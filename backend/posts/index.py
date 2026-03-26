"""Посты в ленте: получение, создание, лайки"""
import json
import os
import psycopg2

SCHEMA = "t_p83964609_simple_messenger_app"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    }
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    method = event.get("httpMethod")
    conn = get_conn()
    cur = conn.cursor()

    if method == "GET":
        params = event.get("queryStringParameters") or {}
        user_id = params.get("user_id")
        if user_id:
            cur.execute(f"""
                SELECT p.id, p.text, p.likes_count, p.created_at, u.name, u.avatar,
                    EXISTS(SELECT 1 FROM {SCHEMA}.post_likes pl WHERE pl.post_id = p.id AND pl.user_id = %s) as liked
                FROM {SCHEMA}.posts p
                JOIN {SCHEMA}.users u ON u.id = p.user_id
                ORDER BY p.created_at DESC
            """, (user_id,))
        else:
            cur.execute(f"""
                SELECT p.id, p.text, p.likes_count, p.created_at, u.name, u.avatar, false
                FROM {SCHEMA}.posts p
                JOIN {SCHEMA}.users u ON u.id = p.user_id
                ORDER BY p.created_at DESC
            """)
        rows = cur.fetchall()
        conn.close()
        posts = [{"id": r[0], "text": r[1], "likes_count": r[2], "time": r[3].strftime("%d.%m %H:%M"), "author": r[4], "avatar": r[5], "liked": r[6]} for r in rows]
        return {"statusCode": 200, "headers": headers, "body": json.dumps(posts)}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        action = body.get("action", "create")

        if action == "create":
            user_id = body.get("user_id")
            text = (body.get("text") or "").strip()
            if not user_id or not text:
                conn.close()
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "user_id и text обязательны"})}
            cur.execute(
                f"INSERT INTO {SCHEMA}.posts (user_id, text) VALUES (%s, %s) RETURNING id, created_at",
                (user_id, text)
            )
            row = cur.fetchone()
            conn.commit()
            conn.close()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": row[0], "time": row[1].strftime("%d.%m %H:%M")})}

        if action == "like":
            user_id = body.get("user_id")
            post_id = body.get("post_id")
            if not user_id or not post_id:
                conn.close()
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "user_id и post_id обязательны"})}
            cur.execute(f"SELECT 1 FROM {SCHEMA}.post_likes WHERE user_id = %s AND post_id = %s", (user_id, post_id))
            if cur.fetchone():
                cur.execute(f"DELETE FROM {SCHEMA}.post_likes WHERE user_id = %s AND post_id = %s", (user_id, post_id))
                cur.execute(f"UPDATE {SCHEMA}.posts SET likes_count = likes_count - 1 WHERE id = %s RETURNING likes_count", (post_id,))
                liked = False
            else:
                cur.execute(f"INSERT INTO {SCHEMA}.post_likes (user_id, post_id) VALUES (%s, %s)", (user_id, post_id))
                cur.execute(f"UPDATE {SCHEMA}.posts SET likes_count = likes_count + 1 WHERE id = %s RETURNING likes_count", (post_id,))
                liked = True
            likes = cur.fetchone()[0]
            conn.commit()
            conn.close()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"likes_count": likes, "liked": liked})}

    conn.close()
    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}
