// Получаем элементы
const searchQuery = document.getElementById('searchQuery');
const repoList = document.getElementById('repoList');
const errorMessage = document.getElementById('errorMessage');
const backButton = document.getElementById('backButton');

// Показать кнопку "Назад"
function showBackButton() {
    backButton.classList.add('show');
}

// Скрыть кнопку "Назад"
function hideBackButton() {
    backButton.classList.remove('show');
}

// Функция поиска репозиториев
async function searchRepos() {
    const query = searchQuery.value.trim();

    // Очистка
    errorMessage.textContent = '';
    repoList.innerHTML = '';

    if (!query) {
        errorMessage.textContent = 'Пожалуйста, введите ключевое слово для поиска.';
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=50`);
        
        if (!response.ok) {
            throw new Error('Ошибка при получении данных с GitHub');
        }

        const data = await response.json();

        if (data.items.length === 0) {
            errorMessage.textContent = 'Нет репозиториев по данному запросу.';
            return;
        }

        data.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('repo-item');
            listItem.innerHTML = `
                <h3><a href="${item.html_url}" target="_blank">${item.name}</a></h3>
                <p>${item.description || 'Нет описания'}</p>
                <p><strong>Автор:</strong> ${item.owner.login}</p>
            `;
            repoList.appendChild(listItem);
        });

        showBackButton();
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        errorMessage.textContent = 'Произошла ошибка при поиске репозиториев. Попробуйте позже.';
    }
}

// Функция для возврата на начальную страницу
function goBack() {
    searchQuery.value = '';
    repoList.innerHTML = '';
    errorMessage.textContent = '';
    hideBackButton();
}
