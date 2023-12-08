const Router = require('express');
const router = new Router();
const mainController = require("../controller/main.controller");

router.get('/', mainController.getMain);
router.get('/about', mainController.getAbout);
router.get('/add-recipe', mainController.getAddRecipe);
router.get('/auth', mainController.getAuth);
router.get('/contact', mainController.getContact);
router.get('/favorite', mainController.getFavorite);
router.get('/recipe', mainController.getRecipe);
router.get('/recipe/page', mainController.getPageRecipe);
router.get('/recipe/:id', mainController.getOneRecipe);
router.get('/registration', mainController.getRegistration);
router.get('/logout', mainController.logout);
router.get('/user', mainController.getUser);


module.exports = router;