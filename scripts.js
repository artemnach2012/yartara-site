class NewsManager {
    constructor() {
        this.news = this.loadNews();
        this.editingIndex = -1;
        this.init();
    }

    init() {
        this.renderNews();
        document.getElementById('newsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNews();
        });
    }

    // Загрузка новостей из localStorage
    loadNews() {
        try {
            const savedNews = localStorage.getItem('storeNews');
            return savedNews ? JSON.parse(savedNews) : [];
        } catch (error) {
            console.error('Ошибка при загрузке новостей:', error);
            return [];
        }
    }

    // Сохранение новостей в localStorage
    saveNews() {
        try {
            localStorage.setItem('storeNews', JSON.stringify(this.news));
        } catch (error) {
            console.error('Ошибка при сохранении новостей:', error);
            this.showNotification('Ошибка при сохранении данных', 'error');
        }
    }

    // Добавление новой новости или сохранение изменений
    addNews() {
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();

        if (!title || !content) {
            this.showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }

        if (title.length < 3) {
            this.showNotification('Заголовок должен содержать минимум 3 символа', 'error');
            return;
        }

        if (content.length < 10) {
            this.showNotification('Описание должно содержать минимум 10 символов', 'error');
            return;
        }

        const now = new Date();
        const newsItem = {
            id: Date.now(),
            title,
            content,
            date: now.toLocaleString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            timestamp: now.getTime()
        };

        if (this.editingIndex >= 0) {
            // Редактирование существующей новости
            this.news[this.editingIndex] = { ...newsItem, id: this.news[this.editingIndex].id };
            this.editingIndex = -1;
            document.querySelector('.btn').textContent = '📝 Опубликовать обновление';
            this.showNotification('Обновление успешно изменено!', 'success');
        } else {
            // Добавление новой новости
            this.news.unshift(newsItem);
            this.showNotification('Обновление успешно опубликовано!', 'success');
        }

        this.saveNews();
        this.renderNews();
        this.clearForm();
    }

    // Редактирование новости
    editNews(index) {
        const newsItem = this.news[index];
        document.getElementById('title').value = newsItem.title;
        document.getElementById('content').value = newsItem.content;
        this.editingIndex = index;
        document.querySelector('.btn').textContent = '✏️ Сохранить изменения';
        
        // Прокручиваем к форме
        document.querySelector('.add-news-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Фокус на заголовке
        document.getElementById('title').focus();
    }

    // Удаление новости
    deleteNews(index) {
        const newsItem = this.news[index];
        
        if (confirm(`Вы уверены, что хотите удалить обновление "${newsItem.title}"?`)) {
            this.news.splice(index, 1);
            this.saveNews();
            this.renderNews();
            this.showNotification('Обновление удалено', 'success');
        }
    }

    // Очистка формы
    clearForm() {
        document.getElementById('newsForm').reset();
        this.editingIndex = -1;
        document.querySelector('.btn').textContent = '📝 Опубликовать обновление';
    }

    // Отображение новостей
    renderNews() {
        const newsList = document.getElementById('newsList');
        
        if (this.news.length === 0) {
            newsList.innerHTML = `
                <div class="no-news">
                    Пока нет опубликованных обновлений. Добавьте первое обновление выше!
                </div>
            `;
            return;
        }

        // Сортируем новости по времени (новые сверху)
        const sortedNews = [...this.news].sort((a, b) => b.timestamp - a.timestamp);

        newsList.innerHTML = sortedNews.map((news, sortedIndex) => {
            const originalIndex = this.news.findIndex(item => item.id === news.id);
            const shortContent = news.content.length > 150 
                ? news.content.substring(0, 150) + '...' 
                : news.content;
            
            return `
                <div class="news-item">
                    <div class="news-date">📅 ${news.date}</div>
                    <div class="news-title">${this.escapeHtml(news.title)}</div>
                    <div class="news-content">${this.escapeHtml(shortContent).replace(/\n/g, '<br>')}</div>
                    <button class="edit-btn" onclick="newsManager.editNews(${originalIndex})" title="Редактировать">
                        ✏️ Редактировать
                    </button>
                    <button class="delete-btn" onclick="newsManager.deleteNews(${originalIndex})" title="Удалить">
                        🗑️ Удалить
                    </button>
                </div>
            `;
        }).join('');
    }

    // Безопасное отображение HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Показ уведомлений
    showNotification(message, type = 'success') {
        // Удаляем существующие уведомления
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        // Автоматическое удаление через 3 секунды
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Экспорт данных
    exportData() {
        const dataStr = JSON.stringify(this.news, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `news-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Импорт данных
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedNews = JSON.parse(e.target.result);
                if (Array.isArray(importedNews)) {
                    if (confirm('Это действие заменит все существующие данные. Продолжить?')) {
                        this.news = importedNews;
                        this.saveNews();
                        this.renderNews();
                        this.showNotification('Данные успешно импортированы!', 'success');
                    }
                } else {
                    throw new Error('Неверный формат файла');
                }
            } catch (error) {
                this.showNotification('Ошибка при импорте данных', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Поиск новостей
    searchNews(query) {
        if (!query.trim()) {
            this.renderNews();
            return;
        }

        const filteredNews = this.news.filter(news => 
            news.title.toLowerCase().includes(query.toLowerCase()) ||
            news.content.toLowerCase().includes(query.toLowerCase())
        );

        this.renderFilteredNews(filteredNews);
    }

    // Отображение отфильтрованных новостей
    renderFilteredNews(filteredNews) {
        const newsList = document.getElementById('newsList');
        
        if (filteredNews.length === 0) {
            newsList.innerHTML = `
                <div class="no-news">
                    По вашему запросу ничего не найдено.
                </div>
            `;
            return;
        }

        newsList.innerHTML = filteredNews.map(news => {
            const originalIndex = this.news.findIndex(item => item.id === news.id);
            const shortContent = news.content.length > 150 
                ? news.content.substring(0, 150) + '...' 
                : news.content;
            
            return `
                <div class="news-item">
                    <div class="news-date">📅 ${news.date}</div>
                    <div class="news-title">${this.escapeHtml(news.title)}</div>
                    <div class="news-content">${this.escapeHtml(shortContent).replace(/\n/g, '<br>')}</div>
                    <button class="edit-btn" onclick="newsManager.editNews(${originalIndex})">
                        ✏️ Редактировать
                    </button>
                    <button class="delete-btn" onclick="newsManager.deleteNews(${originalIndex})">
                        🗑️ Удалить
                    </button>
                </div>
            `;
        }).join('');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.newsManager = new NewsManager();
    
    // Добавляем обработчик для поиска (если добавим поле поиска)
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            newsManager.searchNews(e.target.value);
        });
    }

    // Обработка клавиш
    document.addEventListener('keydown', (e) => {
        // Escape для отмены редактирования
        if (e.key === 'Escape' && newsManager.editingIndex >= 0) {
            newsManager.clearForm();
            newsManager.showNotification('Редактирование отменено', 'success');
        }
    });
});

// Функции для работы с буфером обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        newsManager.showNotification('Текст скопирован в буфер обмена!', 'success');
    }).catch(() => {
        newsManager.showNotification('Ошибка при копировании', 'error');
    });
}

// Функция для получения статистики
function getStats() {
    const totalNews = newsManager.news.length;
    const today = new Date().toDateString();
    const todayNews = newsManager.news.filter(news => 
        new Date(news.date).toDateString() === today
    ).length;
    
    return {
        total: totalNews,
        today: todayNews,
        thisMonth: newsManager.news.filter(news => {
            const newsDate = new Date(news.date);
            const now = new Date();
            return newsDate.getMonth() === now.getMonth() && 
                   newsDate.getFullYear() === now.getFullYear();
        }).length
    };
}