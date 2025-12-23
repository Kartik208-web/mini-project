-- 1️⃣ Create the database
CREATE DATABASE IF NOT EXISTS ngo_db;

-- 2️⃣ Select it
USE ngo_db;

-- 3️⃣ Create the donations table
CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4️⃣ Delete old user if any (to fix permission issue)
DROP USER IF EXISTS 'ngo_user'@'localhost';
FLUSH PRIVILEGES;

-- 5️⃣ Create new user
CREATE USER 'ngo_user'@'localhost' IDENTIFIED BY '12345';

-- 6️⃣ Grant permissions to access ngo_db
GRANT ALL PRIVILEGES ON ngo_db.* TO 'ngo_user'@'localhost';

-- 7️⃣ Use legacy authentication method (fixes Python connector issues)
ALTER USER 'ngo_user'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345';

-- 8️⃣ Apply all privilege changes
FLUSH PRIVILEGES;

-- 9️⃣ Check that user exists
SELECT User, Host FROM mysql.user WHERE User = 'ngo_user';
 