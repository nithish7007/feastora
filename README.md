# 🍲 FEASTORA – Complete Java Full Stack Food Ordering & Restaurant Platform

> *"Every Craving Has a Destination."*

FEASTORA is a production-grade, enterprise-ready full-stack food delivery and restaurant management platform inspired by the leading consumer experience of platforms like Zomato and Swiggy, built with a completely unique brand identity, custom Indian chef mascot, and rich cultural gastronomy spanning **Bengaluru, Chennai, Tamil Nadu, and Karnataka**.

---

## 🌟 Executive Summary & Portfolio Highlights

- **Backend Architecture**: Enterprise Java (Java 17/25) utilizing **Java Servlets 6.0 (Jakarta EE 10)**, Apache Tomcat 10.1+, JDBC connection pooling, PreparedStatement query sanitization, and manual JDBC transaction management.
- **Frontend Architecture**: Modern **React.js 18** paired with **Tailwind CSS**, Lucide React iconography, fluid glassmorphism, responsive mobile-first UI, and animated state transitions.
- **Database Architecture**: Normalized **MySQL 8.0+** relational schema (`feastora_db`) with 21 relational tables, strict foreign keys, indexing, and automated inventory sync.
- **Security & Authorization**: **BCrypt password hashing** (`jbcrypt`), HTTP session authorization, role-based access control (`CUSTOMER`, `ADMIN`), login rate limiting, and audit logging.
- **Enterprise Features**: 7-Step visual order tracking pipeline, dynamic UPI QR code generator with manual admin verification, JavaMail SMTP alerts sent to `s.ten8hs9698@gmail.com`, and financial CSV exports.

---

## 🏗️ Project Architecture & Directory Structure

```
FEASTORA/
├── backend/
│   ├── src/main/java/com/feastora/
│   │   ├── config/          # DatabaseConfig, AppConfig
│   │   ├── controller/      # Servlets (Auth, Restaurant, Food, Cart, Order, Admin, Payment, Delivery)
│   │   ├── dao/             # UserDAO, RestaurantDAO, FoodDAO, CartDAO, OrderDAO, PaymentDAO, ReportDAO
│   │   ├── filter/          # CORSFilter, AdminAuthFilter
│   │   ├── model/           # User, Restaurant, FoodItem, Cart, Order, Payment, InventoryItem
│   │   ├── service/         # AuthService, OrderService, EmailService, InventoryService
│   │   ├── util/            # JsonUtil, SecurityUtil (BCrypt)
│   │   └── ServerMain.java  # Embedded Tomcat 10.1+ Standalone Runner
│   ├── src/main/resources/  # database.properties, email.properties
│   ├── src/main/webapp/     # WEB-INF/web.xml (Servlet 6.0 Deployment Descriptor)
│   ├── pom.xml              # Maven configuration (WAR packaging)
│   └── mvnw.cmd             # Maven Wrapper
│
├── frontend/
│   ├── public/
│   │   └── logo-icon.svg    # Cartoon Mascot (Chef with turban, towel, spoon, & biryani bowl)
│   ├── src/
│   │   ├── admin/           # Complete Admin Dashboard (Sections A through H)
│   │   ├── components/      # SplashScreen, Navbar, HeroBanner, CategoryBar, Cards, Modals
│   │   ├── context/         # AppContext (Cart, Auth, Orders, Toasts, Server Status)
│   │   ├── pages/           # HomePage, RestaurantPage, OrdersPage
│   │   ├── services/        # api.js (REST API client with resilient demo fallback)
│   │   ├── App.jsx          # Root Component
│   │   ├── index.css        # Tailwind custom styles & animations
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── database/
│   ├── schema.sql           # Complete MySQL 8 DDL (21 tables, constraints, indexes)
│   └── sample-data.sql      # Seed data (Roles, Admin, Customers, 20 Categories, 16 Restaurants, Menu)
│
├── tools/                   # Bundled Maven 3.9.9 binaries
├── run-backend.bat          # 1-Click Java Backend Launcher
├── run-frontend.bat         # 1-Click React Frontend Launcher
├── run-all.bat              # 1-Click Full Stack Launcher
└── README.md
```

---

## 🎨 Branding & Mascot Design

FEASTORA features a colorful, cheerful mascot:
- **Character**: Friendly Indian Chef with royal saffron turban (*pagri*) adorned with ruby kalgi.
- **Attire**: Traditional angavastram towel draped over crisp white chef jacket.
- **Pose**: Left hand holding a golden steaming delicious food bowl; right hand holding a tasting spoon.
- **Color Palette**: Saffron Orange (`#FF5722`), Ruby Red (`#D32F2F`), Sunshine Yellow (`#FFC107`), Basil Green (`#2E7D32`), and Cream White (`#FFFDFB`).

---

## 🍛 Culinary Catalogue & Regions

### 20 Specialized Food Categories
1. South Indian
2. North Indian
3. Tamil Nadu Special
4. Karnataka Special
5. Kerala Special
6. Andhra Special
7. Chinese
8. Italian
9. Fast Food
10. Biryani
11. Pizza
12. Burger
13. Cakes and Desserts
14. Ice Cream
15. Fresh Juices
16. Milkshakes
17. Beverages
18. Healthy Food
19. Street Food
20. Snacks

