import os
import sys
import pymongo
import shutil
from dotenv import load_dotenv, find_dotenv
from bson.objectid import ObjectId
from db_solution_checker.src.api import check_solution


def main():
    load_dotenv(find_dotenv())

    check_id, task_id, image_name, prepare_file = sys.argv[1:5]
    task_dir = os.path.join('/tasks', task_id)

    working_dir = os.path.join('/checks', check_id)
    shutil.copytree(task_dir, working_dir)

    for abs_file_path in sys.argv[5:]:
        shutil.copyfile(abs_file_path, os.path.join(working_dir, os.path.basename(abs_file_path)))
    os.chdir(working_dir)

    client = pymongo.MongoClient(os.environ.get("MONGODB_URL"))
    database = client.checkme
    task = database.tasks.find_one({'_id': ObjectId(task_id)})

    os.system(f'unzip -o {os.path.join(working_dir, "additional.zip")}')

    result = {}
    criterions: dict = task['criterions']
    try:
        check_files = {
            os.path.basename(to_be_check): criter_name
            for to_be_check, criter_name in zip(sys.argv[5:], list(criterions.keys()))
        }

        check_result: dict = {}
        try:
            check_result = check_solution(
                image_name,
                working_dir,
                {
                    to_be_check: criterions[criter_name]["test"] for to_be_check, criter_name in check_files.items()
                },
                ["dbPrepare.sql"]
            )
        except Exception as exc:
            print(str(exc))

        for to_be_check, criter_name in check_files.items():
            data = criterions[criter_name]
            result[criter_name] = {}
            if check_result.get(to_be_check):
                result[criter_name]['score'] = data['score']
                result[criter_name]['message'] = data['description']
            else:
                result[criter_name]['score'] = 0
                result[criter_name]['message'] = data['message']

        database.checks.update_one({'_id': ObjectId(check_id)}, {'$set': { 'result': result, 'status': 'Проверено' }})
        shutil.rmtree(working_dir)
    except Exception as e:
        print(e)
        database.checks.update_one({'_id': ObjectId(check_id)}, {'$set': { 'status': 'Ошибка выполнения' }})

if __name__ == '__main__':
    main()

