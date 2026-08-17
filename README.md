# 📚 University Library Management System

> A full‑stack web application for managing library operations at Omani universities – featuring book cataloging, member management, borrowing/returning, automated fine calculation, and fine payment handling.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![React](https://img.shields.io/badge/React-18.x-blue) ![Vite](https://img.shields.io/badge/Vite-4.x-yellow) ![SQLite](https://img.shields.io/badge/SQLite-3.x-lightgrey) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- **📖 Book Management** – Add, view, delete books with stock tracking (total & available copies).
- **👤 Member Management** – Register members with Omani names, email, and phone.
- **📤 Borrow & Return** – Borrow books (checks availability) with a 14‑day loan period.
- **💰 Automatic Fine Calculation** – Fines are calculated at return: **1 OMR per day late**.
- **💳 Fine Payment** – Pay outstanding fines with a single click (sets fine to 0).
- **📊 Dashboard** – Real‑time statistics: total books, members, active borrows, overdue items, and unpaid fines (OMR).
- **🌱 Demo Data Seeding** – Instantly populate the system with sample books and Omani members via a one‑click button.
- **🎨 Modern UI** – Clean, responsive design with the Inter font and subtle animations.
- **💾 Lightweight Database** – SQLite – no external database setup required.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, Sequelize (ORM) |
| Frontend | React, Vite, Axios, React Router |
| Database | SQLite (file‑based) |
| Styling | Custom CSS with Google Fonts (Inter) |
| Development | Nodemon (backend), Vite HMR (frontend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Clone the Repository
```bash
git clone https://github.com/yourusername/University-Library-Management-System.git
cd University-Library-Management-System
```

### Backend Setup
```bash
cd backend
npm install
npm run dev   # starts server at http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev   # starts Vite dev server at http://localhost:3000
```

The SQLite database (`database.sqlite`) will be created automatically in the `backend` folder on first run.

---

## 🌱 Seeding Demo Data

After both servers are running, open `http://localhost:3000` and click the **🌱 Seed Demo Data** button on the Dashboard. This will:

- Clear existing data.
- Insert 7 sample books (English titles).
- Insert 5 members with authentic Omani names and contact details.
- Insert 4 transactions (some borrowed, some returned, with one overdue and fined 6 OMR).

You can reseed anytime to reset to the default demo state.

---

## 📡 API Endpoints

All routes are prefixed with `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books` | Get all books |
| POST | `/books` | Add a new book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |
| GET | `/members` | Get all members |
| POST | `/members` | Add a new member |
| PUT | `/members/:id` | Update a member |
| DELETE | `/members/:id` | Delete a member |
| GET | `/transactions` | Get all transactions with book/member details |
| POST | `/transactions/borrow` | Borrow a book (expects `{ bookId, memberId }`) |
| POST | `/transactions/return` | Return a book (expects `{ transactionId }`) |
| PUT | `/transactions/:id/pay-fine` | Pay the fine for a returned transaction |
| GET | `/stats` | Dashboard statistics (books, members, borrows, overdue, total fines) |
| POST | `/seed` | Seed demo data (resets and inserts sample records) |

---

## 💵 Fine System

- Fines are calculated **automatically** when a book is returned.
- Rate: **1 OMR per day late** (rounded up to the next whole day).
- The fine amount is saved in the transaction record.
- The **Pay** button on the transaction history page sets the fine to 0 (simulating payment).
- Unpaid fines are aggregated and displayed on the dashboard.

---

## 🧪 Testing

The system comes with seeded data for immediate testing. You can also manually add books, members, and perform borrow/return operations through the UI.

> *No automated tests are included in this initial version.*

---

## 📁 Project Structure

```
University-Library-Management-System/
├── backend/
│   ├── config/            # Database configuration
│   ├── models/            # Sequelize models (Book, Member, Transaction)
│   ├── routes/            # API route handlers
│   ├── package.json
│   └── server.js          # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api.js         # Axios client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚢 Deployment

You can easily deploy this project to free hosting platforms:

- **Backend**: Render, Railway, or Heroku (set `NODE_ENV=production`).
- **Frontend**: Vercel, Netlify, or Render static sites.

Make sure to set environment variables and use a persistent database (e.g., PostgreSQL) in production if needed.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
- [Google Fonts – Inter](https://fonts.google.com/specimen/Inter)

---

## 📧 Contact

Project maintained by [Shahad Al Harthy](mailto:shahadthy15@gmail.com).  

Feel free to reach out with questions or feedback.

---
