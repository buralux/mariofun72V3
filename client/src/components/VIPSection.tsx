import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Gift, Trophy, Dice6, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { motion } from 'framer-motion';
import { VipReward, LotteryWinner } from '@/types';
import Player from 'lottie-react';
// @ts-ignore
import lottieChest from './lottie-mystery-chest.json';
import ChestPixelIcon from './ChestPixelIcon';
import SafeLottie from './SafeLottie';

export default function VIPSection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isChestOpening, setIsChestOpening] = useState(false);

  // Fetch user rewards
  const { data: rewardsData } = useQuery<{ rewards: VipReward[] }>({
    queryKey: [`/api/vip/rewards/${user?.id}`],
    enabled: Boolean(user?.id && user.isSubscribed),
  });

  // Fetch latest lottery winner
  const { data: winnerData } = useQuery<{ winner: LotteryWinner }>({
    queryKey: ['/api/lottery/latest-winner'],
  });

  // Mystery chest mutation
  const mysteryChestMutation = useMutation({
    mutationFn: async () => {
      setIsChestOpening(true);
      const response = await apiRequest('POST', '/api/vip/mystery-chest', { userId: user?.id });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/vip/rewards/${user?.id}`] });
      setTimeout(() => setIsChestOpening(false), 2000);
    },
    onError: () => {
      setIsChestOpening(false);
    }
  });

  // Lottery entry mutation
  const lotteryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/lottery/enter', { userId: user?.id });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/lottery/latest-winner'] });
    }
  });

  if (!user?.isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-br from-yellow-100 to-orange-100">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center border-4 border-yellow-400">
            <CardContent className="p-12">
              <div className="mb-6">
                <Crown className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Fredoka One' }}>
                  Espace VIP Officiel
                </h3>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Abonne-toi à la chaîne YouTube de Youssef pour débloquer du contenu exclusif !
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center text-gray-700">
                  <Gift className="mr-2" />
                  <span>Coffres mystère hebdomadaires</span>
                </div>
                <div className="flex items-center justify-center text-gray-700">
                  <Dice6 className="mr-2" />
                  <span>Tirage au sort exclusif</span>
                </div>
                <div className="flex items-center justify-center text-gray-700">
                  <Trophy className="mr-2" />
                  <span>Badges et récompenses VIP</span>
                </div>
              </div>
              <Button
                asChild
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full"
              >
                <a 
                  href="https://youtube.com/@mariofun72_yt?feature=shared" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  S'abonner maintenant
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-100 to-orange-100">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-yellow-400">
          <div className="text-center mb-8">
            <motion.div 
              className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-xl mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Player
                autoplay
                loop
                animationData={lottieChest}
                style={{ width: 48, height: 48, marginRight: 12 }}
              />
              👑 VIP Officiel
            </motion.div>
            <motion.div 
              className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-xl mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="mr-2 animate-pulse" />
              👑 Espace VIP Officiel
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Fredoka One' }}>
              Bienvenue {user.username} !
            </h3>
            <p className="text-lg text-gray-600">Ton contenu exclusif t'attend !</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mystery Chest */}
            <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <motion.div className="mb-3 flex justify-center">
                  <div style={{ width: 120, height: 120 }}>
                    <SafeLottie
                      animationData={lottieChest}
                      fallback={<ChestPixelIcon style={{ width: 120, height: 120 }} />}
                      style={{ width: 120, height: 120 }}
                    />
                  </div>
                </motion.div>
                <h4 className="font-bold text-lg mb-2">Coffre Mystère</h4>
                <p className="text-purple-100 text-sm mb-4">Récompense hebdomadaire surprise</p>
                <Button
                  onClick={() => mysteryChestMutation.mutate()}
                  disabled={mysteryChestMutation.isPending || isChestOpening}
                  className="bg-white text-purple-600 hover:bg-purple-100 font-semibold"
                >
                  {isChestOpening ? 'Ouverture...' : 'Ouvrir'}
                </Button>
              </CardContent>
            </Card>
            
            {/* Rewards History */}
            <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-6xl mb-3">🏆</div>
                <h4 className="font-bold text-lg mb-2">Mes Récompenses</h4>
                <p className="text-green-100 text-sm mb-4">
                  {rewardsData?.rewards.length || 0} badges collectés
                </p>
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  {(rewardsData?.rewards ?? []).slice(0, 3).map((reward: any, index: number) => (
                    <div key={reward.id} className="flex items-center gap-2 text-xs bg-white/20 rounded px-2 py-1">
                      {reward.rewardType === 'badge' && (
                        <span className="text-yellow-300 animate-bounce text-lg">🎖️</span>
                      )}
                      {reward.rewardType === 'image' && reward.rewardData?.url && (
                        <img src={reward.rewardData.url} alt={reward.rewardData.name} className="w-6 h-6 rounded-full border-2 border-white" />
                      )}
                      {reward.rewardType === 'secret_link' && reward.rewardData?.url && (
                        <a href={reward.rewardData.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-200 hover:text-blue-400">
                          🔗 Lien secret
                        </a>
                      )}
                      <span>{reward.rewardData?.name || 'Récompense'}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Lottery */}
            <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <motion.div 
                  className="text-6xl mb-3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  🎲
                </motion.div>
                <h4 className="font-bold text-lg mb-2">Tirage au Sort</h4>
                <p className="text-blue-100 text-sm mb-4">Participation hebdomadaire</p>
                <Button
                  onClick={() => lotteryMutation.mutate()}
                  disabled={lotteryMutation.isPending}
                  className="bg-white text-blue-600 hover:bg-blue-100 font-semibold"
                >
                  {lotteryMutation.isPending ? 'Inscription...' : 'Participer'}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Latest Winner */}
          {winnerData?.winner && (
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl">
              <h5 className="font-bold text-lg mb-2 text-gray-800">🏆 Dernier Gagnant du Tirage</h5>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">{winnerData.winner.username}</span> - 
                {winnerData.winner.wonAt && new Date(winnerData.winner.wonAt).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-sm text-gray-500 mb-2">{winnerData.winner.prizeDescription}</p>
            </div>
          )}

          {/* Success Messages */}
          {mysteryChestMutation.isSuccess && (
            <motion.div 
              className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              🎉 Félicitations ! Tu as reçu une nouvelle récompense !
            </motion.div>
          )}

          {lotteryMutation.isSuccess && (
            <motion.div 
              className="mt-6 p-4 bg-blue-100 border border-blue-400 rounded-lg text-blue-700 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              🎲 Tu es inscrit au tirage de cette semaine ! Bonne chance !
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
