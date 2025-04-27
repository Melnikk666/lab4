// Функция для поиска репозиториев на GitHub
async function searchRepos() {
    const query = document.getElementById('searchQuery').value;
    const repoList = document.getElementById('repoList');
    const errorMessage = document.getElementById('errorMessage');
    const backButton = document.getElementById('backButton');

    // Очистить сообщения об ошибках и список
    errorMessage.textContent = '';
    repoList.innerHTML = '';

    // Проверка на пустой запрос
    if (!query) {
        errorMessage.textContent = 'Пожалуйста, введите ключевое слово для поиска.';
        return;
    }

    try {
        // Делаем запрос к GitHub API
        const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=2000`);
        
        // Проверяем, если API вернул ошибку
        if (!response.ok) {
            throw new Error('Ошибка при получении данных с GitHub');
        }

        // Преобразуем ответ в JSON
        const data = await response.json();

        // Проверяем, есть ли результаты
        if (data.items.length === 0) {
            errorMessage.textContent = 'Нет репозиториев по данному запросу.';
            return;
        }

        // Заполняем список репозиториев
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

        // Показать кнопку "Назад"
        backButton.style.display = 'inline-block';
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        errorMessage.textContent = 'Произошла ошибка при поиске репозиториев. Попробуйте позже.';
    }
}

// Функция для возврата на начальную страницу
function goBack() {
    const backButton = document.getElementById('backButton');
    const repoList = document.getElementById('repoList');
    const errorMessage = document.getElementById('errorMessage');
    const searchQuery = document.getElementById('searchQuery');

    // Очистить результаты
    repoList.innerHTML = '';
    errorMessage.textContent = '';
    searchQuery.value = '';

    // Скрыть кнопку "Назад"
    backButton.style.display = 'none';
}
