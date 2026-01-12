let messages = [];
let currentChat = null;

// Fetch messages data from data.json
async function fetchMessages() {
  try {
    const response = await fetch("../../data.json");
    const data = await response.json();

    messages = data.messages.map((msg) => ({
      id: msg.id,
      from: {
        id: msg.from.id,
        name: msg.from.name,
        avatar: msg.from.avatar,
      },
      message: msg.message,
      status: msg.status,
      createdAt: msg.createdAt,
    }));

    renderContactList();
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}

// Render contact list from messages
function renderContactList() {
  const contactList = document.getElementById("contactList");
  if (!contactList) return;

  contactList.innerHTML = messages
    .map(
      (msg) => `
        <div class="contact-item ${msg.status}" onclick="loadChat('${msg.id}')">
            <div class="contact-avatar">
                <img src="${msg.from.avatar}" alt="${msg.from.name}">
                <span class="status-indicator ${msg.status}"></span>
            </div>
            <div class="contact-info">
                <div class="contact-header">
                    <h4>${msg.from.name}</h4>
                    <span class="timestamp">${formatTime(msg.createdAt)}</span>
                </div>
                <p class="last-message">${msg.message}</p>
            </div>
        </div>
      `
    )
    .join("");
}

// Load chat when a contact is clicked
function loadChat(messageId) {
  const message = messages.find((m) => m.id === messageId);
  if (!message) return;

  currentChat = {
    contact: message.from,
    messages: [
      {
        senderId: message.from.id,
        text: message.message,
        timestamp: formatTime(message.createdAt),
        type: message.status === "read" ? "received" : "received",
      },
    ],
  };

  updateChatHeader(message.from);
  renderMessages();

  // Highlight selected contact
  document.querySelectorAll(".contact-item").forEach((item) => {
    item.classList.remove("active");
  });
  document
    .querySelector(`.contact-item[onclick="loadChat('${message.id}')"]`)
    .classList.add("active");
}

// Update header info for current chat
function updateChatHeader(contact) {
  document.getElementById("activeChatImage").src = contact.avatar;
  document.getElementById("activeChatName").textContent = contact.name;
  document.getElementById("activeChatStatus").textContent = "Online";
}

// Render chat messages for current contact
function renderMessages() {
  const container = document.getElementById("chatMessages");
  if (!container || !currentChat) return;

  container.innerHTML = currentChat.messages
    .map(
      (msg) => `
        <div class="message ${msg.type}">
            <div class="message-content">
                <p class="message ${msg.type}">${msg.text}</p>
                <span class="timestamp">${msg.timestamp}</span>
            </div>
        </div>
      `
    )
    .join("");

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// Send new message
function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text || !currentChat) return;

  const newMsg = {
    senderId: "admin",
    text,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: "sent",
  };

  currentChat.messages.push(newMsg);
  renderMessages();
  input.value = "";

  // Optional: simulate response
  simulateResponse();
}

// Simulate fake response
function simulateResponse() {
  setTimeout(() => {
    currentChat.messages.push({
      senderId: currentChat.contact.id,
      text: "Thanks for your help!",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "received",
    });
    renderMessages();
  }, 2000);
}

// Format time from ISO string
function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Setup listeners
function setupEventListeners() {
  const sendBtn = document.getElementById("sendMessage");
  const input = document.getElementById("messageInput");

  sendBtn?.addEventListener("click", sendMessage);
  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  fetchMessages();
  setupEventListeners();
});

// GSAP Animations
// let tl = gsap.timeline({ defaults: { ease: "power1.out" } });
// tl.from(".settings-header", { y: -50, opacity: 0, duration: 0.5 });
// tl.from(".settings-section", {
//   y: 50,
//   opacity: 0,
//   duration: 0.5,
//   stagger: 0.2,
// });

let sdBar = gsap.timeline();

sdBar.from(".sidebar", { y: -250, opacity: 0, duration: 0.5 });
sdBar.from(".sidebar .nav-item", {
  x: -50,
  opacity: 0,
  duration: 0.3,
  stagger: 0.2,
});

let nav = gsap.timeline();

nav.from(".navbar", { y: -50, opacity: 0, duration: 0.5 });
nav.from(".navbar .nav-link", {
  y: -20,
  opacity: 0,
  duration: 0.3,
  stagger: 0.2,
});

nav.from(".main-container .head-title .left", {
  y: -20,
  opacity: 0,
  duration: 0.3,
});

nav.from(".chat-container", {
  y: 50,
  opacity: 0,
  duration: 0.5,
  stagger: 0.2,
});
