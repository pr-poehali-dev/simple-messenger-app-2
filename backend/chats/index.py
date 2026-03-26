"""Управление чатами: получение списка и создание нового чата"""
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
        if not user_id:
            conn.close()
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "user_id обязателен"})}

        cur.execute(f"""
            SELECT
                c.id,
                CASE WHEN c.user1_id = %s THEN u2.id ELSE u1.id END as other_id,
                CASE WHEN c.user1_id = %s THEN u2.name ELSE u1.name END as other_name,
                CASE WHEN c.user1_id = %s THEN u2.avatar ELSE u1.avatar END as other_avatar,
                (SELECT text FROM {SCHEMA}.messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_msg,
                (SELECT created_at FROM {SCHEMA}.messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_time,
                (SELECT COUNT(*) FROM {SCHEMA}.messages WHERE chat_id = c.id AND sender_id != %s) as unread
            FROM {SCHEMA}.chats c
            JOIN {SCHEMA}.users u1 ON u1.id = c.user1_id
            JOIN {SCHEMA}.users u2 ON u2.id = c.user2_id
            WHERE c.user1_id = %s OR c.user2_id = %s
            ORDER BY last_time DESC NULLS LAST
        """, (user_id, user_id, user_id, user_id, user_id, user_id))

        rows = cur.fetchall()
        conn.close()
        chats = []
        for r in rows:
            chats.append({
                "id": r[0],
                "other_id": r[1],
                "other_name": r[2],
                "other_avatar": r[3],
                "last_msg": r[4] or "",
                "last_time": r[5].strftime("%H:%M") if r[5] else "",
                "unread": int(r[6] or 0)
            })
        return {"statusCode": 200, "headers": headers, "body": json.dumps(chats)}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        user1_id = body.get("user1_id")
        user2_id = body.get("user2_id")
        if not user1_id or not user2_id:
            conn.close()
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "user1_id и user2_id обязательны"})}

        min_id = min(int(user1_id), int(user2_id))
        max_id = max(int(user1_id), int(user2_id))

        cur.execute(f"SELECT id FROM {SCHEMA}.chats WHERE user1_id = %s AND user2_id = %s", (min_id, max_id))
        existing = cur.fetchone()
        if existing:
            conn.close()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": existing[0]})}

        cur.execute(f"INSERT INTO {SCHEMA}.chats (user1_id, user2_id) VALUES (%s, %s) RETURNING id", (min_id, max_id))
        chat_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": chat_id})}

    conn.close()
    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}
