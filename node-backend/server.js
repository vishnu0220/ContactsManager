const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Enable CORS to allow React app (running on port 3000) to access this server
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Create an SQLite database or open an existing one
const db = new sqlite3.Database('./contacts.db', (err) => {
  if (err) {
    console.error('Database opening error: ', err);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Create contacts table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE
  )`
);

// POST endpoint to add contact
app.post('/add_contact', (req, res) => {
  const { username, phone } = req.body;

  if (!username || !phone) {
    return res.status(400).json({ success: false, message: 'Username and phone are required' });
  }

  // Check if phone already exists in the database
  db.get('SELECT * FROM contacts WHERE phone = ?', [phone], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error checking phone number' });
    }

    if (row) {
      // If phone number already exists, return an error
      return res.status(400).json({ success: false, message: 'Phone number already exists' });
    }

    // Insert the new contact
    const stmt = db.prepare('INSERT INTO contacts (username, phone) VALUES (?, ?)');
    stmt.run(username, phone, function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error adding contact' });
      }
      res.status(200).json({ success: true, message: 'Contact added successfully' });
    });
    stmt.finalize();
  });
});

// GET endpoint to view all contacts
app.get('/view_contacts', (req, res) => {
  db.all('SELECT * FROM contacts', (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error retrieving contacts' });
    }
    res.status(200).json({ success: true, contacts: rows });
  });
});

// PUT endpoint to update a contact
app.put('/edit_contact/:id', (req, res) => {
  const { id } = req.params;
  const { username, phone } = req.body;

  if (!username || !phone) {
    return res.status(400).json({ success: false, message: 'Username and phone are required' });
  }

  const stmt = db.prepare('UPDATE contacts SET username = ?, phone = ? WHERE id = ?');

  stmt.run(username, phone, id, function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error updating contact' });
    }
    res.status(200).json({ success: true, message: 'Contact updated successfully' });
  });

  stmt.finalize();
});

// DELETE endpoint to delete a contact
app.delete('/delete_contact/:id', (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');

  stmt.run(id, function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error deleting contact' });
    }
    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  });

  stmt.finalize();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
