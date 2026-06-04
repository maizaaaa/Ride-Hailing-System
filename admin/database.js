const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ride_hailing.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the SQLite database:', err.message);
    } else {
        console.log('Connected successfully to the SQLite database.');
    }
});

db.serialize(() => {
    // Added ip_address TEXT to the table structure
    db.run(`
        CREATE TABLE IF NOT EXISTS driver_locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            driver_id TEXT NOT NULL,
            user_role TEXT DEFAULT 'Driver',
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            ip_address TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating database table:', err.message);
        } else {
            console.log('Database tables verified with IP Tracking capabilities.');
        }
    });
});

module.exports = db;
