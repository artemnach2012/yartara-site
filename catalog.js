// Каталог товаров

// Инициализация каталога
function initCatalog() {
    renderProducts(getProducts());
    initFilters();
}

// Рендеринг продуктов
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-type="${product.type}" data-volume="${getVolumeCategory(product.volume)}">
            <div class="product-header">
                <h4>${product.name}</h4>
                <div class="product-type">${getTypeLabel(product.type)}</div>
            </div>
            <div class="product-details">
                <div class="detail-row">
                    <span class="label">Объем:</span>
                    <span class="value">${product.volume}</span>
                </div>
                ${product.diameter ? `
                <div class="detail-row">
                    <span class="label">Диаметр:</span>
                    <span class="value">${product.diameter}</span>
                </div>
                ` : ''}
                ${product.shape ? `
                <div class="detail-row">
                    <span class="label">Форма:</span>
                    <span class="value">${product.shape}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Цена:</span>
                    <span class="value price">${product.price.toFixed(2)} ₽</span>
                </div>
                <div class="detail-row">
                    <span class="label">Наличие:</span>
                    <span class="value stock">${product.stock.toLocaleString()} шт</span>
                </div>
                <div class="detail-row">
                    <span class="label">Статус:</span>
                    <span class="value ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                        ${product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="callForPrice()" ${!product.inStock ? 'disabled' : ''}>
                    <i class="fas fa-phone"></i>
                    Заказать
                </button>
            </div>
        </div>
    `).join('');
}

// Получение категории объема
function getVolumeCategory(volume) {
    const numVolume = parseFloat(volume.replace(/[^\d.]/g, ''));
    if (numVolume < 100) return 'small';
    if (numVolume < 500) return 'medium';
    if (numVolume < 1000) return 'large';
    return 'xlarge';
}

// Получение метки типа
function getTypeLabel(type) {
    const labels = {
        'twist': 'Твист',
        'wide-neck': 'Твист широкое горло',
        'sko': 'СКО'
    };
    return labels[type] || type;
}

// Инициализация фильтров
function initFilters() {
    const typeFilter = document.getElementById('typeFilter');
    const volumeFilter = document.getElementById('volumeFilter');
    
    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    
    if (volumeFilter) {
        volumeFilter.addEventListener('change', applyFilters);
    }
}

// Применение фильтров
function applyFilters() {
    const typeFilter = document.getElementById('typeFilter').value;
    const volumeFilter = document.getElementById('volumeFilter').value;
    
    let filteredProducts = getProducts();
    
    // Фильтр по типу
    if (typeFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.type === typeFilter);
    }
    
    // Фильтр по объему
    if (volumeFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => getVolumeCategory(product.volume) === volumeFilter);
    }
    
    renderProducts(filteredProducts);
}

