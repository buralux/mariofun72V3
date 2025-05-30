import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Brain, Gamepad2, Target, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { GameEngine, QuizQuestion, MemoryCard } from '@/lib/gameEngine';
import { motion } from 'framer-motion';

interface GameScore {
  gameType: string;
  score: number;
  username: string;
}

export default function GamesSection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [memoryStartTime, setMemoryStartTime] = useState<number>(0);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Fetch user's scores
  const { data: scoresData } = useQuery<{ scores: GameScore[] }>({
    queryKey: [`/api/games/scores/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch leaderboard
  const { data: leaderboardData } = useQuery<{ leaderboard: GameScore[] }>({
    queryKey: ['/api/games/leaderboard/quiz_mario'],
  });

  // Submit score mutation
  const scoreSubmitMutation = useMutation({
    mutationFn: async (data: { gameType: string; score: number; timeSpent: number }) => {
      const response = await apiRequest('POST', '/api/games/score', {
        userId: user?.id,
        ...data
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/games/scores/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/games/leaderboard/quiz_mario'] });
    }
  });

  const games = [
    {
      id: 'quiz_mario',
      name: 'Quiz Mario',
      description: 'Teste tes connaissances Mario',
      emoji: '🧠',
      color: 'from-red-400 to-pink-500',
      category: 'quiz'
    },
    {
      id: 'quiz_fortnite',
      name: 'Quiz Fortnite',
      description: 'Connais-tu bien Fortnite ?',
      emoji: '🎯',
      color: 'from-purple-400 to-indigo-500',
      category: 'quiz'
    },
    {
      id: 'memory',
      name: 'Memory Game',
      description: 'Retourne les cartes gaming',
      emoji: '🃏',
      color: 'from-green-400 to-teal-500',
      category: 'memory'
    },
    {
      id: 'drag_drop',
      name: 'Glisser-Déposer',
      description: 'Place les objets gaming au bon endroit',
      emoji: '🎮',
      color: 'from-orange-400 to-red-500',
      category: 'puzzle'
    }
  ];

  const startQuiz = (gameType: string) => {
    const theme = gameType === 'quiz_mario' ? 'mario' : gameType === 'quiz_fortnite' ? 'fortnite' : 'general';
    const questions = GameEngine.getQuizQuestions(theme);
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizStartTime(Date.now());
    setActiveGame(gameType);
  };

  const startMemoryGame = () => {
    const cards = GameEngine.generateMemoryCards();
    setMemoryCards(cards);
    setFlippedCards([]);
    setMemoryMoves(0);
    setMemoryStartTime(Date.now());
    setActiveGame('memory');
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (answerIndex === currentQuestion.correctAnswer) {
      setQuizScore(prev => prev + currentQuestion.points);
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < quizQuestions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz finished
        const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
        const finalScore = GameEngine.calculateScore(
          activeGame!,
          quizScore,
          quizQuestions.length * 100,
          timeSpent
        );
        
        if (user) {
          scoreSubmitMutation.mutate({
            gameType: activeGame!,
            score: finalScore,
            timeSpent
          });
        }
        
        setActiveGame(null);
      }
    }, 1500);
  };

  const handleMemoryCardClick = (cardId: string) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId)) return;
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    setMemoryMoves(prev => prev + 1);

    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards;
      const firstCard = memoryCards.find(card => card.id === firstId);
      const secondCard = memoryCards.find(card => card.id === secondId);

      if (firstCard?.content === secondCard?.content) {
        // Match found
        setMemoryCards(prev => prev.map(card => 
          card.content === firstCard.content 
            ? { ...card, isMatched: true, isFlipped: true }
            : card
        ));
        setFlippedCards([]);
        
        // Check if game is complete
        const updatedCards = memoryCards.map(card => 
          card.content === firstCard.content 
            ? { ...card, isMatched: true }
            : card
        );
        
        if (updatedCards.every(card => card.isMatched)) {
          // Game completed
          const timeSpent = Math.floor((Date.now() - memoryStartTime) / 1000);
          const finalScore = Math.max(0, 1000 - (memoryMoves * 10) - timeSpent);
          
          if (user) {
            scoreSubmitMutation.mutate({
              gameType: 'memory',
              score: finalScore,
              timeSpent
            });
          }
          
          setTimeout(() => setActiveGame(null), 2000);
        }
      } else {
        // No match
        setTimeout(() => {
          setMemoryCards(prev => prev.map(card => 
            newFlippedCards.includes(card.id) 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }

    // Update card flip state
    setMemoryCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));
  };

  const getUserBestScore = (gameType: string) => {
    const userScores = scoresData?.scores.filter(score => score.gameType === gameType) || [];
    return userScores.length > 0 ? Math.max(...userScores.map(s => s.score)) : 0;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-green-100 to-teal-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Fredoka One' }}>
            <Gamepad2 className="inline mr-3 text-orange-500" />
            Jeux & Quiz
          </h2>
          <p className="text-lg text-gray-600">Teste tes compétences gaming et amuse-toi !</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${game.color} text-white text-center hover:scale-105 transition-all duration-300 cursor-pointer`}>
                <CardContent className="p-6">
                  <div className="text-6xl mb-4">{game.emoji}</div>
                  <h4 className="font-bold text-lg mb-2">{game.name}</h4>
                  <p className="text-white/90 text-sm mb-4">{game.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-center text-yellow-300 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < 3 ? 'fill-current' : ''}`} 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-white/80">
                      Meilleur: {getUserBestScore(game.id)} pts
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => {
                      if (game.category === 'quiz') {
                        startQuiz(game.id);
                      } else if (game.id === 'memory') {
                        startMemoryGame();
                      }
                    }}
                    className="bg-white text-gray-800 hover:bg-gray-100 font-semibold w-full"
                  >
                    Jouer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="mt-12">
          <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6" style={{ fontFamily: 'Fredoka One' }}>
                🏆 Classement des Champions
              </h3>
              <div className="space-y-3">
                {leaderboardData?.leaderboard.slice(0, 3).map((player, index) => {
                  const medals = ['🥇', '🥈', '🥉'];
                  const bgColors = ['from-yellow-200 to-yellow-300', 'from-gray-200 to-gray-300', 'from-orange-200 to-orange-300'];
                  
                  return (
                    <div key={index} className={`flex items-center justify-between p-3 bg-gradient-to-r ${bgColors[index]} rounded-lg`}>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{medals[index]}</span>
                        <span className="font-bold text-gray-800">{player.username}</span>
                      </div>
                      <span className="font-bold text-gray-800">{player.score.toLocaleString()} pts</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Game Dialog */}
        <Dialog open={activeGame?.startsWith('quiz') === true} onOpenChange={() => setActiveGame(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center" style={{ fontFamily: 'Fredoka One' }}>
                {activeGame === 'quiz_mario' ? 'Quiz Mario' : 'Quiz Fortnite'}
              </DialogTitle>
            </DialogHeader>
            
            {quizQuestions.length > 0 && (
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Question {currentQuestionIndex + 1}/{quizQuestions.length}</span>
                    <span>Score: {quizScore} pts</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {quizQuestions[currentQuestionIndex]?.question}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {quizQuestions[currentQuestionIndex]?.answers.map((answer, index) => (
                      <Button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={`text-left p-4 transition-all duration-300 ${
                          selectedAnswer === null 
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                            : selectedAnswer === index
                              ? index === quizQuestions[currentQuestionIndex].correctAnswer
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                              : index === quizQuestions[currentQuestionIndex].correctAnswer
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {answer}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Memory Game Dialog */}
        <Dialog open={activeGame === 'memory'} onOpenChange={() => setActiveGame(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center" style={{ fontFamily: 'Fredoka One' }}>
                Memory Game
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-6">
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Coups: {memoryMoves}</span>
                <span>Temps: {Math.floor((Date.now() - memoryStartTime) / 1000)}s</span>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {memoryCards.map((card) => (
                  <motion.div
                    key={card.id}
                    className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 ${
                      card.isFlipped || card.isMatched
                        ? 'bg-orange-200'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => handleMemoryCardClick(card.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {card.isFlipped || card.isMatched ? card.emoji : '❓'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
