document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const adminInputMail = document.getElementById("username").value.trim();
  const passwordInput = document.getElementById("password").value.trim();
  const message = document.getElementById("message");
  const messageIcon = document.getElementById("messageIcon");
  const messageText = document.getElementById("messageText");
  // const mailEmptyError = document.getElementById("mailEmptyError");

  try {
    const response = await fetch("../../data.json");
    const data = await response.json();

    // Merge users from JSON and localStorage
    const localUsers = JSON.parse(localStorage.getItem("users")) || [];
    const allUsers = [...data.users, ...localUsers];

    // Find user by username/email and password
    const user = allUsers.find(
      (u) =>
        (u.username === adminInputMail || u.email === adminInputMail) &&
        u.password === passwordInput
    );

    // ✅ Admin authentication only
    if (user && user.role === "admin") {
      messageIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="#39ff14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;
      messageText.textContent = " Admin login successful! Redirecting...";
      messageText.style.color = "#3d8b30ff";
      messageText.style.fontWeight = "600";

      localStorage.setItem("loggedInUser", JSON.stringify(user));

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else if (user && user.role !== "admin") {
      // ❌ Block normal users
      messageIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M800-520q-17 0-28.5-11.5T760-560q0-17 11.5-28.5T800-600q17 0 28.5 11.5T840-560q0 17-11.5 28.5T800-520Zm-40-120v-200h80v200h-80ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"/></svg>`;
      messageIcon.style.color = "#ff5555";
      messageText.textContent = " Access denied! Only admin can log in.";
      messageText.style.color = "#ff5555";
    } else {
      // ❌ Invalid credentials
      messageIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px"
             viewBox="0 -960 960 960" width="24px" fill="currentColor">
          <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm0 200q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Z"/>
        </svg>`;
      messageIcon.style.color = "#ff5555";
      messageText.textContent = " Invalid username or password.";
      messageText.style.color = "#ff5555";
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    message.textContent = "Error connecting to server.";
  }
});
