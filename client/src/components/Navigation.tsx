import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gamepad2, Crown, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Theme } from '@/types';

interface NavigationProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  themes: Theme[];
}

export default function Navigation({ currentTheme, onThemeChange, themes }: NavigationProps) {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg shadow-lg z-50 border-b-4 border-orange-400">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-teal-400 rounded-full flex items-center justify-center animate-bounce">
              <Gamepad2 className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Fredoka One' }}>
                MarioFun72
              </h1>
              <p className="text-sm text-gray-600">L'univers gaming de Youssef</p>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                {user.isSubscribed && (
                  <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    <Crown className="w-4 h-4 mr-1" />
                    VIP
                  </div>
                )}
                <span className="text-gray-700 font-semibold">{user.username}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Theme Switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-700">Thème:</span>
              <div className="flex space-x-1">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => onThemeChange(theme)}
                    className={`w-8 h-8 rounded-full border-2 border-white shadow-md transition-all duration-300 ${
                      currentTheme.id === theme.id ? 'ring-4 ring-gray-400 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ background: theme.colors.background }}
                    title={`${theme.emoji} ${theme.name}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
