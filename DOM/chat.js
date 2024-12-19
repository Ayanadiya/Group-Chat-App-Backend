document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("Token") || "Arun";
    const decodedToken = parseJwt(token);
    const username = decodedToken.name;
    document.getElementById("username-nav").textContent = username;

    // Handle Logout
    document.getElementById("logout-btn").addEventListener("click", function () {
        // Clear localStorage and redirect or do a full logout action here
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/"; // Redirect to the home page after logout
    });

    fetchLoggedInUsers();
    fetchMessages();

    // Send message logic
    const sendButton = document.getElementById("send-btn");
    const messageInput = document.getElementById("message");
    sendButton.addEventListener("click", function () {
        const message = messageInput.value.trim();
        if (message !== "") {
            // You would send the message to the backend here
            // For now, we will just display it in the chat list
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = `${username}: ${message}`;
            document.getElementById("chat-list").appendChild(li);
            messageInput.value = ""; // Clear message input after sending
        }
    });
});

function parseJWT(token) {
    if (!token) {
        return null; // If no token provided, return null
    }
    
    const base64Url = token.split('.')[1]; // Get the payload part of the token
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // URL safe base64 to regular base64
    
    try {
        const jsonPayload = JSON.parse(window.atob(base64)); // Decode and parse JSON
        
        return jsonPayload; // Return the decoded payload
    } catch (error) {
        console.error('Invalid JWT token', error);
        return null; // In case the token is invalid
    }
}

function fetchLoggedInUsers() {
    fetch("http://127.0.0.1:3000/users", {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}` 
        }
    })
    .then(response => response.json())
    .then(users => {
        const chatList = document.getElementById("chat-list");
    
        users.forEach(user => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = `${user.username} joined`; 
            chatList.appendChild(li);
        });
    })
    .catch(err => {
        console.error("Error fetching users:", err);
    });
}

// Fetch all chat messages
function fetchMessages() {
    fetch("http://127.0.0.1:3000/messages", {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}` 
        }
    })
    .then(response => response.json())
    .then(messages => {
        const chatList = document.getElementById("chat-list");

        messages.forEach(message => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = `${message.user}: ${message.message}`; // Display the user and their message
            chatList.appendChild(li);
        });
    })
    .catch(err => {
        console.error("Error fetching messages:", err);
    });
}
