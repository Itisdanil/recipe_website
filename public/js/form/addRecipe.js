document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const photo = document.getElementById('photo').files[0];

    const ingredientsList = document.querySelectorAll('ul li input[type="text"]');
    const ingredients = Array.from(ingredientsList).map(ingredient => ingredient.value);

    const cookingStepsList = document.querySelectorAll('ol li input[type="text"]');
    const cookingSteps = Array.from(cookingStepsList).map(step => step.value);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('photo', photo);

    ingredients.forEach((ingredient, index) => {
        formData.append(`ingredients[${index}]`, ingredient);
    });

    cookingSteps.forEach((step, index) => {
        formData.append(`cookingSteps[${index}]`, step);
    });

    try {
        const response = await axios.post('/api/addRecipe', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('Ответ от сервера:', response.data);
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
});