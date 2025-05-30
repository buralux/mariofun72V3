export interface Theme {
  id: 'mario' | 'fortnite' | 'gamer';
  name: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export interface MoodCharacter {
  id: string;
  name: string;
  emoji: string;
  description: string;
  animation: string;
  color: string;
}

export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    publishedAt: string;
  };
}

export interface GameType {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  category: 'quiz' | 'memory' | 'puzzle';
}

export interface VipReward {
  id: number;
  rewardType: string;
  rewardData: any;
  earnedAt: Date;
}

export interface LotteryWinner {
  id: number;
  username: string;
  weekNumber: number;
  year: number;
  prizeDescription: string;
  wonAt: Date;
}
