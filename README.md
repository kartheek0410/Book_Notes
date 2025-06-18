# 📚 Book Tracker Website

This is a personal web application that helps me keep track of the books I've read. It allows me to record key details about each book and manage them easily.

## ✨ Features

- ✅ Add a book with:
  - Title
  - Key points/summary
  - Rating
  - Date read (on which day book entry done)
- 📋 View all added books
  - Sorted by **recency** (latest first) and **rating** (highest first)
- ✏️ Edit a book's details
- 🗑️ Delete a book entry

## 🛠️ Tech Stack

- Node.js
- PostgreSQL
- HTML/CSS/EJS (Frontend)
- Express.js (Backend)

## 🚀 Getting Started (Local)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name

2.Install dependencies:
    npm i

3.Set up your .env file:
    PG_HOST=localhost
    PG_PORT=5432
    PG_DATABASE=your_db_name
    PG_USER=your_db_user
    PG_PASSWORD=your_db_password
4.Run the app
     node index.js

5.Open your browser at:
  http://localhost:port; (port i used is 3000 but i recent commit i changed to 10000 so check and use)
