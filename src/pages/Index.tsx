import { useState } from "react";
import Icon from "@/components/ui/icon";
import AuthPage from "./AuthPage";
import HomePage from "./HomePage";
import FeedPage from "./FeedPage";
import MessengerPage from "./MessengerPage";
import ProfilePage from "./ProfilePage";
import SubscriptionPage from "./SubscriptionPage";

interface User {
  name: string;
  avatar: string;
}

type Tab = "home" | "feed" | "messenger" | "profile" | "subscription";

const NAV_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "feed", label: "Лента", icon: "Newspaper" },
  { id: "messenger", label: "Чаты", icon: "MessageCircle" },
  { id: "profile", label: "Профиль", icon: "User" },
  { id: "subscription", label: "Подписка", icon: "Zap" },
];

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");

  if (!user) {
    return <AuthPage onAuth={setUser} />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case "home": return <HomePage currentUser={user} onNavigate={(t) => setActiveTab(t as Tab)} />;
      case "feed": return <FeedPage currentUser={user} />;
      case "messenger": return <MessengerPage currentUser={user} />;
      case "profile": return <ProfilePage currentUser={user} onUpdateUser={setUser} />;
      case "subscription": return <SubscriptionPage />;
    }
  };

  return (
    <div className="mesh-bg flex flex-col max-w-md mx-auto relative" style={{ height: '100dvh', overflow: 'hidden' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #EC4899, transparent)' }} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <div key={activeTab} className="h-full animate-fade-in">
            {renderPage()}
          </div>
        </div>

        <nav className="flex-shrink-0 glass-dark border-t border-white/8">
          <div className="flex items-center justify-around px-2 py-2">
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-300 relative ${isActive ? 'nav-item-active scale-105' : 'hover:bg-white/5'}`}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl opacity-20 blur-sm" style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }} />
                  )}
                  <Icon
                    name={item.icon}
                    size={22}
                    className={`transition-all duration-300 ${isActive ? 'text-purple-400' : 'text-muted-foreground'}`}
                  />
                  <span className={`text-[10px] font-semibold transition-all duration-300 ${isActive ? 'text-purple-300' : 'text-muted-foreground'}`}>
                    {item.label}
                  </span>
                  {item.id === "messenger" && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-pink-500 animate-pulse-dot" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
