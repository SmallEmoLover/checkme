import os
import unittest

from src.db_checkers import MySqlSolutionChecker
from src.utils import run_container, stop_container
from src.constants import (
    ErrorMsgs, PATH_TASK_FILES_IN_CONTAINER, BASH_COMMAND_IN_CONTAINER, DB_USER_ROOT, DB_PASSWORD_ROOT,
    PATH_RESULT_IN_CONTAINER, RESULT_DIR_LOCAL_NAME)


SAKILA_DB_PATH = os.path.join(os.getcwd(), "tests/sakila-db")


class TestSolutionChecker(unittest.TestCase):

    def test_prepare_db(self):
        """
            Проверка выполненяи подготовки БД.
        """
        new_cont = run_container(
            "mysql",
            SAKILA_DB_PATH,
            container_start_cfg={"environment": {"MYSQL_ROOT_PASSWORD": DB_PASSWORD_ROOT}}
        )

        checker = MySqlSolutionChecker(new_cont)

        checker.prepare_db(SAKILA_DB_PATH, ["sakila-schema.sql", "sakila-data.sql"])

        _, output = new_cont.exec_run(
            BASH_COMMAND_IN_CONTAINER.format(f"\
                mysql -u {DB_USER_ROOT} --password={DB_PASSWORD_ROOT}\
                -e 'use sakila; SELECT COUNT(*) as count FROM actor' > '{PATH_RESULT_IN_CONTAINER}/res.txt'\
            ")
        )
        with open(os.path.join(SAKILA_DB_PATH, f"{RESULT_DIR_LOCAL_NAME.format(''.join(new_cont.name.split('-')[1:]))}",
                               "res.txt")) as f:
            self.assertEqual(["count", "200"], [elem.strip() for elem in f.readlines()])

        # остановка контейнера и удаление контейнера
        stop_container(new_cont, SAKILA_DB_PATH)

    def test_check(self):
        """
            Проверка выполненяи подготовки БД.
        """
        new_cont = run_container(
            "mysql",
            SAKILA_DB_PATH,
            container_start_cfg={"environment": {"MYSQL_ROOT_PASSWORD": DB_PASSWORD_ROOT}}
        )

        checker = MySqlSolutionChecker(new_cont)

        checker.prepare_db(SAKILA_DB_PATH, ["sakila-schema.sql", "sakila-data.sql"])

        self.assertTrue(checker.check(SAKILA_DB_PATH, "to_be_checked_correct.sql", "verify.sql"))

        self.assertFalse(checker.check(SAKILA_DB_PATH, "to_be_checked_wrong.sql", "verify.sql"))

        # остановка контейнера и удаление контейнера
        stop_container(new_cont, SAKILA_DB_PATH)


if __name__ == "__main__":
    unittest.main()