### Iconic Sample Restaurants
- **Bengaluru**: Mavalli Tiffin Room (MTR), Vidyarthi Bhavan, CTR Shri Sagar, The Rameshwaram Cafe, Meghana Foods, Empire Restaurant, Nagarjuna, Truffles, Brahmin's Coffee Bar.
- **Chennai**: Saravana Bhavan, Murugan Idli Shop, Ratna Cafe, Buhari 1937, Ponnusamy, Junior Kuppanna.
- **Tamil Nadu & Karnataka Regions**: Kongu Naadu Kitchen, Chettinad Spice Palace, Madurai Mess, Hotel Vinayaka Mylari (Mysore), Sri Krishna Udupi Tiffin.

---

## 🔑 Authentication Credentials

### 1. Initial Secure Admin Account
- **Email**: `admin@feastora.com`
- **Password**: `Admin@Feastora2026`
- **Role**: `ADMIN`
- **Security**: Stored as a salted BCrypt hash (`$2a$10$...`). Automatic email alert sent to `s.ten8hs9698@gmail.com` on successful login with IP address and timestamp.
- **Access**: Click the **"Admin Portal"** link in the footer or switch to the Admin tab in the login modal.

### 2. Sample Customer Accounts
- **Customer 1**: `rahul.sharma@example.com` / `Password@123` (Bengaluru)
- **Customer 2**: `priya.patel@example.com` / `Password@123` (Chennai)
- **Customer 3**: `anand.kumar@example.com` / `Password@123` (Mysore)

---

## 🗄️ Database Setup Instructions (MySQL 8)

1. Open your MySQL Command Line or MySQL Workbench.
2. Execute the schema script:
   ```sql
   source /path/to/FEASTORA/database/schema.sql;
   ```
3. Execute the sample data seed script:
   ```sql
   source /path/to/FEASTORA/database/sample-data.sql;
   ```
4. Verify database creation:
   ```sql
   USE feastora_db;
   SHOW TABLES; -- 21 tables created
   SELECT full_name, email, role_id FROM users;
   ```
5. *(Optional)* Update credentials in `backend/src/main/resources/database.properties` if your MySQL root password is not `root`:
   ```properties
   db.url=jdbc:mysql://localhost:3306/feastora_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   db.username=root
   db.password=YOUR_PASSWORD
   ```
   *You can also set environment variables `FEASTORA_DB_USER` and `FEASTORA_DB_PASS`.*

---

## 🚀 Running the Project

### Option A: The 1-Click Launchers (Windows)
Double-click:
```bat
run-all.bat
```
*This starts the Java Tomcat Backend on port `8080` and the React Frontend on port `5173`.*

---

### Option B: Manual Command Line

#### 1. Start the Java Backend
```powershell
cd backend
.\mvnw.cmd compile exec:java
```
Or build the standard WAR file for standalone Tomcat:
```powershell
.\mvnw.cmd package
# Result: backend/target/feastora.war (Deploy to Tomcat 10.1+ webapps/)
```

#### 2. Start the React Frontend
```powershell
cd frontend
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🛡️ Admin Dashboard Features

Navigate to **Admin Portal** from the footer link to access:
- **A. Overview**: Real-time sales trajectory charts, orders counter, active revenue metrics.
- **B. Restaurants**: Register new restaurants, edit cuisine tags, upload banners, toggle open/close status.
- **C. Food Menu**: Add dishes, set vegetarian indicators, pricing, discounts, and bestselling flags.
- **D. Order Management**: Live 7-step pipeline status updater (*ORDER_PLACED → ORDER_CONFIRMED → FOOD_PREPARING → READY_FOR_PICKUP → DELIVERY_PARTNER_ASSIGNED → OUT_FOR_DELIVERY → DELIVERED / CANCELLED*).
- **E. Inventory**: Real-time stock monitor with *LOW STOCK ALERT* and *OUT OF STOCK* badges with 1-click restock modal.
- **F. Payments**: View payment transactions, approve or reject manual UPI UTR payments, dynamically update merchant UPI ID & QR code image.
- **G. Customers**: View customer account lifetime value, order counts, and active status.
- **H. Reports**: Audit analytics and 1-click **Download CSV Sales Report**.

---

## 📧 Email Notification Service (JavaMail SMTP)

Sends automated administrative notifications to `s.ten8hs9698@gmail.com`:
- **Admin Login Alert**: Records admin email, login timestamp, client IP address, and browser User-Agent.
- **New Order Notification**: Dispatches order items, delivery address, and total amount.
- **Payment Verification Alert**: Dispatches transaction reference number and verification status.
- **Order Cancellation Alert**: Notifies when an order is cancelled and inventory is restored.
- *Failure-Safe*: Asynchronous daemon thread pool ensures SMTP delays or network drops never interrupt user ordering workflows.

---

## 🎓 Technology Stack Details

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Glassmorphism, Custom SVG Mascot |
| **Backend** | Java 17/25, Jakarta EE 10 Servlets, Apache Tomcat 10.1+, HikariCP, Gson, jBCrypt, JavaMail |
| **Database** | MySQL 8.0+, InnoDB, UTF-8 MB4, PreparedStatements, Strict Foreign Keys, Transactions |
| **Build & Deploy**| Apache Maven 3.9+, Embedded Tomcat runner, Deployable WAR package |
