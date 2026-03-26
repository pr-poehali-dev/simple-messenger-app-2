import { useState } from "react";
import Icon from "@/components/ui/icon";

interface AuthPageProps {
  onAuth: (user: { name: string; avatar: string }) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const FAKE_USERS: { name: string; password: string; avatar: string }[] = [
    { name: "Алекс", password: "1234", avatar: "🦊" },
    { name: "Марина", password: "1234", avatar: "🌸" },
    { name: "Дима", password: "1234", avatar: "🚀" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !password.trim()) {
      setError("Заполни все поля");
      return;
    }
    if (isLogin) {
      const found = FAKE_USERS.find(
        (u) => u.name.toLowerCase() === name.toLowerCase() && u.password === password
      );
      if (found) {
        onAuth({ name: found.name, avatar: found.avatar });
      } else if (name.trim() && password.trim()) {
        onAuth({ name: name.trim(), avatar: "😎" });
      }
    } else {
      onAuth({ name: name.trim(), avatar: "😎" });
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-600/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-sm animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 neon-glow" style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
            <span className="text-2xl font-montserrat font-black text-white">V</span>
          </div>
          <h1 className="text-4xl font-montserrat font-black gradient-text">VIBE</h1>
          <p className="text-muted-foreground text-sm mt-1">Социальная платформа нового поколения</p>
        </div>

        <div className="glass rounded-2xl p-6 gradient-border">
          <div className="flex rounded-xl overflow-hidden mb-6 bg-muted/30 p-1 gap-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin ? 'text-white shadow-lg' : 'text-muted-foreground'}`}
              style={isLogin ? { background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' } : {}}
            >
              Войти
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin ? 'text-white shadow-lg' : 'text-muted-foreground'}`}
              style={!isLogin ? { background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' } : {}}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Имя</label>
              <div className="relative">
                <Icon name="User" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Твоё имя"
                  className="w-full bg-muted/40 border border-border rounded-xl pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Пароль</label>
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-muted/40 border border-border rounded-xl pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <Icon name="AlertCircle" size={14} />
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] neon-glow"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              {isLogin ? "Войти в VIBE" : "Создать аккаунт"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Демо: имя <span className="text-purple-400">Алекс</span>, пароль <span className="text-purple-400">1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}
