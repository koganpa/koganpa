document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("drawer_btn");
    const nav = document.querySelector(".nav_content");

    btn.addEventListener("click", () => {
        nav.classList.toggle("active");
        btn.classList.toggle("active");
    });
});