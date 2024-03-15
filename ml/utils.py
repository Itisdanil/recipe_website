import os
import re

import pandas as pd
import numpy as np
import torch
from dotenv import load_dotenv
from fuzzywuzzy import fuzz, process
from sqlalchemy import create_engine
from sklearn.metrics.pairwise import cosine_similarity
from transformers import AutoTokenizer, AutoModel


DOTENV_PATH = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(DOTENV_PATH):
    load_dotenv(DOTENV_PATH)

DB_HOST=os.getenv("DB_HOST")
DB_PORT=os.getenv("DB_PORT")
DB_USER=os.getenv("DB_USER")
DB_PASSWORD=os.getenv("DB_PASSWORD")
DB_NAME=os.getenv("DB_NAME")


TOKENIZER = AutoTokenizer.from_pretrained('cointegrated/rubert-tiny2')
MODEL = AutoModel.from_pretrained('cointegrated/rubert-tiny2')


def read_text_file(file_path):
    with open(file_path, 'r') as f:
        return f.read()
    
def get_dataframe(table):
    engine = create_engine(f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}')

    data = pd.read_sql_table(table, con=engine)
    data = data.sort_values("id")

    if table == "ingredient":
        data = data.groupby('recipe_id')['info'].agg(list).reset_index()
        data["info"] = data["info"].apply(lambda x: ' '.join(x))
        data = data.rename({"info": "name"}, axis=1)

    return data


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

    return np.array([]), False


def get_ans_search(query, dist_threshold=85, sim_threshold=0.7, table="recipe"):
    # параметр table может быть либо "recipe" либо "ingredient" в зависимости от типа поиска
    data = get_dataframe(table)

    recipes = data.name.tolist()

    lev_dists = np.array(list(map(lambda x: fuzz.WRatio(query, x), recipes)))

    ans_recipes, flag = get_list_of_recipes(lev_dists, dist_threshold)

    if flag:
        pre_ans = ans_recipes.tolist()
        return list(map(lambda x: x+1, pre_ans))

    search_vector = encode_text(query)
    recipe_vectors = torch.stack([encode_text(recipe) for recipe in recipes])

    cosine_similarities = cosine_similarity(search_vector, recipe_vectors.reshape(recipe_vectors.shape[0], recipe_vectors.shape[2]))

    ans_recipes, flag = get_list_of_recipes(cosine_similarities[0], sim_threshold)

    pre_ans = ans_recipes.tolist()
    return list(map(lambda x: x+1, pre_ans))


def get_recommendation_by_fav(recipe_id, dist_threshold=0.5, sim_threshold=0.5, table="recipe"):
    data = get_dataframe(table)

    recipes = data[data["id"] != recipe_id].name.tolist()

    anchor_recipe_name = data[data["id"] == recipe_id].name.tolist()[0]

    lev_dists = np.array(list(map(lambda x: fuzz.WRatio(anchor_recipe_name, x), recipes)))

    ans_recipes, _ = get_list_of_recipes(lev_dists, dist_threshold)

    first_step = ans_recipes[:50]

    anchor_vector = encode_text(anchor_recipe_name)
    recipe_vectors = torch.stack([encode_text(recipe) for recipe in recipes])

    cosine_similarities = cosine_similarity(anchor_vector, recipe_vectors.reshape(recipe_vectors.shape[0], recipe_vectors.shape[2]))

    ans_recipes, _ = get_list_of_recipes(cosine_similarities[0], sim_threshold)

    second_step = ans_recipes[:50]

    pre_ans = [item for item in second_step if item in set(first_step)][:9]

    return list(map(lambda x: x+1, pre_ans))
