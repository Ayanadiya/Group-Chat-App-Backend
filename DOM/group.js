

const createGroupBtnModal = document.getElementById('createGroupBtnModal');
const groupNameInput = document.getElementById('groupName');
const grouplist=document.getElementById('group-list');
const addmemberbtn=document.getElementById('addmemder-btn');
addmemberbtn.addEventListener('click', addmember);
const groupmemberlist=document.getElementById('members');

// Create Group
createGroupBtnModal.addEventListener('click', function() {
    const groupName = groupNameInput.value.trim();
    const selectedUsers = Array.from(document.getElementById('groupMembers').selectedOptions).map(option => option.value);
    const userId=localStorage.getItem('id');

    if (!groupName && selectedUsers.length > 0) {
        alert('Please enter a group name.');
        return;
    }
    axios.post(`http://127.0.0.1:3000/group/creategroup`,{
        groupName,
        selectedUsers,
        userId
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
    console.log("sending to backend for groups");
    axios.get(`http://127.0.0.1:3000/group/getgroup/${userId}`)
    .then(res => {
        const groups=res.data;
        console.log("groups",groups);
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
    loadgroupmembers(id);
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

function addmember(){
    const userId=localStorage.getItem('id');
    const userIdentifier=document.getElementById('addmember').value;
    const groupId=localStorage.getItem('groupid');
    axios.post('http://127.0.0.1:3000/group/addmember', {
        userId,
        userIdentifier,
        groupId
    })
    .then(res => {
        alert(res.data.message);
    })
    .catch(error => {
        alert(error.data.message);
    })
}

function loadgroupmembers(groupId){
    console.log('sending to backend for group members');
    axios.get(`http://127.0.0.1:3000/group/getgroupmembers/${groupId}`)
    .then(res =>{
        const members=res.data;
        members.forEach(member => {
            const li=document.createElement('li');
            li.textContent=member.user.username;
            if(member.role==='admin')
            {
                li.innerHTML = `${member.user.username} (Admin)`;
            }
            else
            {
                const convertButton = document.createElement('button');
                convertButton.textContent = 'Convert to Admin';
                convertButton.classList.add('btn', 'btn-warning', 'btn-sm', 'ms-2');
                convertButton.onclick = () => promoteToAdmin(member.userId, groupId);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete User';
                deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
                deleteButton.onclick = () => deletemember(member.userId, groupId);
                li.appendChild(convertButton);
                li.appendChild(deleteButton);
            }
            groupmemberlist.appendChild(li);
        })
    })
    .catch(error => {
        console.log('Error fetching group members:', error);
    })
}

function promoteToAdmin(memberId, groupId){
    const userId=localStorage.getItem('id');
    axios.put('http://127.0.0.1:3000/group/addAdmin', {
        userId,
        memberId,
        groupId
    }).then(res => {
        console.log(res);
        alert(res.data.message);
    })
    .catch(error =>{
        console.log(error);
        alert(error.response.data.message);
    })
}

function deletemember(memberId, groupId){
    const userId=localStorage.getItem('id');
    axios.put('http://127.0.0.1:3000/group/deletemember', {
        userId,
        memberId,
        groupId
    }).then(res => {
        console.log(res);
        alert(res.data.message);
    })
    .catch(error =>{
        console.log(error);
        alert(error.data.message);
    })
}