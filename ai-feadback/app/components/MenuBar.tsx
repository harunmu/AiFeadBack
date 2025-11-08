import { CalendarDays, MessageCircle } from 'lucide-react';
import React from 'react';

type View = 'log' | 'chat';

interface MenuBarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  theme: { bg: string; accent: string; color: string};
}

const MenuBar: React.FC<MenuBarProps> = ({ currentView, onViewChange, theme }) => {
  const menuItems = [
    { id: 'chat' as View, label: <MessageCircle /> },
    { id: 'log' as View, label: <CalendarDays /> },
  ];

  // colorに基づいた実際の色を定義
  const colorMap: { [key: string]: { active: string; hover: string; } } = {
    green: {
      active: 'bg-green-400',
      hover: 'hover:text-green-500',
    },
    orange: {
      active: 'bg-orange-300',
      hover: 'hover:text-orange-400',
    },
    purple: {
      active: 'bg-purple-300',
      hover: 'hover:text-purple-500',
    }
  };

  const colors = colorMap[theme.color] || colorMap.purple;

  return (
    <footer className="w-full bg-[#f2f2f2a2] backdrop-blur-md border-t-2 border-gray-200 shadow-2xl z-50">
      <nav className="flex justify-around items-center h-30 max-w-lg mx-auto">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`scale-180 flex flex-col items-center justify-center px-6 py-2 rounded-full transition-all duration-200
                ${isActive
                  ? `bg-gradient-to-r ${colors.active} text-white shadow-lg scale-180 hover:shadow-xl`
                  : `text-gray-600 ${colors.hover} hover:scale-200`
                }
              `}
            >
              <span className="text-3xl font-semibold tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default MenuBar