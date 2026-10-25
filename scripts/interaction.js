document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";

    // img загорнутий у .image-lightbox-inner — обгортку,
    // яка отримує точний розмір зображення (розрахований у JS).
    // Це дозволяє клікам "повз картинку" іти на .image-lightbox
    // і закривати лайтбокс, а клік по самій картинці обробляти окремо.
    lightbox.innerHTML = `
        <span class="image-lightbox-close" aria-label="Закрити">&times;</span>
        <div class="image-lightbox-inner">
            <img src="" alt="">
        </div>
    `;

    document.body.appendChild(lightbox);

    const preview = lightbox.querySelector("img");
    const inner = lightbox.querySelector(".image-lightbox-inner");
    const closeButton = lightbox.querySelector(".image-lightbox-close");

    // Максимальні розміри для картинки у лайтбоксі
    const MAX_WIDTH_RATIO = 0.95;   // 95vw
    const MAX_HEIGHT_RATIO = 0.94;  // 94vh

    /**
     * Розраховує розмір картинки так, щоб вона:
     * - вписувалась у 95vw × 94vh
     * - ЗАБІЛЬШУВАЛАСЬ до цих меж (якщо мала)
     * - зберігала пропорції
     */
    function fitImageToViewport(naturalWidth, naturalHeight) {
        const maxW = window.innerWidth * MAX_WIDTH_RATIO;
        const maxH = window.innerHeight * MAX_HEIGHT_RATIO;

        const ratio = naturalWidth / naturalHeight;
        const targetRatio = maxW / maxH;

        let width, height;
        if (ratio > targetRatio) {
            // Картинка відносно ширша за ціль — обмежуємо по ширині
            width = maxW;
            height = maxW / ratio;
        } else {
            // Картинка відносно вища — обмежуємо по висоті
            height = maxH;
            width = maxH * ratio;
        }

        return { width: Math.round(width), height: Math.round(height) };
    }

    // Відкриття зображення
    document.querySelectorAll(
        "main img, article img, .content img"
    ).forEach((img) => {
        img.addEventListener("click", (event) => {
            event.preventDefault();

            const src = img.currentSrc || img.src;
            preview.alt = img.alt || "";
            preview.src = src;

            // Скидаємо розміри обгортки, поки картинка вантажиться
            inner.style.width = "";
            inner.style.height = "";

            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";

            // Як тільки картинка завантажилась — розраховуємо розмір
            // обгортки під неї
            const applySize = () => {
                const nw = preview.naturalWidth;
                const nh = preview.naturalHeight;
                if (nw && nh) {
                    const { width, height } = fitImageToViewport(nw, nh);
                    inner.style.width = width + "px";
                    inner.style.height = height + "px";
                }
            };

            if (preview.complete && preview.naturalWidth) {
                applySize();
            } else {
                preview.addEventListener("load", applySize, { once: true });
            }
        });
    });

    // Закриття
    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

    // Закриваємо при кліку на:
    //   - .image-lightbox (чорний фон поза обгорткою)
    //   - closeButton (×)
    //   - .image-lightbox-inner (обгортка — на випадок, якщо є прозорі краї)
    // Клік по самій картинці (preview) НЕ закриває — тут можна додати
    // інші дії (зум, перехід до наступної тощо).
    lightbox.addEventListener("click", (event) => {
        if (
            event.target === lightbox ||
            event.target === closeButton ||
            event.target === inner
        ) {
            closeLightbox();
        }
    });

    // Перерахунок розміру обгортки при зміні розміру вікна (якщо лайтбокс відкритий)
    window.addEventListener("resize", () => {
        if (lightbox.classList.contains("active") && preview.naturalWidth) {
            const { width, height } = fitImageToViewport(
                preview.naturalWidth,
                preview.naturalHeight
            );
            inner.style.width = width + "px";
            inner.style.height = height + "px";
        }
    });

    // Закриття клавішею Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeLightbox();
        }
    });
});
