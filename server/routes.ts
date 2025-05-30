import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGameScoreSchema, insertVipRewardSchema } from "@shared/schema";
import { z } from "zod";

// YouTube API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY || "";
const YOUTUBE_CHANNEL_ID = "UCMarioFun72"; // This would be the actual channel ID

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, youtubeId, isSubscribed } = insertUserSchema.parse(req.body);
      
      let user = await storage.getUserByYouTubeId(youtubeId || "");
      if (!user) {
        user = await storage.createUser({ username, youtubeId, isSubscribed });
      } else {
        user = await storage.updateUser(user.id, { isSubscribed });
      }
      
      res.json({ user });
    } catch (error) {
      res.status(400).json({ message: "Données invalides", error });
    }
  });

  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  });

  app.put("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;
      
      const user = await storage.updateUser(userId, updates);
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Erreur de mise à jour", error });
    }
  });

  // YouTube API routes
  app.get("/api/youtube/videos", async (req, res) => {
    try {
      if (!YOUTUBE_API_KEY) {
        return res.status(503).json({ message: "API YouTube non configurée" });
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=6&type=video`
      );

      if (!response.ok) {
        throw new Error("Erreur API YouTube");
      }

      const data = await response.json();
      res.json({ videos: data.items });
    } catch (error) {
      res.status(500).json({ message: "Impossible de récupérer les vidéos", error });
    }
  });

  app.get("/api/youtube/check-subscription/:channelId", async (req, res) => {
    try {
      const { channelId } = req.params;
      
      if (!YOUTUBE_API_KEY) {
        return res.status(503).json({ message: "API YouTube non configurée" });
      }

      // This would require OAuth2 authentication in a real implementation
      // For now, we'll simulate the check
      res.json({ isSubscribed: Math.random() > 0.5 });
    } catch (error) {
      res.status(500).json({ message: "Erreur de vérification", error });
    }
  });

  // Game routes
  app.post("/api/games/score", async (req, res) => {
    try {
      const scoreData = insertGameScoreSchema.parse(req.body);
      const score = await storage.addGameScore(scoreData);
      
      // Update user stats
      const user = await storage.getUser(scoreData.userId);
      if (user) {
        await storage.updateUser(user.id, {
          gamesPlayed: user.gamesPlayed + 1,
          totalPoints: user.totalPoints + scoreData.score
        });
      }
      
      res.json({ score });
    } catch (error) {
      res.status(400).json({ message: "Données de score invalides", error });
    }
  });

  app.get("/api/games/scores/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const scores = await storage.getGameScores(userId);
      res.json({ scores });
    } catch (error) {
      res.status(500).json({ message: "Erreur récupération scores", error });
    }
  });

  app.get("/api/games/leaderboard/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getTopScores(gameType, limit);
      res.json({ leaderboard });
    } catch (error) {
      res.status(500).json({ message: "Erreur récupération classement", error });
    }
  });

  // VIP routes
  app.get("/api/vip/rewards/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const rewards = await storage.getUserRewards(userId);
      res.json({ rewards });
    } catch (error) {
      res.status(500).json({ message: "Erreur récupération récompenses", error });
    }
  });

  app.post("/api/vip/mystery-chest", async (req, res) => {
    try {
      const { userId } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user || !user.isSubscribed) {
        return res.status(403).json({ message: "Accès VIP requis" });
      }

      // Generate random reward
      const rewardTypes = ['badge', 'image', 'secret_link'];
      const randomType = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
      
      const rewardData = {
        badge: { name: "Explorateur VIP", icon: "🎖️" },
        image: { name: "Avatar Collector", url: "/images/special-avatar.png" },
        secret_link: { name: "Lien Secret Gaming", url: "https://secret-gaming-content.com" }
      };

      const reward = await storage.addVipReward({
        userId,
        rewardType: randomType,
        rewardData: rewardData[randomType as keyof typeof rewardData]
      });

      res.json({ reward });
    } catch (error) {
      res.status(500).json({ message: "Erreur ouverture coffre", error });
    }
  });

  // Lottery routes
  app.post("/api/lottery/enter", async (req, res) => {
    try {
      const { userId } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user || !user.isSubscribed) {
        return res.status(403).json({ message: "Seuls les abonnés VIP peuvent participer" });
      }

      const now = new Date();
      const weekNumber = Math.ceil((now.getDate()) / 7);
      const year = now.getFullYear();

      // Check if already entered this week
      const existingEntries = await storage.getUserLotteryEntries(userId, weekNumber, year);
      if (existingEntries.length > 0) {
        return res.status(400).json({ message: "Déjà inscrit cette semaine" });
      }

      const entry = await storage.addLotteryEntry({ userId, weekNumber, year });
      res.json({ entry, message: "Inscription au tirage réussie !" });
    } catch (error) {
      res.status(500).json({ message: "Erreur inscription tirage", error });
    }
  });

  app.get("/api/lottery/latest-winner", async (req, res) => {
    try {
      const winner = await storage.getLatestWinner();
      res.json({ winner });
    } catch (error) {
      res.status(500).json({ message: "Erreur récupération gagnant", error });
    }
  });

  // Mood system
  app.post("/api/mood/update", async (req, res) => {
    try {
      const { userId, mood } = req.body;
      
      const user = await storage.updateUser(userId, { preferredMood: mood });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      res.json({ user, message: "Humeur mise à jour !" });
    } catch (error) {
      res.status(500).json({ message: "Erreur mise à jour humeur", error });
    }
  });

  // AI personalization (simulated)
  app.get("/api/ai/daily-message/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const messages = [
        `Salut ${user.username} ! Tu as regardé ${user.videosWatched} vidéos cette semaine, c'est génial ! 🎉`,
        `Hey ${user.username} ! Prêt pour un nouveau défi gaming aujourd'hui ? 🎮`,
        `${user.username}, tes scores s'améliorent ! Continue comme ça ! 🏆`,
        `Bonjour ${user.username} ! N'oublie pas de regarder la dernière vidéo de Youssef ! 📺`
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      res.json({ message: randomMessage });
    } catch (error) {
      res.status(500).json({ message: "Erreur génération message", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
