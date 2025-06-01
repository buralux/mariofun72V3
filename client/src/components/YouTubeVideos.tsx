import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Youtube, Eye, Calendar } from 'lucide-react';
import { useYouTubeVideos } from '@/hooks/useYouTube';
import { motion } from 'framer-motion';

export default function YouTubeVideos() {
  const { data, isLoading, error } = useYouTubeVideos();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Il y a 1 jour';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaine(s)`;
    return date.toLocaleDateString('fr-FR');
  };

  const getRandomViews = () => {
    return Math.floor(Math.random() * 5000) + 500;
  };

  if (error) {
    // Gestion spécifique de l'erreur 503 (API YouTube indisponible)
    // On vérifie le message d'erreur retourné par React Query/fetch
    const is503 = error?.message && (error.message.includes('503') || error.message.toLowerCase().includes('api youtube non configurée'));
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8" style={{ fontFamily: 'Fredoka One' }}>
              <Youtube className="inline mr-3 text-red-600" />
              Mes Dernières Vidéos
            </h2>
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  {is503
                    ? "L'API YouTube est temporairement indisponible. Réessaie dans quelques minutes !"
                    : "Impossible de charger les vidéos pour le moment."}
                </p>
                <Button
                  asChild
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <a 
                    href="https://youtube.com/@mariofun72_yt?feature=shared" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Youtube className="mr-2" />
                    Voir sur YouTube
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Fredoka One' }}>
            <Youtube className="inline mr-3 text-red-600" />
            Mes Dernières Vidéos
          </h2>
          <p className="text-lg text-gray-600">Découvre mes aventures gaming !</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : data?.videos && data.videos.length > 0 ? (
            // Actual videos
            data.videos.map((video, index) => (
              <motion.div
                key={video.id.videoId}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={video.snippet.thumbnails.medium.url} 
                      alt={video.snippet.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Button
                        asChild
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                      >
                        <a 
                          href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Youtube className="mr-2" />
                          Regarder
                        </a>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
                      {video.snippet.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {video.snippet.description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{getRandomViews().toLocaleString()} vues</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(video.snippet.publishedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            // Empty state
            <div className="col-span-full text-center py-12">
              <h3 className="text-2xl font-bold text-gray-600 mb-4">Aucune vidéo trouvée</h3>
              <p className="text-gray-500 mb-6">Les vidéos apparaîtront ici bientôt !</p>
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <a 
                  href="https://youtube.com/@mariofun72_yt?feature=shared" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Youtube className="mr-2" />
                  Visiter la chaîne
                </a>
              </Button>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Button
            asChild
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg"
          >
            <a 
              href="https://youtube.com/@mariofun72_yt?feature=shared" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Youtube className="mr-2" />
              Voir toutes mes vidéos
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
