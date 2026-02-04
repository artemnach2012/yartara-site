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
        <div class="product-card" data-type="${product.type || ''}" data-volume="${getVolumeCategory(product.volume)}" data-category="${product.category}">
            <div class="product-header">
                <h4>${product.name}</h4>
                <div class="product-type">${getCategoryLabel(product.category)}</div>
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
                    <span class="value price">${Number(product.price).toFixed(2)} ₽</span>
                </div>
                <div class="detail-row">
                    <span class="label">Наличие:</span>
                    <span class="value stock">${Number(product.stock).toLocaleString()} шт</span>
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
    if (!volume) return 'other';
    const str = String(volume).toLowerCase();
    const numMatch = str.match(/[\d.,]+/);
    const num = numMatch ? parseFloat(numMatch[0].replace(',', '.')) : 0;
    if (str.includes('л')) {
        if (num < 5) return 'medium'; // 1-5 л -> medium
        if (num < 10) return 'large';  // 5-10 л -> large
        return 'xlarge';                // 10+ л -> xlarge
    } else {
        if (num < 100) return 'small';
        if (num < 500) return 'medium';
        if (num < 1000) return 'large';
        return 'xlarge';
    }
}

// Получение метки категории
function getCategoryLabel(category) {
    const labels = {
        'banks': 'Банки',
        'bottles': 'Бутылки',
        'carboys': 'Бутыли',
        'lids': 'Крышки',
        'caps': 'Колпачки',
        'buckets': 'Ведра',
        'dispensers': 'Лимонадники',
        'tableware': 'Наборы посуды'
    };
    return labels[category] || category || '';
}

// Получение метки типа (для банок)
function getTypeLabel(type) {
    const labels = {
        'twist': 'Твист',
        'wide-neck': 'Твист широкое горло',
        'sko': 'СКО'
    };
    return labels[type] || type || '';
}

// Инициализация фильтров
function initFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const typeFilter = document.getElementById('typeFilter');
    const volumeFilter = document.getElementById('volumeFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    if (volumeFilter) {
        volumeFilter.addEventListener('change', applyFilters);
    }
}

