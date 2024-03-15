const userModel = require("../model/user.model");
const recipeModel = require("../model/recipe.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt.config')
const {basename} = require("path");

const generateAccessToken = (user_id, role) => {
    const payload = {
        user_id,
        role
    };
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class ApiController{


    async getLogin(req, res) {
        try {
            const {username, password} = req.body;
            if (!await userModel.checkLogin(username)) {
                return res.json({message: "Пользователь с таким username не существует"});
            }

            const hashPassword = await userModel.getPassword(username);
            const validPassword = bcrypt.compareSync(password, hashPassword);
            if (!validPassword) return res.json({message: 'Введён неверный пароль'});

            const {id, role} = await userModel.getIdAndRole(username);

            const token = generateAccessToken(id, role);
            return res.json({token, message: 'Пользователь успешно авторизирован'});

        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'});
        }
    }

    async postRegistration(req, res) {
        try {
            const {first_name, last_name, username, password} = req.body;
            if (await userModel.checkLogin(username)) {
                return res.json({message: "Пользователь с таким username существует"})
            }
            const role = 1;
            const hashPassword = bcrypt.hashSync(password, 5);
            await userModel.createUser(first_name, last_name, username, hashPassword, role);

            return res.json({message: "Пользователь успешно зарегистрирован"})

        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'})
        }
    }

    async postAddRecipe(req, res) {
        const userId = req.user.user_id;
        const { name } = req.body;
        const photoFileName = basename(req.file.path);

        const ingredients = req.body.ingredients || [];
        const cookingSteps = req.body.cookingSteps || [];

        const recipe_id = await recipeModel.addRecipe(name, photoFileName, userId);

        for (const ingredient of ingredients) {
            await recipeModel.addIngredient(ingredient, recipe_id);
        }

        for (const step of cookingSteps) {
            await recipeModel.addStep(step, recipe_id);
        }

        res.json({
            success: true,
            message: 'Рецепт успешно добавлен',
            data: {
                name: name,
                photoPath: photoFileName,
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

    async changeRecipe(req, res) {
        const recipe_id = req.params.id;
        let { name, fileChange } = req.body;
        if (fileChange === 'true') {
            const photoFileName = basename(req.file.path);
            await recipeModel.changeFile(recipe_id, photoFileName);
        }

        await recipeModel.changeName(recipe_id, name);

        const ingredients = req.body.ingredients || [];
        const cookingSteps = req.body.cookingSteps || [];

        await recipeModel.deleteIngById(recipe_id);
        await recipeModel.deleteStepById(recipe_id);

        for (const ingredient of ingredients) {
            await recipeModel.addIngredient(ingredient, recipe_id);
        }

        for (const step of cookingSteps) {
            await recipeModel.addStep(step, recipe_id);
        }

        res.json({
            success: true,
            message: 'Рецепт успешно изменён',
            data: {
                name: name,
                ingredients: ingredients,
                cookingSteps: cookingSteps
            }
        });
    }

    async addFavorite(req, res) {
        const user_id = req.user.user_id;
        const recipe_id = req.body.recipe_id;

        await recipeModel.addFavorite(user_id, recipe_id);

        res.status(200).json({ message: 'Добавлено в избранное' });

    }

    async deleteFavorite(req, res) {
        const user_id = req.user.user_id;
        const recipe_id = req.body.recipe_id;

        await recipeModel.deleteFavorite(user_id, recipe_id);

        res.status(200).json({ message: 'Удалено из избранных' });
    }



}

module.exports = new ApiController();