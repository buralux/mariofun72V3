export interface QuizQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  points: number;
}

export interface MemoryCard {
  id: string;
  content: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export class GameEngine {
  // Quiz questions for different themes
  static getQuizQuestions(theme: 'mario' | 'fortnite' | 'general'): QuizQuestion[] {
    const questions = {
      mario: [
        {
          id: '1',
          question: 'Quel est le nom de la princesse que Mario sauve souvent ?',
          answers: ['Peach', 'Daisy', 'Rosalina', 'Zelda'],
          correctAnswer: 0,
          points: 100
        },
        {
          id: '2',
          question: 'Quel est le nom du frère de Mario ?',
          answers: ['Wario', 'Luigi', 'Waluigi', 'Yoshi'],
          correctAnswer: 1,
          points: 100
        },
        {
          id: '3',
          question: 'Comment s\'appelle le principal ennemi de Mario ?',
          answers: ['Koopa', 'Goomba', 'Bowser', 'Piranha'],
          correctAnswer: 2,
          points: 150
        },
        {
          id: '4',
          question: 'Dans quel jeu Mario peut-il voler avec une cape ?',
          answers: ['Super Mario World', 'Super Mario Bros 3', 'Mario Galaxy', 'Mario Kart'],
          correctAnswer: 0,
          points: 200
        }
      ],
      fortnite: [
        {
          id: '1',
          question: 'Comment appelle-t-on la zone de tempête dans Fortnite ?',
          answers: ['Storm', 'Zone', 'Cercle', 'Tempête'],
          correctAnswer: 0,
          points: 100
        },
        {
          id: '2',
          question: 'Combien de joueurs maximum dans une partie de Fortnite Battle Royale ?',
          answers: ['50', '100', '150', '200'],
          correctAnswer: 1,
          points: 100
        },
        {
          id: '3',
          question: 'Quel matériau est le plus résistant pour construire ?',
          answers: ['Bois', 'Pierre', 'Métal', 'Plastique'],
          correctAnswer: 2,
          points: 150
        }
      ],
      general: [
        {
          id: '1',
          question: 'Quelle console a sorti Nintendo en 2017 ?',
          answers: ['Wii U', 'Switch', '3DS', 'GameCube'],
          correctAnswer: 1,
          points: 100
        },
        {
          id: '2',
          question: 'Quel personnage mange des points dans un labyrinthe ?',
          answers: ['Mario', 'Sonic', 'Pac-Man', 'Link'],
          correctAnswer: 2,
          points: 100
        }
      ]
    };

    return questions[theme] || questions.general;
  }

  // Generate memory cards with gaming characters
  static generateMemoryCards(): MemoryCard[] {
    const characters = [
      { content: 'mario', emoji: '🍄' },
      { content: 'luigi', emoji: '👨‍🔧' },
      { content: 'bowser', emoji: '🐢' },
      { content: 'peach', emoji: '👸' },
      { content: 'yoshi', emoji: '🦕' },
      { content: 'sonic', emoji: '💙' },
      { content: 'pacman', emoji: '🟡' },
      { content: 'kirby', emoji: '🩷' }
    ];

    const cards: MemoryCard[] = [];
    characters.forEach((char, index) => {
      // Create pairs
      cards.push({
        id: `${char.content}-1`,
        content: char.content,
        emoji: char.emoji,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        id: `${char.content}-2`,
        content: char.content,
        emoji: char.emoji,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    return cards.sort(() => Math.random() - 0.5);
  }

  // Drag and drop puzzle items
  static getDragDropItems() {
    return {
      items: [
        { id: 'controller', emoji: '🎮', category: 'gaming' },
        { id: 'console', emoji: '📺', category: 'gaming' },
        { id: 'headset', emoji: '🎧', category: 'gaming' },
        { id: 'pizza', emoji: '🍕', category: 'food' },
        { id: 'burger', emoji: '🍔', category: 'food' },
        { id: 'apple', emoji: '🍎', category: 'food' },
        { id: 'car', emoji: '🚗', category: 'transport' },
        { id: 'bike', emoji: '🚲', category: 'transport' }
      ],
      categories: [
        { id: 'gaming', name: 'Gaming', color: 'bg-blue-200' },
        { id: 'food', name: 'Nourriture', color: 'bg-green-200' },
        { id: 'transport', name: 'Transport', color: 'bg-yellow-200' }
      ]
    };
  }

  // Calculate score based on performance
  static calculateScore(gameType: string, correctAnswers: number, totalQuestions: number, timeSpent: number): number {
    const baseScore = Math.round((correctAnswers / totalQuestions) * 1000);
    const timeBonus = Math.max(0, 500 - timeSpent); // Bonus for speed
    return Math.max(0, baseScore + timeBonus);
  }

  // Generate random VIP reward
  static generateVipReward(): { type: string; data: any } {
    const rewards = [
      {
        type: 'badge',
        data: { name: 'Champion du Quiz', emoji: '🏆', description: 'Maître des quiz gaming' }
      },
      {
        type: 'avatar',
        data: { name: 'Avatar Spécial', url: '/avatars/special-1.png', description: 'Avatar exclusif VIP' }
      },
      {
        type: 'secret_link',
        data: { name: 'Contenu Secret', url: '/secret/vip-only', description: 'Accès à du contenu caché' }
      },
      {
        type: 'points_bonus',
        data: { amount: 500, description: 'Bonus de 500 points !' }
      }
    ];

    return rewards[Math.floor(Math.random() * rewards.length)];
  }
}
