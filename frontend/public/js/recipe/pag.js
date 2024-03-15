const pageInput = document.getElementById('pageInput');
const goToPageBtn = document.querySelector('.pagination-container button');
const recipesContainer = document.querySelector('.recipes');

let searchActive = false;

const curPageNumber = parseInt(pageInput.value);

if (document.getElementById('search').value !== '') {
    searchActive = true;
}

loadRecipes(curPageNumber);


async function loadRecipes(pageNumber) {
    if (searchActive === false) {
        try {
            const response = await axios.get(`/recipe/page`, {params: {page: pageNumber}});
            updateRecipesContainer(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке рецептов:', error);
        }
    } else {
        const searchTerm = document.getElementById('search').value.trim();
        console.log(searchTerm)

        const element = document.querySelector('.search-active');
        const table = element.classList.contains('search-recipe') ? 'recipe' : 'ingredient';
        
        if (searchTerm !== '') {
            try {
                const params = {
                    query: searchTerm,
                    table: table,
                    page: pageNumber
                  };
                const response = await axios.get(`/recipe/search/page`, { params });
                updateRecipesContainer(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке рецептов:', error);
            }
        }
    }

}

document.getElementById('search').addEventListener('keypress', handleKeyPress);

async function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchActive = true;
        const searchTerm = document.getElementById('search').value.trim();
        console.log(searchTerm)

        const element = document.querySelector('.search-active');
        const table = element.classList.contains('search-recipe') ? 'recipe' : 'ingredient';
        
        if (searchTerm !== '') {
            try {
                const params = {
                    query: searchTerm,
                    table: table
                  };
                const response = await axios.get(`/recipe/search`, { params });
                updateRecipesContainer(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке рецептов:', error);
            }
        }
    }
}


goToPageBtn.addEventListener('click', async () => {
    const pageNumber = parseInt(pageInput.value);
    if (!isNaN(pageNumber) && pageNumber > 0) {
        await loadRecipes(pageNumber);
    } else {
        console.error('Некорректный номер страницы');
    }
});

function updateRecipesContainer(newHTML) {
    recipesContainer.innerHTML = '';
    recipesContainer.innerHTML = newHTML;
    favoriteLoad();
}

async function favoriteLoad() {
    const favorites = document.querySelectorAll('.favorite-img');

    favorites.forEach(favorite => {
        favorite.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault()
            if (favorite.getAttribute('src') === '/image/favorite/favorite-off.png') {
                favorite.setAttribute('src', '/image/favorite/favorite-on.png')

                axios.post('/api/recipe/favorite', {
                    recipe_id: favorite.getAttribute('data-id')
                }).catch(error => {
                    console.error('Ошибка запроса:', error);
                });
            } else {
                favorite.setAttribute('src', '/image/favorite/favorite-off.png')

                axios.delete('/api/recipe/favorite', {data: {
                    recipe_id: favorite.getAttribute('data-id')
                }}).catch(error => {
                    console.error('Ошибка запроса:', error);
                });
            }
        });
    })
}


