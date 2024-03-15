const path = require("path");
const ejs = require("ejs");
const { exec } = require("child_process");

const userModel = require("../model/user.model");
const recipeModel = require("../model/recipe.model");

const RECIPE_IN_PAGE = 9;

class MainController {
  async getMain(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "index.ejs"
    );

    const role = req.user.role;
    let html = await ejs.renderFile(template, { role });

    res.send(html);
  }

  async getAbout(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "about.ejs"
    );

    const role = req.user.role;
    let html = await ejs.renderFile(template, { role });

    res.send(html);
  }

  async getContact(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "contact.ejs"
    );

    const role = req.user.role;
    let html = await ejs.renderFile(template, { role });

    res.send(html);
  }

  async getAddRecipe(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "add-recipe.ejs"
    );

    const role = req.user.role;
    let html = await ejs.renderFile(template, { role });

    res.send(html);
  }

  async getFavorite(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "favorite.ejs"
    );
    const script_path = path.join(__dirname, "..", "..", "ml", "fav.py");
    const source_path = path.join(
      __dirname,
      "..",
      "..",
      "recipe_website_ml",
      "bin",
      "activate"
    );

    const user_id = req.user.user_id;
    const role = req.user.role;
    const recipes = await recipeModel.getAllRecipeByFavorite(user_id);

    let recommended = [];

    if (recipes.length != 0) {
      const id = recipes.slice(-1)[0].id;

      const command = `source ${source_path} && python ${script_path} ${id}`;

      exec(command, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Ошибка выполнения: ${error}`);
          return;
        }
        const result = stdout.trim().match(/\d+/g).map(Number);

        recommended = await recipeModel.getRecipesByIds(result);
        console.log(recommended);

        let html = await ejs.renderFile(template, {
          role,
          recipes,
          recommended,
        });
        res.send(html);
      });
    } else {
      let html = await ejs.renderFile(template, { role, recipes, recommended });
      res.send(html);
    }
  }

  async getOneRecipe(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "one-recipe.ejs"
    );

    const recipeId = parseInt(req.params.id);

    const { back, page, search } = req.query;

    const recipe = await recipeModel.getRecipe(recipeId);
    const ingredients = await recipeModel.getIngredients(recipeId);
    const steps = await recipeModel.getSteps(recipeId);

    const role = req.user.role;
    const id = req.user.user_id;
    let html = await ejs.renderFile(template, {
      role,
      recipe,
      ingredients,
      steps,
      id,
      back,
      page,
      search,
    });

    res.send(html);
  }

  async getRecipe(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "recipe.ejs"
    );

    let page = req.query.page;
    const search = req.query.search;
    if (!page || page < 1) page = 1;

    const role = req.user.role;

    let html = await ejs.renderFile(template, { role, page, search });

    res.send(html);
  }

  async getPageRecipe(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "recipe-page.ejs"
    );
    let pageNumber = req.query.page;
    if (!pageNumber || pageNumber < 1) pageNumber = 1;

    const countRecipe = parseInt(await recipeModel.countRecipe());
    if (countRecipe + RECIPE_IN_PAGE <= pageNumber * RECIPE_IN_PAGE)
      pageNumber = 1;

    const offset = (pageNumber - 1) * RECIPE_IN_PAGE;
    const recipes = await recipeModel.getAllRecipe(RECIPE_IN_PAGE, offset);

    const role = req.user.role;
    const user_id = req.user.user_id;

    for (let recipe of recipes) {
      recipe.favorite = await recipeModel.checkFavorite(user_id, recipe.id);
    }

    let html = await ejs.renderFile(template, { recipes, role, pageNumber });
    res.send(html);
  }

  async getAuth(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "auth.ejs"
    );
    let html = await ejs.renderFile(template);

    res.send(html);
  }

  async getRegistration(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "registration.ejs"
    );
    let html = await ejs.renderFile(template);

    res.send(html);
  }

  async getUser(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "user.ejs"
    );

    const role = req.user.role;
    const user = await userModel.getUser(req.user.user_id);
    const recipes = await recipeModel.getAllRecipeByCreate(req.user.user_id);

    let html = await ejs.renderFile(template, { role, user, recipes });

    res.send(html);
  }

  async logout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
  }

  async getRecipeSearch(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "recipe-page.ejs"
    );
    const script_path = path.join(__dirname, "..", "..", "ml", "search.py");
    const source_path = path.join(
      __dirname,
      "..",
      "..",
      "recipe_website_ml",
      "bin",
      "activate"
    );
    const { query, table } = req.query;
    console.log(query, table);
    let ids = [];
    const command = `source ${source_path} && python ${script_path} "${query}" ${table}`;
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка выполнения: ${error}`);
        return;
      }
      console.log("Работа ml - ", stdout);

      if (stdout.trim() === "[]") {
        res.send('<div class="no-search">Таких рецептов не найдено!</div>');
        return;
      }

      ids = stdout.trim().match(/\d+/g).map(Number);
      console.log(ids);

      if (ids.length > 9) ids = ids.slice(0, 9);
      const recipes = await recipeModel.getRecipesByIds(ids);

      const role = req.user.role;
      const user_id = req.user.user_id;

      for (let recipe of recipes) {
        recipe.favorite = await recipeModel.checkFavorite(user_id, recipe.id);
      }

      const pageNumber = 1;

      let html = await ejs.renderFile(template, {
        recipes,
        role,
        pageNumber,
        query,
      });
      res.send(html);
    });
  }

  async getPageRecipeSearch(req, res) {
    const template = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "view",
      "recipe-page.ejs"
    );
    const script_path = path.join(__dirname, "..", "..", "ml", "search.py");
    const source_path = path.join(
      __dirname,
      "..",
      "..",
      "recipe_website_ml",
      "bin",
      "activate"
    );
    const { query, table, page } = req.query;
    console.log(query, table, page);
    let ids = [];
    const command = `source ${source_path} && python ${script_path} "${query}" ${table}`;
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка выполнения: ${error}`);
        return;
      }

      console.log("Работа ml - ", stdout);

      if (stdout.trim() === "[]") {
        res.send('<div class="no-search">Таких рецептов не найдено!</div>');
        return;
      }
      ids = stdout.trim().match(/\d+/g).map(Number);
      console.log(ids);

      if (ids.length >= parseInt(page) * 9)
        ids = ids.slice(parseInt(page) * 9 - 9, parseInt(page) * 9);
      else if (ids.length >= parseInt(page) * 9 - 9)
        ids = ids.slice(parseInt(page) * 9 - 9);
      else ids = [];
      const recipes = await recipeModel.getRecipesByIds(ids);

      const role = req.user.role;
      const user_id = req.user.user_id;

      for (let recipe of recipes) {
        recipe.favorite = await recipeModel.checkFavorite(user_id, recipe.id);
      }

      const pageNumber = page;

      let html = await ejs.renderFile(template, {
        recipes,
        role,
        pageNumber,
        query,
      });
      res.send(html);
    });
  }
}

module.exports = new MainController();
