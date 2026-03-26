
CREATE TABLE t_p83964609_simple_messenger_app.users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '😎',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p83964609_simple_messenger_app.chats (
  id SERIAL PRIMARY KEY,
  user1_id INTEGER REFERENCES t_p83964609_simple_messenger_app.users(id),
  user2_id INTEGER REFERENCES t_p83964609_simple_messenger_app.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE t_p83964609_simple_messenger_app.messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER REFERENCES t_p83964609_simple_messenger_app.chats(id),
  sender_id INTEGER REFERENCES t_p83964609_simple_messenger_app.users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p83964609_simple_messenger_app.posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p83964609_simple_messenger_app.users(id),
  text TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p83964609_simple_messenger_app.post_likes (
  user_id INTEGER REFERENCES t_p83964609_simple_messenger_app.users(id),
  post_id INTEGER REFERENCES t_p83964609_simple_messenger_app.posts(id),
  PRIMARY KEY (user_id, post_id)
);
