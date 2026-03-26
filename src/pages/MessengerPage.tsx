import { useState } from "react";
import Icon from "@/components/ui/icon";

interface User {
  name: string;
  avatar: string;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  type: "dm" | "group" | "channel";
}

interface Message {
  id: number;
  text: string;
  from: string;
  avatar: string;
  time: string;
  isMe: boolean;
}

const EMOJIS = ["😀", "😍", "🔥", "💜", "🚀", "✨", "😂", "❤️", "👏", "🎉", "😎", "🌸"];

const CHATS: Chat[] = [
  { id: 1, name: "Марина", avatar: "🌸", lastMsg: "Привет! Как дела?", time: "сейчас", unread: 3, online: true, type: "dm" },
  { id: 2, name: "Дима Про", avatar: "🚀", lastMsg: "Отправил файл 📎", time: "5 мин", unread: 0, online: true, type: "dm" },
  { id: 3, name: "Группа «Дизайнеры»", avatar: "🎨", lastMsg: "Иван: классная работа!", time: "12 мин", unread: 7, online: false, type: "group" },
  { id: 4, name: "Канал VIBE News", avatar: "📡", lastMsg: "Новое обновление платформы", time: "1 час", unread: 12, online: false, type: "channel" },
  { id: 5, name: "Соня", avatar: "🎵", lastMsg: "Слушай мой новый трек 🎶", time: "2 часа", unread: 0, online: false, type: "dm" },
  { id: 6, name: "Команда VIBE", avatar: "⚡", lastMsg: "Встреча завтра в 10:00", time: "вчера", unread: 0, online: false, type: "group" },
];

const INITIAL_MSGS: { [key: number]: Message[] } = {
  1: [
    { id: 1, text: "Привет! Как дела? 😊", from: "Марина", avatar: "🌸", time: "14:30", isMe: false },
    { id: 2, text: "Всё отлично! Работаю над новым проектом ✨", from: "Ты", avatar: "😎", time: "14:31", isMe: true },
    { id: 3, text: "Звучит интересно! Расскажи подробнее 🔥", from: "Марина", avatar: "🌸", time: "14:32", isMe: false },
  ],
  2: [
    { id: 1, text: "Посмотри, отправил файл с макетами 📎", from: "Дима", avatar: "🚀", time: "15:00", isMe: false },
    { id: 2, text: "Спасибо, уже смотрю!", from: "Ты", avatar: "😎", time: "15:02", isMe: true },
  ],
  3: [
    { id: 1, text: "Ребята, показываю финальный вариант 🎨", from: "Иван", avatar: "⚡", time: "13:00", isMe: false },
    { id: 2, text: "классная работа!", from: "Иван", avatar: "⚡", time: "13:01", isMe: false },
  ],
  4: [
    { id: 1, text: "📢 Новое обновление платформы VIBE! Теперь доступны группы и каналы", from: "VIBE News", avatar: "📡", time: "12:00", isMe: false },
  ],
  5: [
    { id: 1, text: "Слушай мой новый трек 🎶 https://music.example.com", from: "Соня", avatar: "🎵", time: "11:00", isMe: false },
  ],
  6: [
    { id: 1, text: "Встреча завтра в 10:00 по московскому времени", from: "Команда", avatar: "⚡", time: "09:00", isMe: false },
  ],
};

interface MessengerPageProps {
  currentUser: User;
}

