import { useState } from "react";
import Icon from "@/components/ui/icon";
import { api, User } from "@/lib/api";

interface ProfilePageProps {
  currentUser: User;
  onUpdateUser: (u: User) => void;
}

const AVATARS = ["😎", "🦊", "🌸", "🚀", "🎵", "⚡", "🌺", "🔥", "✨", "🎨", "🌊", "🦋", "🐉", "🌙", "🎭", "🦄"];

export default function ProfilePage({ currentUser, onUpdateUser }: ProfilePageProps) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(currentUser.name);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [editingBio, setEditingBio] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const data = await api.users.update({ id: currentUser.id, name: newName.trim(), bio });
      if (!data.error) onUpdateUser(data as User);
    } catch (e) { console.error(e); } finally {
      setSaving(false);
      setEditing(false);
      setEditingBio(false);
    }
  };

  const selectAvatar = async (a: string) => {
    try {
      const data = await api.users.update({ id: currentUser.id, avatar: a });
      if (!data.error) onUpdateUser(data as User);
    } catch (e) { console.error(e); }
    setShowAvatarPicker(false);
  };

  const stats = [
    { label: "Посты", value: "0" },
    { label: "Подписчики", value: "0" },
    { label: "Подписки", value: "0" },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative">
        <div className="h-32 w-full" style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #F97316)' }} />
        <div className="absolute top-4 right-4">
          <button onClick={() => { setEditing(!editing); setShowAvatarPicker(false); }}
            className="glass-dark px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5">
            <Icon name="Settings" size={14} />
            Настройки
          </button>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-end gap-4 -mt-10 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border-4 border-background neon-glow cursor-pointer"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(236,72,153,0.3))' }}
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
              {currentUser.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
              <Icon name="Camera" size={14} className="text-white" />
            </div>
          </div>
          <div className="flex-1 pb-2">
            {editing ? (
              <div className="flex gap-2">
                <input value={newName} onChange={e => setNewName(e.target.value)} autoFocus
                  className="flex-1 bg-muted/40 border border-purple-500/50 rounded-xl px-3 py-1.5 text-sm text-foreground focus:outline-none" />
                <button onClick={saveProfile} disabled={saving}
                  className="px-3 py-1.5 rounded-xl text-white text-sm disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
                  {saving ? "..." : "OK"}
                </button>
              </div>
            ) : (
              <h2 className="text-xl font-montserrat font-bold text-foreground">{currentUser.name}</h2>
            )}
            <p className="text-sm text-muted-foreground">@{currentUser.name.toLowerCase().replace(/\s/g, '_')}</p>
          </div>
        </div>

        {showAvatarPicker && (
          <div className="glass rounded-2xl p-4 mb-4 animate-scale-in gradient-border">
            <p className="text-sm font-semibold text-foreground mb-3">Выбери аватар</p>
            <div className="grid grid-cols-8 gap-2">
              {AVATARS.map(a => (
                <button key={a} onClick={() => selectAvatar(a)}
                  className={`text-2xl p-1.5 rounded-xl transition-all hover:scale-125 ${currentUser.avatar === a ? 'neon-glow' : 'hover:bg-white/10'}`}
                  style={currentUser.avatar === a ? { background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3))' } : {}}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="glass rounded-2xl p-4 mb-4 relative">
          {editingBio ? (
            <div>
              <textarea value={bio} onChange={e => setBio(e.target.value)} autoFocus rows={2}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none resize-none" />
              <button onClick={saveProfile} className="text-xs text-purple-400 mt-1">
                {saving ? "Сохраняю..." : "Сохранить"}
              </button>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <p className="text-sm text-foreground leading-relaxed">{bio || "Расскажи о себе..."}</p>
              <button onClick={() => setEditingBio(true)} className="ml-2 text-muted-foreground hover:text-purple-400 transition-colors flex-shrink-0">
                <Icon name="Pencil" size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {stats.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-3 text-center">
              <div className="text-xl font-montserrat font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => { setEditing(true); setShowAvatarPicker(false); }}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white neon-glow transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
            Редактировать профиль
          </button>
          <button className="flex-1 py-2.5 rounded-xl font-semibold text-sm glass text-foreground border border-border/50 hover:border-purple-500/50 transition-colors">
            Поделиться
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-10 text-center glass rounded-2xl">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-sm font-semibold text-foreground mb-1">Публикаций пока нет</p>
          <p className="text-xs text-muted-foreground">Твои посты из ленты появятся здесь</p>
        </div>
      </div>
    </div>
  );
}
