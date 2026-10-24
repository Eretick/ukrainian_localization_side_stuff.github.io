
document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";

    lightbox.innerHTML = `
        <span class="image-lightbox-close" aria-label="Закрити">&times;</span>
        <img src="" alt="">
    `;

    document.body.appendChild(lightbox);

    const preview = lightbox.querySelector("img");
    const closeButton = lightbox.querySelector(
        ".image-lightbox-close"
    );

    // Відкриття зображення
    document.querySelectorAll(
        "main img, article img, .content img"
    ).forEach((img) => {
        img.addEventListener("click", (event) => {
            event.preventDefault();

            preview.src = img.currentSrc || img.src;
            preview.alt = img.alt || "";

            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    // Закриття
    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

    lightbox.addEventListener("click", (event) => {
        if (
            event.target === lightbox ||
            event.target === closeButton
        ) {
            closeLightbox();
        }
    });

    // Закриття клавішею Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeLightbox();
        }
    });
});
