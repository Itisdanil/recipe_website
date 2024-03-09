from utils import *


def main():
    print(f'Result get_ans_search by recipes: {get_ans_search("банановый кекс")}\n')
    print(f'Result get_ans_search by recipes: {get_ans_search("масло сливочное", table="ingredient")}\n')
    print(f'Result get_recommendation_by_fav: {get_recommendation_by_fav(50)}\n')


if __name__ == "__main__":
    main()
