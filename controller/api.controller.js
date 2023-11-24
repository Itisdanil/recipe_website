const path = require('path');
const ejs = require('ejs');



class ApiController{

    async getRecipeDiff(req, res) {
        const fakeRecipeDifficultyData = [
            { _id: 'Простой', count: 25 },
            { _id: 'Средний', count: 40 },
            { _id: 'Сложный', count: 15 }
        ];

        res.json(fakeRecipeDifficultyData);
    }

    async getVisitors(req, res) {
        const visitorsData = [
            { date: '2023-11-01', visitors: 100 },
            { date: '2023-11-02', visitors: 120 },
            { date: '2023-11-03', visitors: 90 },
            { date: '2023-11-04', visitors: 150 },
            { date: '2023-11-05', visitors: 200 },
            { date: '2023-11-06', visitors: 180 },
            { date: '2023-11-07', visitors: 250 }
        ];

        res.json(visitorsData);
    }

    async getRecipesByCountry(req, res) {
        const recipesByCountryData = [
            { country: 'Италия', recipesCount: 150 },
            { country: 'Франция', recipesCount: 120 },
            { country: 'Япония', recipesCount: 199 },
            { country: 'Россия', recipesCount: 253 },
        ];

        res.json(recipesByCountryData);
    }

    async getDishTypes(req, res) {
        const dishTypesData = [
            { type: 'Завтрак', count: 30 },
            { type: 'Обед', count: 50 },
            { type: 'Ужин', count: 40 }
        ];

        res.json(dishTypesData);
    }

    async getPopularRecipesVisits(req, res) {
        const popularRecipesVisitsData = [
            { recipe: 'Борщ', visits: 120 },
            { recipe: 'Пельмени', visits: 90 },
            { recipe: 'Паста карбонара', visits: 85 },
        ];

        res.json(popularRecipesVisitsData);
    }

    async getLogin(req, res) {
        const username = req.query.username;
        const password = req.query.password;

        console.log('username:', username);
        console.log('password:', password);

        res.json({ success: true, message: 'Успешный вход' });
    }

    async postRegistration(req, res) {
        const { firstName, lastName, username, password, agreement } = req.body;
        console.log('firstName:', firstName);
        console.log('lastName:', lastName);
        console.log('username:', username);
        console.log('password:', password);
        console.log('agreement:', agreement);
        res.json({
            success: true,
            message: 'Пользователь успешно зарегистрирован',
            data: {
                firstName: firstName,
                lastName: lastName,
                username: username,
                agreement: agreement
            }
        });
    }

    async postAddRecipe(req, res) {
        const { name } = req.body;
        const photoPath = req.file.path;

        const ingredients = req.body.ingredients || [];
        const cookingSteps = req.body.cookingSteps || [];

        console.log('name:', name);
        console.log('photoPath:', photoPath);
        console.log('ingredients:', ingredients);
        console.log('cookingSteps:', cookingSteps);

        res.json({
            success: true,
            message: 'Рецепт успешно добавлен',
            data: {
                name: name,
                photoPath: photoPath,
                ingredients: ingredients,
                cookingSteps: cookingSteps
            }
        });
    }

    async postFeedback(req, res) {
        const message = req.body.message;

        console.log('Получено новое сообщение:', message);

        res.status(200).json({ message: 'Сообщение успешно получено на сервере' });
    }



}

module.exports = new ApiController();