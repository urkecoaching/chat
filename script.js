let username = "";
let editIndex = -1;

function toggleAuth(view) {
    document.getElementById("registerContainer").style.display = view === 'register' ? "block" : "none";
    document.getElementById("loginContainer").style.display = view === 'login' ? "block" : "none";
}

function registerUser() {
    const newUser = document.getElementById("registerUsername").value;
    const newPass = document.getElementById("registerPassword").value;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.username === newUser)) {
        alert("Username is taken.");
        return;
    }
    users.push({ username: newUser, password: newPass });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! Now log in.");
    toggleAuth("login");
}

function loginUser() {
    const loginUser = document.getElementById("loginUsername").value;
    const loginPass = document.getElementById("loginPassword").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find(user => user.username === loginUser && user.password === loginPass);
    if (validUser) {
        username = loginUser;
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("chatContainer").style.display = "block";
        loadMessages();
    } else {
        alert("Invalid username or password.");
    }
}

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";
    messages.forEach((msg, index) => {
        addMessageToChatBox(msg, index);
    });
}

function addMessageToChatBox(msg, index) {
    const chatBox = document.getElementById("chatBox");
    const messageClass = msg.user === username ? "user-message" : "other-message";
    chatBox.innerHTML += `
        <div class="${messageClass}">
            <strong>${msg.user}:</strong> <span>${msg.text}</span>
            ${msg.user === username ? `
                <button class="btn-warning btn-sm" onclick="editMessage(${index})">✏️</button>
                <button class="btn-danger btn-sm" onclick="deleteMessage(${index})">🗑️</button>` : ""}
            ${msg.user === "admin" ? `
                <button class="btn-danger btn-sm" onclick="deleteAllMessages()">Delete All</button>` : ""}
        </div>
    `;
}
function loginUser() {
    const loginUser = document.getElementById("loginUsername").value.trim();
    const loginPass = document.getElementById("loginPassword").value.trim();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!loginUser || !loginPass) {
        alert("Please enter both username and password.");
        return;
    }

    const validUser = users.find(user => user.username === loginUser && user.password === loginPass);
    if (validUser) {
        username = loginUser;
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("chatContainer").style.display = "block";
        loadMessages();
    } else {
        alert("Invalid username or password.");
    }
}

function sendMessage(event) {
    event.preventDefault();
    const chatInput = document.getElementById("chatInput").value.trim();
    if (chatInput) {
        const messages = JSON.parse(localStorage.getItem("messages")) || [];
        if (editIndex >= 0) {
            messages[editIndex].text = chatInput;
            editIndex = -1;
        } else {
            const newMessage = { user: username, text: chatInput };
            messages.push(newMessage);
        }
        localStorage.setItem("messages", JSON.stringify(messages));
        loadMessages();
        document.getElementById("chatInput").value = "";
    }
}

function editMessage(index) {
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    document.getElementById("chatInput").value = messages[index].text;
    editIndex = index;
}

function deleteMessage(index) {
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    const currentUser = messages[index].user;

    if (currentUser === username || username === 'admin') { // Provera da li je korisnik admin
        messages.splice(index, 1);
        localStorage.setItem("messages", JSON.stringify(messages));
        loadMessages();
    } else {
        alert("You are not authorized to delete this message.");
    }
}


function deleteAllMessages() {
    if (confirm("Are you sure you want to delete all messages?")) {
        localStorage.removeItem("messages");
        loadMessages();
    }
}
