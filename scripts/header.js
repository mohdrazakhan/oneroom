document.addEventListener("DOMContentLoaded", function () {
    const headerPlaceholder = document.getElementById("header-placeholder");

    // Check if we are on the homepage to set the correct logo link
    // If index.html is in the path or it's the root, logo points to #
    // Otherwise it points to index.html
    const isHome = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
    const logoLink = isHome ? "#" : "index.html";

    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = `
        <header>
            <div class="container flex justify-between items-center">
                <a href="${logoLink}" class="logo" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
                    <img src="assets/logo.png" alt="OneRoom" style="height: 50px;">
                    <span style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-main);">OneRoom<span style="color: var(--primary);">.</span></span>
                </a>
                <nav>
                    <ul class="flex gap-md">
                        <li><a href="index.html" class="nav-link">Home</a></li>
                        <li><a href="features.html" class="nav-link">Features</a></li>
                        <li><a href="about.html" class="nav-link">About</a></li>
                        <li><a href="support.html" class="nav-link">Support</a></li>
                    </ul>
                </nav>
                <a href="https://play.google.com/store/apps/details?id=com.oneroom.app&hl=en" class="btn btn-primary">Get the App</a>
            </div>
        </header>
        `;

        // Active Link Logic
        const currentPath = window.location.pathname.split("/").pop();
        const navLinks = document.querySelectorAll(".nav-link");

        navLinks.forEach(link => {
            const linkPath = link.getAttribute("href");
            if (currentPath === linkPath) {
                link.style.color = "var(--primary)";
                link.classList.add("active");
            }
        });
    }
});
