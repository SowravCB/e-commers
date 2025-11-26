const allSideMenu = document.querySelectorAll(
  ".sidebar .action-btn .btn button"
);
allSideMenu.forEach((item) => {
  const button = item.parentElement;
  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    button.classList.add("active");
  });
});

// TOGGLE SIDEBAR
const menuIcon = document.querySelector(".menu-icon");
const sidebar = document.querySelector(".sidebar");

if (menuIcon && sidebar) {
  menuIcon.addEventListener("click", function () {
    sidebar.classList.toggle("hide");
  });
}

// Close sidebar when clicking outside on small screens
document.addEventListener("click", function (e) {
  const isClickInsideSidebar = sidebar && sidebar.contains(e.target);
  const isClickOnMenuIcon = menuIcon && menuIcon.contains(e.target);

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
    if (!profileIcon.contains(e.target) && !adminProfile.contains(e.target)) {
      adminProfile.classList.remove("show");
    }
  }
});

function printPdf() {
  window.print();
}

document.getElementById("printPdf").addEventListener("click", printPdf);
