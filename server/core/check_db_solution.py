import os
import sys
import pymongo
from dotenv import load_dotenv, find_dotenv
from bson.objectid import ObjectId
from db_solution_checker.src.api import check_solution


def main():
    load_dotenv(find_dotenv())

    check_id, task_id, image_name, prepare_file = sys.argv[1:5]
    print("qwe")
    task_dir = os.path.join('/tasks', task_id)
    sys.path.append(task_dir)

    working_dir = os.path.join('/checks', check_id)
    os.mkdir(working_dir)
    os.chdir(working_dir)

    client = pymongo.MongoClient(os.environ.get("MONGODB_URL"))
    database = client.checkme
    task = database.tasks.find_one({'_id': ObjectId(task_id)})

    result = {}
    criterions: dict = task['criterions']
    try: 



        check_files = {
           to_be_check: criter_name for to_be_check, criter_name in zip(sys.argv[5:], list(criterions.keys()))
        }

        check_result = check_solution(
            image_name,
            task_dir,
            {
                to_be_check: criterions[criter_name]["test"] for to_be_check, criter_name in check_files.items()
            },
            "dbPrepare.sql"
        )

        for to_be_check, res in check_result.items():
            criter_name = check_files[to_be_check]
            data = criterions[criter_name]
            result[criter_name] = {}
            if res:
                result[criter_name]['score'] = data['score']
                result[criter_name]['message'] = data['description']
            else:
                result[criter_name]['score'] = 0
                result[criter_name]['message'] = data['message']

        database.checks.update_one({'_id': ObjectId(check_id)}, {'$set': { 'result': result, 'status': 'Проверено' }})
    except Exception as e:
        print(e)
        database.checks.update_one({'_id': ObjectId(check_id)}, {'$set': { 'status': 'Ошибка выполнения' }})

if __name__ == '__main__':
    main()

