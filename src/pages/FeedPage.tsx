import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api, User, Post } from "@/lib/api";

const EMOJIS = ["😍", "🔥", "💜", "🚀", "✨", "😂", "❤️", "👏"];

interface FeedPageProps {
  currentUser: User;
}

export default function FeedPage({ currentUser }: FeedPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newText, setNewText] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadPosts(); }, []); // eslint-disable-line

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await api.posts.list(currentUser.id);
      if (Array.isArray(data)) setPosts(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const toggleLike = async (postId: number) => {
    try {
      const data = await api.posts.like(currentUser.id, postId);
      setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: data.likes_count, liked: data.liked } : p));
    } catch (e) { console.error(e); }
  };

  const addEmoji = (emoji: string) => { setNewText(prev => prev + emoji); setShowEmojis(false); };

  const submitPost = async () => {
    if (!newText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const data = await api.posts.create(currentUser.id, newText.trim());
      const newPost: Post = {
        id: data.id, text: newText.trim(), likes_count: 0,
        time: data.time, author: currentUser.name, avatar: currentUser.avatar, liked: false,
      };
      setPosts([newPost, ...posts]);
      setNewText("");
      setShowCompose(false);
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-montserrat font-bold text-foreground">Лента</h2>
          <button onClick={() => setShowCompose(!showCompose)}
            className="p-2 rounded-xl text-white neon-glow"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
            <Icon name="Plus" size={20} />
          </button>
        </div>

        {showCompose && (
          <div className="glass rounded-2xl p-4 mb-4 animate-fade-in gradient-border">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex-shrink-0">
                {currentUser.avatar}
              </div>
              <div className="flex-1">
                <textarea value={newText} onChange={e => setNewText(e.target.value)}
                  placeholder="Что происходит? Поделись с миром..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[80px]" />
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                  <div className="flex gap-1 relative">
                    <button onClick={() => setShowEmojis(!showEmojis)} className="p-1.5 rounded-lg text-muted-foreground hover:text-yellow-400 transition-colors">
                      <Icon name="Smile" size={18} />
                    </button>
                    {showEmojis && (
                      <div className="absolute bottom-full left-0 mb-2 glass rounded-xl p-2 flex gap-1 flex-wrap w-48 animate-scale-in z-10">
                        {EMOJIS.map(e => (
                          <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:scale-125 transition-transform p-1">{e}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={submitPost} disabled={!newText.trim() || submitting}
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-all"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
                    {submitting ? "Публикую..." : "Опубликовать"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="text-muted-foreground text-sm">Загрузка...</div>
          </div>
        ) : posts.length === 0 && !showCompose ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 glass neon-glow">✍️</div>
            <h3 className="text-lg font-montserrat font-bold text-foreground mb-2">Лента пока пуста</h3>
            <p className="text-muted-foreground text-sm max-w-xs">Будь первым — напиши пост и поделись им с сообществом</p>
            <button onClick={() => setShowCompose(true)}
              className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white neon-glow transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
              Написать первый пост
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post, idx) => (
              <div key={post.id} className="glass rounded-2xl p-4 animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 flex-shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm text-foreground">{post.author}</span>
                    <p className="text-xs text-muted-foreground">{post.time}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-3">{post.text}</p>
                <div className="flex items-center gap-4 pt-2 border-t border-border/30">
                  <button onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs transition-all duration-200 ${post.liked ? 'text-pink-400' : 'text-muted-foreground hover:text-pink-400'}`}>
                    <Icon name="Heart" size={16} className={post.liked ? "fill-pink-400" : ""} />
                    {post.likes_count}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-400 transition-colors ml-auto">
                    <Icon name="Share2" size={16} />
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-yellow-400 transition-colors">
                    <Icon name="Bookmark" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
