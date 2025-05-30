import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionCheck } from '@/hooks/useYouTube';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import MoodSystem from '@/components/MoodSystem';
import YouTubeVideos from '@/components/YouTubeVideos';
import VIPSection from '@/components/VIPSection';
import GamesSection from '@/components/GamesSection';
import UserProfile from '@/components/UserProfile';
import { Theme, MoodCharacter } from '@/types';

export default function Home() {
  const { user, login } = useAuth();
  const subscriptionCheck = useSubscriptionCheck();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [currentTheme, setCurrentTheme] = useState<Theme>({
    id: 'mario',
    name: 'Mario',
    emoji: '🎩',
    colors: {
      primary: '#E60026',
      secondary: '#0066CC',
      background: 'linear-gradient(135deg, #E60026, #0066CC)'
    }
  });

  const themes: Theme[] = [
    {
      id: 'mario',
      name: 'Mario',
      emoji: '🎩',
      colors: {
        primary: '#E60026',
        secondary: '#0066CC',
        background: 'linear-gradient(135deg, #E60026, #0066CC)'
      }
    },
    {
      id: 'fortnite',
      name: 'Fortnite',
      emoji: '⚔️',
      colors: {
        primary: '#8B5FBF',
        secondary: '#00D4FF',
        background: 'linear-gradient(135deg, #8B5FBF, #00D4FF)'
      }
    },
    {
      id: 'gamer',
      name: 'Gamer',
      emoji: '🎧',
      colors: {
        primary: '#00FF88',
        secondary: '#AA00FF',
        background: 'linear-gradient(135deg, #00FF88, #AA00FF)'
      }
    }
  ];

  const moods: MoodCharacter[] = [
    {
      id: 'mario',
      name: 'Mario',
      emoji: '😄',
      description: 'Joyeux aujourd\'hui !',
      animation: 'bounce',
      color: 'linear-gradient(135deg, #4ade80, #22c55e)'
    },
    {
      id: 'kirby',
      name: 'Kirby',
      emoji: '😴',
      description: 'Un peu fatigué...',
      animation: 'float',
      color: 'linear-gradient(135deg, #f472b6, #ec4899)'
    },
    {
      id: 'bowser',
      name: 'Bowser',
      emoji: '😡',
      description: 'Énervé par la défaite !',
      animation: 'fire',
      color: 'linear-gradient(135deg, #ef4444, #dc2626)'
    },
    {
      id: 'sonic',
      name: 'Sonic',
      emoji: '😎',
      description: 'Fier de sa vitesse !',
      animation: 'spin',
      color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    },
    {
      id: 'pacman',
      name: 'Pac-Man',
      emoji: '😱',
      description: 'Surpris par les fantômes !',
      animation: 'surprise',
      color: 'linear-gradient(135deg, #facc15, #eab308)'
    }
  ];

  const [currentMood, setCurrentMood] = useState<MoodCharacter>(
    moods.find(mood => mood.id === user?.preferredMood) || moods[0]
  );

  useEffect(() => {
    if (user?.preferredMood) {
      const userMood = moods.find(mood => mood.id === user.preferredMood);
      if (userMood) {
        setCurrentMood(userMood);
      }
    }
  }, [user?.preferredMood]);

  const handleConnectYouTube = () => {
    if (!user) {
      setShowLoginDialog(true);
    } else {
      // In a real implementation, this would trigger YouTube OAuth
      subscriptionCheck.mutate('UC_CHANNEL_ID', {
        onSuccess: (data) => {
          if (data.isSubscribed) {
            login(user.username, user.youtubeId, true);
          }
        }
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    try {
      // Generate a random YouTube ID for demo purposes
      const youtubeId = `yt_${Math.random().toString(36).substr(2, 9)}`;
      const isSubscribed = Math.random() > 0.5; // Random subscription status for demo
      
      await login(username, youtubeId, isSubscribed);
      setShowLoginDialog(false);
      setUsername('');
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const handleMoodSelect = (mood: MoodCharacter) => {
    setCurrentMood(mood);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation 
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        themes={themes}
      />

      <Hero 
        currentTheme={currentTheme}
        dailyMood={currentMood}
        onConnectYouTube={handleConnectYouTube}
      />

      <MoodSystem 
        moods={moods}
        selectedMood={currentMood}
        onMoodSelect={handleMoodSelect}
      />

      <YouTubeVideos />

      <VIPSection />

      <GamesSection />

      <UserProfile />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-teal-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🎮</span>
              </div>
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'Fredoka One' }}>MarioFun72</h3>
            </div>
            
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              L'univers gaming de Youssef - Rejoins la communauté des vrais gamers !
            </p>

            <div className="flex justify-center space-x-6 mb-8">
              <a href="https://youtube.com/@mariofun72_yt?feature=shared" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-2xl text-red-500 hover:text-red-400 transition-colors duration-300">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-2xl text-blue-400 hover:text-blue-300 transition-colors duration-300">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="text-2xl text-purple-400 hover:text-purple-300 transition-colors duration-300">
                <i className="fab fa-twitch"></i>
              </a>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500 text-sm">
                © 2024 MarioFun72. Fait avec ❤️ pour les gamers !
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center" style={{ fontFamily: 'Fredoka One' }}>
              Rejoins l'aventure !
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleLogin} className="space-y-4 p-6">
            <div>
              <Label htmlFor="username">Ton nom de gamer</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: SuperGamer2024"
                className="mt-1"
                required
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                🎮 En te connectant, tu pourras :
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Sauvegarder tes scores de jeux</li>
                <li>• Accéder au contenu VIP si tu es abonné</li>
                <li>• Personnaliser ton profil gamer</li>
                <li>• Participer aux tirages au sort</li>
              </ul>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3"
            >
              Commencer l'aventure ! 🚀
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
