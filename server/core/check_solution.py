import os
import sys
import shutil
import importlib
import pymongo
from dotenv import load_dotenv, find_dotenv
from bson.objectid import ObjectId 

def main():
    load_dotenv(find_dotenv())

    check_id, task_id = sys.argv[1:3]
    task_dir = os.path.join('/tasks', task_id)
    sys.path.append(task_dir)

    working_dir = os.path.join('/checks', check_id)
    os.mkdir(working_dir)
    os.chdir(working_dir)

    client = pymongo.MongoClient(os.environ.get("MONGODB_URL"))
    database = client.checkme
    task = database.tasks.find_one({'_id': ObjectId(task_id)})

    os.system(f'unzip -o {os.path.join(task_dir, "additional.zip")}')

    result = {}
    criterions = task['criterions']
    try: 
        if (os.path.isfile(os.path.join(task_dir, 'beforeAll.py'))):
            execute_file('beforeAll.py')

        for criterion, data in criterions.items():
            if 'test' not in data.keys():
                continue

            if (os.path.isfile(os.path.join(task_dir, 'beforeEach.py'))):
                execute_file('beforeEach.py')

            # For the case if test changes working directory
            os.chdir(working_dir)
            result[criterion] = {}
            if(execute_file(data['test'])):
                result[criterion]['score'] = data['score']
                result[criterion]['message'] = data['description']
            else:
                result[criterion]['score'] = 0
                result[criterion]['message'] = data['message']

            if (os.path.isfile(os.path.join(task_dir, 'afterEach.py'))):
                execute_file('afterEach.py')

        if (os.path.isfile(os.path.join(task_dir, 'afterAll.py'))):
            execute_file('afterAll.py')

        database.checks.update_one({'_id': ObjectId(check_id)}, {'$set': { 'result': result, 'status': 'Проверено' }})
    except Exception as e:
        print(e)
        database.checks.update_one({'_id': ObjectId(check_id)}, {'$set': { 'status': 'Ошибка выполнения' }})

def execute_file(filename) -> bool:
    # rstrip will not work here
    # example: check_dependency.py will be cropped to check_dependenc
    if filename.endswith('.py'):
        filename = filename[:-3]
    module = importlib.import_module(filename)
    test = getattr(module, 'main')
    try:
        return test(sys.argv[3:])
    except Exception as e:
        print(e)
        return False

if __name__ == '__main__':
    main()
