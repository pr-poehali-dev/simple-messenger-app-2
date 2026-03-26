"""Регистрация и вход пользователей VIBE"""
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

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")
    name = (body.get("name") or "").strip()
    password = (body.get("password") or "").strip()
    avatar = body.get("avatar", "😎")

    if not name or not password:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Имя и пароль обязательны"})}

    conn = get_conn()
    cur = conn.cursor()

    if action == "register":
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE name = %s", (name,))
        if cur.fetchone():
            conn.close()
            return {"statusCode": 409, "headers": headers, "body": json.dumps({"error": "Имя уже занято"})}
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (name, password, avatar) VALUES (%s, %s, %s) RETURNING id, name, avatar, bio",
            (name, password, avatar)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": row[0], "name": row[1], "avatar": row[2], "bio": row[3]})}

    elif action == "login":
        cur.execute(f"SELECT id, name, avatar, bio FROM {SCHEMA}.users WHERE name = %s AND password = %s", (name, password))
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Неверное имя или пароль"})}
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": row[0], "name": row[1], "avatar": row[2], "bio": row[3]})}

    conn.close()
    return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Неизвестное действие"})}
