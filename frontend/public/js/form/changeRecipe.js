let fileChange = false;
document.querySelector('.input-img').addEventListener('change', () => {
    fileChange = true;
})


document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;

    const photo = document.getElementById('photo').files[0];

    const ingredientsList = document.querySelectorAll('ul li input[type="text"]');
    const ingredients = Array.from(ingredientsList).map(ingredient => ingredient.value);

    const cookingStepsList = document.querySelectorAll('ol li input[type="text"]');
    const cookingSteps = Array.from(cookingStepsList).map(step => step.value);


    const id = document.querySelector('h1').getAttribute('data-id');

    try {
        const response = await axios.put(`/api/recipe/change/${id}`, {
            name,
            photo,
            ingredients,
            cookingSteps,
            fileChange
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('Ответ от сервера:', response.data);
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
});