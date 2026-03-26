import { useState } from "react";
import Icon from "@/components/ui/icon";

interface User {
  name: string;
  avatar: string;
}

interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
  liked: boolean;
  verified?: boolean;
}

const EMOJIS = ["😍", "🔥", "💜", "🚀", "✨", "😂", "❤️", "👏"];

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Марина",
    avatar: "🌸",
    time: "2 мин назад",
    text: "Только что закончила работу над новым проектом 🎨 Это было невероятно сложно, но результат стоит того! Иногда нужно просто верить в себя ✨",
    likes: 142,
    comments: 23,
    liked: false,
    verified: true,
  },
  {
    id: 2,
    author: "Дима Про",
    avatar: "🚀",
    time: "15 мин назад",
    text: "Запустил новый сервис за выходные 💻 Код, кофе и немного магии — вот и весь рецепт. Кто хочет попробовать первым? @Марина @Алекс",
    likes: 89,
    comments: 41,
    liked: true,
    verified: true,
  },
  {
    id: 3,
    author: "Соня",
    avatar: "🎵",
    time: "1 час назад",
    text: "Новый трек готов 🎶 Три месяца работы, сотни итераций, и наконец — то самое ощущение когда всё встаёт на своё место",
    likes: 334,
    comments: 67,
    liked: false,
  },
  {
    id: 4,
    author: "Иван",
    avatar: "⚡",
    time: "3 часа назад",
    text: "Путешествие во Владивосток — место где заканчивается страна и начинается океан 🌊 Никогда не видел такого заката",
    likes: 521,
    comments: 88,
    liked: false,
  },
];

interface FeedPageProps {
  currentUser: User;
}

export default function FeedPage({ currentUser }: FeedPageProps) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newText, setNewText] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  const toggleLike = (id: number) => {
    setPosts(posts.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const addEmoji = (emoji: string) => {
    setNewText(prev => prev + emoji);
    setShowEmojis(false);
  };

  const submitPost = () => {
    if (!newText.trim()) return;
    const post: Post = {
      id: Date.now(),
      author: currentUser.name,
      avatar: currentUser.avatar,
      time: "Только что",
      text: newText.trim(),
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts([post, ...posts]);
    setNewText("");
    setShowCompose(false);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-montserrat font-bold text-foreground">Лента</h2>
          <button
            onClick={() => setShowCompose(!showCompose)}
            className="p-2 rounded-xl text-white neon-glow"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
          >
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
                <textarea
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  placeholder="Что происходит? Поделись с миром..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[80px]"
                />
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                  <div className="flex gap-1 relative">
                    <button onClick={() => setShowEmojis(!showEmojis)} className="p-1.5 rounded-lg text-muted-foreground hover:text-yellow-400 transition-colors">
                      <Icon name="Smile" size={18} />
                    </button>
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 transition-colors">
                      <Icon name="Image" size={18} />
                    </button>
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-green-400 transition-colors">
                      <Icon name="Paperclip" size={18} />
                    </button>
                    {showEmojis && (
                      <div className="absolute bottom-full left-0 mb-2 glass rounded-xl p-2 flex gap-1 flex-wrap w-48 animate-scale-in z-10">
                        {EMOJIS.map(e => (
                          <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:scale-125 transition-transform p-1">
                            {e}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={submitPost}
                    disabled={!newText.trim()}
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-all"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
                  >
                    Опубликовать
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {posts.map((post, idx) => (
            <div
              key={post.id}
              className="glass rounded-2xl p-4 animate-fade-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 flex-shrink-0">
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-foreground">{post.author}</span>
                    {post.verified && <Icon name="BadgeCheck" size={14} className="text-purple-400" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                </div>
                <button className="p-1 text-muted-foreground hover:text-foreground">
                  <Icon name="MoreHorizontal" size={18} />
                </button>
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-3">{post.text}</p>

              <div className="flex items-center gap-4 pt-2 border-t border-border/30">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs transition-all duration-200 ${post.liked ? 'text-pink-400 scale-110' : 'text-muted-foreground hover:text-pink-400'}`}
                >
                  <Icon name={post.liked ? "Heart" : "Heart"} size={16} className={post.liked ? "fill-pink-400" : ""} />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-purple-400 transition-colors">
                  <Icon name="MessageCircle" size={16} />
                  {post.comments}
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
      </div>
    </div>
  );
}
