"""Отправка и получение сообщений в чате"""
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
        chat_id = params.get("chat_id")
        if not chat_id:
            conn.close()
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "chat_id обязателен"})}
        cur.execute(f"""
            SELECT m.id, m.text, m.sender_id, u.name, u.avatar, m.created_at
            FROM {SCHEMA}.messages m
            JOIN {SCHEMA}.users u ON u.id = m.sender_id
            WHERE m.chat_id = %s
            ORDER BY m.created_at ASC
        """, (chat_id,))
        rows = cur.fetchall()
        conn.close()
        msgs = [{"id": r[0], "text": r[1], "sender_id": r[2], "sender_name": r[3], "sender_avatar": r[4], "time": r[5].strftime("%H:%M")} for r in rows]
        return {"statusCode": 200, "headers": headers, "body": json.dumps(msgs)}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        chat_id = body.get("chat_id")
        sender_id = body.get("sender_id")
        text = (body.get("text") or "").strip()
        if not chat_id or not sender_id or not text:
            conn.close()
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "chat_id, sender_id и text обязательны"})}
        cur.execute(
            f"INSERT INTO {SCHEMA}.messages (chat_id, sender_id, text) VALUES (%s, %s, %s) RETURNING id, created_at",
            (chat_id, sender_id, text)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": row[0], "time": row[1].strftime("%H:%M")})}

    conn.close()
    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}
