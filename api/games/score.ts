import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../server/storage";
import { insertGameScoreSchema } from "../../shared/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
}