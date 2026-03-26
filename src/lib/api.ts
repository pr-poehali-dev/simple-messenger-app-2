const URLS = {
  auth: "https://functions.poehali.dev/c2639894-1080-4725-b960-9b1d7cabc725",
  users: "https://functions.poehali.dev/1e608f90-7ef6-4479-9271-0c6af127f7f7",
  chats: "https://functions.poehali.dev/4125ff15-75ad-43e8-8619-0e47fbadde15",
  messages: "https://functions.poehali.dev/c1112bbf-59b7-4510-8d7c-fe2155819418",
  posts: "https://functions.poehali.dev/6780fda2-4bc4-4c44-b937-330b42b5a6be",
};

export interface User {
  id: number;
  name: string;
  avatar: string;
  bio: string;
}

export interface Chat {
  id: number;
  other_id: number;
  other_name: string;
  other_avatar: string;
  last_msg: string;
  last_time: string;
  unread: number;
}

export interface Message {
  id: number;
  text: string;
  sender_id: number;
  sender_name: string;
  sender_avatar: string;
  time: string;
}

export interface Post {
  id: number;
  text: string;
  likes_count: number;
  time: string;
  author: string;
  avatar: string;
  liked: boolean;
}

export const api = {
  auth: {
    register: (name: string, password: string, avatar: string) =>
      fetch(URLS.auth, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "register", name, password, avatar }) }).then(r => r.json()),
    login: (name: string, password: string) =>
      fetch(URLS.auth, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "login", name, password }) }).then(r => r.json()),
  },
  users: {
    list: (excludeId?: number) =>
      fetch(URLS.users + (excludeId ? `?exclude_id=${excludeId}` : "")).then(r => r.json()) as Promise<User[]>,
    update: (data: { id: number; name?: string; avatar?: string; bio?: string }) =>
      fetch(URLS.users, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
  },
  chats: {
    list: (userId: number) =>
      fetch(URLS.chats + `?user_id=${userId}`).then(r => r.json()) as Promise<Chat[]>,
    create: (user1Id: number, user2Id: number) =>
      fetch(URLS.chats, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user1_id: user1Id, user2_id: user2Id }) }).then(r => r.json()),
  },
  messages: {
    list: (chatId: number) =>
      fetch(URLS.messages + `?chat_id=${chatId}`).then(r => r.json()) as Promise<Message[]>,
    send: (chatId: number, senderId: number, text: string) =>
      fetch(URLS.messages, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, sender_id: senderId, text }) }).then(r => r.json()),
  },
  posts: {
    list: (userId?: number) =>
      fetch(URLS.posts + (userId ? `?user_id=${userId}` : "")).then(r => r.json()) as Promise<Post[]>,
    create: (userId: number, text: string) =>
      fetch(URLS.posts, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", user_id: userId, text }) }).then(r => r.json()),
    like: (userId: number, postId: number) =>
      fetch(URLS.posts, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "like", user_id: userId, post_id: postId }) }).then(r => r.json()),
  },
};
