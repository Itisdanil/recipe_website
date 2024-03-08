import os
import re

import pandas as pd
import numpy as np
import torch
from fuzzywuzzy import fuzz, process
from sklearn.metrics.pairwise import cosine_similarity
from transformers import AutoTokenizer, AutoModel


TOKENIZER = AutoTokenizer.from_pretrained('cointegrated/rubert-tiny2')
MODEL = AutoModel.from_pretrained('cointegrated/rubert-tiny2')


def read_text_file(file_path):
    with open(file_path, 'r') as f:
        return f.read()
    
def get_dataframe():
    all_recipe_files = sorted(os.listdir("./text/recipe/"))

    recipes = []
    for file in all_recipe_files:
        recipes.append((file.split('.')[0], read_text_file("./text/recipe/" + file)))

    data = pd.DataFrame(columns=["recipe_id", "text"])
    data["recipe_id"] = list(map(lambda x: x[0], recipes))
    data["text"] = list(map(lambda x: x[1], recipes))
    data["recipe_id"] = data["recipe_id"].astype(int)
    data = data.sort_values("recipe_id")
    data.reset_index(drop=True, inplace=True)

    return data


def extract_recipes_names(recipes):
    return list(map(lambda x: x.split('📖')[0].strip(), recipes))


def extract_ingridients(recipes):
    ingredients_lists = []

    for recipe in recipes:
        ingredients_part = re.search(r'Ингредиенты:(.*?)🧑🏻‍🍳', recipe, re.DOTALL)
        if not ingredients_part:
            continue
        ingredients_text = ingredients_part.group(1)

        ingredients = [ingredient.strip() for ingredient in ingredients_text.split('-') if ingredient.strip()]

        ingredients = [re.sub(r'\s*-\s*.*', '', ingredient) for ingredient in ingredients]

        upper_case_ingredients = [ingredient for ingredient in ingredients if ingredient[0].isupper()]

        ingredients_lists.append(' '.join(upper_case_ingredients))

    return ingredients_lists


def encode_text(text):
    input_ids = TOKENIZER.encode(text, add_special_tokens=True, return_tensors='pt', max_length=512, truncation=True)
    with torch.no_grad():
        outputs = MODEL(input_ids)
    return outputs.last_hidden_state.mean(dim=1)


def get_list_of_recipes(dists_values, threshold):
    ans_indices = np.where(dists_values > threshold)[0]
    values = dists_values[ans_indices]
    sorted_indices_desc = ans_indices[np.argsort(-values)]

    if len(sorted_indices_desc) > 0:
        return sorted_indices_desc, True

    return [], False


def get_ans_search(query, dist_threshold=85, sim_threshold=0.7, action_type="recipes"):
    data = get_dataframe()

    recipes = data.text.tolist()

    func = extract_recipes_names if action_type == "recipes" else extract_ingridients

    useful_info_recipes = func(recipes)

    lev_dists = np.array(list(map(lambda x: fuzz.WRatio(query, x), useful_info_recipes)))

    ans_recipes, flag = get_list_of_recipes(lev_dists, dist_threshold)

    if flag:
        pre_ans = ans_recipes.tolist()
        return list(map(lambda x: x+1, pre_ans))

    search_vector = encode_text(query)
    recipe_vectors = torch.stack([encode_text(recipe) for recipe in useful_info_recipes])

    cosine_similarities = cosine_similarity(search_vector, recipe_vectors.reshape(recipe_vectors.shape[0], recipe_vectors.shape[2]))

    ans_recipes, flag = get_list_of_recipes(cosine_similarities[0], sim_threshold)

    pre_ans = ans_recipes.tolist()
    return list(map(lambda x: x+1, pre_ans))


def get_recommendation_by_fav(recipe_id, dist_threshold=0.5, sim_threshold=0.5):
    data = get_dataframe()

    recipes = data[data["recipe_id"] != (recipe_id - 1)].text.tolist()

    anchor_recipe_name = extract_recipes_names(data[data["recipe_id"] == (recipe_id - 1)].text.tolist())[0]
    recipes_names = extract_recipes_names(recipes)

    lev_dists = np.array(list(map(lambda x: fuzz.WRatio(anchor_recipe_name, x), recipes_names)))

    ans_recipes, _ = get_list_of_recipes(lev_dists, dist_threshold)

    first_step = ans_recipes[:50]

    anchor_vector = encode_text(anchor_recipe_name)
    recipe_vectors = torch.stack([encode_text(recipe) for recipe in recipes_names])

    cosine_similarities = cosine_similarity(anchor_vector, recipe_vectors.reshape(recipe_vectors.shape[0], recipe_vectors.shape[2]))

    ans_recipes, _ = get_list_of_recipes(cosine_similarities[0], sim_threshold)

    second_step = ans_recipes[:50]

    pre_ans = [item for item in second_step if item in set(first_step)][:9]

    return list(map(lambda x: x+1, pre_ans))
