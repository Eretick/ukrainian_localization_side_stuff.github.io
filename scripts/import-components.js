document.addEventListener("DOMContentLoaded", () => {
    const isInsidePages = window.location.pathname.includes('/pages/');
    const prefix = isInsidePages ? '' : 'pages/';

    fetch(`${prefix}components/header.html`)
        .then(response => {
            if (!response.ok) throw new Error('Хедер не знайдено');
            return response.text();
        })
        .then(data => {
            const headerEl = document.getElementById('global-header');
            if (headerEl) {
                headerEl.innerHTML = data;

                if (isInsidePages) {
                    const indexLink = document.getElementById('nav-index');
                    const aiLink = document.getElementById('nav-ai');
                    const russianLink = document.getElementById('nav-russian');

                    if (indexLink) indexLink.setAttribute('href', '../index.html');
                    if (aiLink) aiLink.setAttribute('href', 'ai-translation.html');
                    if (russianLink) russianLink.setAttribute('href', 'russian-translation.html');
                }

                setActiveNavLink();
            }
        })
        .catch(err => console.error('Помилка завантаження хедера:', err));

    fetch(`${prefix}components/footer.html`)
        .then(response => {
            if (!response.ok) throw new Error('Футер не знайдено');
            return response.text();
        })
        .then(data => {
            const footerEl = document.getElementById('global-footer');
            if (footerEl) {
                footerEl.innerHTML = data;
            }
        })
        .catch(err => console.error('Помилка завантаження футера:', err));
});

function setActiveNavLink() {
    const currentPath = window.location.pathname;

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

    if (currentPath.includes('ai-translation.html')) {
        document.getElementById('nav-ai')?.classList.add('active');
    } else if (currentPath.includes('russian-translation.html')) {
        document.getElementById('nav-russian')?.classList.add('active');
    } else {
        document.getElementById('nav-index')?.classList.add('active');
    }
}