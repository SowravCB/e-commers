document.addEventListener("DOMContentLoaded", () => {
  // Check if already logged in
  if (auth.isLoggedIn()) {
    window.location.href = "../index.html";
    return;
  }

  const loginForm = document.getElementById("loginForm");
  const loginUserName = document.getElementById("loginUserName");
  const loginPassword = document.getElementById("loginPassword");
  const clearUserInput = document.getElementById("clearUserInput");
  const messageIcon = document.getElementById("messageIcon");
  const messageText = document.getElementById("messageText");
  const errorEmail = document.getElementById("errorEmail");
  const errorPassword = document.getElementById("errorPassword");
  const loginBtn = document.querySelector('button[type="submit"]');
  const forgotPasswordLink = document.getElementById("forgotPassword");

  // Clear username input
  clearUserInput?.addEventListener("click", () => {
    loginUserName.value = "";
  });

  // Password visibility toggle
  const showPassInput = document.getElementById("showPassInput");
  showPassInput?.addEventListener("click", () => {
    loginPassword.type =
      loginPassword.type === "password" ? "text" : "password";
  });

  // Form submission
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear old errors and disable submit button
    [errorEmail, errorPassword].forEach((el) => {
      if (el) el.innerHTML = "";
    });
    if (messageIcon) messageIcon.innerHTML = "";
    if (messageText) messageText.textContent = "";
    // if (loginBtn) {
    //   loginBtn.disabled = true;
    //   loginBtn.textContent = "Logging in...";
    // }
    let hasError = false;

    // Field validation
    if (!loginUserName?.value?.trim()) {
      showError(errorEmail, "Please enter your Email or Username!");
      hasError = true;
    }

    if (!loginPassword?.value?.trim()) {
      showError(errorPassword, "Please enter your Password!");
      hasError = true;
    }

    if (hasError) {
      if (loginBtn) loginBtn.disabled = false;
      return;
    }

    try {
      const email = loginUserName.value.trim();
      const password = loginPassword.value;

      // Clear any existing errors
      if (messageIcon) messageIcon.innerHTML = "";
      if (messageText) messageText.textContent = "";

      // Attempt login
      const result = await auth.login(email, password);

      if (result.success) {
        // Show success message
        if (messageIcon) {
          messageIcon.classList.add("success");
          messageIcon.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="#008000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>`;
        }

        if (messageText) {
          messageText.classList.add("success");
          messageText.textContent = " Log In Successful";
          messageText.style.color = "#008000";
        }

        // Redirect to home page
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 1500);
      } else {
        // Show error message
        // showError(errorEmail, result.error);
        showInvalidCredentials();
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = "Login";
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.message === "Failed to fetch") {
        showError(
          errorEmail,
          "Unable to connect to server. Please check your internet connection."
        );
      } else {
        showInvalidCredentials();
      }
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
      }
    }
  });
});

// Helper functions
function showError(element, message) {
  if (element) {
    element.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                 fill="currentColor" class="bi bi-patch-exclamation-fill" viewBox="0 0 16 16">
                <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg> ${message}`;
    element.style.display = "flex";
    element.style.alignItems = "center";
    element.style.color = "red";
    element.style.fontSize = "14px";
    element.style.gap = "8px";
    element.style.marginTop = "5px";
  }
}

function showInvalidCredentials() {
  const messageIcon = document.getElementById("messageIcon");
  const messageText = document.getElementById("messageText");

  if (messageIcon) {
    messageIcon.classList.add("invalid");
    messageIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                 fill="currentColor" class="bi bi-patch-exclamation-fill" viewBox="0 0 16 16">
                <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>`;
  }
  if (messageText) {
    messageText.classList.add("invalid");
    messageText.textContent = " Invalid email/username or password";
    messageText.style.color = "red";
  }
}

const loginPassword = document.getElementById("loginPassword");
const showPassInput = document.getElementById("showPassInput");

showPassInput?.addEventListener("click", () => {
  loginPassword.type = loginPassword.type === "password" ? "text" : "password";
});
