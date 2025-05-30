import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MoodCharacter } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface MoodSystemProps {
  moods: MoodCharacter[];
  selectedMood: MoodCharacter;
  onMoodSelect: (mood: MoodCharacter) => void;
}

export default function MoodSystem({ moods, selectedMood, onMoodSelect }: MoodSystemProps) {
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
                  <motion.div 
                    className="text-6xl mb-4"
                    animate={{ 
                      rotate: mood.animation === 'spin' ? 360 : 0,
                      y: mood.animation === 'bounce' ? [-10, 10, -10] : 0,
                      scale: mood.animation === 'pulse' ? [1, 1.1, 1] : 1
                    }}
                    transition={{ 
                      duration: mood.animation === 'spin' ? 2 : 3, 
                      repeat: Infinity,
                      ease: mood.animation === 'spin' ? 'linear' : 'easeInOut'
                    }}
                  >
                    {mood.emoji}
                  </motion.div>
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
