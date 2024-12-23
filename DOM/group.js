
const createGroupBtnModal = document.getElementById('createGroupBtnModal');
const groupNameInput = document.getElementById('groupName');
const grouplist=document.getElementById('group-list');

// Create Group
createGroupBtnModal.addEventListener('click', function() {
    const groupName = groupNameInput.value.trim();
    const selectedUsers = Array.from(document.getElementById('groupMembers').selectedOptions).map(option => option.value);

    if (!groupName && selectedUsers.length > 0) {
        alert('Please enter a group name.');
        return;
    }
    axios.post(`http://127.0.0.1:3000/group/creategroup/`,{
        groupName,
        selectedUsers
    })
    .then(res => {
        alert("new group has created");
        // Reset the form
    groupNameInput.value = '';
    bootstrap.Modal.getInstance(document.getElementById('createGroupModal')).hide();
    })
    .catch(error => {
        console.log(error);
    })
});

function getGroups() {
    const userId=localStorage.getItem('id')
    console.log("userId", userId);
    axios.get(`http://127.0.0.1:3000/group/getgroup/${userId}`)
    .then(res => {
        const groups=res.data;
        console.log(groups);
        groups.forEach(group => {
            addtogroplist(group);
        });
    })
    .catch()
}

function addtogroplist(group) {
     const li=document.createElement('button');
     li.classList.add("list-group-item", "list-group-item-action");
     li.textContent=group.group.groupname;
     li.onclick = () => loadGroupMessages(group.groupname,group.groupId);
     grouplist.appendChild(li);
}

window.addEventListener('DOMContentLoaded', () => {
    getGroups();
    getUsers();
})

function loadGroupMessages(groupname,id){
    document.getElementById('group').textContent=groupname;
    localStorage.removeItem('groupid');
    localStorage.setItem('groupid', id);
    console.log('sending to backend for group message');
    axios.get(`http://127.0.0.1:3000/group/getgroupmessages/${id}`)
    .then(res => {
        chatList.innerHTML='';
        const chats=res.data;
        console.log(chats);
        chats.forEach(chat => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = `${chat.user.username}: ${chat.message}`; // Display the user and their message
            chatList.appendChild(li);
        })  
    })
    .catch()
}

function getUsers(){
    axios.get('http://127.0.0.1:3000/user/getusers')
    .then(response => {
        const users = response.data;
        console.log(users);
        const userSelect = document.getElementById('groupMembers');
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.username;
            userSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error fetching users:", error);
    })
}