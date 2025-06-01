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
}