// Применение фильтров
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const volumeFilter = document.getElementById('volumeFilter').value;
    
    let filteredProducts = getProducts();
    
    // Фильтр по категории
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }
    
    // Фильтр по типу (для банок)
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
    const banks = [
        // Твист
        { id: 1, name: 'Банка Твист 20 мл', volume: '20 мл', type: 'twist', diameter: 'd43', price: 14.20, stock: 6954, inStock: true, category: 'banks' },
        { id: 2, name: 'Банка Твист 30 мл', volume: '30 мл', type: 'twist', diameter: 'd43', price: 17.30, stock: 3132, inStock: true, category: 'banks' },
        { id: 3, name: 'Банка Твист 45 мл Шестигранник', volume: '45 мл', type: 'twist', diameter: 'd43', shape: 'Шестигранник', price: 16.30, stock: 2511, inStock: true, category: 'banks' },
        { id: 4, name: 'Банка Твист 50 мл', volume: '50 мл', type: 'twist', diameter: 'd58', price: 17.00, stock: 1334, inStock: true, category: 'banks' },
        { id: 5, name: 'Банка Твист 100 мл Сота', volume: '100 мл', type: 'twist', diameter: 'd58', shape: 'Шестигранник', price: 20.00, stock: 11770, inStock: true, category: 'banks' },
        { id: 6, name: 'Банка Твист 100 мл Икра', volume: '100 мл', type: 'twist', diameter: 'd66', shape: 'Икра', price: 20.50, stock: 6387, inStock: true, category: 'banks' },
        { id: 7, name: 'Банка Твист 105 мл', volume: '105 мл', type: 'twist', diameter: 'd63', price: 10.50, stock: 481, inStock: true, category: 'banks' },
        { id: 8, name: 'Банка Твист 120 мл Солонка', volume: '120 мл', type: 'twist', diameter: 'd48', shape: 'Солонка', price: 12.10, stock: 1601, inStock: true, category: 'banks' },
        { id: 9, name: 'Банка Твист 130 мл Цветочек', volume: '130 мл', type: 'twist', diameter: 'd66', shape: 'Цветочек', price: 15.80, stock: 1160, inStock: true, category: 'banks' },
        { id: 10, name: 'Банка Твист 200 мл Аврора', volume: '200 мл', type: 'twist', diameter: 'd66', shape: 'Аврора', price: 14.70, stock: 3989, inStock: true, category: 'banks' },
        { id: 11, name: 'Банка Твист 200 мл Горчичка', volume: '200 мл', type: 'twist', diameter: 'd58', shape: 'Горчичка', price: 14.50, stock: 1, inStock: true, category: 'banks' },
        { id: 12, name: 'Банка Твист 200 мл', volume: '200 мл', type: 'twist', price: 14.50, stock: 0, inStock: false, category: 'banks' },
        { id: 13, name: 'Банка Твист 250 мл КБ149', volume: '250 мл', type: 'twist', diameter: 'd66', shape: 'КБ149', price: 16.30, stock: 2753, inStock: true, category: 'banks' },
        { id: 14, name: 'Банка Твист 250 мл Кубик', volume: '250 мл', type: 'twist', diameter: 'd66', shape: 'Кубик', price: 16.80, stock: 10, inStock: true, category: 'banks' },
        { id: 15, name: 'Банка Твист 250 мл Шайба', volume: '250 мл', type: 'twist', diameter: 'd82', shape: 'Шайба', price: 18.50, stock: 78, inStock: true, category: 'banks' },
        { id: 16, name: 'Банка Твист 250 мл Шестигранник', volume: '250 мл', type: 'twist', diameter: 'd82', shape: 'Шестигранник', price: 16.80, stock: 703, inStock: true, category: 'banks' },
        { id: 17, name: 'Банка Твист 255 мл', volume: '255 мл', type: 'twist', diameter: 'd66', price: 15.20, stock: 8658, inStock: true, category: 'banks' },
        { id: 18, name: 'Банка Твист 260 мл Мёд', volume: '260 мл', type: 'twist', diameter: 'd63', shape: 'Мёд', price: 25.20, stock: 2927, inStock: true, category: 'banks' },
        { id: 19, name: 'Банка Твист 275 мл Мишка', volume: '275 мл', type: 'twist', diameter: 'd58', shape: 'Мишка', price: 27.30, stock: 741, inStock: true, category: 'banks' },
        { id: 20, name: 'Банка Твист 280 мл Октава', volume: '280 мл', type: 'twist', diameter: 'd66', shape: 'Октава', price: 20.50, stock: 289, inStock: true, category: 'banks' },
        { id: 21, name: 'Банка Твист 330 мл К665', volume: '330 мл', type: 'twist', diameter: 'd66', shape: 'К665', price: 20.00, stock: 137, inStock: true, category: 'banks' },
        { id: 22, name: 'Банка Твист 350 мл Туба', volume: '350 мл', type: 'twist', diameter: 'd66', shape: 'Туба', price: 23.10, stock: 28313, inStock: true, category: 'banks' },
        { id: 23, name: 'Банка Твист 350 мл Шайба', volume: '350 мл', type: 'twist', diameter: 'd82', shape: 'Шайба', price: 23.10, stock: 28313, inStock: true, category: 'banks' },
        { id: 24, name: 'Банка Твист 360 мл Шестигранник', volume: '360 мл', type: 'twist', diameter: 'd82', shape: 'Шестигранник', price: 26.80, stock: 704, inStock: true, category: 'banks' },
        { id: 25, name: 'Банка Твист 390 мл Кубик', volume: '390 мл', type: 'twist', diameter: 'd82', shape: 'Кубик', price: 23.60, stock: 8779, inStock: true, category: 'banks' },
        { id: 26, name: 'Банка Твист 450 мл Кубышка', volume: '450 мл', type: 'twist', diameter: 'd82', shape: 'Кубышка', price: 18.40, stock: 1898, inStock: true, category: 'banks' },
        { id: 27, name: 'Банка Твист 500 мл Груша', volume: '500 мл', type: 'twist', diameter: 'd82', shape: 'Груша', price: 24.20, stock: 1305, inStock: true, category: 'banks' },
        { id: 28, name: 'Банка Твист 500 мл', volume: '500 мл', type: 'twist', diameter: 'd82', price: 18.00, stock: 21603, inStock: true, category: 'banks' },
        { id: 29, name: 'Банка Твист 500 мл Овал', volume: '500 мл', type: 'twist', diameter: 'd82', shape: 'Овал', price: 22.10, stock: 803, inStock: true, category: 'banks' },
        { id: 30, name: 'Банка Твист 500 мл Фрутоняня', volume: '500 мл', type: 'twist', diameter: 'd66', shape: 'Фрутоняня', price: 22.60, stock: 4928, inStock: true, category: 'banks' },
        { id: 31, name: 'Банка Твист 500 мл Бочонок', volume: '500 мл', type: 'twist', diameter: 'd82', shape: 'Бочонок', price: 22.60, stock: 3989, inStock: true, category: 'banks' },
        { id: 32, name: 'Банка Твист 650 мл Глория', volume: '650 мл', type: 'twist', diameter: 'd82', shape: 'Глория', price: 24.20, stock: 911, inStock: true, category: 'banks' },
        { id: 33, name: 'Банка Твист 720 мл', volume: '720 мл', type: 'twist', diameter: 'd82', price: 23.00, stock: 4801, inStock: true, category: 'banks' },
        { id: 34, name: 'Банка Твист 800 мл Арт. 2Т', volume: '800 мл', type: 'twist', diameter: 'd82', shape: 'Арт. 2Т', price: 33.10, stock: 103, inStock: true, category: 'banks' },
        { id: 35, name: 'Банка Твист 950 мл', volume: '950 мл', type: 'twist', diameter: 'd82', price: 29.40, stock: 10051, inStock: true, category: 'banks' },
        { id: 36, name: 'Банка Твист 2 л', volume: '2 л', type: 'twist', diameter: 'd82', price: 54.10, stock: 1050, inStock: true, category: 'banks' },
        { id: 37, name: 'Банка Твист 3 л', volume: '3 л', type: 'twist', diameter: 'd82', price: 70.90, stock: 206, inStock: true, category: 'banks' },
        
        // Твист широкое горло
        { id: 38, name: 'Банка Твист широкое горло 950 мл', volume: '950 мл', type: 'wide-neck', diameter: 'd100', price: 38.90, stock: 1916, inStock: true, category: 'banks' },
        { id: 39, name: 'Банка Твист широкое горло 1,5 л Маяк', volume: '1,5 л', type: 'wide-neck', diameter: 'd100', shape: 'Маяк', price: 55.70, stock: 2422, inStock: true, category: 'banks' },
        { id: 40, name: 'Банка Твист широкое горло 1,5 л Фонарь', volume: '1,5 л', type: 'wide-neck', diameter: 'd100', shape: 'Фонарь', price: 51.50, stock: 383, inStock: true, category: 'banks' },
        { id: 41, name: 'Банка Твист широкое горло 2 л', volume: '2 л', type: 'wide-neck', diameter: 'd100', price: 54.10, stock: 158, inStock: true, category: 'banks' },
        { id: 42, name: 'Банка Твист широкое горло 3 л', volume: '3 л', type: 'wide-neck', diameter: 'd100', price: 83.00, stock: 216, inStock: true, category: 'banks' },
        
        // СКО
        { id: 43, name: 'Банка СКО 500 мл', volume: '500 мл', type: 'sko', diameter: 'd82', price: 23.00, stock: 11888, inStock: true, category: 'banks' },
        { id: 44, name: 'Банка СКО 650 мл', volume: '650 мл', type: 'sko', diameter: 'd82', price: 24.20, stock: 911, inStock: true, category: 'banks' },
        { id: 45, name: 'Банка СКО 950 мл', volume: '950 мл', type: 'sko', diameter: 'd82', price: 32.00, stock: 1488, inStock: true, category: 'banks' },
        { id: 46, name: 'Банка СКО 1,5 л', volume: '1,5 л', type: 'sko', price: 50.90, stock: 160, inStock: true, category: 'banks' },
        { id: 47, name: 'Банка СКО 2 л', volume: '2 л', type: 'sko', price: 69.30, stock: 449, inStock: true, category: 'banks' },
        { id: 48, name: 'Банка СКО 3 л', volume: '3 л', type: 'sko', price: 73.50, stock: 132, inStock: true, category: 'banks' }
    ];

    const other = [
        // Бутылки
        { id: 101, name: 'Бутылка 0,050 л. d18', volume: '50 мл', diameter: 'd18', price: 16.30, stock: 1348, inStock: true, category: 'bottles' },
        { id: 102, name: 'Бутылка 0,050 л. Futuro d18', volume: '50 мл', diameter: 'd18', price: 15.80, stock: 426, inStock: true, category: 'bottles' },
        { id: 103, name: 'Бутылка 0,100 л. d28', volume: '100 мл', diameter: 'd28', price: 12.60, stock: 799, inStock: true, category: 'bottles' },
        { id: 104, name: 'Бутылка 0,100 л. Пляшка d28', volume: '100 мл', diameter: 'd28', price: 15.20, stock: 7283, inStock: true, category: 'bottles' },
        { id: 105, name: 'Бутылка 0,250 л. Арт. В-28 коричневая', volume: '250 мл', diameter: 'd28', price: 18.40, stock: 278, inStock: true, category: 'bottles' },
        { id: 106, name: 'Бутылка 0,250 л. Гаврош d28', volume: '250 мл', diameter: 'd28', price: 17.30, stock: 2694, inStock: true, category: 'bottles' },
        { id: 107, name: 'Бутылка 0,250 л. для масла "Олива" коричневая', volume: '250 мл', diameter: 'd28', price: 31.00, stock: 347, inStock: true, category: 'bottles' },
        { id: 108, name: 'Бутылка 0,250 л. Сок d43', volume: '250 мл', diameter: 'd43', price: 14.50, stock: 243, inStock: true, category: 'bottles' },
        { id: 109, name: 'Бутылка 0,250 л. Фляжка г.Коркино d28', volume: '250 мл', diameter: 'd28', price: 20.50, stock: 2360, inStock: true, category: 'bottles' },
        { id: 110, name: 'Бутылка 0,310 л. КБ 38 d43', volume: '310 мл', diameter: 'd43', price: 19.40, stock: 794, inStock: true, category: 'bottles' },
        { id: 111, name: 'Бутылка 0,500 л К 37', volume: '500 мл', diameter: 'd28', price: 29.40, stock: 135, inStock: true, category: 'bottles' },
        { id: 112, name: 'Бутылка 0,500 л. Арт. К-640. Молочная d43', volume: '500 мл', diameter: 'd43', price: 21.00, stock: 390, inStock: true, category: 'bottles' },
        { id: 113, name: 'Бутылка 0,500 л. Базис 2. КПМ3. Гуала', volume: '500 мл', diameter: 'd43', price: 20.50, stock: 656, inStock: true, category: 'bottles' },
        { id: 114, name: 'Бутылка 0,500 л. Бугельная Beer LM коричневая', volume: '500 мл', diameter: 'd28', price: 47.80, stock: 249, inStock: true, category: 'bottles' },
        { id: 115, name: 'Бутылка 0,500 л. Бугельная бесцветная', volume: '500 мл', diameter: 'd28', price: 47.80, stock: 380, inStock: true, category: 'bottles' },
        { id: 116, name: 'Бутылка 0,500 л. Фляга d28', volume: '500 мл', diameter: 'd28', price: 34.70, stock: 22, inStock: true, category: 'bottles' },
        { id: 117, name: 'Бутылка 0,700 л. Камю. Арт. П-30', volume: '700 мл', diameter: 'd28', price: 57.80, stock: 526, inStock: true, category: 'bottles' },
        { id: 118, name: 'Бутылка 0,750 л. Бугельная Bordo classic LM виноградная', volume: '750 мл', diameter: 'd28', price: 53.60, stock: 378, inStock: true, category: 'bottles' },
        { id: 119, name: 'Бутылка 1 литр. Бугельная бесцветная П-32-10-1000', volume: '1 л', diameter: 'd32', price: 89.30, stock: 301, inStock: true, category: 'bottles' },
        { id: 120, name: 'Бутылка 1 литр. Бугельная коричневая Litva 2', volume: '1 л', diameter: 'd32', price: 84.00, stock: 7, inStock: true, category: 'bottles' },
        { id: 121, name: 'Бутылка 1 литр. Бугельная коричневая П-32', volume: '1 л', diameter: 'd32', price: 89.30, stock: 369, inStock: true, category: 'bottles' },
        { id: 122, name: 'Бутылка 1 литр. Винная WINE1 d66', volume: '1 л', diameter: 'd66', price: 31.00, stock: 397, inStock: true, category: 'bottles' },

        // Бутыли
        { id: 201, name: 'Бутыль 3л "Дамижана"', volume: '3 л', diameter: 'd38', price: 892.50, stock: 8, inStock: true, category: 'carboys' },
        { id: 202, name: 'Бутыль 3л "Джон" с крышкой', volume: '3 л', diameter: 'd38', price: 630.00, stock: 11, inStock: true, category: 'carboys' },
        { id: 203, name: 'Бутыль 3л "Четверть" с крышкой', volume: '3 л', diameter: 'd58', price: 787.50, stock: 6, inStock: true, category: 'carboys' },
        { id: 204, name: 'Бутыль 3л "Четверть" с пробкой', volume: '3 л', diameter: 'd58', price: 735.00, stock: 8, inStock: true, category: 'carboys' },
        { id: 205, name: 'Бутыль 5л "Виноград" ТО d38 (зеленый)', volume: '5 л', diameter: 'd38', price: 1050.00, stock: 6, inStock: true, category: 'carboys' },
        { id: 206, name: 'Бутыль 5л "Дамижана"', volume: '5 л', diameter: 'd38', price: 945.00, stock: 4, inStock: true, category: 'carboys' },
        { id: 207, name: 'Бутыль 7л "Виноград" ТО d38 (зеленый)', volume: '7 л', diameter: 'd38', price: 1102.50, stock: 4, inStock: true, category: 'carboys' },
        { id: 208, name: 'Бутыль 10л "Дачная" СКО (зеленый)', volume: '10 л', diameter: 'd58', price: 1260.00, stock: 6, inStock: true, category: 'carboys' },
        { id: 209, name: 'Бутыль 10л "Казак" ТО d58 (зеленый)', volume: '10 л', diameter: 'd58', price: 1215.00, stock: 1, inStock: true, category: 'carboys' },
        { id: 210, name: 'Бутыль 10л "Казак" ТО d58 (прозрачный)', volume: '10 л', diameter: 'd58', price: 1215.00, stock: 5, inStock: true, category: 'carboys' },
        { id: 211, name: 'Бутыль 15л "Казак" ТО d58 (зеленый)', volume: '15 л', diameter: 'd58', price: 2205.00, stock: 5, inStock: true, category: 'carboys' },
        { id: 212, name: 'Бутыль 15л "Казак" ТО d58 (прозрачный)', volume: '15 л', diameter: 'd58', price: 1920.00, stock: 4, inStock: true, category: 'carboys' },

        // Крышки
        { id: 301, name: 'Крышка d43 мм белая', volume: '—', diameter: 'd43', price: 8.80, stock: 2669, inStock: true, category: 'lids' },
        { id: 302, name: 'Крышка d43 мм золото Магол', volume: '—', diameter: 'd43', price: 5.50, stock: 4773, inStock: true, category: 'lids' },
        { id: 303, name: 'Крышка d43 мм красная Магол', volume: '—', diameter: 'd43', price: 5.50, stock: 1558, inStock: true, category: 'lids' },
        { id: 304, name: 'Крышка d43 мм черная Магол', volume: '—', diameter: 'd43', price: 7.50, stock: 11, inStock: true, category: 'lids' },
        { id: 305, name: 'Крышка d48 мм золото', volume: '—', diameter: 'd48', price: 6.90, stock: 9214, inStock: true, category: 'lids' },
        { id: 306, name: 'Крышка d51 мм белая (стер) с клапаном', volume: '—', diameter: 'd51', price: 9.50, stock: 3869, inStock: true, category: 'lids' },
        { id: 307, name: 'Крышка d53 мм золото Магол', volume: '—', diameter: 'd53', price: 6.30, stock: 822, inStock: true, category: 'lids' },
        { id: 308, name: 'Крышка d58 мм "Пчелка"', volume: '—', diameter: 'd58', price: 6.80, stock: 637, inStock: true, category: 'lids' },
        { id: 309, name: 'Крышка d58 мм DEEP серебро', volume: '—', diameter: 'd58', price: 13.10, stock: 1058, inStock: true, category: 'lids' },
        { id: 310, name: 'Крышка d58 мм белая г. Елабуга', volume: '—', diameter: 'd58', price: 6.00, stock: 796, inStock: true, category: 'lids' },
        { id: 311, name: 'Крышка d58 мм золото г. Елабуга', volume: '—', diameter: 'd58', price: 6.00, stock: 13582, inStock: true, category: 'lids' },
        { id: 312, name: 'Крышка d58 мм красная г. Елабуга', volume: '—', diameter: 'd58', price: 6.00, stock: 1306, inStock: true, category: 'lids' },
        { id: 313, name: 'Крышка d58 мм черная г. Елабуга', volume: '—', diameter: 'd58', price: 6.00, stock: 4665, inStock: true, category: 'lids' },
        { id: 314, name: 'Крышка d66 мм "Пчелка"', volume: '—', diameter: 'd66', price: 7.90, stock: 920, inStock: true, category: 'lids' },
        { id: 315, name: 'Крышка d66 мм DEEP золото Китай', volume: '—', diameter: 'd66', price: 16.40, stock: 949, inStock: true, category: 'lids' },
        { id: 316, name: 'Крышка d66 мм DEEP золото Магол', volume: '—', diameter: 'd66', price: 13.70, stock: 48, inStock: true, category: 'lids' },
        { id: 317, name: 'Крышка d66 мм DEEP серебро Магол', volume: '—', diameter: 'd66', price: 12.60, stock: 467, inStock: true, category: 'lids' },
        { id: 318, name: 'Крышка d66 мм DEEP черная матовая Магол', volume: '—', diameter: 'd66', price: 13.70, stock: 783, inStock: true, category: 'lids' },
        { id: 319, name: 'Крышка d66 мм белая г. Елабуга', volume: '—', diameter: 'd66', price: 7.40, stock: 7574, inStock: true, category: 'lids' },
        { id: 320, name: 'Крышка d66 мм золото г. Елабуга', volume: '—', diameter: 'd66', price: 7.40, stock: 4075, inStock: true, category: 'lids' },
        { id: 321, name: 'Крышка d66 мм красная г. Елабуга', volume: '—', diameter: 'd66', price: 7.40, stock: 2919, inStock: true, category: 'lids' },
        { id: 322, name: 'Крышка d66 мм чёрная г. Елабуга', volume: '—', diameter: 'd66', price: 7.40, stock: 7580, inStock: true, category: 'lids' },
        { id: 323, name: 'Крышка d70 мм золото', volume: '—', diameter: 'd70', price: 12.60, stock: 69, inStock: true, category: 'lids' },
        { id: 324, name: 'Крышка d77 мм серебро Магол', volume: '—', diameter: 'd77', price: 11.00, stock: 9, inStock: true, category: 'lids' },
        { id: 325, name: 'Крышка d82 мм "Пчелка"', volume: '—', diameter: 'd82', price: 16.80, stock: 700, inStock: true, category: 'lids' },
        { id: 326, name: 'Крышка d82 мм белая г. Елабуга', volume: '—', diameter: 'd82', price: 8.90, stock: 11786, inStock: true, category: 'lids' },
        { id: 327, name: 'Крышка d82 мм золотая (стерилизация) г. Елабуга', volume: '—', diameter: 'd82', price: 8.90, stock: 3895, inStock: true, category: 'lids' },
        { id: 328, name: 'Крышка d82 мм золотая г. Елабуга', volume: '—', diameter: 'd82', price: 8.90, stock: 9900, inStock: true, category: 'lids' },
        { id: 329, name: 'Крышка d82 мм красная г. Елабуга', volume: '—', diameter: 'd82', price: 8.90, stock: 650, inStock: true, category: 'lids' },
        { id: 330, name: 'Крышка d82 мм чёрная г. Елабуга', volume: '—', diameter: 'd82', price: 9.10, stock: 3359, inStock: true, category: 'lids' },
        { id: 331, name: 'Крышка d82 СКО "Автоклавирование" г. Елабуга', volume: '—', diameter: 'd82', price: 7.50, stock: 2250, inStock: true, category: 'lids' },
        { id: 332, name: 'Крышка d82 СКО "Гарантия Качества" г. Елабуга', volume: '—', diameter: 'd82', price: 6.70, stock: 1750, inStock: true, category: 'lids' },
        { id: 333, name: 'Крышка d82 СКО золото г. Екатеринбург', volume: '—', diameter: 'd82', price: 3.70, stock: 650, inStock: true, category: 'lids' },
        { id: 334, name: 'Крышка d89 мм золото г. Елабуга', volume: '—', diameter: 'd89', price: 12.10, stock: 367, inStock: true, category: 'lids' },
        { id: 335, name: 'Крышка d100 мм золото г. Елабуга', volume: '—', diameter: 'd100', price: 12.10, stock: 209, inStock: true, category: 'lids' },

        // Колпачки
        { id: 401, name: 'Колпачок 28 мм Двухкомпонентный Белый', volume: '—', diameter: '28 мм', price: 1.10, stock: 2774, inStock: true, category: 'caps' },
        { id: 402, name: 'Колпачок 28 мм Черный 99222 S', volume: '—', diameter: '28 мм', price: 1.10, stock: 3885, inStock: true, category: 'caps' },
        { id: 403, name: 'Колпачок алюминиевый 28*18 мм черный (без резьбы)', volume: '—', diameter: '28 мм', price: 4.20, stock: 2018, inStock: true, category: 'caps' },
        { id: 404, name: 'Колпачок Гуала под бутылку золотая, зелёная', volume: '—', diameter: '—', price: 6.80, stock: 1530, inStock: true, category: 'caps' },
        { id: 405, name: 'Колпачок Гуала под бутылку, кпм-30 чёрный', volume: '—', diameter: '—', price: 14.20, stock: 5, inStock: true, category: 'caps' },

        // Ведра
        { id: 501, name: 'Ведро с крышкой 1 литр круглое', volume: '1 л', diameter: '—', price: 31.50, stock: 67, inStock: true, category: 'buckets' },
        { id: 502, name: 'Ведро с крышкой 5,7 литра круглое, белое', volume: '5,7 л', diameter: '—', price: 116.60, stock: 18, inStock: true, category: 'buckets' },

        // Лимонадники
        { id: 601, name: 'Лимонадник 3л "Кристалл" с краном', volume: '3 л', diameter: '—', price: 2572.50, stock: 3, inStock: true, category: 'dispensers' },
        { id: 602, name: 'Лимонадник 5л "Колба" с краном', volume: '5 л', diameter: '—', price: 1522.50, stock: 2, inStock: true, category: 'dispensers' },
        { id: 603, name: 'Лимонадник 7л "Колба" с краном', volume: '7 л', diameter: '—', price: 1680.00, stock: 1, inStock: true, category: 'dispensers' },
        { id: 604, name: 'Лимонадник 8л "Амфора" с краном', volume: '8 л', diameter: '—', price: 1890.00, stock: 2, inStock: true, category: 'dispensers' },

        // Наборы посуды
        { id: 701, name: 'Набор посуды №6 Для всей семьи', volume: '—', diameter: '—', price: 105.00, stock: 24, inStock: true, category: 'tableware' },

        // Спецпозиции (стеклобанки с крышками и др.)
        { id: 801, name: 'Банка 3,8 л стеклянная "кольцо"', volume: '3,8 л', diameter: '—', price: 735.00, stock: 3, inStock: true, category: 'banks' },
        { id: 802, name: 'Банка 7 л. "Ламели" СКО проз.', volume: '7 л', diameter: '—', price: 945.00, stock: 1, inStock: true, category: 'banks' },
        { id: 803, name: 'Банка 9 л. стеклянная с гидрозатвором', volume: '9 л', diameter: '—', price: 1207.50, stock: 1, inStock: true, category: 'banks' },
        { id: 804, name: 'Банка 16 л. стеклянная с ручкой (фиолет. с клапаном)', volume: '16 л', diameter: '—', price: 1365.00, stock: 3, inStock: true, category: 'banks' },
        { id: 805, name: 'Банка 18 л. стеклянная с гидрозатвором', volume: '18 л', diameter: '—', price: 1995.00, stock: 7, inStock: true, category: 'banks' },
        { id: 806, name: 'Банка 25 л. стеклянная с гидрозатвором', volume: '25 л', diameter: '—', price: 2793.00, stock: 6, inStock: true, category: 'banks' },
        { id: 807, name: 'Банка 3,1 л. КБ249 d100', volume: '3,1 л', diameter: 'd100', price: 76.70, stock: 95, inStock: true, category: 'banks' },
        { id: 808, name: 'Банка 5 л. d110 с крышкой и ручкой', volume: '5 л', diameter: 'd110', price: 200.00, stock: 6, inStock: true, category: 'banks' },
        { id: 809, name: 'Банка 5 л. с крышкой и ручкой (мерная) d110', volume: '5 л', diameter: 'd110', price: 250.00, stock: 50, inStock: true, category: 'banks' },

        // Бутылки декоративные
        { id: 901, name: 'Бутылка 1,5 л. "Традиция" бронза', volume: '1,5 л', diameter: '—', price: 472.50, stock: 5, inStock: true, category: 'bottles' },
        { id: 902, name: 'Бутылка 12 л. "GARRAFA CABERNET" с пробкой', volume: '12 л', diameter: '—', price: 3675.00, stock: 5, inStock: true, category: 'bottles' },
        { id: 903, name: 'Бутылка 12 л. "GARRAFA COLONIAL" с пробкой', volume: '12 л', diameter: '—', price: 3675.00, stock: 5, inStock: true, category: 'bottles' },
        { id: 904, name: 'Бутылка 2 литра. Бугельная Most LM бесцветная', volume: '2 л', diameter: '—', price: 283.50, stock: 6, inStock: true, category: 'bottles' },
        { id: 905, name: 'Бутылка 3 л. "Ностальгия"', volume: '3 л', diameter: '—', price: 524.00, stock: 1, inStock: true, category: 'bottles' },
        { id: 906, name: 'Бутылка 3 л. "Ностальгия" бронза', volume: '3 л', diameter: '—', price: 892.50, stock: 2, inStock: true, category: 'bottles' },
        { id: 907, name: 'Бутылка 3 л. "Ностальгия" зелёная', volume: '3 л', diameter: '—', price: 892.50, stock: 2, inStock: true, category: 'bottles' },
        { id: 908, name: 'Бутылка 3 л. "Ностальгия" красная', volume: '3 л', diameter: '—', price: 892.50, stock: 1, inStock: true, category: 'bottles' },
        { id: 909, name: 'Бутылка 3 л. "Ностальгия" синяя', volume: '3 л', diameter: '—', price: 892.50, stock: 4, inStock: true, category: 'bottles' },
        { id: 910, name: 'Бутылка 3 л. "Ностальгия" чёрная', volume: '3 л', diameter: '—', price: 892.50, stock: 5, inStock: true, category: 'bottles' },
        { id: 911, name: 'Бутылка 3 л. "Фуфырь" синяя', volume: '3 л', diameter: '—', price: 897.80, stock: 3, inStock: true, category: 'bottles' },
        { id: 912, name: 'Бутылка 4,5 л. "Ровоам" бронза', volume: '4,5 л', diameter: '—', price: 735.00, stock: 1, inStock: true, category: 'bottles' },
        { id: 913, name: 'Бутылка 4,5 л. "Ровоам" синий', volume: '4,5 л', diameter: '—', price: 735.00, stock: 1, inStock: true, category: 'bottles' },

        // Прочее
        { id: 1001, name: 'ПЭТ-бутыль 18,9 л голубая № 1 с ручкой', volume: '18,9 л', diameter: '—', price: 378.00, stock: 5, inStock: true, category: 'carboys' },
        { id: 1002, name: 'Бугельная пробка /пр-во Россия/', volume: '—', diameter: '—', price: 25.20, stock: 899, inStock: true, category: 'caps' },
        { id: 1003, name: 'Ручка для Стеклобанок - d82', volume: '—', diameter: 'd82', price: 6.30, stock: 1403, inStock: true, category: 'lids' },
        { id: 1004, name: 'Термоусадочный колпачок золото с алюм. верхом ТУК-А-30 мм', volume: '—', diameter: '30 мм', price: 4.20, stock: 485, inStock: true, category: 'caps' },
        { id: 1005, name: 'Флакон 0,100 л для лекарственных средств, цв. оранж', volume: '100 мл', diameter: '—', price: 10.00, stock: 851, inStock: true, category: 'bottles' }
    ];

    return [...banks, ...other];
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initCatalog();
});