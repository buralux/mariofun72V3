import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../server/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const userId = parseInt(id as string);

  if (req.method === 'GET') {
    try {
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  } else if (req.method === 'PUT') {
    try {
      const updates = req.body;
      
      const user = await storage.updateUser(userId, updates);
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Erreur de mise à jour", error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}