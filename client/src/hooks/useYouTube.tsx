import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { YouTubeVideo } from '@/types';

export function useYouTubeVideos() {
  return useQuery<{ videos: YouTubeVideo[] }>({
    queryKey: ['/api/youtube/videos'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSubscriptionCheck() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (channelId: string) => {
      const response = await fetch(`/api/youtube/check-subscription/${channelId}`);
      if (!response.ok) throw new Error('Erreur vérification abonnement');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/youtube/videos'] });
    }
  });
}
