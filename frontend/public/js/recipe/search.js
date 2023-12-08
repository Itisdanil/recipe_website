document.addEventListener('DOMContentLoaded', function() {
    const recipe = document.querySelector('.search-recipe');
    const ingredient = document.querySelector('.search-ingredient');

    function toggleActive() {
        recipe.classList.toggle('search-active');
        ingredient.classList.toggle('search-active');
    }

    recipe.addEventListener('click', function() {
        toggleActive()
    });

    ingredient.addEventListener('click', function() {
        toggleActive()
    });
});