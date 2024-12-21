let registeredUsers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mary Johnson' },
    { id: 4, name: 'James Brown' },
    { id: 5, name: 'Patricia Williams' }
];

const userSelectDropdown = document.getElementById('userSelectDropdown');
const selectedUsersList = document.getElementById('selectedUsersList');
const createGroupBtnModal = document.getElementById('createGroupBtnModal');
const groupNameInput = document.getElementById('groupName');
const selectedUserIds = new Set();

// Populate the user select dropdown with registered users
function populateUserSelect() {
    axios.get('http://127.0.0.1:3000/user/getusers')
    .then(res => {
       // registeredUsers= res.data;
        console.log("registeredusers:", registeredUsers);
        userSelectDropdown.innerHTML = '';  // Clear previous options
        registeredUsers.forEach(user => {
            const li = document.createElement('li');
            li.classList.add('dropdown-item');
            li.innerHTML = `
                <input type="checkbox" class="form-check-input me-2" id="user-${user.id}" value="${user.id}">
                ${user.username}
            `;
            userSelectDropdown.appendChild(li);
        });
    })
    .catch()
    

    // Attach event listeners to checkboxes to manage selections
    const checkboxes = userSelectDropdown.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedUserIds.add(this.value);
            } else {
                selectedUserIds.delete(this.value);
            }
            updateSelectedUsersList();
        });
    });
}

// Update the selected users list in the modal
function updateSelectedUsersList() {
    selectedUsersList.innerHTML = '';  // Clear the list

    // Get selected users from registeredUsers array based on selectedUserIds
    const selectedUsers = registeredUsers.filter(user => selectedUserIds.has(user.id.toString()));

    selectedUsers.forEach(user => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = user.name;
        selectedUsersList.appendChild(li);
    });
}

// Create Group and Send Invitations
createGroupBtnModal.addEventListener('click', function() {
    const groupName = groupNameInput.value.trim();

    if (!groupName || selectedUserIds.size === 0) {
        alert('Please enter a group name and select at least one user.');
        return;
    }

    axios.post()
    alert(`Group "${groupName}" created successfully with the following users: ${Array.from(selectedUserIds).join(', ')}`);

    // Reset the form
    groupNameInput.value = '';
    selectedUserIds.clear();  // Clear the selected user IDs
    updateSelectedUsersList(); // Update the UI to reflect changes
    bootstrap.Modal.getInstance(document.getElementById('createGroupModal')).hide();
    populateUserSelect();
});

