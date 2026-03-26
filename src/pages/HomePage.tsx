import Icon from "@/components/ui/icon";

interface User {
  name: string;
  avatar: string;
}

interface HomePageProps {
  currentUser: User;
  onNavigate: (tab: string) => void;
}

const STORIES = [
  { name: "Алекс", avatar: "🦊", active: true },
  { name: "Марина", avatar: "🌸", active: true },
  { name: "Дима", avatar: "🚀", active: false },
  { name: "Соня", avatar: "🎵", active: true },
  { name: "Иван", avatar: "⚡", active: false },
  { name: "Катя", avatar: "🌺", active: true },
];

const TRENDING = [
  { tag: "#музыка", posts: "12.4K" },
  { tag: "#технологии", posts: "8.2K" },
  { tag: "#путешествия", posts: "19.1K" },
  { tag: "#дизайн", posts: "5.6K" },
];

const SUGGESTED = [
  { name: "Алекс К.", avatar: "🦊", followers: "2.1K", verified: true },
  { name: "Марина", avatar: "🌸", followers: "890", verified: false },
  { name: "Дима Про", avatar: "🚀", followers: "15K", verified: true },
];

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
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-pulse-dot" />
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

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Онлайн сейчас</h3>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {STORIES.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl relative ${s.active ? 'neon-glow' : ''}`}
                  style={s.active ? { background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3))', border: '2px solid rgba(139,92,246,0.5)' } : { background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)' }}>
                  {s.avatar}
                  {s.active && (
                    <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-background animate-pulse-dot" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Тренды</h3>
          <div className="grid grid-cols-2 gap-2">
            {TRENDING.map((t, i) => (
              <button key={i} className="glass rounded-xl p-3 text-left hover:border-purple-500/30 transition-all duration-200 hover:scale-[1.02]">
                <div className="text-purple-400 font-semibold text-sm">{t.tag}</div>
                <div className="text-muted-foreground text-xs mt-0.5">{t.posts} постов</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Рекомендации</h3>
            <button className="text-xs text-purple-400 hover:text-purple-300">Все</button>
          </div>
          <div className="space-y-2">
            {SUGGESTED.map((u, i) => (
              <div key={i} className="glass rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                  {u.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-foreground">{u.name}</span>
                    {u.verified && <Icon name="BadgeCheck" size={14} className="text-purple-400" />}
                  </div>
                  <div className="text-xs text-muted-foreground">{u.followers} подписчиков</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
                  + Подписаться
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