export default function MessengerPage({ currentUser }: MessengerPageProps) {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState(INITIAL_MSGS);
  const [inputText, setInputText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [filter, setFilter] = useState<"all" | "dm" | "group" | "channel">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = CHATS.filter(c => {
    const matchesFilter = filter === "all" || c.type === filter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sendMessage = () => {
    if (!inputText.trim() || !selectedChat) return;
    const msg: Message = {
      id: Date.now(),
      text: inputText.trim(),
      from: currentUser.name,
      avatar: currentUser.avatar,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };
    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), msg],
    }));
    setInputText("");
  };

  const addEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setShowEmojis(false);
  };

  const chatMsgs = selectedChat ? (messages[selectedChat.id] || []) : [];

  const typeIcon = (type: string) => {
    if (type === "group") return <Icon name="Users" size={12} className="text-purple-400" />;
    if (type === "channel") return <Icon name="Radio" size={12} className="text-cyan-400" />;
    return null;
  };

  const typeLabel = (type: string) => {
    if (type === "group") return "Группа";
    if (type === "channel") return "Канал";
    return "Личное";
  };

  return (
    <div className="h-full flex">
      <div className={`flex flex-col ${selectedChat ? 'hidden md:flex w-72' : 'flex w-full'} border-r border-border/50`}>
        <div className="p-4 pb-2">
          <h2 className="text-2xl font-montserrat font-bold text-foreground mb-3">Сообщения</h2>
          <div className="relative mb-3">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск чатов..."
              className="w-full bg-muted/40 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {(["all", "dm", "group", "channel"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? 'text-white' : 'text-muted-foreground glass'}`}
                style={filter === f ? { background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' } : {}}
              >
                {f === "all" ? "Все" : f === "dm" ? "Личные" : f === "group" ? "Группы" : "Каналы"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${selectedChat?.id === chat.id ? 'nav-item-active' : 'hover:bg-white/5'}`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20">
                  {chat.avatar}
                </div>
                {chat.online && (
                  <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {typeIcon(chat.type)}
                    <span className="text-sm font-semibold text-foreground truncate">{chat.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground truncate">{chat.lastMsg}</span>
                  {chat.unread > 0 && (
                    <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <button className="glass rounded-xl p-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="Users" size={16} className="text-purple-400" />
              Создать группу
            </button>
            <button className="glass rounded-xl p-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="Radio" size={16} className="text-cyan-400" />
              Создать канал
            </button>
          </div>
        </div>
      </div>

      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b border-border/50 glass-dark">
            <button
              onClick={() => setSelectedChat(null)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors md:hidden"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20">
                {selectedChat.avatar}
              </div>
              {selectedChat.online && (
                <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-background" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                {typeIcon(selectedChat.type)}
                <span className="font-semibold text-foreground">{selectedChat.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{selectedChat.online ? "Онлайн" : typeLabel(selectedChat.type)}</span>
            </div>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="Phone" size={18} />
              </button>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="Video" size={18} />
              </button>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="MoreVertical" size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMsgs.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 animate-fade-in ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                {!msg.isMe && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 flex-shrink-0">
                    {msg.avatar}
                  </div>
                )}
                <div className={`max-w-[70%] ${msg.isMe ? 'msg-bubble-out' : 'msg-bubble-in'} px-4 py-2.5`}>
                  {!msg.isMe && <div className="text-xs font-semibold text-purple-400 mb-1">{msg.from}</div>}
                  <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                  <div className={`text-xs mt-1 ${msg.isMe ? 'text-white/60 text-right' : 'text-white/40'}`}>{msg.time}</div>
                </div>
              </div>
            ))}
            {chatMsgs.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="text-5xl mb-4">{selectedChat.avatar}</div>
                <p className="text-muted-foreground text-sm">Начни переписку с {selectedChat.name}!</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border/50">
            {showEmojis && (
              <div className="glass rounded-xl p-3 mb-2 flex flex-wrap gap-2 animate-scale-in">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:scale-125 transition-transform">
                    {e}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button onClick={() => setShowEmojis(!showEmojis)} className={`p-2.5 rounded-xl transition-colors ${showEmojis ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'} glass`}>
                <Icon name="Smile" size={18} />
              </button>
              <button className="p-2.5 rounded-xl text-muted-foreground hover:text-blue-400 transition-colors glass">
                <Icon name="Paperclip" size={18} />
              </button>
              <button className="p-2.5 rounded-xl text-muted-foreground hover:text-green-400 transition-colors glass">
                <Icon name="Image" size={18} />
              </button>
              <input
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Напиши сообщение..."
                className="flex-1 bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95 neon-glow"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
              >
                <Icon name="Send" size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-muted-foreground font-semibold text-lg">Выбери чат</p>
            <p className="text-muted-foreground text-sm mt-1">Начни общение с кем-то особенным</p>
          </div>
        </div>
      )}
    </div>
  );
}
