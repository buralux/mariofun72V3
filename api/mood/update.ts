import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../server/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
}