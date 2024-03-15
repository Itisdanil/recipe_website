const Router = require('express');
const router = new Router();
const apiController = require("../controller/api.controller");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'frontend', 'public', 'image', 'recipe'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


// Формы

router.post('/login', apiController.getLogin);
router.post('/registration', apiController.postRegistration);
router.post('/addRecipe', upload.single('photo'), apiController.postAddRecipe);
router.post('/feedback', apiController.postFeedback);



router.put('/recipe/change/:id', upload.single('photo'), apiController.changeRecipe);


router.post('/recipe/favorite', apiController.addFavorite);
router.delete('/recipe/favorite', apiController.deleteFavorite);








module.exports = router;