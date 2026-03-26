import Icon from "@/components/ui/icon";
import { User } from "@/lib/api";

interface HomePageProps {
  currentUser: User;
  onNavigate: (tab: string) => void;
}

export default function HomePage({ currentUser, onNavigate }: HomePageProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm">Добро пожаловать,</p>
            <h2 className="text-2xl font-montserrat font-bold text-foreground">
              {currentUser.name} <span>{currentUser.avatar}</span>
            </h2>
          </div>
          <button className="relative p-2 glass rounded-xl">
            <Icon name="Bell" size={20} className="text-foreground" />
          </button>
        </div>

        <div className="glass rounded-2xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-purple-500 to-pink-500">
              {currentUser.avatar}
            </div>
            <button
              onClick={() => onNavigate("feed")}
              className="flex-1 text-left text-muted-foreground text-sm bg-white/5 rounded-xl px-4 py-2.5 border border-white/10 hover:border-purple-500/50 transition-colors"
            >
              Что у тебя нового?
            </button>
            <button
              onClick={() => onNavigate("feed")}
              className="p-2 rounded-xl text-pink-400 hover:bg-pink-500/10 transition-colors"
            >
              <Icon name="Image" size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 glass neon-glow">
            🌍
          </div>
          <h3 className="text-lg font-montserrat font-bold text-foreground mb-2">Добро пожаловать в VIBE!</h3>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Здесь пока пусто — напиши первый пост в ленте, начни общение в чатах или пригласи друзей
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onNavigate("feed")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white neon-glow transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              Написать пост
            </button>
            <button
              onClick={() => onNavigate("messenger")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold glass text-foreground border border-border/50 hover:border-purple-500/50 transition-colors"
            >
              Открыть чаты
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}