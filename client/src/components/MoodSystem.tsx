import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MoodCharacter } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Player from 'lottie-react';
// @ts-ignore
import lottieMoodHappy from './lottie-mood-happy.json';
// @ts-ignore
import lottieMoodKirby from './lottie-mood-kirby.json';
// @ts-ignore
import lottieBowserGif from './bowser_gif_lottie.json';
// @ts-ignore
import lottieSonicGif from './sonic_gif_lottie.json';
// @ts-ignore
import lottieMoodPeach from './lottie-mood-peach.json';
// @ts-ignore
import lottieMoodMario from './lottie-mood-mario.json';
import lottieMarioGif from './mario_gif_lottie.json';
import lottieMariofunAIGif from './mariofun_ai_gif_lottie.json';
import { useState } from 'react';
import KirbyPixelIcon from './KirbyPixelIcon';
import BowserPixelIcon from './BowserPixelIcon';
import SonicPixelIcon from './SonicPixelIcon';
import PeachPixelIcon from './PeachPixelIcon';
import PacmanPixelIcon from './PacmanPixelIcon';
import lottieKirbyGif from './kirby_gif_lottie.json';
import lottiePeachGif from './peach_gif_lottie.json';
import lottiePacmanGif from './pacman_gif_lottie.json';
// @ts-ignore
import lottiePeelyHappy from './peely_happy_lottie.json';
// @ts-ignore
import lottieKratosAngry from './kratos_angry_lottie_embedded.json';
// @ts-ignore
import llamaExcitedLottie from './llama_excited_lottie_embedded.json';
import PeelyPixelIcon from './PeelyPixelIcon';
// @ts-ignore
import lottieSynthStarConfident from './synthstar_confident_lottie_embedded.json';
// @ts-ignore
import fishstickSadLottie from './fishstick_sad_lottie_embedded.json';

interface MoodSystemProps {
  moods: MoodCharacter[];
  selectedMood: MoodCharacter;
  onMoodSelect: (mood: MoodCharacter) => void;
}

function SafeLottie({ animationData, fallback, ...props }: { animationData: any; fallback?: React.ReactNode; style?: React.CSSProperties }) {
  const [error, setError] = useState(false);
  // Vérification stricte du JSON Lottie
  const isValidLottie =
    animationData &&
    typeof animationData === 'object' &&
    Array.isArray(animationData.layers) &&
    animationData.layers.length > 0;

  if (!isValidLottie || error) {
    // Fallback animé Pac-Man ou custom
    return (
      <div className="flex flex-col items-center justify-center" style={props.style}>
        {fallback ? (
          fallback
        ) : (
          <div className="text-5xl animate-spin" style={{ display: 'inline-block' }}>🟡</div>
        )}
        <div className="text-xs text-yellow-500 mt-1">Animation non disponible</div>
      </div>
    );
  }
  return (
    <Player
      autoplay
      loop
      animationData={animationData}
      style={props.style}
      onError={() => setError(true)}
    />
  );
}

