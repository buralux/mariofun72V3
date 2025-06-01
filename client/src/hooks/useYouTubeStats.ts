import { useQuery } from '@tanstack/react-query';

export function useYouTubeStats() {
  return useQuery<{ subscribers: string; views: string; videos: string }>({
    queryKey: ['/api/youtube/stats'],
    queryFn: async () => {
      const response = await fetch('/api/youtube/stats');
      if (!response.ok) throw new Error('Erreur récupération stats YouTube');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}
