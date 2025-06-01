import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { storage } from "../server/storage";
import { insertUserSchema, insertGameScoreSchema, insertVipRewardSchema } from "../shared/schema";
import { z } from "zod";

// YouTube API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY || "";
const YOUTUBE_CHANNEL_ID = "UCzLBWyAYcp_ynG85K3NxXtQ"; // ID réel de la chaîne MarioFun72

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de logging pour les API routes
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }

    if (logLine.length > 80) {
      logLine = logLine.slice(0, 79) + "…";
    }

    console.log(logLine);
  });

  next();
});

// Auth routes
app.post("/auth/login", async (req, res) => {
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
app.get("/user/:id", async (req, res) => {
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

app.put("/user/:id", async (req, res) => {
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
app.get("/youtube/videos", async (req, res) => {
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

app.get("/youtube/check-subscription/:channelId", async (req, res) => {
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

// YouTube channel stats route
app.get("/youtube/stats", async (req, res) => {
  try {
    if (!YOUTUBE_API_KEY) {
      return res.status(503).json({ message: "API YouTube non configurée" });
    }
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Erreur API YouTube stats");
    }
    const data = await response.json();
    const stats = data.items && data.items[0] && data.items[0].statistics;
    if (!stats) {
      return res.status(404).json({ message: "Statistiques non trouvées" });
    }
    res.json({
      subscribers: stats.subscriberCount,
      views: stats.viewCount,
      videos: stats.videoCount
    });
  } catch (error) {
    res.status(500).json({ message: "Impossible de récupérer les statistiques", error });
  }
});

// Game routes
app.post("/games/score", async (req, res) => {
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

app.get("/games/scores/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const scores = await storage.getGameScores(userId);
    res.json({ scores });
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération scores", error });
  }
});

app.get("/games/leaderboard/:gameType", async (req, res) => {
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
app.get("/vip/rewards/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const rewards = await storage.getUserRewards(userId);
    res.json({ rewards });
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération récompenses", error });
  }
});

app.post("/vip/mystery-chest", async (req, res) => {
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
app.post("/lottery/enter", async (req, res) => {
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

app.get("/lottery/latest-winner", async (req, res) => {
  try {
    const winner = await storage.getLatestWinner();
    res.json({ winner });
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération gagnant", error });
  }
});

// Mood system
app.post("/mood/update", async (req, res) => {
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
app.get("/ai/daily-message/:userId", async (req, res) => {
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

// Gestionnaire d'erreurs
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
  console.error(err);
});

export default app;