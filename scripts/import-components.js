document.addEventListener("DOMContentLoaded", () => {
    // Перевіряємо, чи в адресному рядку є папка pages
    const isInsidePages = window.location.pathname.includes('/pages/');

    // Якщо ми всередині pages/, до компонентів рукою подати: 'components/...'
    // Якщо ми на головній (в корені), треба йти в: 'pages/components/...'
    const headerPath = isInsidePages ? 'components/header.html' : 'pages/components/header.html';
    const footerPath = isInsidePages ? 'components/footer.html' : 'pages/components/footer.html';

    // 1. Завантажуємо Хедер
    fetch(headerPath)
        .then(response => {
            if (!response.ok) throw new Error(`Не знайдено за шляхом: ${headerPath}`);
            return response.text();
        })
        .then(data => {
            const headerEl = document.getElementById('global-header');
            if (headerEl) {
                headerEl.innerHTML = data;

                // Одразу коригуємо посилання для правильних переходів
                const indexLink = document.getElementById('nav-index');
                const aiLink = document.getElementById('nav-ai');
                const russianLink = document.getElementById('nav-russian');

                if (isInsidePages) {
                    // Якщо ми в папці pages, щоб вийти на головну, треба піднятися на рівень вище
                    if (indexLink) indexLink.setAttribute('href', '../index.html');
                    if (aiLink) aiLink.setAttribute('href', 'ai-translation.html');
                    if (russianLink) russianLink.setAttribute('href', 'russian-translation.html');
                } else {
                    // Якщо ми на головній (index.html в корені), йдемо в папку pages
                    if (indexLink) indexLink.setAttribute('href', 'index.html');
                    if (aiLink) aiLink.setAttribute('href', 'pages/ai-translation.html');
                    if (russianLink) russianLink.setAttribute('href', 'pages/russian-translation.html');
                }

                setActiveNavLink();
            }
        })
        .catch(err => console.error('Помилка хедера:', err));

    // 2. Завантажуємо Футер
    fetch(footerPath)
        .then(response => {
            if (!response.ok) throw new Error(`Не знайдено за шляхом: ${footerPath}`);
            return response.text();
        })
        .then(data => {
            const footerEl = document.getElementById('global-footer');
            if (footerEl) footerEl.innerHTML = data;
        })
        .catch(err => console.error('Помилка футера:', err));
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
