document.addEventListener("DOMContentLoaded", () => {
  // Check if already logged in
  if (auth.isLoggedIn()) {
    window.location.href = "../index.html";
    return;
  }

  const signupForm = document.getElementById("signupForm");
  const signupUserName = document.getElementById("signupUserName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const clearSignUpInput = document.getElementById("clearSignUpInput");
  const errorName = document.getElementById("errorName");
  const errorEmail = document.getElementById("errorEmail");
  const errorPhone = document.getElementById("errorPhone");
  const errorPassword = document.getElementById("errorPassword");
  const errorConfirmPass = document.getElementById("errorConfirmPass");
  const signupBtn = document.querySelector('button[type="submit"]');

  // Clear username input
  clearSignUpInput?.addEventListener("click", () => {
    signupUserName.value = "";
  });

  // Password visibility toggle
  const showPassInput = document.getElementById("showPassInput");
  showPassInput?.addEventListener("click", () => {
    password.type = password.type === "password" ? "text" : "password";
  });

  // Confirm password visibility toggle
  const showConfirmPassInput = document.getElementById("showConfirmPassInput");
  showConfirmPassInput?.addEventListener("click", () => {
    confirmPassword.type =
      confirmPassword.type === "password" ? "text" : "password";
  });

  // Form submission
  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (signupBtn) signupBtn.disabled = true;

    let hasError = false;

    // Clear previous errors
    [
      errorName,
      errorEmail,
      errorPhone,
      errorPassword,
      errorConfirmPass,
    ].forEach((el) => {
      if (el) el.innerHTML = "";
    });

    try {
      // Validate all required fields
      if (!signupUserName?.value?.trim()) {
        showError(errorName, "Please enter your username!");
        hasError = true;
      }

      if (!email?.value?.trim()) {
        showError(errorEmail, "Please enter your email!");
        hasError = true;
      } else if (!isValidEmail(email.value.trim())) {
        showError(errorEmail, "Please enter a valid email address!");
        hasError = true;
      }

      if (!phone?.value?.trim()) {
        showError(errorPhone, "Please enter your phone number!");
        hasError = true;
      } else if (!isValidPhone(phone.value.trim())) {
        showError(errorPhone, "Please enter a valid 10-digit phone number!");
        hasError = true;
      }

      if (!password?.value) {
        showError(errorPassword, "Please enter your password!");
        hasError = true;
      } else if (!auth.isStrongPassword(password.value)) {
        showError(
          errorPassword,
          "Password must be at least 8 characters long and contain letters, numbers, and special characters!"
        );
        hasError = true;
      }

      if (!confirmPassword?.value) {
        showError(errorConfirmPass, "Please confirm your password!");
        hasError = true;
      } else if (password.value !== confirmPassword.value) {
        showError(errorConfirmPass, "Passwords do not match!");
        hasError = true;
      }

      if (hasError) {
        return;
      }

      // Prepare user data (server expects firstName/lastName)
      const userData = {
        firstName: signupUserName.value.trim(),
        lastName: "",
        email: email.value.trim(),
        phone: phone.value.trim(),
        password: password.value,
      };

      // Register user using auth module
      const result = await auth.register(userData);

      if (result.success) {
        // Show success message
        showSuccess();

        // Store user in localStorage and start session
        localStorage.setItem("loggedInUser", JSON.stringify(result.user));
        auth.startSession();

        // Redirect to account page (same folder)
        setTimeout(() => {
          window.location.href = "./account.html";
        }, 1500);
      } else {
        // Show error message
        const errorElement = result.error.toLowerCase().includes("email")
          ? errorEmail
          : result.error.toLowerCase().includes("password")
          ? errorPassword
          : errorName;
        showError(errorElement, result.error);
      }
    } catch (error) {
      console.error("Registration error:", error);
      showError(
        errorName,
        "An error occurred during registration. Please try again later."
      );
    } finally {
      if (signupBtn) signupBtn.disabled = false;
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
    element.style.color = "red";
    element.style.fontSize = "14px";
    element.style.display = "flex";
    element.style.alignItems = "center";
    element.style.gap = "8px";
  }
}

function showSuccess() {
  const messageIcon = document.getElementById("messageIcon");
  const messageText = document.getElementById("messageText");

  if (messageIcon && messageText) {
    messageIcon.classList.add("success");
    messageIcon.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="#39ff14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>`;
    messageText.classList.add("success");
    messageText.textContent = " Registration Successful";
    messageText.style.color = "#39ff14";
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}
