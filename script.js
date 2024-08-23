const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((navItem) => {
    navItem.addEventListener("click", () => {
        navItems.forEach((item) => {
            item.classList.remove("active");
        });
        navItem.classList.add("active");
    });
});
