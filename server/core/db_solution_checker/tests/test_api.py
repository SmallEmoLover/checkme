import os
import unittest
from unittest.mock import patch, MagicMock

from src.api import check_solution, run_container, stop_container
from src.constants import ErrorMsgs


SAKILA_DB_PATH = os.path.join(os.getcwd(), "tests/sakila-db")


class TestCheckSolution(unittest.TestCase):

    def test_none_abs_path_task_files(self):
        """
            Тестируем вызов функции проверки решения с None значением абсолютного пути до файлов задачи.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.WRONG_ABS_PATH.
        """
        with self.assertRaises(Exception) as context:
            _result = check_solution(None, None, None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.WRONG_ABS_PATH)

    def test_empty_str_abs_path_task_files(self):
        """
            Тестируем вызов функции проверки решения с пустым абсолютным путём до файлов задачи.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.WRONG_ABS_PATH.
        """
        with self.assertRaises(Exception) as context:
            _result = check_solution(None, None, None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.WRONG_ABS_PATH)

    def test_wrong_container(self):
        """
            Тестируем передачу неподдерживаемого типа контейнера.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.WRONG_CONTAINER.
        """
        with self.assertRaises(Exception) as context:
            _result = check_solution("wrong container name", SAKILA_DB_PATH, {"sol1": "verify"}, None)

        self.assertEqual(str(context.exception), ErrorMsgs.WRONG_CONTAINER)

    def test_none_check_files(self):
        """
            Тестируем передачу None значения для проверямых файлов.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.EMPTY_CHECK_FILES.
        """
        with self.assertRaises(Exception) as context:
            _result = check_solution("mysql", SAKILA_DB_PATH, None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CHECK_FILES)

    def test_empty_dict_check_files(self):
        """
            Тестируем передачу пустого словаря для проверямых файлов.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.EMPTY_CHECK_FILES.
        """
        with self.assertRaises(Exception) as context:
            _result = check_solution("mysql", SAKILA_DB_PATH, {}, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CHECK_FILES)

    def test_none_checked_file(self):
        """
            Тестируем передачу None значения для названия проверяемого файла в словаре проверямых файлов.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.EMPTY_CHECK_FILES.
        """
        with self.assertRaises(Exception) as context:
            _result = check_solution("mysql", SAKILA_DB_PATH, {None: "verify", "sol1": "verify"}, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CHECK_FILES)

    def test_empty_str_checked_file(self):
        """
            Тестируем передачу пустой строки для названия проверяемого файла в словаре проверямых файлов.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.EMPTY_CHECK_FILES.
        """
        with self.assertRaises(Exception) as context:
            _result = check_solution("mysql", SAKILA_DB_PATH, {"": "verify", "sol1": "verify"}, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CHECK_FILES)

    def test_none_checking_file(self):
        """
            Тестируем передачу None значения для названия проверяющего файла в словаре проверямых файлов.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.EMPTY_CHECK_FILES.
        """
        with self.assertRaises(Exception) as context:
            _result = check_solution("mysql", SAKILA_DB_PATH, {"sol2": None, "sol1": "verify"}, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CHECK_FILES)

    def test_empty_str_checking_file(self):
        """
            Тестируем передачу пустой строки для названия проверяющего файла в словаре проверямых файлов.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.EMPTY_CHECK_FILES.
        """
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

    def test_check_solution_pos_case(self):
        """
            Тестируем полную работу функции проверки задания в положительном сценарии.
            ОР:
                проверка пройдена успешно
        """
        result = check_solution(
            "mysql",
            SAKILA_DB_PATH,
            {"to_be_checked_correct.sql": "verify.sql"},
            ["sakila-schema.sql", "sakila-data.sql"]
        )

        self.assertTrue(result["to_be_checked_correct.sql"])

    def test_check_solution_neg_case(self):
        """
            Тестируем полную работу функции проверки задания в негативном сценарии.
            ОР:
                проверка пройдена неуспешно
        """
        result = check_solution(
            "mysql",
            SAKILA_DB_PATH,
            {"to_be_checked_wrong.sql": "verify.sql"},
            ["sakila-schema.sql", "sakila-data.sql"]
        )

        self.assertFalse(result["to_be_checked_wrong.sql"])


if __name__ == "__main__":
    unittest.main()
