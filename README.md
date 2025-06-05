# ContactsManager

**ContactManager** is a full-stack application that stores and manages contact details.  
It supports adding, viewing, editing, and deleting contacts through a clean and interactive interface.

---

## Features

- ➕ **Add Contact**  
  Add a new contact by entering the name and phone number.

- 📋 **View Contacts**  
  Displays all saved contacts in a list.

- ⚙️ **Settings Button (per contact)**  
  Every contact has a settings icon on the right side.  
  On clicking it, you will see two options:
  - ✏️ **Edit** – Update an existing contact.
  - ❌ **Delete** – Permanently delete a contact.

---

## 🚀 Tech Stack

This project was built with:

### 🌐 Frontend
- React
- CSS for styling

### 🛠️ Backend
- Node.js
- Express.js
- Local DB file (`contacts.db`) for data storage

---

## 🧰 Getting Started – Run It Locally

### 📦 Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or later)
- npm (comes with Node)

---

### 🛠️ Step-by-Step Installation

#### 1. **Clone the Repository**
```bash
git clone https://github.com/your-username/ContactManager.git
cd ContactManager
```

### 🛠️ 2. Set Up the Backend (Node.js)

```bash
cd node-backend
npm install
```

### 3. Now start the backend server
```bash
cd node-backend
node server.js
```

### 4. Set Up the Frontend (React)
In a new terminal tab or window, go to the frontend folder and then start the React development server.
```bash
cd contact-app
npm start
```