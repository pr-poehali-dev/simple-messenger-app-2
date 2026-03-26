import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { api, User, Chat, Message } from "@/lib/api";

const EMOJIS = ["😀", "😍", "🔥", "💜", "🚀", "✨", "😂", "❤️", "👏", "🎉", "😎", "🌸"];

interface MessengerPageProps {
  currentUser: User;
}

export default function MessengerPage({ currentUser }: MessengerPageProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadChats = async () => {
    try {
      const data = await api.chats.list(currentUser.id);
      if (Array.isArray(data)) setChats(data);
    } catch (e) { console.error(e); }
  };

  const loadMessages = async (chatId: number) => {
    setLoadingMsgs(true);
    try {
      const data = await api.messages.list(chatId);
      if (Array.isArray(data)) setMessages(data);
    } catch (e) { console.error(e); } finally { setLoadingMsgs(false); }
  };

  const openNewChat = async () => {
    setShowNewChat(true);
    setLoadingUsers(true);
    try {
      const data = await api.users.list(currentUser.id);
      if (Array.isArray(data)) setAllUsers(data);
    } catch (e) { console.error(e); } finally { setLoadingUsers(false); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadChats(); }, []);
   
  useEffect(() => { if (selectedChat) loadMessages(selectedChat.id); }, [selectedChat]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const startChat = async (user: User) => {
    try {
      const data = await api.chats.create(currentUser.id, user.id);
      setShowNewChat(false);
      setUserSearch("");
      await loadChats();
      setSelectedChat({
        id: data.id,
        other_id: user.id,
        other_name: user.name,
        other_avatar: user.avatar,
        last_msg: "",
        last_time: "",
        unread: 0,
      });
    } catch (e) { console.error(e); }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !selectedChat || sendingMsg) return;
    setSendingMsg(true);
    const text = inputText.trim();
    setInputText("");
    try {
      const data = await api.messages.send(selectedChat.id, currentUser.id, text);
      setMessages(prev => [...prev, {
        id: data.id, text, sender_id: currentUser.id,
        sender_name: currentUser.name, sender_avatar: currentUser.avatar, time: data.time,
      }]);
      await loadChats();
    } catch { setInputText(text); } finally { setSendingMsg(false); }
  };

  const addEmoji = (emoji: string) => { setInputText(prev => prev + emoji); setShowEmojis(false); };

  const filteredChats = chats.filter(c => c.other_name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredUsers = allUsers.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()));

  return (
    <div className="h-full flex">
      <div className={`flex flex-col ${selectedChat ? 'hidden md:flex w-72' : 'flex w-full'} border-r border-border/50`}>
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-montserrat font-bold text-foreground">Сообщения</h2>
            <button onClick={openNewChat} className="p-2 rounded-xl text-white neon-glow" style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
              <Icon name="Plus" size={18} />
            </button>
          </div>
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Поиск чатов..."
              className="w-full bg-muted/40 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-colors" />
          </div>
        </div>

        {showNewChat && (
          <div className="mx-4 mb-3 glass rounded-2xl p-3 animate-fade-in gradient-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Новый чат</span>
              <button onClick={() => { setShowNewChat(false); setUserSearch(""); }} className="text-muted-foreground hover:text-foreground">
                <Icon name="X" size={16} />
              </button>
            </div>
            <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Найти пользователя..."
              className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-colors mb-2" />
            <div className="max-h-44 overflow-y-auto space-y-1">
              {loadingUsers ? (
                <div className="text-center py-3 text-muted-foreground text-sm">Загрузка...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-3 text-muted-foreground text-sm">
                  {allUsers.length === 0 ? "Пока нет других пользователей" : "Не найдено"}
                </div>
              ) : filteredUsers.map(u => (
                <button key={u.id} onClick={() => startChat(u)}
                  className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition-colors text-left">
                  <span className="text-xl">{u.avatar}</span>
                  <span className="text-sm text-foreground font-medium">{u.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {filteredChats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm text-muted-foreground">Нет чатов</p>
              <button onClick={openNewChat} className="mt-3 text-xs text-purple-400 hover:text-purple-300">
                Начать новый чат
              </button>
            </div>
          )}
          {filteredChats.map(chat => (
            <button key={chat.id} onClick={() => setSelectedChat(chat)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${selectedChat?.id === chat.id ? 'nav-item-active' : 'hover:bg-white/5'}`}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 flex-shrink-0">
                {chat.other_avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground truncate">{chat.other_name}</span>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{chat.last_time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground truncate">{chat.last_msg || "Начните переписку"}</span>
                  {chat.unread > 0 && (
                    <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b border-border/50 glass-dark">
            <button onClick={() => setSelectedChat(null)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors md:hidden">
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20">
              {selectedChat.other_avatar}
            </div>
            <div className="flex-1">
              <span className="font-semibold text-foreground">{selectedChat.other_name}</span>
              <p className="text-xs text-muted-foreground">Личное сообщение</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingMsgs ? (
              <div className="flex justify-center py-8"><div className="text-muted-foreground text-sm">Загрузка...</div></div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="text-5xl mb-4">{selectedChat.other_avatar}</div>
                <p className="text-muted-foreground text-sm">Начни переписку с {selectedChat.other_name}!</p>
              </div>
            ) : messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 animate-fade-in ${msg.sender_id === currentUser.id ? 'flex-row-reverse' : ''}`}>
                {msg.sender_id !== currentUser.id && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 flex-shrink-0">
                    {msg.sender_avatar}
                  </div>
                )}
                <div className={`max-w-[70%] ${msg.sender_id === currentUser.id ? 'msg-bubble-out' : 'msg-bubble-in'} px-4 py-2.5`}>
                  <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                  <div className={`text-xs mt-1 ${msg.sender_id === currentUser.id ? 'text-white/60 text-right' : 'text-white/40'}`}>{msg.time}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border/50">
            {showEmojis && (
              <div className="glass rounded-xl p-3 mb-2 flex flex-wrap gap-2 animate-scale-in">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:scale-125 transition-transform">{e}</button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button onClick={() => setShowEmojis(!showEmojis)}
                className={`p-2.5 rounded-xl transition-colors ${showEmojis ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'} glass`}>
                <Icon name="Smile" size={18} />
              </button>
              <button className="p-2.5 rounded-xl text-muted-foreground hover:text-blue-400 transition-colors glass">
                <Icon name="Paperclip" size={18} />
              </button>
              <input value={inputText} onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Напиши сообщение..."
                className="flex-1 bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-colors" />
              <button onClick={sendMessage} disabled={!inputText.trim() || sendingMsg}
                className="p-2.5 rounded-xl text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95 neon-glow"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
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
            <p className="text-muted-foreground text-sm mt-1">Или начни новый разговор через +</p>
          </div>
        </div>
      )}
    </div>
  );
}