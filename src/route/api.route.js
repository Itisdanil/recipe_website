const Router = require('express');
const router = new Router();
const apiController = require("../controller/api.controller");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Графики и диаграммы

router.get('/recipe/difficulty', apiController.getRecipeDiff);
router.get('/visitors', apiController.getVisitors);
router.get('/recipes-by-country', apiController.getRecipesByCountry);
router.get('/dish-types', apiController.getDishTypes);
router.get('/popular-recipes-visits', apiController.getPopularRecipesVisits);


// Формы

router.post('/login', apiController.getLogin);
router.post('/registration', apiController.postRegistration);
router.post('/addRecipe', upload.single('photo'), apiController.postAddRecipe);
router.post('/feedback', apiController.postFeedback);





router.put('/recipe/change/:id', upload.single('photo'), apiController.changeRecipe);


router.post('/recipe/favorite', apiController.addFavorite);
router.delete('/recipe/favorite', apiController.deleteFavorite);








module.exports = router;