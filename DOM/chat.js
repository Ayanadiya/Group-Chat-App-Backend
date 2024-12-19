

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');
    const decodedToken=parseJwt(token);
    const username = decodedToken.name;
    console.log(decodedToken);
    document.getElementById("username-nav").textContent = username;

    // Handle Logout
    document.getElementById("logout-btn").addEventListener("click", function () {
        // Clear localStorage and redirect or do a full logout action here
        localStorage.removeItem("token");
        window.location.href = "/"; // Redirect to the home page after logout
    });

    fetchLoggedInUsers(username);
    fetchMessages();

    // Send message logic
    const sendButton = document.getElementById("send-btn");
    const messageInput = document.getElementById("message");

    sendButton.addEventListener("click", async function () {
    const message = messageInput.value.trim(); // Get the message from the input field

    // Only send the message if it's not empty
    if (message !== "") {
        try {
            // Make the POST request with the message and the Authorization token
            const res = await axios.post('http://127.0.0.1:3000/chat/addmessage', { message }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}` 
                }
            });
            if(res.status===201){
                console.log(res.data);
                const name = res.data.name;
                const chatMessage = res.data.message;
                const li = document.createElement("li");
                li.classList.add("list-group-item");
                li.textContent = `${name}: ${chatMessage}`;
                document.getElementById("chat-list").appendChild(li);
                messageInput.value = ""; 
            }
            
        } catch (err) {
            console.log(err);
        }
    }
});

});

function parseJwt(token) {
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

function fetchLoggedInUsers(name) {
    const chatList = document.getElementById("chat-list");
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = `${name} joined`; 
    chatList.appendChild(li);
}

// Fetch all chat messages
function fetchMessages() {
    axios.get("http://127.0.0.1:3000/chat/getmessages")
    .then(response => {
        const chats=response.data;
        console.log(chats);
        chats.forEach(chat => {
            console.log(message)
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = `${chat.username}: ${chat.message}`; // Display the user and their message
            chatList.appendChild(li);
        });
    })
    .catch(err => {
        console.error("Error fetching messages:", err);
    });
}
