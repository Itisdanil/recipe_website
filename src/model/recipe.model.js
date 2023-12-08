const pool = require('../config/db.config');

class RecipeModel {

    async addRecipe(name, path_photo, creater_id) {
        const query = await pool.query('INSERT INTO recipe (name, path_photo, creater_id)' +
            ' VALUES ($1, $2, $3) RETURNING id', [name, path_photo, creater_id]);
        return query.rows[0].id;
    }

    async addIngredient(ingredient, recipeId) {
        const query = await pool.query('INSERT INTO ingredient (info, recipe_id) VALUES ($1, $2)',
            [ingredient, recipeId]);
        return 'OK';
    }

    async addStep(step, recipeId) {
        const query = await pool.query('INSERT INTO step (info, recipe_id) VALUES ($1, $2)',
            [step, recipeId]);
        return 'OK';
    }

    async getIngredients(recipeId) {
        const query = await pool.query('select * from ingredient where recipe_id = $1',
            [recipeId]);
        return query.rows;
    }

    async getSteps(recipeId) {
        const query = await pool.query('select * from step where recipe_id = $1',
            [recipeId]);
        return query.rows;
    }

    async getAllRecipe(pageSize, offset) {
        const query = await pool.query('SELECT * FROM recipe ORDER BY id LIMIT $1 OFFSET $2;',
            [pageSize, offset]);
        return query.rows;
    }

    async getRecipe(id) {
        const query = await pool.query('SELECT * FROM recipe WHERE id = $1;',
            [id]);
        return query.rows[0];
    }

    async countRecipe() {
        const query = await pool.query('select count(*) as count from recipe');
        return query.rows[0].count;
    }

    async deleteById(id) {
        await pool.query('delete from ingredient where recipe_id = $1;', [id]);
        await pool.query('delete from step where recipe_id = $1;', [id]);
        await pool.query('delete from favorite where recipe_id = $1;', [id]);
        await pool.query('delete from recipe where id = $1;', [id]);

        return 'OK';
    }

    async deleteIngById(id) {
        await pool.query('delete from ingredient where recipe_id = $1;', [id]);
        return 'OK';
    }

    async deleteStepById(id) {
        await pool.query('delete from step where recipe_id = $1;', [id]);
        return 'OK';
    }

    async changeFile(id, path) {
        let query = 'update recipe set path_photo = $1 where id = $2;';
        await pool.query(query, [path, id]);

        return 'OK';
    }

    async changeName(id, name) {
        let query = 'update recipe set name = $1 where id = $2;';
        await pool.query(query, [name, id]);

        return 'OK';
    }

    async addFavorite(user_id, recipe_id) {
        let query = 'insert into favorite(user_id, recipe_id) values ($1, $2);';
        await pool.query(query, [user_id, recipe_id]);

        return 'OK';
    }

    async deleteFavorite(user_id, recipe_id) {
        let query = 'delete from favorite where user_id = $1 and recipe_id = $2;';
        await pool.query(query, [user_id, recipe_id]);

        return 'OK';
    }

    async checkFavorite(user_id, recipe_id) {
        let query = 'select id from favorite where user_id = $1 and recipe_id = $2;';
        const result = await pool.query(query, [user_id, recipe_id]);

        return Boolean(result.rows[0]);
    }

    async getAllRecipeByFavorite(user_id) {
        let query = 'select * from recipe, favorite where user_id = $1 and recipe_id = recipe.id;';
        const result = await pool.query(query, [user_id]);

        return result.rows;
    }

    async getAllRecipeByCreate(user_id) {
        let query = 'select * from recipe where creater_id = $1;';
        const result = await pool.query(query, [user_id]);

        return result.rows;
    }


}

module.exports = new RecipeModel();