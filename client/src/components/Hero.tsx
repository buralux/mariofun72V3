import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Youtube, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Theme, MoodCharacter } from '@/types';
import { motion } from 'framer-motion';

interface HeroProps {
  currentTheme: Theme;
  dailyMood: MoodCharacter;
  onConnectYouTube: () => void;
}

export default function Hero({ currentTheme, dailyMood, onConnectYouTube }: HeroProps) {
  const { user } = useAuth();

  const backgroundStyle = {
    background: currentTheme.colors.background
  };

  return (
    <section 
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
      style={backgroundStyle}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-80"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-12 h-12 bg-pink-400 rounded-full opacity-70"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/4 w-20 h-20 bg-green-300 rounded-full opacity-60"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/3 w-8 h-8 bg-white rounded-full opacity-50"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Avatar Gaming */}
          <motion.div 
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-6xl border-4 border-white shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎮
            </motion.div>
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
            style={{ fontFamily: 'Fredoka One' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Salut les Gamers ! 🎮
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-8 font-semibold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Bienvenue dans l'univers gaming de Youssef !
          </motion.p>
          
          {/* YouTube CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              asChild
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <a 
                href="https://youtube.com/@mariofun72_yt?feature=shared" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Youtube className="mr-3 text-2xl" />
                🎮 Regarde mes vidéos
              </a>
            </Button>
          </motion.div>

          {/* YouTube Connection Button */}
          {!user?.isSubscribed && (
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                onClick={onConnectYouTube}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg"
              >
                <Youtube className="mr-2" />
                Connexion YouTube
              </Button>
              <p className="text-white/80 mt-2 text-sm">Connecte-toi pour accéder au contenu VIP !</p>
            </motion.div>
          )}

          {/* Mood Display */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Fredoka One' }}>
                  Humeur du jour
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <motion.div 
                    className="text-6xl"
                    animate={{ 
                      rotate: dailyMood.animation === 'spin' ? 360 : 0,
                      y: dailyMood.animation === 'float' ? [-5, 5, -5] : 0 
                    }}
                    transition={{ 
                      duration: dailyMood.animation === 'spin' ? 2 : 3, 
                      repeat: Infinity,
                      ease: dailyMood.animation === 'spin' ? 'linear' : 'easeInOut'
                    }}
                  >
                    {dailyMood.emoji}
                  </motion.div>
                  <div className="text-left">
                    <p className="font-bold text-lg text-gray-800">{dailyMood.name}</p>
                    <p className="text-gray-600">{dailyMood.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
