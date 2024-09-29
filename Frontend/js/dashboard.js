// Check if the user is authenticated
if (!localStorage.getItem('token')) {
    // Redirect to login page if token is missing
    window.location.href = 'login.html';
  }
  
  // Logout Functionality
  const logoutButton = document.getElementById('logout-button');
  
  if (logoutButton) {
    logoutButton.addEventListener('click', function () {
      // Clear token from localStorage
      localStorage.removeItem('token');
  
      // Redirect to login page
      window.location.href = 'login.html';
    });
  }

// Base API URL (Replace with your actual backend API)
const apiUrl = 'http://localhost:5000/api';

// Fetch and display contacts when the page loads
window.onload = async function() {
  await fetchContacts();
};

// Fetch contacts from the backend API
async function fetchContacts() {
  try {
    const response = await fetch(`${apiUrl}/contacts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') // Assuming JWT token is stored in localStorage
      }
    });

    const data = await response.json();
    if (response.ok) {
      displayContacts(data.contacts);
    } else {
      alert(data.message || 'Failed to fetch contacts');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching contacts.');
  }
}

// Display contacts in the contact list
function displayContacts(contacts) {
  const contactList = document.getElementById('contact-list');
  contactList.innerHTML = '';

  contacts.forEach(contact => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${contact.name} (${contact.email}, ${contact.phone}, ${contact.address})</span>
      <button onclick="editContact(${contact.id}, '${contact.name}', '${contact.email}', '${contact.phone}', '${contact.address}')">Edit</button>
      <button onclick="deleteContact(${contact.id})">Delete</button>
    `;
    contactList.appendChild(li);
  });
}

// Add or Update a contact
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const contactId = document.getElementById('contact-id').value;
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const phone = document.getElementById('contact-phone').value;
  const address = document.getElementById('contact-address').value;

  if (contactId) {
    // Update contact
    await updateContact(contactId, { name, email, phone, address });
  } else {
    // Add new contact
    await addContact({ name, email, phone, address });
  }

  document.getElementById('contactForm').reset();
  document.getElementById('contact-id').value = ''; // Reset the hidden ID field
  document.getElementById('submit-button').innerText = 'Add Contact'; // Reset button text
  fetchContacts(); // Refresh the contact list
});

// Add a new contact
async function addContact(contact) {
  try {
    const response = await fetch(`${apiUrl}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(contact)
    });

    const data = await response.json();

    if (response.ok) {
      alert('Contact added successfully!');
    } else {
      alert(data.message || 'Failed to add contact');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while adding the contact.');
  }
}

// Update a contact
async function updateContact(contactId, contact) {
  try {
    const response = await fetch(`${apiUrl}/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(contact)
    });

    const data = await response.json();

    if (response.ok) {
      alert('Contact updated successfully!');
    } else {
      alert(data.message || 'Failed to update contact');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while updating the contact.');
  }
}

// Edit a contact (populate the form with the selected contact's details)
function editContact(contactId, name, email, phone, address) {
  document.getElementById('contact-id').value = contactId;
  document.getElementById('contact-name').value = name;
  document.getElementById('contact-email').value = email;
  document.getElementById('contact-phone').value = phone;
  document.getElementById('contact-address').value = address;

  document.getElementById('submit-button').innerText = 'Update Contact';  // Change button text
}

// Delete a contact
async function deleteContact(contactId) {
  if (!confirm('Are you sure you want to delete this contact?')) return;

  try {
    const response = await fetch(`${apiUrl}/contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });

    const data = await response.json();

    if (response.ok) {
      alert('Contact deleted successfully!');
      fetchContacts(); // Refresh the contact list
    } else {
      alert(data.message || 'Failed to delete contact');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while deleting the contact.');
  }
}
