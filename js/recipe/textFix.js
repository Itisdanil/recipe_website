document.addEventListener("DOMContentLoaded", function() {
    const recipeNames = document.querySelectorAll(".recipe-name");

    recipeNames.forEach(function(name) {
        if (name.textContent.length > 32) {
            name.textContent = name.textContent.slice(0, 29) + "...";
        }
    });
});