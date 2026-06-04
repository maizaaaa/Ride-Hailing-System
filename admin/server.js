const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * POST Endpoint: Capture coordinate inputs and tracking device IP addresses
 */
app.post('/api/checkout', (req, res) => {
    const { driver_id, user_role, latitude, longitude } = req.body;

    if (!driver_id || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ success: false, error: 'Missing required payload parameters.' });
    }

    // Automatically capture the sender's IP address from the incoming request headers
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const role = user_role || 'Driver';

    const insertQuery = `
        INSERT INTO driver_locations (driver_id, user_role, latitude, longitude, ip_address) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(insertQuery, [driver_id, role, latitude, longitude, clientIp], function(err) {
        if (err) {
            console.error('Database write error:', err.message);
            return res.status(500).json({ success: false, error: 'Database capture error.' });
        }
        
        console.log(`[GPS RECEIVED] User: ${driver_id} (${role}) | IP: ${clientIp}`);
        res.status(201).json({ success: true, message: 'Location and network data recorded.' });
    });
});

/**
 * GET Endpoint: Serve latest locations including IP information
 */
app.get('/api/locations', (req, res) => {
    const filteringQuery = `
        SELECT dl.id, dl.driver_id, dl.user_role, dl.latitude, dl.longitude, dl.ip_address, dl.timestamp 
        FROM driver_locations dl
        INNER JOIN (
            SELECT driver_id, MAX(timestamp) as max_timestamp 
            FROM driver_locations 
            GROUP BY driver_id
        ) latest ON dl.driver_id = latest.driver_id AND dl.timestamp = latest.max_timestamp
    `;

    db.all(filteringQuery, [], (err, rows) => {
        if (err) {
            console.error('Database query failure:', err.message);
            return res.status(500).json({ error: 'Failed to stream logs.' });
        }
        res.status(200).json(rows);
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});