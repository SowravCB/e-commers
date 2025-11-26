// document.getElementById("signupForm").addEventListener("submit", (e) => {
//   e.preventDefault();

//   const username = document.getElementById("newUsername").value.trim();
//   const email = document.getElementById("newEmail").value.trim();
//   const password = document.getElementById("newPassword").value.trim();
//   const message = document.getElementById("signupMessage");

//   let users = JSON.parse(localStorage.getItem("users")) || [];

//   const alreadyExists = users.some(
//     (u) => u.username === username || u.email === email
//   );

//   if (alreadyExists) {
//     message.style.color = "#ff5555";
//     message.textContent = "User already exists!";
//     return;
//   }

//   const newUser = {
//     id: Date.now(),
//     username,
//     email,
//     password,
//   };

//   users.push(newUser);
//   localStorage.setItem("users", JSON.stringify(users));

//   message.style.color = "#39ff14";
//   message.textContent = "Account created successfully! Redirecting...";
//   setTimeout(() => {
//     window.location.href = "dashboard.html";
//   }, 1500);
// });
