from flask import Flask, render_template, request, redirect, url_for, session, flash
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "your_secret_key_here"

db_config = {
    "host": "localhost",
    "user": "ngo_user",
    "password": "901329V@5588",
    "database": "ngo_db"
}

def get_db_connection():
    return mysql.connector.connect(**db_config)


# ---------------- HOME PAGE (Login + Signup processing) ----------------
@app.route("/", methods=["GET", "POST"])
def home():

    # DEBUG : Check incoming form data
    if request.method == "POST":
        print("📩 FORM DATA RECEIVED:", request.form)

    # SIGNUP FORM SUBMISSION
    if request.method == "POST" and "first_name" in request.form:
        print("➡️ SIGNUP form triggered")

        first = request.form.get("first_name")
        last = request.form.get("last_name")
        email = request.form.get("email")
        password = request.form.get("password")

        print("Signup data:", first, last, email, password)  # DEBUG

        username = f"{first} {last}"
        hashed_pw = generate_password_hash(password)

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
                           (username, email, hashed_pw))
            conn.commit()
            cursor.close()
            conn.close()
            flash("Account created successfully! Login now 👍", "success")

        except Exception as e:
            print("Signup ERROR:", e)  # DEBUG
            flash("Email already exists ❌", "danger")

        return redirect(url_for("home"))


    # LOGIN FORM SUBMISSION
    if request.method == "POST" and "loginEmail" in request.form:
        print("➡️ LOGIN form triggered")

        email = request.form.get("loginEmail")
        password = request.form.get("loginPassword")

        print("Login data:", email, password)  # DEBUG

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and check_password_hash(user["password_hash"], password):
            session["user_id"] = user["id"]
            session["username"] = user["username"]
            session["user_email"] = user["email"]
            flash(f"Welcome back {user['username']} 👋", "success")
        else:
            flash("Invalid email or password ❌", "danger")

        return redirect(url_for("ngos"))

    return render_template("home.html")



# ---------------- NGO ----------------
@app.route("/ngo")
def ngos():
    return render_template("ngo.html")

# ---------------- LOGOUT ROUTE ----------------
@app.route("/logout")
def logout():
    session.clear()
    flash("Logged out successfully 👋", "info")
    return redirect(url_for("home"))



# ---------------- DONATION (Login Required) ----------------
@app.route("/donation", methods=["GET", "POST"])
def donation_collect():
    if "user_id" not in session:
        flash("Please login before donating 🙏", "warning")
        return redirect(url_for("home"))

    if request.method == "POST":
        full_name = request.form.get("full_name")
        email = request.form.get("email")
        ngo_name = request.form.get("ngo_name")
        donation_type = request.form.get("donation_type")
        amount = request.form.get("amount")
        payment_method = request.form.get("payment_method")
        message = request.form.get("message")

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO donations (full_name, email, ngo_name, donation_type,
                                       amount, payment_method, message)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (full_name, email, ngo_name, donation_type, amount, payment_method, message))
            conn.commit()
            cursor.close()
            conn.close()
            flash("🎉 Donation recorded successfully!", "success")
            return redirect(url_for("donation_collect"))

        except Exception as e:
            print("DB ERROR:", e)
            flash("Database error ❌", "danger")

    return render_template("donation.html")


if __name__ == "__main__":
    app.run(debug=True)
