const Router = require('express');
const router = new Router();
const adminController = require("../controller/admin.controller");


router.get('/users', adminController.getUsers);
router.get('/recipe/change/:id', adminController.getChangeRecipe);


router.put(`/users/update/:id`, adminController.updateUser);


router.delete(`/users/delete/:id`, adminController.deleteUser);
router.delete(`/recipe/delete/:id`, adminController.deleteRecipe);


module.exports = router;