export default function MoodSystem({ moods, selectedMood, onMoodSelect, currentTheme }: MoodSystemProps & { currentTheme: { id: string } }) {
  const { user, updateUser } = useAuth();

  const handleMoodSelect = async (mood: MoodCharacter) => {
    onMoodSelect(mood);
    if (user) {
      try {
        await updateUser({ preferredMood: mood.id });
      } catch (error) {
        console.error('Erreur mise à jour humeur:', error);
      }
    }
  };

  // Mapping des icônes/animations selon le thème
  function getMoodIcon(moodId: string) {
    if (currentTheme.id === 'mario') {
      switch (moodId) {
        case 'mario':
          return <SafeLottie animationData={lottieMarioGif} style={{ width: 160, height: 160 }} />;
        case 'kirby':
          return <SafeLottie animationData={lottieKirbyGif} style={{ width: 160, height: 160 }} fallback={<KirbyPixelIcon style={{ width: 160, height: 160 }} />} />;
        case 'bowser':
          return <SafeLottie animationData={lottieBowserGif} style={{ width: 160, height: 160 }} fallback={<BowserPixelIcon style={{ width: 160, height: 160 }} />} />;
        case 'sonic':
          return <SafeLottie animationData={lottieSonicGif} style={{ width: 160, height: 160 }} fallback={<SonicPixelIcon style={{ width: 160, height: 160 }} />} />;
        case 'peach':
          return <SafeLottie animationData={lottiePeachGif} style={{ width: 160, height: 160 }} fallback={<PeachPixelIcon style={{ width: 160, height: 160 }} />} />;
        default:
          return <SafeLottie animationData={lottiePacmanGif} style={{ width: 160, height: 160 }} fallback={<PacmanPixelIcon style={{ width: 160, height: 160 }} />} />;
      }
    }
    if (currentTheme.id === 'fortnite') {
      switch (moodId) {
        case 'heureux':
          return <SafeLottie animationData={lottiePeelyHappy} style={{ width: 160, height: 160 }} fallback={<PeelyPixelIcon style={{ width: 160, height: 160 }} />} />;
        case 'enerve':
          return <div style={{ borderRadius: '50%', overflow: 'hidden', width: 160, height: 160, background: '#fff' }}>
            <SafeLottie animationData={lottieKratosAngry} style={{ width: 160, height: 160 }} fallback={<img src="https://static.wikia.nocookie.net/fortnite_gamepedia/images/2/2e/Kratos_-_Outfit_-_Fortnite.png" alt="Kratos" style={{ width: 160, height: 160, borderRadius: '50%' }} />} />
          </div>;
        case 'confiant':
          return <SafeLottie animationData={lottieSynthStarConfident} style={{ width: 160, height: 160 }} fallback={<img src="https://static.wikia.nocookie.net/fortnite_gamepedia/images/2/2e/Synth_Star_-_Outfit_-_Fortnite.png" alt="Synth Star" style={{ width: 160, height: 160, borderRadius: '50%' }} />} />;
        case 'triste':
          return <SafeLottie animationData={fishstickSadLottie} style={{ width: 160, height: 160 }} fallback={<img src="https://static.wikia.nocookie.net/fortnite_gamepedia/images/7/7e/Fishstick_-_Outfit_-_Fortnite.png" alt="Fishstick" style={{ width: 160, height: 160, borderRadius: '50%' }} />} />;
        case 'excite':
          return <SafeLottie animationData={llamaExcitedLottie} style={{ width: 160, height: 160 }} fallback={<img src="https://static.wikia.nocookie.net/fortnite_gamepedia/images/7/7e/Loot_Llama_-_Outfit_-_Fortnite.png" alt="Lama Fortnite" style={{ width: 160, height: 160, borderRadius: '50%' }} />} />;
        default:
          return <span className="text-6xl">🎮</span>;
      }
    }
    // Autres thèmes : fallback générique
    return <span className="text-6xl">🎮</span>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Fredoka One' }}>
            Choisis ton humeur gaming !
          </h3>
          <p className="text-lg text-gray-600">Comment te sens-tu aujourd'hui ?</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {moods.map((mood, index) => (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  selectedMood.id === mood.id 
                    ? 'ring-4 ring-orange-400 shadow-xl transform scale-105' 
                    : 'hover:shadow-lg'
                }`}
                style={{ backgroundColor: mood.color }}
                onClick={() => handleMoodSelect(mood)}
              >
                <CardContent className="p-6 text-center text-white">
                  {/* Animation Lottie pour chaque humeur */}
                  <div className="flex justify-center mb-4">
                    {getMoodIcon(mood.id)}
                  </div>
                  <h4 className="font-bold text-xl mb-2">{mood.name}</h4>
                  <p className="text-white/90 text-sm mb-4">{mood.description}</p>
                  
                  {/* Animation indicator */}
                  <div className="mt-4">
                    {mood.animation === 'bounce' && (
                      <motion.div 
                        className="text-2xl"
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        🌟
                      </motion.div>
                    )}
                    {mood.animation === 'float' && (
                      <motion.div 
                        className="text-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        💤
                      </motion.div>
                    )}
                    {mood.animation === 'fire' && (
                      <motion.div 
                        className="text-2xl"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        🔥
                      </motion.div>
                    )}
                    {mood.animation === 'spin' && (
                      <motion.div 
                        className="text-2xl"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        👍
                      </motion.div>
                    )}
                    {mood.animation === 'surprise' && (
                      <motion.div 
                        className="text-2xl"
                        animate={{ rotate: [0, 360, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        ❓
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {user && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Humeur actuelle: <span className="font-bold text-orange-500">{selectedMood.name}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
