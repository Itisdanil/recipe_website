const path = require('path');
const ejs = require('ejs');

const userModel = require('../model/user.model');
const recipeModel = require('../model/recipe.model');

class AdminController{

    async getUsers(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'users.ejs');

        const users = await userModel.getAll();
        const role = req.user.role;

        let html = await ejs.renderFile(template, { role, users });

        res.send(html);
    }

    async getChangeRecipe(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'recipe-change.ejs');

        const recipeId = req.params.id;
        const role = req.user.role;

        const recipe = await recipeModel.getRecipe(recipeId);
        const ingredients = await recipeModel.getIngredients(recipeId)
        const steps = await recipeModel.getSteps(recipeId)

        let html = await ejs.renderFile(template, { role, recipe, ingredients, steps });

        res.send(html);
    }

    async updateUser(req, res) {
        const userId = req.params.id;
        let { name, last_name, login, role } = req.body;

        if (role === 'Администратор') role = 2;
        else role = 1;

        try {

            await userModel.updateUser(userId, name, last_name, login, role);

            return res.status(200).json({ message: 'Данные пользователя успешно обновлены' });
        } catch (error) {
            return res.status(500).json({ message: 'Ошибка при обновлении данных пользователя', error: error.message });
        }
    }

    async deleteUser(req, res) {
        const userId = req.params.id;

        try {

            await userModel.deleteById(userId);

            return res.status(200).json({ message: 'Данные пользователя успешно обновлены' });
        } catch (error) {
            return res.status(500).json({ message: 'Ошибка при обновлении данных пользователя', error: error.message });
        }
    }

    async deleteRecipe(req, res) {
        const recipeId = req.params.id;

        try {
            await recipeModel.deleteById(recipeId);

            return res.status(200).json({ message: 'Рецепт удалён' });
        } catch (error) {
            return res.status(500).json({ message: 'Ошибка при удалении рецепта', error: error.message });
        }
    }

}

module.exports = new AdminController();