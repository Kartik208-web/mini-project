import mysql.connector

db_config = {
    "host": "localhost",
    "user": "ngo_user",
    "password": "901329V@5588",
    "database": "ngo_db"
}

try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO donations (full_name, email, ngo_name, donation_type, amount, payment_method, message) VALUES ('Test User', 'test@example.com', 'Test NGO', 'Money', 500, 'UPI', 'Testing')")
    conn.commit()
    print("✅ Insert successful")
except Exception as e:
    print("❌ Error:", e)
