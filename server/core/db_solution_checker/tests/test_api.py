import os
import unittest

from src.api import check_solution, run_container, stop_container
from src.constants import ErrorMsgs


class TestSolutionChecker(unittest.TestCase):

    def test_check_solution_api(self):

        # не передан абсолютный путь до файлов задачи -> исключение
        with self.assertRaises(Exception) as context:
            _result = check_solution(None, None, None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.WRONG_ABS_PATH)

        sakila_db_path = os.path.join(os.getcwd(), "tests", "sakila-db")

        with self.assertRaises(Exception) as context:
            _result = check_solution(
                "nginx",
                sakila_db_path,
                {"to_be_checked_correct.sql": "verify.sql"},
                [f"sakila-schema.sql", "sakila-data.sql"]
            )

        self.assertEqual(str(context.exception), ErrorMsgs.WRONG_SOLUTION_CHECKER)

        with self.assertRaises(Exception) as context:
            _result = check_solution(
                "mysql",
                None,
                {"to_be_checked_correct.sql": "verify.sql"},
                [f"sakila-schema.sql", "sakila-data.sql"]
            )

        self.assertEqual(str(context.exception), ErrorMsgs.WRONG_ABS_PATH)

        result = check_solution(
            "mysql",
            sakila_db_path,
            {"to_be_checked_correct.sql": "verify.sql"},
            ["sakila-schema.sql", "sakila-data.sql"]
        )

        self.assertTrue(result["to_be_checked_correct.sql"])

        result = check_solution(
            "mysql",
            sakila_db_path,
            {"to_be_checked_wrong.sql": "verify.sql"},
            ["sakila-schema.sql", "sakila-data.sql"]
        )

        self.assertFalse(result["to_be_checked_wrong.sql"])


if __name__ == "__main__":
    unittest.main()