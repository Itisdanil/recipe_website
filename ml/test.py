from utils import *


def main():
    print(f'Result get_ans_search by recipes: {get_ans_search("q")}\n')
    print(f'Result get_ans_search by recipes: {get_ans_search("грибы", table="ingredient")}\n')
    print(f'Result get_recommendation_by_fav: {get_recommendation_by_fav(50)}\n')


if __name__ == "__main__":
    main()
