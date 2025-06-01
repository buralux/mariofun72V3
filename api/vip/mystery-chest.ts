import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../server/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
}