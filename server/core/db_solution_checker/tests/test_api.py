import os
import unittest
from unittest.mock import patch, MagicMock

from src.api import check_solution, run_container, stop_container
from src.constants import ErrorMsgs


SAKILA_DB_PATH = os.path.join(os.getcwd(), "tests/sakila-db")


class TestCheckSolution(unittest.TestCase):

    def test_wrong_input_data(self):

        # не передан абсолютный путь до файлов задачи -> ловим исключение с текстом
        with self.assertRaises(Exception) as context:
            _result = check_solution(None, None, None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.WRONG_ABS_PATH)

        # передан неподдерживаемый тип контейнера-> ловим исключение с текстом
        with self.assertRaises(Exception) as context:
            _result = check_solution("wrong container name", SAKILA_DB_PATH, {"sol1": "verify"}, None)

        self.assertEqual(str(context.exception), ErrorMsgs.WRONG_SOLUTION_CHECKER)

        # не переданы файлы для проверки -> ловим исключение с текстом
        with self.assertRaises(Exception) as context:
            _result = check_solution("mysql", SAKILA_DB_PATH, None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CHECK_FILES)

        # не переданы файлы для проверки -> ловим исключение с текстом
        with self.assertRaises(Exception) as context:
            _result = check_solution("mysql", SAKILA_DB_PATH, {}, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CHECK_FILES)

        # один из проверяемых файлов пуст -> ловим исключение с текстом
        with self.assertRaises(Exception) as context:
            _result = check_solution("mysql", SAKILA_DB_PATH, {None: "verify", "sol1": "verify"}, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CHECK_FILES)

        # один из проверочных файлов пуст -> ловим исключение с текстом
        with self.assertRaises(Exception) as context:
            _result = check_solution("mysql", SAKILA_DB_PATH, {"sol2": None, "sol1": "verify"}, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CHECK_FILES)

        # один из проверяемых файлов пуст -> ловим исключение с текстом
        with self.assertRaises(Exception) as context:
            _result = check_solution("mysql", SAKILA_DB_PATH, {"": "verify", "sol1": "verify"}, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CHECK_FILES)

        # один из проверочных файлов пуст -> ловим исключение с текстом
        with self.assertRaises(Exception) as context:
            _result = check_solution("mysql", SAKILA_DB_PATH, {"sol2": "", "sol1": "verify"}, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CHECK_FILES)

    @patch("src.api.run_container")
    def test_not_run_container(self, run_container_mock: MagicMock):

        err_msg = "Упс, ошибонька при старте контейнера"
        run_container_mock.side_effect = Exception(err_msg)

        with self.assertRaises(Exception) as context:
            _result = check_solution("mysql", SAKILA_DB_PATH, {"sol1": "verify"}, None)

        self.assertIn(ErrorMsgs.NOT_STARTED_CONT, str(context.exception))
        self.assertIn(err_msg, str(context.exception))

    def test_check_solution(self):

        # положительный сценарий
        result = check_solution(
            "mysql",
            SAKILA_DB_PATH,
            {"to_be_checked_correct.sql": "verify.sql"},
            ["sakila-schema.sql", "sakila-data.sql"]
        )

        self.assertTrue(result["to_be_checked_correct.sql"])

        # негативный сценарий
        result = check_solution(
            "mysql",
            SAKILA_DB_PATH,
            {"to_be_checked_wrong.sql": "verify.sql"},
            ["sakila-schema.sql", "sakila-data.sql"]
        )

        self.assertFalse(result["to_be_checked_wrong.sql"])


if __name__ == "__main__":
    unittest.main()