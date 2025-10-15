// Умная функция для определения базового пути
function getBasePath() {
    // Если работаем на GitHub Pages
    if (window.location.hostname.includes('github.io')) {
        return '/Second_project/';
    }
    // Если работаем локально
    return '/';
}

// Функция для правильного пути к файлам
function getAssetPath(path) {
    const base = getBasePath();
    // Убираем лишние ../ и ./ из пути
    const cleanPath = path.replace(/^(\.\.\/)+/, '');
    return base + cleanPath;
}

// Исправляем все пути на странице
function fixAllPaths() {
    // Исправляем CSS
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        if (link.href) {
            const newHref = getAssetPath(link.getAttribute('href'));
            link.setAttribute('href', newHref);
        }
    });
    
    // Исправляем JS (кроме этого файла)
    document.querySelectorAll('script[src]').forEach(script => {
        if (!script.src.includes('path-fixer.js')) {
            const newSrc = getAssetPath(script.getAttribute('src'));
            script.setAttribute('src', newSrc);
        }
    });
    
    // Исправляем изображения
    document.querySelectorAll('img[src]').forEach(img => {
        const newSrc = getAssetPath(img.getAttribute('src'));
        img.setAttribute('src', newSrc);
    });
}

// Запускаем когда DOM готов
document.addEventListener('DOMContentLoaded', fixAllPaths);