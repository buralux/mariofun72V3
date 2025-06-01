import type { VercelRequest, VercelResponse } from '@vercel/node';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY || "";
const YOUTUBE_CHANNEL_ID = "UCzLBWyAYcp_ynG85K3NxXtQ";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
}