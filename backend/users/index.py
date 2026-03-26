"""Получение списка пользователей и обновление профиля"""
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
        user_id = params.get("exclude_id")
        if user_id:
            cur.execute(f"SELECT id, name, avatar, bio FROM {SCHEMA}.users WHERE id != %s ORDER BY name", (user_id,))
        else:
            cur.execute(f"SELECT id, name, avatar, bio FROM {SCHEMA}.users ORDER BY name")
        rows = cur.fetchall()
        conn.close()
        users = [{"id": r[0], "name": r[1], "avatar": r[2], "bio": r[3]} for r in rows]
        return {"statusCode": 200, "headers": headers, "body": json.dumps(users)}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        user_id = body.get("id")
        avatar = body.get("avatar")
        name = body.get("name")
        bio = body.get("bio")
        if not user_id:
            conn.close()
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "id обязателен"})}
        updates = []
        values = []
        if avatar:
            updates.append("avatar = %s")
            values.append(avatar)
        if name:
            updates.append("name = %s")
            values.append(name.strip())
        if bio is not None:
            updates.append("bio = %s")
            values.append(bio)
        if updates:
            values.append(user_id)
            cur.execute(f"UPDATE {SCHEMA}.users SET {', '.join(updates)} WHERE id = %s RETURNING id, name, avatar, bio", values)
            row = cur.fetchone()
            conn.commit()
            conn.close()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": row[0], "name": row[1], "avatar": row[2], "bio": row[3]})}
        conn.close()
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Нет данных для обновления"})}

    conn.close()
    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}
