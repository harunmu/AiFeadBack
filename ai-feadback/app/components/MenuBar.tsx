import React from 'react';
// import { BookOpen, MessageSquare } from 'lucide-react'; // アイコンライブラリの例

type View = 'log' | 'chat';

interface MenuBarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ currentView, onViewChange }) => {
  
  // 各ボタンの設定
  const menuItems = [
    { id: 'chat' as View, label: 'チャット' },
    { id: 'log' as View, label: 'ログ' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-xl z-10">
      <nav className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center p-2 text-sm font-medium transition-colors ${
                isActive 
                  ? 'text-indigo-600 border-t-2 border-indigo-600 -mt-0.5' // アクティブ時のスタイル
                  : 'text-gray-500 hover:text-indigo-600' // 非アクティブ時のスタイル
              }`}
            >
              {/* アイコンのレンダリング */}
              {/* <item.icon className="w-5 h-5 mb-0.5" /> */}
              {/* ラベル */}
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MenuBar;