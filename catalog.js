// Каталог товаров - обновлено по данным от 2 февраля 2026 г.

// Инициализация каталога
function initCatalog() {
    renderProducts(getProducts());
    initFilters();
}

// Рендеринг продуктов
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<p class="text-center">Товары не найдены по выбранным критериям</p>';
        return;
    }
    
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-type="${product.type || ''}" data-volume="${getVolumeCategory(product.volume)}" data-category="${product.category}">
            <div class="product-header">
                <h4>${product.name}</h4>
                <div class="product-type">${getCategoryLabel(product.category)}</div>
            </div>
            <div class="product-details">
                <div class="detail-row">
                    <span class="label">Объем:</span>
                    <span class="value">${product.volume || '—'}</span>
                </div>
                ${product.diameter ? `
                <div class="detail-row">
                    <span class="label">Диаметр/Размер:</span>
                    <span class="value">${product.diameter}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Цена:</span>
                    <span class="value price">${Number(product.price).toFixed(2)} ₽</span>
                </div>
                <div class="detail-row">
                    <span class="label">Наличие:</span>
                    <span class="value stock">${Number(product.stock).toLocaleString()} ${product.unit || 'шт'}</span>
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

// Получение категории объема для фильтрации
function getVolumeCategory(volumeStr) {
    if (!volumeStr) return 'other';
    const str = String(volumeStr).toLowerCase().replace(',', '.');
    const numMatch = str.match(/[\d.,]+/);
    const num = numMatch ? parseFloat(numMatch[0]) : 0;
    
    if (str.includes('л')) {
        if (num < 5) return 'medium'; 
        if (num < 10) return 'large';  
        if (num < 20) return 'xlarge'; 
        return 'xxlarge';               
    } else if (str.includes('мл')) {
        if (num < 100) return 'small';
        if (num < 500) return 'medium';
        return 'large';
    } else if (str.includes('м') || str.includes('пог')) {
        return 'other'; // Метры, погонные метры
    } else {
        return 'other'; // Штуки, кг и т.д.
    }
}

// Получение метки категории
function getCategoryLabel(category) {
    const labels = {
        'banks': 'Банки',
        'bottles': 'Бутылки',
        'carboys': 'Бутыли',
        'lids': 'Крышки/Колпачки',
        'containers': 'Емкости',
        'agriculture': 'Агротовары',
        'home': 'Товары для дома/дачи',
        'tools': 'Инструменты'
    };
    return labels[category] || category || '';
}

// Определение типа банки по имени
function getBankType(name) {
    const n = name.toLowerCase();
    if (n.includes('ско')) return 'sko';
    if (n.includes('твист') || n.includes('широкое горло')) return 'twist';
    return 'other';
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
    
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
    
    if (typeFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.type === typeFilter);
    }
    
    if (volumeFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => getVolumeCategory(p.volume) === volumeFilter);
    }
    
    renderProducts(filteredProducts);
}

// Генерация ID
function generateId() {
    return Math.floor(Math.random() * 1000000);
}

// Парсинг диаметра из строки
function parseDiameter(name) {
    const match = name.match(/d(\d+)/i);
    return match ? 'd' + match[1] : '';
}

// Главная функция получения товаров (парсинг из таблицы)
function getProducts() {
    // Данные получены из таблицы catalog
    const data = [
        // --- БАНКИ СТЕКЛЯННЫЕ ---
        { name: 'Банка 0,020 л. d43/72', price: 14.2, stock: 6594, volume: '20 мл', category: 'banks', type: 'twist', diameter: 'd43' },
        { name: 'Банка 0,030 л. d43/72', price: 17.3, stock: 3132, volume: '30 мл', category: 'banks', type: 'twist', diameter: 'd43' },
        { name: 'Банка 0,045 л. Шестигранник d43/38', price: 16.3, stock: 2549, volume: '45 мл', category: 'banks', type: 'twist', diameter: 'd43' },
        { name: 'Банка 0,050 л. d58/22', price: 17.0, stock: 1334, volume: '50 мл', category: 'banks', type: 'twist', diameter: 'd58' },
        { name: 'Банка 0,100 л. Сота d58/22', price: 20.0, stock: 11066, volume: '100 мл', category: 'banks', type: 'twist', diameter: 'd58' },
        { name: 'Банка 0,100 л. Икра d66/17', price: 20.5, stock: 5350, volume: '100 мл', category: 'banks', type: 'twist', diameter: 'd66' },
        { name: 'Банка 0,200 л. Аврора d66/17', price: 14.7, stock: 3989, volume: '200 мл', category: 'banks', type: 'twist', diameter: 'd66' },
        { name: 'Банка 0,200 л. Глория d66/24шт.уп', price: 18.9, stock: 848, volume: '200 мл', category: 'banks', type: 'twist', diameter: 'd66' },
        { name: 'Банка 0,250 л. КБ-149 d66/4400/40 пакет', price: 16.3, stock: 2473, volume: '250 мл', category: 'banks', type: 'twist', diameter: 'd66' },
        { name: 'Банка 0,250 л. Кубик. КБ152 d66/20', price: 16.8, stock: 10, volume: '250 мл', category: 'banks', type: 'twist', diameter: 'd66' },
        { name: 'Банка 0,250 л. Шайба d82/14шт.уп/ г.Елизово', price: 18.5, stock: 78, volume: '250 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,250 л. Шестигранник d82/14', price: 16.8, stock: 703, volume: '250 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,255 л. d66/18', price: 15.2, stock: 8658, volume: '255 мл', category: 'banks', type: 'twist', diameter: 'd66' },
        { name: 'Банка 0,260 л. Мёд d63/12', price: 25.2, stock: 2927, volume: '260 мл', category: 'banks', type: 'twist', diameter: 'd63' },
        { name: 'Банка 0,350 л. Шайба КБ-212 d82/3312/24 пакет', price: 23.1, stock: 28121, volume: '350 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,360 л.ТО-82 Шестигранник d82/11', price: 26.8, stock: 704, volume: '360 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,390 л. Кубик. КБ 140 d82/3360/28 пакет', price: 23.6, stock: 8779, volume: '390 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,450 л. Кубышка d82/11', price: 18.4, stock: 1898, volume: '450 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,500 л. (К) d82', price: 18.0, stock: 21383, volume: '500 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,500 л. Бочонок КБ94 d82', price: 22.6, stock: 3989, volume: '500 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,500 л. Груша d82/11', price: 24.2, stock: 1305, volume: '500 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,500 л. Овал. К-667 d82/11', price: 22.1, stock: 803, volume: '500 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,500 л. Фрутоняня. Арт. КБ 70. d66', price: 22.6, stock: 4928, volume: '500 мл', category: 'banks', type: 'twist', diameter: 'd66' },
        { name: 'Банка 0,720 л. d82/11', price: 23.0, stock: 4801, volume: '720 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,800 л. Арт. 2Т. d82/12', price: 33.1, stock: 103, volume: '800 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,950 л. (К) d82', price: 29.4, stock: 10051, volume: '950 мл', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 0,950 л. Арт.КБ 80. d100', price: 38.9, stock: 1916, volume: '950 мл', category: 'banks', type: 'wide-neck', diameter: 'd100' },
        { name: 'Банка 1,5 л. Арт. КБ 79. d100', price: 55.7, stock: 2422, volume: '1.5 л', category: 'banks', type: 'wide-neck', diameter: 'd100' },
        { name: 'Банка 1,5 л. Фонарь А118. d100', price: 51.5, stock: 383, volume: '1.5 л', category: 'banks', type: 'wide-neck', diameter: 'd100' },
        { name: 'Банка 2 л. Экран. d82/6', price: 54.1, stock: 1050, volume: '2 л', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 3 л. КБ2 d100/4', price: 83.0, stock: 216, volume: '3 л', category: 'banks', type: 'wide-neck', diameter: 'd100' },
        { name: 'Банка 3 л. Экран. d82/6', price: 70.9, stock: 200, volume: '3 л', category: 'banks', type: 'twist', diameter: 'd82' },
        { name: 'Банка 3,1 л. КБ249 d100', price: 76.7, stock: 95, volume: '3.1 л', category: 'banks', type: 'wide-neck', diameter: 'd100' },
        { name: 'Банка 5 л. d110 с крышкой и ручкой', price: 200.0, stock: 6, volume: '5 л', category: 'banks', type: 'wide-neck', diameter: 'd110' },
        { name: 'Банка 5 л. с крышкой и ручкой (мерная) d110', price: 250.0, stock: 50, volume: '5 л', category: 'banks', type: 'wide-neck', diameter: 'd110' },
        { name: 'Банка 3,8 л стеклянная "кольцо"', price: 735.0, stock: 3, volume: '3.8 л', category: 'banks' },
        { name: 'Банка 7 л. "Ламели" СКО проз.', price: 945.0, stock: 1, volume: '7 л', category: 'banks', type: 'sko' },
        { name: 'Банка 9 л. стеклянная с гидрозатвором', price: 1207.5, stock: 1, volume: '9 л', category: 'banks' },
        { name: 'Банка 16 л. стеклянная с ручкой (фиолет. с клапаном)', price: 1365.0, stock: 3, volume: '16 л', category: 'banks' },
        { name: 'Банка 18 л. стеклянная с гидрозатвором', price: 1995.0, stock: 7, volume: '18 л', category: 'banks' },
        { name: 'Банка 25 л. стеклянная с гидрозатвором', price: 2793.0, stock: 6, volume: '25 л', category: 'banks' },
        { name: 'Банка СКО 0,500 л. d82', price: 23.0, stock: 11888, volume: '500 мл', category: 'banks', type: 'sko', diameter: 'd82' },
        { name: 'Банка СКО 0,650 л. d82', price: 24.2, stock: 911, volume: '650 мл', category: 'banks', type: 'sko', diameter: 'd82' },
        { name: 'Банка СКО 0,950 л. d82', price: 32.0, stock: 1488, volume: '950 мл', category: 'banks', type: 'sko', diameter: 'd82' },
        { name: 'Банка СКО 1,5 л. d82', price: 61.4, stock: 408, volume: '1.5 л', category: 'banks', type: 'sko', diameter: 'd82' },
        { name: 'Банка СКО 2 л. d82', price: 69.3, stock: 449, volume: '2 л', category: 'banks', type: 'sko', diameter: 'd82' },
        { name: 'Банка СКО 3 л. d82', price: 73.5, stock: 132, volume: '3 л', category: 'banks', type: 'sko', diameter: 'd82' },

        // --- БУТЫЛКИ И БУТЫЛИ ---
        { name: 'Бутылка 0,050 л. d18/115/107', price: 16.3, stock: 1348, volume: '50 мл', category: 'bottles', diameter: 'd18' },
        { name: 'Бутылка 0,100 л. d28/70', price: 18.5, stock: 799, volume: '100 мл', category: 'bottles', diameter: 'd28' },
        { name: 'Бутылка 0,100 л. Пляшка d28/44', price: 15.2, stock: 7151, volume: '100 мл', category: 'bottles', diameter: 'd28' },
        { name: 'Бутылка 0,250 л. Гаврош d28/23', price: 17.3, stock: 1130, volume: '250 мл', category: 'bottles', diameter: 'd28' },
        { name: 'Бутылка 0,250 л. для масла "Олива" цв.коричневый', price: 31.0, stock: 347, volume: '250 мл', category: 'bottles', diameter: 'd28' },
        { name: 'Бутылка 0,250 л. Сок d43/22', price: 14.5, stock: 243, volume: '250 мл', category: 'bottles', diameter: 'd43' },
        { name: 'Бутылка 0,500 л. Арт. К-640. Молочная d43/15', price: 21.0, stock: 390, volume: '500 мл', category: 'bottles', diameter: 'd43' },
        { name: 'Бутылка 0,500 л. Базис 2. КПМ3. Гуала', price: 20.5, stock: 656, volume: '500 мл', category: 'bottles', diameter: 'd43' },
        { name: 'Бутылка 0,500 л. Бугельная Beer LM коричневая', price: 47.8, stock: 249, volume: '500 мл', category: 'bottles' },
        { name: 'Бутылка 0,500 л. Бугельная бесцветная', price: 47.8, stock: 380, volume: '500 мл', category: 'bottles' },
        { name: 'Бутылка 0,750 л. Бугельная Bordo classic LM виноградная', price: 53.6, stock: 378, volume: '750 мл', category: 'bottles' },
        { name: 'Бутылка 1 литр. Бугельная бесцветная П-32-10-1000', price: 89.3, stock: 301, volume: '1 л', category: 'bottles' },
        { name: 'Бутылка 1 литр. Винная WINE1 d66', price: 31.0, stock: 397, volume: '1 л', category: 'bottles', diameter: 'd66' },
        { name: 'Бутылка 1,5 л. "Традиция" бронза', price: 472.5, stock: 5, volume: '1.5 л', category: 'bottles' },
        { name: 'Бутылка 3 л. "Ностальгия"', price: 524.0, stock: 1, volume: '3 л', category: 'bottles' },
        { name: 'Бутылка 3 л. "Ностальгия" бронза', price: 892.5, stock: 2, volume: '3 л', category: 'bottles' },
        { name: 'Бутылка 3 л. "Ностальгия" зелёная', price: 892.5, stock: 2, volume: '3 л', category: 'bottles' },
        { name: 'Бутылка 3 л. "Ностальгия" чёрная', price: 892.5, stock: 5, volume: '3 л', category: 'bottles' },
        { name: 'Бутылка 12 л. "GARRAFA CABERNET" с пробкой', price: 3675.0, stock: 5, volume: '12 л', category: 'bottles' },
        
        // Бутыли
        { name: 'Бутыль 3л "Дамижана"', price: 892.5, stock: 8, volume: '3 л', category: 'carboys', diameter: 'd38' },
        { name: 'Бутыль 5л "Виноград" ТО d38 (зеленый)', price: 1050.0, stock: 6, volume: '5 л', category: 'carboys', diameter: 'd38' },
        { name: 'Бутыль 10л "Казак" ТО d58 (прозрачный)', price: 1215.0, stock: 5, volume: '10 л', category: 'carboys', diameter: 'd58' },
        { name: 'Бутыль 15л "Казак" ТО d58 (зеленый)', price: 2205.0, stock: 5, volume: '15 л', category: 'carboys', diameter: 'd58' },
        { name: 'Пэт-бутыль 18,9 л голубая № 1 с ручкой', price: 378.0, stock: 5, volume: '18.9 л', category: 'carboys' },

        // --- КРЫШКИ И КОЛПАЧКИ ---
        { name: 'Крышка d43 мм белая', price: 8.8, stock: 2669, volume: '—', category: 'lids', diameter: 'd43' },
        { name: 'Крышка d43 мм золото Магол', price: 5.5, stock: 4420, volume: '—', category: 'lids', diameter: 'd43' },
        { name: 'Крышка d48 мм золото', price: 6.9, stock: 9214, volume: '—', category: 'lids', diameter: 'd48' },
        { name: 'Крышка d58 мм "Пчелка"', price: 6.8, stock: 637, volume: '—', category: 'lids', diameter: 'd58' },
        { name: 'Крышка d58 мм DEEP серебро', price: 13.1, stock: 1058, volume: '—', category: 'lids', diameter: 'd58' },
        { name: 'Крышка d58 мм золото г. Елабуга', price: 6.0, stock: 12301, volume: '—', category: 'lids', diameter: 'd58' },
        { name: 'Крышка d66 мм DEEP золото Китай', price: 16.4, stock: 949, volume: '—', category: 'lids', diameter: 'd66' },
        { name: 'Крышка d66 мм белая г. Елабуга', price: 7.4, stock: 7524, volume: '—', category: 'lids', diameter: 'd66' },
        { name: 'Крышка d66 мм чёрная г. Елабуга', price: 7.4, stock: 12952, volume: '—', category: 'lids', diameter: 'd66' },
        { name: 'Крышка d82 мм "Пчелка"', price: 16.8, stock: 700, volume: '—', category: 'lids', diameter: 'd82' },
        { name: 'Крышка d82 мм белая г. Елабуга', price: 8.9, stock: 9786, volume: '—', category: 'lids', diameter: 'd82' },
        { name: 'Крышка d82 мм золотая г. Елабуга', price: 8.9, stock: 7904, volume: '—', category: 'lids', diameter: 'd82' },
        { name: 'Крышка d82 СКО "Автоклавирование" г. Елабуга', price: 7.5, stock: 2250, volume: '—', category: 'lids', diameter: 'd82' },
        { name: 'Крышка d100 мм золото г. Елабуга', price: 12.1, stock: 209, volume: '—', category: 'lids', diameter: 'd100' },
        { name: 'Колпачок 28 мм Двухкомпонентный Белый', price: 1.1, stock: 2752, volume: '—', category: 'lids', diameter: '28 мм' },
        { name: 'Колпачок 28 мм Черный 99222 S', price: 1.1, stock: 3199, volume: '—', category: 'lids', diameter: '28 мм' },
        { name: 'Термоусадочный колпачок золото с алюм. верхом ТУК-А-30 мм', price: 4.2, stock: 485, volume: '—', category: 'lids', diameter: '30 мм' },

        // --- ЕМКОСТИ (Баки, Бочки, Ведра, Канистры) ---
        { name: 'Бак 110 л. оцинкованный с крышкой', price: 2625.0, stock: 1, volume: '110 л', category: 'containers' },
        { name: 'Бак 32 л. оцинкованный с крышкой и краном', price: 1155.0, stock: 1, volume: '32 л', category: 'containers' },
        { name: 'Бак хозяйственный 100л', price: 1417.5, stock: 8, volume: '100 л', category: 'containers' },
        { name: 'Бочка -бак 200 л круглая с крышкой', price: 3412.5, stock: 2, volume: '200 л', category: 'containers' },
        { name: 'Бочка 50 л круглая', price: 1554.0, stock: 5, volume: '50 л', category: 'containers' },
        { name: 'Канистра 10 л. со сливом', price: 304.5, stock: 11, volume: '10 л', category: 'containers' },
        { name: 'Канистра 20 л. "Бочонок"', price: 577.5, stock: 1, volume: '20 л', category: 'containers' },
        { name: 'Канистра 25 л. "Бочонок"', price: 588.0, stock: 13, volume: '25 л', category: 'containers' },
        { name: 'Канистра- Бочка 50л."Байкал- эконом"', price: 819.0, stock: 2, volume: '50 л', category: 'containers' },
        { name: 'Ведро 10 л. с крышкой (АП 053)', price: 273.0, stock: 6, volume: '10 л', category: 'containers' },
        { name: 'Ведро 15 л. прямоугольное', price: 210.0, stock: 16, volume: '15 л', category: 'containers' },
        { name: 'Ведро оцинкованное 12 литров', price: 315.0, stock: 5, volume: '12 л', category: 'containers' },
        { name: 'Фляга 60 литров (Арт.5004-окр)', price: 1312.5, stock: 8, volume: '60 л', category: 'containers' },

        // --- АГРОТОВАРЫ ---
        { name: 'АГРО 160 чёрный, ширина 1,6м/120 п.м', price: 89.3, stock: 58.5, volume: '1.6 м', category: 'agriculture', unit: 'пог.м' },
        { name: 'АГРОтекстиль 100" белый 3,20 Тула/100м', price: 105.0, stock: 59.7, volume: '3.2 м', category: 'agriculture', unit: 'пог.м' },
        { name: 'Плёнка п/э, Н, рукав, 0,100*(1500*2) 22,5кг - 100 п/м', price: 74.0, stock: 1147.8, volume: '1.5 м', category: 'agriculture', unit: 'пог.м' },
        { name: 'Плёнка воздушно-пузырьковая ВПП 2-10-65/1,6м/100 п.м.', price: 36.8, stock: 616.3, volume: '1.6 м', category: 'agriculture', unit: 'пог.м' },
        { name: 'Пленка голубая для пруда 0,350*(1500*2)/50', price: 262.5, stock: 103.4, volume: '1.5 м', category: 'agriculture', unit: 'пог.м' },
        { name: 'Парник 6,5м /Агротекс № 35/дуга 2м/20мм/колышки, клипсы', price: 577.5, stock: 1, volume: '6.5 м', category: 'agriculture' },
        { name: 'Вставка теплицы "Малыш" 2м*2м', price: 3465.0, stock: 2, volume: '4 м²', category: 'agriculture' },
        { name: 'Каркас теплицы "Малыш" 2м*4м', price: 14070.0, stock: 2, volume: '8 м²', category: 'agriculture' },
        { name: 'Пруд п/э 480 литров круглый (133*133*42см) чёрный', price: 6037.5, stock: 1, volume: '480 л', category: 'agriculture' },

        // --- ТОВАРЫ ДЛЯ ДОМА И ДАЧИ ---
        { name: 'Автоклав 27 л Беларусский с биметрическим термометром', price: 6615.0, stock: 5, volume: '27 л', category: 'home' },
        { name: 'Автоклав 33 л Беларусский с биметрическим термометром', price: 7927.5, stock: 7, volume: '33 л', category: 'home' },
        { name: 'Казан 10л чугунный с алюм. крышкой с дужкой/MANOLI', price: 6436.5, stock: 1, volume: '10 л', category: 'home' },
        { name: 'Казан 6л чугунный с чугун. крышкой-ск./МАNOLI', price: 5381.3, stock: 1, volume: '6 л', category: 'home' },
        { name: 'Мангал сталь 0,4мм (350*250*350) сборный', price: 262.5, stock: 19, volume: '—', category: 'home' },
        { name: 'Мангал сталь 1,5мм (700*300*700) сборный', price: 2257.5, stock: 2, volume: '—', category: 'home' },
        { name: 'Коптильня большая с поддоном (500*270*175)', price: 1312.5, stock: 7, volume: '—', category: 'home' },
        { name: 'Дрожжи "TURBO MegaPack" 100 литров', price: 451.5, stock: 10, volume: '100 л', category: 'home' },
        { name: 'Декстроза 1 кг', price: 262.5, stock: 6, volume: '1 кг', category: 'home' },
        { name: 'Чай Дары тайги Алтайский (краф пакет)', price: 246.8, stock: 2, volume: '—', category: 'home' },
        { name: 'Самогонный аппарат Славянка Премиум 20 литров', price: 6630.8, stock: 1, volume: '20 л', category: 'home' },
        
        // --- БАННЫЕ ПРИНАДЛЕЖНОСТИ ---
        { name: 'Абажур "Волна" угловой, липа, 27*10,5*30,5см "Банные штучки"', price: 456.8, stock: 7, volume: '—', category: 'home' },
        { name: 'Веник бамбуковый массажный "Банные штучки"', price: 367.5, stock: 13, volume: '—', category: 'home' },
        { name: 'Вешалка 3-х рожковая, липа, 25*6,5*7 "Банные штучки"', price: 189.0, stock: 9, volume: '—', category: 'home' },
        { name: 'Подголовник липовый, мягкий 30,5*30*9,5 "Банные штучки"', price: 735.0, stock: 1, volume: '—', category: 'home' },
        { name: 'Термометр "Банщик" 23*10*3см для бани и сауны', price: 1102.5, stock: 6, volume: '—', category: 'home' },
        { name: 'Часы кварцевые в предбанник " С легким паром" 27*0,6 см', price: 577.5, stock: 1, volume: '—', category: 'home' },

        // --- ИНСТРУМЕНТЫ ---
        { name: 'Лопата "БОГАТЫРЬ №2" 480*360мм с метал. черенком', price: 346.5, stock: 13, volume: '—', category: 'tools' },
        { name: 'Лопата "РУСИЧ-7" оцинкованная 428*375*0,8мм', price: 346.5, stock: 9, volume: '—', category: 'tools' },
        { name: 'Вилы 4-х рогие кованные', price: 336.0, stock: 37, volume: '—', category: 'tools' },
        { name: 'Метла хоз. с круглым основанием с 4 решётками', price: 233.0, stock: 369, volume: '—', category: 'tools' },
        { name: 'Скрепер для снега "Таран" на колёсах 68*63см', price: 1650.0, stock: 9, volume: '—', category: 'tools' },
        { name: 'Санки детские ВЭЛ-4ДК (2 пласт. колеса)', price: 892.5, stock: 24, volume: '—', category: 'tools' }
    ];

    // Добавляем поля id и inStock
    return data.map((item, index) => ({
        ...item,
        id: index + 1,
        inStock: item.stock > 0
    }));
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initCatalog();
});
