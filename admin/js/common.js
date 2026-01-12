// DOM Elements for common components
const sidebar = document.querySelector(".sidebar");
const navbar = document.querySelector(".navbar");

// Sidebar Menu Items
const menuItems = [
  {
    title: "Dashboard",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"fill="currentColor"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" /></svg>',
    link: "dashboard.html",
  },
  {
    title: "Products",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"fill="currentColor"><path d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z" /> </svg>',
    link: "products.html",
  },
  {
    title: "Customers",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"fill="currentColor"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z" /></svg>',
    link: "customers.html",
  },
  {
    title: "Orders",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm0-80h480v-640h-80v280l-100-60-100 60v-280H240v640Zm0 0v-640 640Zm200-360 100-60 100 60-100-60-100 60Z"/></svg>',
    link: "orders.html",
  },
  {
    title: "Messages",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/></svg>',
    link: "messages.html",
  },
  {
    title: "Analytics",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"fill="currentColor"><path d="M480-80q-83 0-156-31.5t-127-86Q143-252 111.5-325T80-480q0-157 104-270t256-128v120q-103 14-171.5 92.5T200-480q0 116 82 198t198 82q66 0 123.5-28t96.5-76l104 60q-54 75-139 119.5T480-80Zm366-238-104-60q9-24 13.5-49.5T760-480q0-107-68.5-185.5T520-758v-120q152 15 256 128t104 270q0 44-8 85t-26 77Z" /></svg>',
    link: "analytics.html",
  },
  {
    title: "Settings",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z"/></svg>',
    link: "settings.html",
  },
];

function initializeSidebar(sidebarElement) {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split("/").pop();

  const menuHTML = menuItems
    .map((item) => {
      const isActive = currentPage === item.link ? "active" : "";
      return `
            <div class="btn ${isActive}">
                <a href="${item.link}">
                    ${item.icon}
                    <span>${item.title}</span>
                </a>
            </div>
        `;
    })
    .join("");

  sidebarElement.innerHTML = `
        <div class="logo">
            <img src="/assets/svg/Group 4 (1).svg" alt="Logo">
        </div>
        <div class="action-btn">
            ${menuHTML}
        </div>
        <div class="logout-btn">
            <div class="btn">
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                    </svg>
                    <span>Log out</span>
                </button>
            </div>
        </div>
    `;
}

