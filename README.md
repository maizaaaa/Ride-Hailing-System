# 🚖 RideCheck: Full-Stack Ride-Hailing System

A complete full-stack ride-hailing solution featuring a cross-platform mobile application for users and a real-time web dashboard for administrators. 

This project allows Drivers and Passengers to check in their live GPS locations, which are instantly synchronized and plotted on an interactive map for admins to monitor.

## 📸 Screenshots

### Mobile App (Flutter)

|  Role | Output |
|---------------|----------------|
| Passanger | <img width="1650" height="1275" alt="passagers" src="https://github.com/user-attachments/assets/2e8c0d1f-c169-4aa4-98e1-2b3bcf9dec3c" /> |
| Driver | <img width="3300" height="2550" alt="driver" src="https://github.com/user-attachments/assets/854711c7-f1f3-493e-b8bd-e0ca586dab85" /> |

**📱 Mobile App (Drivers & Passengers)**
* **Role Selection:** Users can securely log in as either a Passenger or a Driver.
* **Live GPS Tracking:** Captures highly accurate coordinates using the device's native location services.
* **Server Synchronization:** Sends real-time timestamped location data to the central database.

### Admin Control Panel (Web)

  Role | Output |
|---------------|----------------|
| Admin | <img width="902" height="491" alt="Screenshot 2026-06-04 215558" src="https://github.com/user-attachments/assets/4916f65b-2dea-4126-a22c-60d3a78a1d2c" /> |

**💻 Admin Dashboard**
* **Interactive Map:** Live plotting of all active users using OpenStreetMap and Leaflet.js.
* **Real-time Analytics:** Tracks total check-ins, active drivers, and active passengers.
* **Smart Filtering:** Search users by name or filter the table by specific roles without refreshing the page.
* **Click-to-Locate:** Instantly pan the map to a specific user's location with the click of a button.


## 🛠️ Tech Stack

* **Frontend (Mobile):** Flutter & Dart
* **Frontend (Web):** HTML5, CSS3, Vanilla JavaScript, Leaflet.js
* **Backend API:** PHP 8+
* **Database:** MySQL

## 🚀 Getting Started

### 1. Database Setup (Ubuntu Linux)
1. Open your Ubuntu VM terminal and log in to MySQL: `sudo mysql -u root -p`
2. Create a MySQL database named `ride_hailing_db`.
3. Create the `check_ins` table with the following columns: `id` (Auto Increment), `driver_id`, `user_role`, `latitude`, `longitude`, `ip_address`, `timestamp`.
4. Ensure your database credentials in `admin/api.php` match your Ubuntu MySQL user (e.g., user `admin`, password `password123`).

### 2. Admin Dashboard Setup (Apache on Ubuntu)
1. Move the `admin` folder contents into your Ubuntu Apache web server directory, specifically: `/var/www/html/RIDE-HAILING/`
2. Ensure your Apache and MySQL services are awake and running:
   ```bash
   sudo systemctl start apache2
   sudo systemctl start mysql
   
### 3. Flutter App Setup
1. Open the `flutter` folder in your terminal.
2. Run `flutter pub get` to install dependencies.
3. **Important:** Open `lib/main.dart` and update the `http.post` URL to match your computer's local Wi-Fi IP address (e.g., `http://192.168.1.X/admin/api.php`).
4. Run the app on an emulator or physical device using `flutter run`.