// Получение списка продуктов с реальными ценами и остатками
function getProducts() {
    return [
        // Твист
        { id: 1, name: 'Банка Твист 20 мл', volume: '20 мл', type: 'twist', diameter: 'd43', price: 14.20, stock: 6954, inStock: true },
        { id: 2, name: 'Банка Твист 30 мл', volume: '30 мл', type: 'twist', diameter: 'd43', price: 17.30, stock: 3132, inStock: true },
        { id: 3, name: 'Банка Твист 45 мл Шестигранник', volume: '45 мл', type: 'twist', diameter: 'd43', shape: 'Шестигранник', price: 16.30, stock: 2511, inStock: true },
        { id: 4, name: 'Банка Твист 50 мл', volume: '50 мл', type: 'twist', diameter: 'd58', price: 17.00, stock: 1334, inStock: true },
        { id: 5, name: 'Банка Твист 100 мл Сота', volume: '100 мл', type: 'twist', diameter: 'd58', shape: 'Шестигранник', price: 20.00, stock: 11770, inStock: true },
        { id: 6, name: 'Банка Твист 100 мл Икра', volume: '100 мл', type: 'twist', diameter: 'd66', shape: 'Икра', price: 20.50, stock: 6387, inStock: true },
        { id: 7, name: 'Банка Твист 105 мл', volume: '105 мл', type: 'twist', diameter: 'd63', price: 10.50, stock: 481, inStock: true },
        { id: 8, name: 'Банка Твист 120 мл Солонка', volume: '120 мл', type: 'twist', diameter: 'd48', shape: 'Солонка', price: 12.10, stock: 1601, inStock: true },
        { id: 9, name: 'Банка Твист 130 мл Цветочек', volume: '130 мл', type: 'twist', diameter: 'd66', shape: 'Цветочек', price: 15.80, stock: 1160, inStock: true },
        { id: 10, name: 'Банка Твист 200 мл Аврора', volume: '200 мл', type: 'twist', diameter: 'd66', shape: 'Аврора', price: 14.70, stock: 3989, inStock: true },
        { id: 11, name: 'Банка Твист 200 мл Горчичка', volume: '200 мл', type: 'twist', diameter: 'd58', shape: 'Горчичка', price: 14.50, stock: 1, inStock: true },
        { id: 12, name: 'Банка Твист 200 мл', volume: '200 мл', type: 'twist', price: 14.50, stock: 0, inStock: false },
        { id: 13, name: 'Банка Твист 250 мл КБ149', volume: '250 мл', type: 'twist', diameter: 'd66', shape: 'КБ149', price: 16.30, stock: 2753, inStock: true },
        { id: 14, name: 'Банка Твист 250 мл Кубик', volume: '250 мл', type: 'twist', diameter: 'd66', shape: 'Кубик', price: 16.80, stock: 10, inStock: true },
        { id: 15, name: 'Банка Твист 250 мл Шайба', volume: '250 мл', type: 'twist', diameter: 'd82', shape: 'Шайба', price: 18.50, stock: 78, inStock: true },
        { id: 16, name: 'Банка Твист 250 мл Шестигранник', volume: '250 мл', type: 'twist', diameter: 'd82', shape: 'Шестигранник', price: 16.80, stock: 703, inStock: true },
        { id: 17, name: 'Банка Твист 255 мл', volume: '255 мл', type: 'twist', diameter: 'd66', price: 15.20, stock: 8658, inStock: true },
        { id: 18, name: 'Банка Твист 260 мл Мёд', volume: '260 мл', type: 'twist', diameter: 'd63', shape: 'Мёд', price: 25.20, stock: 2927, inStock: true },
        { id: 19, name: 'Банка Твист 275 мл Мишка', volume: '275 мл', type: 'twist', diameter: 'd58', shape: 'Мишка', price: 27.30, stock: 741, inStock: true },
        { id: 20, name: 'Банка Твист 280 мл Октава', volume: '280 мл', type: 'twist', diameter: 'd66', shape: 'Октава', price: 20.50, stock: 289, inStock: true },
        { id: 21, name: 'Банка Твист 330 мл К665', volume: '330 мл', type: 'twist', diameter: 'd66', shape: 'К665', price: 20.00, stock: 137, inStock: true },
        { id: 22, name: 'Банка Твист 350 мл Туба', volume: '350 мл', type: 'twist', diameter: 'd66', shape: 'Туба', price: 23.10, stock: 28313, inStock: true },
        { id: 23, name: 'Банка Твист 350 мл Шайба', volume: '350 мл', type: 'twist', diameter: 'd82', shape: 'Шайба', price: 23.10, stock: 28313, inStock: true },
        { id: 24, name: 'Банка Твист 360 мл Шестигранник', volume: '360 мл', type: 'twist', diameter: 'd82', shape: 'Шестигранник', price: 26.80, stock: 704, inStock: true },
        { id: 25, name: 'Банка Твист 390 мл Кубик', volume: '390 мл', type: 'twist', diameter: 'd82', shape: 'Кубик', price: 23.60, stock: 8779, inStock: true },
        { id: 26, name: 'Банка Твист 450 мл Кубышка', volume: '450 мл', type: 'twist', diameter: 'd82', shape: 'Кубышка', price: 18.40, stock: 1898, inStock: true },
        { id: 27, name: 'Банка Твист 500 мл Груша', volume: '500 мл', type: 'twist', diameter: 'd82', shape: 'Груша', price: 24.20, stock: 1305, inStock: true },
        { id: 28, name: 'Банка Твист 500 мл', volume: '500 мл', type: 'twist', diameter: 'd82', price: 18.00, stock: 21603, inStock: true },
        { id: 29, name: 'Банка Твист 500 мл Овал', volume: '500 мл', type: 'twist', diameter: 'd82', shape: 'Овал', price: 22.10, stock: 803, inStock: true },
        { id: 30, name: 'Банка Твист 500 мл Фрутоняня', volume: '500 мл', type: 'twist', diameter: 'd66', shape: 'Фрутоняня', price: 22.60, stock: 4928, inStock: true },
        { id: 31, name: 'Банка Твист 500 мл Бочонок', volume: '500 мл', type: 'twist', diameter: 'd82', shape: 'Бочонок', price: 22.60, stock: 3989, inStock: true },
        { id: 32, name: 'Банка Твист 650 мл Глория', volume: '650 мл', type: 'twist', diameter: 'd82', shape: 'Глория', price: 24.20, stock: 911, inStock: true },
        { id: 33, name: 'Банка Твист 720 мл', volume: '720 мл', type: 'twist', diameter: 'd82', price: 23.00, stock: 4801, inStock: true },
        { id: 34, name: 'Банка Твист 800 мл Арт. 2Т', volume: '800 мл', type: 'twist', diameter: 'd82', shape: 'Арт. 2Т', price: 33.10, stock: 103, inStock: true },
        { id: 35, name: 'Банка Твист 950 мл', volume: '950 мл', type: 'twist', diameter: 'd82', price: 29.40, stock: 10051, inStock: true },
        { id: 36, name: 'Банка Твист 2 л', volume: '2 л', type: 'twist', diameter: 'd82', price: 54.10, stock: 1050, inStock: true },
        { id: 37, name: 'Банка Твист 3 л', volume: '3 л', type: 'twist', diameter: 'd82', price: 70.90, stock: 206, inStock: true },
        
        // Твист широкое горло
        { id: 38, name: 'Банка Твист широкое горло 950 мл', volume: '950 мл', type: 'wide-neck', diameter: 'd100', price: 38.90, stock: 1916, inStock: true },
        { id: 39, name: 'Банка Твист широкое горло 1,5 л Маяк', volume: '1,5 л', type: 'wide-neck', diameter: 'd100', shape: 'Маяк', price: 55.70, stock: 2422, inStock: true },
        { id: 40, name: 'Банка Твист широкое горло 1,5 л Фонарь', volume: '1,5 л', type: 'wide-neck', diameter: 'd100', shape: 'Фонарь', price: 51.50, stock: 383, inStock: true },
        { id: 41, name: 'Банка Твист широкое горло 2 л', volume: '2 л', type: 'wide-neck', diameter: 'd100', price: 54.10, stock: 158, inStock: true },
        { id: 42, name: 'Банка Твист широкое горло 3 л', volume: '3 л', type: 'wide-neck', diameter: 'd100', price: 83.00, stock: 216, inStock: true },
        
        // СКО
        { id: 43, name: 'Банка СКО 500 мл', volume: '500 мл', type: 'sko', diameter: 'd82', price: 23.00, stock: 11888, inStock: true },
        { id: 44, name: 'Банка СКО 650 мл', volume: '650 мл', type: 'sko', diameter: 'd82', price: 24.20, stock: 911, inStock: true },
        { id: 45, name: 'Банка СКО 950 мл', volume: '950 мл', type: 'sko', diameter: 'd82', price: 32.00, stock: 1488, inStock: true },
        { id: 46, name: 'Банка СКО 1,5 л', volume: '1,5 л', type: 'sko', price: 50.90, stock: 160, inStock: true },
        { id: 47, name: 'Банка СКО 2 л', volume: '2 л', type: 'sko', price: 69.30, stock: 449, inStock: true },
        { id: 48, name: 'Банка СКО 3 л', volume: '3 л', type: 'sko', price: 73.50, stock: 132, inStock: true }
    ];
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initCatalog();
});