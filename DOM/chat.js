
const token = localStorage.getItem('token');
const decodedToken=parseJwt(token);
const username = decodedToken.name;
console.log(decodedToken);
localStorage.setItem('id', decodedToken.userId);

const messages=JSON.parse(localStorage.getItem("messages")) || [];


const socket=io('http://127.0.0.1:3000')


//setInterval(() => {
   //fetchMessages();
//},1000);
const logoutbtn=document.getElementById("logout-btn")
logoutbtn.addEventListener('click', logout);

const sendButton = document.getElementById("send-btn");
sendButton.addEventListener("click", sendmessage);


document.addEventListener("DOMContentLoaded", function () {
    updateusername()
    fetchLoggedInUsers();
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

function updateusername(){
    document.getElementById("username-nav").textContent = username;
}

function logout(){
    axios.put(`http://127.0.0.1:3000/user/logout/${decodedToken.userId}`)
    .then(res => {
            localStorage.removeItem("token");
            localStorage.clear();
            window.location.href = "/";
        alert(res.data.message);
    })
    .catch(err => {
        console.log(err);
    })
}

function sendmessage(){
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        console.log('File selected:', file);
      } else {
        console.log('No file selected');
      }
    if(message==='' && !file)
    {
    alert("No message or image");
    }
    const userId=decodedToken.userId;
    const groupId=localStorage.getItem('groupid');
    const chat={
        message,
        userId,
        username,
        groupId,
    }
     // If there's a file, first upload the file to the server
     if (file) {
        const formData = new FormData();
        formData.append('file', file);  // Append the file to the formData
        console.log('formData', formData);
        console.log('sending to upload file')
        // Send the file to the server (this assumes you have a '/upload' endpoint on your server)
        axios.post('http://127.0.0.1:3000/chat/upload', formData)
            .then(uploadResponse => {
                // After file is uploaded, get the file URL from the response
                const fileUrl = uploadResponse.data.fileUrl;

                // Include the file URL in the chat object
                chat.fileUrl = fileUrl;

                // Now send the message along with the file URL
                axios.post('http://127.0.0.1:3000/chat/addmessage', chat)
                    .then(res => {
                        console.log(res.data);
                        const name = res.data.name;
                        const chatMessage = res.data.chat.message;
                        const chatFileUrl = res.data.chat.fileUrl;  // The file URL returned from the backend

                        // Add the message to the local chat array (for persistence)
                        messages.push(res.data.chat);
                        localStorage.setItem("messages", JSON.stringify(messages));

                        // Create the message item in the chat list
                        const li = document.createElement("li");
                        li.classList.add("list-group-item");

                        // If the message contains a file URL, create an image element
                        if (chatFileUrl) {
                            li.innerHTML = `${name}: ${chatMessage} <br><img src="${chatFileUrl}" alt="Shared File" style="max-width: 100px; max-height: 100px;"/>`;
                        } else {
                            li.textContent = `${name}: ${chatMessage}`;
                        }

                        // Append the new message to the chat list
                        chatList.appendChild(li);
                        messageInput.value = "";  // Reset the message input
                    })
                    .catch(err => console.log("Error sending message with file:", err));
            })
            .catch(err => {
                console.log("Error uploading file:", err);
                alert("File upload failed");
            });
    }else{
    axios.post('http://127.0.0.1:3000/chat/addmessage',chat)
    .then(res => {
        console.log(res.data)
        const name = res.data.name;
        const chatMessage = res.data.chat.message;
        messages.push(res.data.chat);
        localStorage.setItem("messages", JSON.stringify(messages));
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = `${name}: ${chatMessage}`;
        chatList.appendChild(li);
        messageInput.value = ""; 
    })
    .catch(err => console.log(err));
}
}

function fetchLoggedInUsers() {
    axios.get('http://127.0.0.1:3000/user/activeuser')
    .then(res => {
        console.log(res.status);
        const users=res.data;
        console.log(users);
        const chatList = document.getElementById("chat-list");
        chatList.innerHTML="";
        users.forEach(user => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = `${user.username} joined`; 
            chatList.appendChild(li);
       })
   })
    .catch(err => console.log(err));
    
}

// Fetch all chat messages
function fetchMessages() {
    let lastmessageid=-1;
    if(messages.length>0)
    {
        lastmessageid=messages[messages.length-1].id;
    }
    axios.get(`http://127.0.0.1:3000/chat/getmessages/${lastmessageid}`)
    .then(response => {
        const chats=response.data;
        console.log(chats);
        chats.forEach(chat => {
            messages.push(chat);
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = `${chat.username}: ${chat.message}`; // Display the user and their message
            chatList.appendChild(li);
        });
        if(messages.length>1000)
        {
            messages.splice(0,100);
        }
        localStorage.setItem("messages", JSON.stringify(messages));
    })
    .catch(err => {
        console.error("Error fetching messages:", err);
    });
}

socket.on('newMessage', function(data) {
    console.log("New message received:", data);
    const chatList = document.getElementById("chat-list");
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = `${data.username}: ${data.message}`;
    chatList.appendChild(li);
});


