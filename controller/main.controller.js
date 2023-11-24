const path = require('path');
const ejs = require('ejs');


class MainController{

    async getMain(req, res) {
        const template = path.join(__dirname, '..', 'view', 'index.ejs');
        let html = await ejs.renderFile(template);

        res.send(html);
    }

    async getAbout(req, res) {
        const template = path.join(__dirname, '..', 'view', 'about.ejs');
        let html = await ejs.renderFile(template);

        res.send(html);
    }

    async getContact(req, res) {
        const template = path.join(__dirname, '..', 'view', 'contact.ejs');
        let html = await ejs.renderFile(template);

        res.send(html);
    }

    async getAddRecipe(req, res) {
        const template = path.join(__dirname, '..', 'view', 'add-recipe.ejs');
        let html = await ejs.renderFile(template);

        res.send(html);
    }

    async getAuth(req, res) {
        const template = path.join(__dirname, '..', 'view', 'auth.ejs');
        let html = await ejs.renderFile(template);

        res.send(html);
    }

    async getFavorite(req, res) {
        const template = path.join(__dirname, '..', 'view', 'favorite.ejs');
        let html = await ejs.renderFile(template);

        res.send(html);
    }

    async getOneRecipe(req, res) {
        const template = path.join(__dirname, '..', 'view', 'one-recipe.ejs');
        let html = await ejs.renderFile(template);

        res.send(html);
    }

    async getRecipe(req, res) {
        const template = path.join(__dirname, '..', 'view', 'recipe.ejs');
        let html = await ejs.renderFile(template);

        res.send(html);
    }

    async getRegistration(req, res) {
        const template = path.join(__dirname, '..', 'view', 'registration.ejs');
        let html = await ejs.renderFile(template);

        res.send(html);
    }
}

module.exports = new MainController();