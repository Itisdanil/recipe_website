const path = require('path');
const ejs = require('ejs');

const userModel = require('../model/user.model');
const recipeModel = require("../model/recipe.model");

const RECIPE_IN_PAGE = 9;

class MainController{

    async getMain(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'index.ejs');

        const role = req.user.role;
        let html = await ejs.renderFile(template, { role });

        res.send(html);
    }

    async getAbout(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'about.ejs');

        const role = req.user.role;
        let html = await ejs.renderFile(template, { role });


        res.send(html);
    }

    async getContact(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'contact.ejs');

        const role = req.user.role;
        let html = await ejs.renderFile(template, { role });


        res.send(html);
    }

    async getAddRecipe(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'add-recipe.ejs');

        const role = req.user.role;
        let html = await ejs.renderFile(template, { role });


        res.send(html);
    }

    async getFavorite(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'favorite.ejs');

        const user_id = req.user.user_id;
        const recipes = await recipeModel.getAllRecipeByFavorite(user_id);

        const role = req.user.role;
        let html = await ejs.renderFile(template, { role, recipes });


        res.send(html);
    }

    async getOneRecipe(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'one-recipe.ejs');

        const recipeId = parseInt(req.params.id);

        const recipe = await recipeModel.getRecipe(recipeId);
        const ingredients = await recipeModel.getIngredients(recipeId)
        const steps = await recipeModel.getSteps(recipeId)

        const role = req.user.role;
        const id = req.user.user_id;
        let html = await ejs.renderFile(template, { role, recipe, ingredients, steps, id });


        res.send(html);
    }

    async getRecipe(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'recipe.ejs');

        let pageNumber = req.query.page;
        if (!pageNumber || pageNumber < 1) pageNumber = 1;

        const role = req.user.role;

        let html = await ejs.renderFile(template, { role, pageNumber });


        res.send(html);
    }

    async getPageRecipe(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'recipe-page.ejs');
        let pageNumber = req.query.page;
        if (!pageNumber || pageNumber < 1) pageNumber = 1;

        const countRecipe = parseInt(await recipeModel.countRecipe());
        if (countRecipe + RECIPE_IN_PAGE <= pageNumber * RECIPE_IN_PAGE) pageNumber = 1;

        const offset = (pageNumber - 1) * RECIPE_IN_PAGE;
        const recipes = await recipeModel.getAllRecipe(RECIPE_IN_PAGE, offset);

        const role = req.user.role;
        const user_id = req.user.user_id;

        for(let recipe of recipes) {
            recipe.favorite = await recipeModel.checkFavorite(user_id, recipe.id);
        }

        let html = await ejs.renderFile(template, { recipes, role });
        res.send(html);
    }

    async getAuth(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'auth.ejs');
        let html = await ejs.renderFile(template);

        res.send(html);
    }


    async getRegistration(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'registration.ejs');
        let html = await ejs.renderFile(template);

        res.send(html);
    }


    async getUser(req, res) {
        const template = path.join(__dirname, '..', '..', 'frontend', 'view', 'user.ejs');

        const role = req.user.role;
        const user = await userModel.getUser(req.user.user_id);
        const recipes = await recipeModel.getAllRecipeByCreate(req.user.user_id);


        let html = await ejs.renderFile(template, { role, user, recipes });

        res.send(html);
    }

    async logout(req, res) {
        res.clearCookie('token');
        res.redirect('/');
    }

}

module.exports = new MainController();