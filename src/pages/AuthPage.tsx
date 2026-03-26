import { useState } from "react";
import Icon from "@/components/ui/icon";
import { api, User } from "@/lib/api";

interface AuthPageProps {
  onAuth: (user: User) => void;
}

const AVATARS = ["😎", "🦊", "🌸", "🚀", "🎵", "⚡", "🌺", "🔥", "✨", "🎨", "🌊", "🦋"];

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("😎");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !password.trim()) { setError("Заполни все поля"); return; }
    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await api.auth.login(name.trim(), password);
      } else {
        data = await api.auth.register(name.trim(), password, avatar);
      }
      if (data.error) { setError(data.error); return; }
      onAuth(data as User);
    } catch {
      setError("Ошибка соединения, попробуй ещё раз");
    } finally {
      setLoading(false);
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
            <span className="text-2xl font-montserrat font-black text-white">+8</span>
          </div>
          <h1 className="text-4xl font-montserrat font-black gradient-text">+8</h1>
          <p className="text-muted-foreground text-sm mt-1">тут могла быть ваша реклама
(мать повешана)</p>
        </div>

        <div className="glass rounded-2xl p-6 gradient-border">
          <div className="flex rounded-xl overflow-hidden mb-6 bg-muted/30 p-1 gap-1">
            {(["Войти", "Регистрация"] as const).map((label, i) => {
              const active = isLogin === (i === 0);
              return (
                <button key={label} onClick={() => { setIsLogin(i === 0); setError(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${active ? 'text-white shadow-lg' : 'text-muted-foreground'}`}
                  style={active ? { background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' } : {}}>
                  {label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Аватар</label>
                <button type="button" onClick={() => setShowAvatars(!showAvatars)}
                  className="w-full flex items-center gap-3 bg-muted/40 border border-border rounded-xl px-4 py-3 hover:border-purple-500 transition-colors">
                  <span className="text-2xl">{avatar}</span>
                  <span className="text-sm text-muted-foreground">Выбери аватар</span>
                  <Icon name="ChevronDown" size={16} className="ml-auto text-muted-foreground" />
                </button>
                {showAvatars && (
                  <div className="mt-2 glass rounded-xl p-3 grid grid-cols-6 gap-2">
                    {AVATARS.map(a => (
                      <button key={a} type="button" onClick={() => { setAvatar(a); setShowAvatars(false); }}
                        className={`text-2xl p-2 rounded-lg transition-all hover:scale-125 ${avatar === a ? 'neon-glow' : 'hover:bg-white/10'}`}
                        style={avatar === a ? { background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3))' } : {}}>
                        {a}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Имя</label>
              <div className="relative">
                <Icon name="User" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Твоё имя"
                  className="w-full bg-muted/40 border border-border rounded-xl pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Пароль</label>
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full bg-muted/40 border border-border rounded-xl pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <Icon name="AlertCircle" size={14} />{error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] neon-glow disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
              {loading ? "Загрузка..." : isLogin ? "Войти в VIBE" : "Создать аккаунт"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}