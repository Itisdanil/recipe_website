from utils import *
import sys


if __name__ == "__main__":
    id = sys.argv[1] if len(sys.argv) > 0 else None

    if id is not None:
        result = get_recommendation_by_fav(int(id))
        print(result)
    else:
        print("Не передан параметр id.")