import { 
  users, 
  gameScores, 
  vipRewards, 
  lotteryEntries, 
  lotteryWinners,
  type User, 
  type InsertUser,
  type GameScore,
  type InsertGameScore,
  type VipReward,
  type InsertVipReward,
  type LotteryEntry,
  type InsertLotteryEntry,
  type LotteryWinner
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByYouTubeId(youtubeId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Game scores methods
  getGameScores(userId: number): Promise<GameScore[]>;
  getTopScores(gameType: string, limit?: number): Promise<(GameScore & { username: string })[]>;
  addGameScore(score: InsertGameScore): Promise<GameScore>;
  
  // VIP rewards methods
  getUserRewards(userId: number): Promise<VipReward[]>;
  addVipReward(reward: InsertVipReward): Promise<VipReward>;
  
  // Lottery methods
  addLotteryEntry(entry: InsertLotteryEntry): Promise<LotteryEntry>;
  getUserLotteryEntries(userId: number, weekNumber: number, year: number): Promise<LotteryEntry[]>;
  getWeeklyLotteryEntries(weekNumber: number, year: number): Promise<LotteryEntry[]>;
  addLotteryWinner(winner: Omit<LotteryWinner, 'id' | 'wonAt'>): Promise<LotteryWinner>;
  getLatestWinner(): Promise<(LotteryWinner & { username: string }) | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameScores: Map<number, GameScore>;
  private vipRewards: Map<number, VipReward>;
  private lotteryEntries: Map<number, LotteryEntry>;
  private lotteryWinners: Map<number, LotteryWinner>;
  private currentUserId: number;
  private currentGameScoreId: number;
  private currentVipRewardId: number;
  private currentLotteryEntryId: number;
  private currentLotteryWinnerId: number;

  constructor() {
    this.users = new Map();
    this.gameScores = new Map();
    this.vipRewards = new Map();
    this.lotteryEntries = new Map();
    this.lotteryWinners = new Map();
    this.currentUserId = 1;
    this.currentGameScoreId = 1;
    this.currentVipRewardId = 1;
    this.currentLotteryEntryId = 1;
    this.currentLotteryWinnerId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByYouTubeId(youtubeId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.youtubeId === youtubeId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      level: 1,
      totalPoints: 0,
      videosWatched: 0,
      gamesPlayed: 0,
      badgesEarned: [],
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getGameScores(userId: number): Promise<GameScore[]> {
    return Array.from(this.gameScores.values()).filter(score => score.userId === userId);
  }

  async getTopScores(gameType: string, limit: number = 10): Promise<(GameScore & { username: string })[]> {
    const scores = Array.from(this.gameScores.values())
      .filter(score => score.gameType === gameType)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scores.map(score => {
      const user = this.users.get(score.userId!);
      return {
        ...score,
        username: user?.username || 'Utilisateur inconnu'
      };
    });
  }

  async addGameScore(insertScore: InsertGameScore): Promise<GameScore> {
    const id = this.currentGameScoreId++;
    const score: GameScore = {
      ...insertScore,
      id,
      achievedAt: new Date(),
    };
    this.gameScores.set(id, score);
    return score;
  }

  async getUserRewards(userId: number): Promise<VipReward[]> {
    return Array.from(this.vipRewards.values())
      .filter(reward => reward.userId === userId)
      .sort((a, b) => b.earnedAt!.getTime() - a.earnedAt!.getTime());
  }

  async addVipReward(insertReward: InsertVipReward): Promise<VipReward> {
    const id = this.currentVipRewardId++;
    const reward: VipReward = {
      ...insertReward,
      id,
      earnedAt: new Date(),
    };
    this.vipRewards.set(id, reward);
    return reward;
  }

  async addLotteryEntry(insertEntry: InsertLotteryEntry): Promise<LotteryEntry> {
    const id = this.currentLotteryEntryId++;
    const entry: LotteryEntry = {
      ...insertEntry,
      id,
      enteredAt: new Date(),
    };
    this.lotteryEntries.set(id, entry);
    return entry;
  }

  async getUserLotteryEntries(userId: number, weekNumber: number, year: number): Promise<LotteryEntry[]> {
    return Array.from(this.lotteryEntries.values()).filter(
      entry => entry.userId === userId && entry.weekNumber === weekNumber && entry.year === year
    );
  }

  async getWeeklyLotteryEntries(weekNumber: number, year: number): Promise<LotteryEntry[]> {
    return Array.from(this.lotteryEntries.values()).filter(
      entry => entry.weekNumber === weekNumber && entry.year === year
    );
  }

  async addLotteryWinner(winner: Omit<LotteryWinner, 'id' | 'wonAt'>): Promise<LotteryWinner> {
    const id = this.currentLotteryWinnerId++;
    const lotteryWinner: LotteryWinner = {
      ...winner,
      id,
      wonAt: new Date(),
    };
    this.lotteryWinners.set(id, lotteryWinner);
    return lotteryWinner;
  }

  async getLatestWinner(): Promise<(LotteryWinner & { username: string }) | undefined> {
    const winners = Array.from(this.lotteryWinners.values())
      .sort((a, b) => b.wonAt!.getTime() - a.wonAt!.getTime());
    
    if (winners.length === 0) return undefined;
    
    const latestWinner = winners[0];
    const user = this.users.get(latestWinner.userId!);
    
    return {
      ...latestWinner,
      username: user?.username || 'Utilisateur inconnu'
    };
  }
}

export const storage = new MemStorage();
