import os
import sys
import shutil
import importlib
import pymongo
from bson.objectid import ObjectId 

def main():
    check_id = sys.argv[1]
    task_id = sys.argv[2]

    sys.path.append(f'/tasks/{task_id}/')

    working_dir = f'/checks/{check_id}'
    os.mkdir(working_dir)
    os.chdir(working_dir)

    client = pymongo.MongoClient('mongodb://127.0.0.1:27017/?retryWrites=true&w=majority')
    database = client.checkme
    task = database.tasks.find_one({'_id': ObjectId(task_id)})

    result = {}
    if 'prepare' in task:
        execute_file('prepare')
    for criterion, data in task['criterions'].items():
        result[criterion] = {}
        if(execute_file(data['test'])):
            result[criterion]['score'] = data['score']
            result[criterion]['message'] = data['description']
        else:
            result[criterion]['score'] = 0
            result[criterion]['message'] = data['message']

    database.checks.update_one({'_id': ObjectId(check_id)}, {'$set': { 'result': result, 'status': 'Проверено' }})

    os.chdir('/checks')
    shutil.rmtree(working_dir)

def execute_file(filename):
    if filename.endswith('.py'):
        filename = filename[:-3]
    module = importlib.import_module(f'{filename}')
    test = getattr(module, 'main')
    try:
        return test(sys.argv[3:])
    except:
        return False

if __name__ == '__main__':
    main()
