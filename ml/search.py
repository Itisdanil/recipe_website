from utils import *
import sys


if __name__ == "__main__":
    query = sys.argv[1];
    table = sys.argv[2];

    result = get_ans_search(query=query, table=table)
    print(result)
