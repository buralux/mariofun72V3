import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Trophy, Gamepad2, Calendar, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { motion } from 'framer-motion';

export default function UserProfile() {
  const { user, updateUser } = useAuth();

  // Fetch user activity
  const { data: activityData } = useQuery<{ message: string }>({
    queryKey: [`/api/ai/daily-message/${user?.id}`],
    enabled: !!user?.id,
  });

  // Mood update mutation
  const moodUpdateMutation = useMutation({
    mutationFn: async (mood: string) => {
      const response = await apiRequest('POST', '/api/mood/update', {
        userId: user?.id,
        mood
      });
      return response.json();
    },
    onSuccess: (data) => {
      updateUser({ preferredMood: data.user.preferredMood });
    }
  });

  const moodOptions = [
    { id: 'mario', name: 'Mario Joyeux', emoji: '😄', description: 'Humeur positive et énergique', color: 'border-red-500 hover:bg-red-50' },
    { id: 'kirby', name: 'Kirby Détendu', emoji: '😴', description: 'Humeur calme et paisible', color: 'border-purple-500 hover:bg-purple-50' },
    { id: 'bowser', name: 'Bowser Énervé', emoji: '😡', description: 'Humeur intense et compétitive', color: 'border-red-700 hover:bg-red-50' },
    { id: 'sonic', name: 'Sonic Fier', emoji: '😎', description: 'Humeur confiante et rapide', color: 'border-blue-500 hover:bg-blue-50' },
    { id: 'pacman', name: 'Pac-Man Surpris', emoji: '😱', description: 'Humeur curieuse et aventureuse', color: 'border-yellow-500 hover:bg-yellow-50' },
  ];

  const recentActivities = [
    { icon: '🎮', text: 'Quiz Gaming terminé', time: 'Il y a 2h' },
    { icon: '📺', text: 'Vidéo "Mario Kart" regardée', time: 'Hier' },
    { icon: '🏆', text: 'Badge "Memory Master" gagné', time: 'Il y a 3 jours' },
    { icon: '🎁', text: 'Coffre mystère ouvert', time: 'Il y a 1 semaine' },
  ];

  if (!user) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-4">Connecte-toi !</h3>
              <p className="text-gray-600 mb-6">
                Connecte-toi avec YouTube pour accéder à ton profil gamer.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Fredoka One' }}>
            <User className="inline mr-3 text-orange-500" />
            Mon Profil Gamer
          </h2>
          <p className="text-lg text-gray-600">Ton univers gaming personnalisé</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <motion.div
                      className="w-24 h-24 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-4 border-white shadow-lg"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🎮
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800">{user.username}</h3>
                    <p className="text-gray-600">Niveau {user.level} - Gamer {user.isSubscribed ? 'VIP' : 'Débutant'}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 flex items-center">
                        <Trophy className="w-4 h-4 mr-2" />
                        Points totaux:
                      </span>
                      <span className="font-bold text-orange-500">{user.totalPoints?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 flex items-center">
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Jeux joués:
                      </span>
                      <span className="font-bold text-teal-500">{user.gamesPlayed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        Badges:
                      </span>
                      <span className="font-bold text-purple-500">{user.badgesEarned?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Membre depuis:
                      </span>
                      <span className="font-bold text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Récemment'}
                      </span>
                    </div>
                  </div>

                  {user.isSubscribed && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg text-center">
                      <div className="flex items-center justify-center text-yellow-700 font-bold">
                        <Trophy className="w-5 h-5 mr-2" />
                        Statut VIP Actif
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Mood Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 text-center" style={{ fontFamily: 'Fredoka One' }}>
                    Personnalise ton Humeur
                  </h3>
                  
                  <div className="space-y-3">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.id}
                        onClick={() => moodUpdateMutation.mutate(mood.id)}
                        disabled={moodUpdateMutation.isPending}
                        className={`w-full flex items-center p-3 border-2 rounded-lg transition-all duration-300 ${
                          user.preferredMood === mood.id 
                            ? 'border-orange-400 bg-orange-50 shadow-md' 
                            : `border-gray-200 ${mood.color}`
                        }`}
                      >
                        <motion.span 
                          className="text-3xl mr-3"
                          animate={{ 
                            rotate: mood.id === 'sonic' ? [0, 360] : 0,
                            y: mood.id === 'mario' ? [-2, 2, -2] : 0,
                            scale: mood.id === 'bowser' ? [1, 1.1, 1] : 1
                          }}
                          transition={{ 
                            duration: mood.id === 'sonic' ? 2 : 3, 
                            repeat: Infinity,
                            ease: mood.id === 'sonic' ? 'linear' : 'easeInOut'
                          }}
                        >
                          {mood.emoji}
                        </motion.span>
                        <div className="text-left flex-1">
                          <p className="font-bold text-gray-800">{mood.name}</p>
                          <p className="text-sm text-gray-600">{mood.description}</p>
                        </div>
                        {user.preferredMood === mood.id && (
                          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Message & Activity */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              {/* AI Personalized Message */}
              {activityData?.message && (
                <Card className="bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <motion.div 
                        className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <span className="text-white text-xl">🤖</span>
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-bold text-indigo-900 mb-2">Message IA personnalisé</h4>
                        <p className="text-indigo-800 text-sm">{activityData.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Activity */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 text-center" style={{ fontFamily: 'Fredoka One' }}>
                    Activité Récente
                  </h3>
                  
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{activity.icon}</span>
                          <span className="text-gray-800 text-sm">{activity.text}</span>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Level Progress Bar */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-orange-100 to-teal-100">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-gray-800">Progression Niveau {user.level}</h4>
                  <p className="text-sm text-gray-600">
                    {user.totalPoints} / {(user.level || 1) * 1000} points pour le niveau suivant
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div 
                    className="bg-gradient-to-r from-orange-400 to-teal-400 h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(((user.totalPoints || 0) % 1000) / 10, 100)}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
