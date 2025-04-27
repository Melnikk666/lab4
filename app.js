let canSearch = true; // Контроль возможности поиска

// Функция для поиска репозиториев на GitHub
async function searchRepos() {
    const errorMessage = document.getElementById('errorMessage');
    
    if (!canSearch) {
        errorMessage.textContent = 'Пожалуйста, подождите 10 секунд перед следующим поиском.';
        return; // Если поиск запрещён — показываем ошибку и ничего не делаем
    }

    canSearch = false; // Блокируем возможность поиска

    let query = document.getElementById('searchQuery').value.trim(); // Убираем пробелы по краям

    // Заменяем несколько пробелов между словами на один
    query = query.replace(/\s+/g, ' '); 

    // Проверка на пустой запрос
    if (!query) {
        errorMessage.textContent = 'Пожалуйста, введите ключевое слово для поиска.';
        canSearch = true; // Разрешить снова поиск
        return;
    }

    // Проверка на наличие пробела в начале запроса
    if (query.startsWith(' ')) {
        errorMessage.textContent = 'Запрос не должен начинаться с пробела.';
        canSearch = true; // Разрешить снова поиск
        return;
    }

    // Проверка на длину строки (максимум 40 символов)
    if (query.length > 40) {
        errorMessage.textContent = 'Запрос не должен превышать 40 символов.';
        canSearch = true; // Разрешить снова поиск
        return;
    }

    // Очистить сообщения об ошибках и список
    errorMessage.textContent = '';
    const repoList = document.getElementById('repoList');
    repoList.innerHTML = '';
    const backButton = document.getElementById('backButton');

    try {
        // Запрос к GitHub API
        const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=20`);
        
        // Проверка успешности запроса
        if (!response.ok) {
            throw new Error('Ошибка при получении данных с GitHub');
        }

        const data = await response.json();

        // Проверка наличия результатов
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
    } finally {
        // Разрешить новый поиск через 10 секунд
        setTimeout(() => {
            canSearch = true;
        }, 10000); // Задержка 10 секунд
    }
}

// Функция для возврата на начальную страницу
function goBack() {
    const backButton = document.getElementById('backButton');
    const repoList = document.getElementById('repoList');
    const errorMessage = document.getElementById('errorMessage');
    const searchQuery = document.getElementById('searchQuery');

    // Очистить результаты поиска
    repoList.innerHTML = '';
    errorMessage.textContent = '';
    searchQuery.value = '';

    // Скрыть кнопку "Назад"
    backButton.style.display = 'none';
}

// Функция, которая не позволяет вводить пробел в начале запроса и заменяет несколько пробелов между словами на один
document.getElementById('searchQuery').addEventListener('input', function(event) {
    let value = event.target.value;

    // Если первый символ пробел, то удаляем его
    if (value.startsWith(' ')) {
        event.target.value = value.slice(1); // Убираем пробел в начале
    }

    // Заменяем несколько пробелов между словами на один
    event.target.value = event.target.value.replace(/\s+/g, ' ');

    // Ограничиваем количество символов до 40
    if (event.target.value.length > 40) {
        event.target.value = event.target.value.slice(0, 40); // Обрезаем строку до 40 символов
    }
});
