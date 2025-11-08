import React from 'react';

type View = 'log' | 'chat';

interface MenuBarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'chat' as View, label: '💬 チャット' },
    { id: 'log' as View, label: '📘 ログ' },
  ];

  return (
    <footer className="
      fixed bottom-0 left-0 w-full 
      bg-white/90 backdrop-blur-md 
      border-t-2 border-gray-200 
      shadow-2xl z-50
    ">
      <nav className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                flex flex-col items-center justify-center 
                px-6 py-2 rounded-2xl 
                transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105'
                  : 'text-gray-600 hover:text-purple-500 hover:scale-105'
                }
              `}
            >
              <span className="text-sm font-semibold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default MenuBar;
