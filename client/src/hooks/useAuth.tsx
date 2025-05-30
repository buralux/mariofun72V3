import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface AuthContextType {
  user: User | null;
  login: (username: string, youtubeId?: string, isSubscribed?: boolean) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username: string, youtubeId?: string, isSubscribed = false) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        username,
        youtubeId,
        isSubscribed
      });
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('mariofun72_user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mariofun72_user');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const response = await apiRequest('PUT', `/api/user/${user.id}`, updates);
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('mariofun72_user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
      throw error;
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('mariofun72_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur parsing utilisateur sauvé:', error);
        localStorage.removeItem('mariofun72_user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
