import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../server/storage";
import { insertUserSchema } from "../../shared/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
}