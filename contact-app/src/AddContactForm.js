import React, { useState } from "react";
import "./App.css"; // Import your CSS file

const AddContactForm = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [displayContactInfo, setDisplayContactInfo] = useState("");

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://localhost:5000/view_contacts");
      const result = await response.json();

      setDisplayContactInfo(result.contacts.length === 0 ? "No contacts found" : "Contact List");
      
      if (result.success) {
        setContacts(result.contacts);
      } else {
        alert("Failed to retrieve contacts.");
      }
    } catch (error) {
      alert("Error fetching contacts: " + error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { username, phone };

    try {
      if (editingContact) {
        const response = await fetch(
          `http://localhost:5000/edit_contact/${editingContact.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        const result = await response.json();
        if (result.success) {
          fetchContacts();
          setEditingContact(null);
          setUsername("");
          setPhone("");
        }
      } else {
        const response = await fetch("http://localhost:5000/add_contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!result.success && result.message === "Phone number already exists") {
          alert("Error: The phone number already exists.");
          fetchContacts();
        } else {
          setUsername("");
          setPhone("");
        }
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (contact) => {
    setUsername(contact.username);
    setPhone(contact.phone);
    setEditingContact(contact);
    setSelectedContactId(contact.id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/delete_contact/${id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (result.success) {
        fetchContacts();
        setSelectedContactId(null);
      }
    } catch (error) {
      alert("Error deleting contact: " + error.message);
    }
  };

  const toggleButtons = (id) => {
    setSelectedContactId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="contact-form">
      <h1>{editingContact ? "Edit Contact" : "Add Contact"}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Contact name:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label htmlFor="phone">Phone Number:</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <div className="action-buttons">
          <button type="submit" className="add-button">
            {editingContact ? "Update Contact" : "Add Contact"}
          </button>
          <button type="button" className="view-button" onClick={fetchContacts}>
            View contacts
          </button>
        </div>
      </form>
      <h2 id="contactList"> {displayContactInfo} </h2>
      <div className="contact-list">
        {contacts.map((contact) => (
          <div key={contact.id} className="contact-item">
            <div className="contact-content">
              <div className="info">{contact.username} - {contact.phone}</div>
              <div className="setting-container">
                {selectedContactId === contact.id ? (
                  <div className="buttons-container">
                    <button
                      className="edit-button"
                      onClick={() => {
                        handleEdit(contact);
                        toggleButtons(contact.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => {
                        handleDelete(contact.id);
                        toggleButtons(contact.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    className="setting-icon"
                    onClick={() => toggleButtons(contact.id)}
                  >
                    ⚙️
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddContactForm;