function initializeNavbar(navbarElement) {
  const currentPath = window.location.pathname;
  let pageTitle = currentPath.split("/").pop().replace(".html", "");
  pageTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);
  if (pageTitle === "") pageTitle = "Dashboard";

  navbarElement.innerHTML = `
        <div class="nav-left">
            <button id="menu-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M500-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/></svg>
            </button>
            <h2>${pageTitle}</h2>
        </div>
        <div class="search-box">
            <input type="text" placeholder="Search...">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path fill="currentColor" d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
        </div>
        <div class="nav-right">
            <div class="nav-notification">
                        <button id="notificationBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="currentColor">
                                <path
                                    d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
                            </svg>
                            <span class="notif-count">0</span>
                        </button>
                        <div class="nav-notification-dropdown" id="notificationDropdown">
                          //  Notifications will be dynamically added here 
                        </div>
                    </div>
            <div class="profile-box">
                        <button class="profile-img" id="profileBtn">
                            <img src="/assets/images/profile pic.jpg" alt="profile picture" id="profileImg">
                        </button>

                        <div class="admin-profile" id="adminProfile">
                            <div class="profile-header">
                                <div class="profile-img">
                                    <img src="/assets/images/profile pic.jpg" alt="">
                                </div>
                                <div class="name-role">
                                    <span class="name">Sowrav Chandra Biswas</span>
                                    <span class="role">Admin</span>
                                </div>
                            </div>
                            <div class="profile-option">
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                        width="24px" fill="currentColor">
                                        <path
                                            d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                                    </svg>
                                    <span>My Account</span>
                                </button>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                        width="24px" fill="currentColor">
                                        <path
                                            d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                                    </svg>
                                    <span>Settings</span>
                                </button>
                                <button id="logOutBtn">
                                    <svg xmlns=" http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                        width="24px" fill="currentColor">
                                        <path
                                            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                                    </svg>
                                    <span>Log out</span>
                                </button>
                            </div>
                        </div>
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
  const sidebarElement = document.querySelector(".sidebar");
  const navbarElement = document.querySelector(".navbar");

  if (sidebarElement) {
    initializeSidebar(sidebarElement);
  } else {
    console.error("Sidebar element not found in the DOM.");
  }

  if (navbarElement) {
    initializeNavbar(navbarElement);

    // Now that the navbar is created, we can safely add event listeners
    const menuBtn = document.getElementById("menu-btn");
    if (menuBtn && sidebarElement) {
      menuBtn.addEventListener("click", () => {
        sidebarElement.classList.toggle("hide");
      });
    }

    // Close sidebar when clicking outside on small screens
    document.addEventListener("click", function (e) {
      const isClickInsideSidebar = sidebar && sidebar.contains(e.target);
      const isClickOnMenuIcon = menuBtn && menuBtn.contains(e.target);

      if (
        window.innerWidth < 768 &&
        !isClickInsideSidebar &&
        !isClickOnMenuIcon &&
        !sidebar.classList.contains("hide")
      ) {
        sidebar.classList.add("hide");
      }
    });

    // Set initial sidebar state based on screen size
    function setSidebarState() {
      if (window.innerWidth < 768) {
        sidebar.classList.add("hide");
      } else {
        sidebar.classList.remove("hide");
      }
    }

    // Initialize sidebar state on load
    setSidebarState();

    // Update sidebar state on window resize
    window.addEventListener("resize", setSidebarState);

    const profileIcon = document.getElementById("profileBtn");
    const adminProfile = document.getElementById("adminProfile");

    if (profileIcon && adminProfile) {
      profileIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        adminProfile.classList.toggle("show");
      });
    }

    // Close profile dropdown when clicking outside
    window.addEventListener("click", function (e) {
      if (adminProfile && adminProfile.classList.contains("show")) {
        if (
          !profileIcon.contains(e.target) &&
          !adminProfile.contains(e.target)
        ) {
          adminProfile.classList.remove("show");
        }
      }
    });
    const notificationBtn = document.getElementById("notificationBtn");
    const notificationDropdown = document.getElementById(
      "notificationDropdown"
    );

    if (notificationBtn && notificationDropdown) {
      notificationBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        notificationDropdown.classList.toggle("show");
      });
      window.addEventListener("click", (e) => {
        if (e.target === notificationDropdown) {
          notificationDropdown.classList.remove("show");
        }
      });
    }
  }
});

const logOutBtn = document.getElementById("logOutBtn");
logOutBtn.addEventListener("click", () => {
  window.location.href = "/admin/pages/adminlogin.html";
});

// // GSAP Animations
// let tl = gsap.timeline({ defaults: { ease: "power1.out" } });
// tl.from(".settings-header", { y: -50, opacity: 0, duration: 0.5 });
// tl.from(".settings-section", {
//   y: 50,
//   opacity: 0,
//   duration: 0.5,
//   stagger: 0.2,
// });

// let sdBar = gsap.timeline();

// sdBar.from(".sidebar", { y: -250, opacity: 0, duration: 0.5 });
// sdBar.from(".sidebar .nav-item", {
//   x: -50,
//   opacity: 0,
//   duration: 0.3,
//   stagger: 0.2,
// });

// let nav = gsap.timeline();

// nav.from(".navbar", { y: -50, opacity: 0, duration: 0.5 });
// nav.from(".navbar .nav-link", {
//   y: -20,
//   opacity: 0,
//   duration: 0.3,
//   stagger: 0.2,
// });

// nav.from(".main-container .head-title .left", {
//   y: -20,
//   opacity: 0,
//   duration: 0.3,
// });
