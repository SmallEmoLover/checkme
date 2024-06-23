import os
import unittest

import docker
from src.utils import run_container, stop_container
from src.constants import ErrorMsgs, PATH_TASK_FILES_IN_CONTAINER, RESULT_DIR_LOCAL_NAME


SAKILA_DB_PATH = os.path.join(os.getcwd(), "tests/sakila-db")


class TestUtils(unittest.TestCase):

    def test_none_cont_name(self):
        """
            Тестируем вызов функции запуска контейнера с None значения названия контейнера.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.WRONG_ABS_PATH.
        """
        with self.assertRaises(Exception) as context:
            _cont = run_container(None, SAKILA_DB_PATH, None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CONT_NAME)

    def test_empty_str_cont_name(self):
        """
            Тестируем вызов функции запуска контейнера с пустой строкой названия контейнера.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.WRONG_ABS_PATH.
        """
        with self.assertRaises(Exception) as context:
            _cont = run_container("", SAKILA_DB_PATH, None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CONT_NAME)

    def test_none_abs_path_task_files(self):
        """
            Тестируем вызов функции запуска контейнера с пустой строкой абсолютного пути до файлов задания.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.WRONG_ABS_PATH.
        """
        with self.assertRaises(Exception) as context:
            _cont = run_container("mysql", None, None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.WRONG_ABS_PATH)

    def test_empty_str_abs_path_task_files(self):
        """
            Тестируем вызов функции запуска контейнера с None значением абсолютного пути до файлов задания.
            ОР:
                бросается исключение с описанием с текстом ErrorMsgs.WRONG_ABS_PATH.
        """
        with self.assertRaises(Exception) as context:
            _cont = run_container("mysql", "", None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.WRONG_ABS_PATH)

    def test_container_life(self):
        """
            Проверка методов для работы с жизненным циклом контейнера.
            ОР:
                контейнер запущен и принимает команды, т.е. не падает
                внутри контейнера создались директории для результата и файлов задания
                файлы задания скопировались
                контейнер остановился, директория с результатам на хостовой ОС удалена
        """
        client = docker.from_env()

        # если не найдет, то упадёт с ошибкой
        client.images.get("mysql")
        conts_before_test = [cont.id for cont in client.containers.list()]
        new_cont = run_container(
            "mysql",
            SAKILA_DB_PATH,
            container_start_cfg={"environment": {"MYSQL_ROOT_PASSWORD": 123}}
        )
        cont_id = new_cont.id

        # запустился контейнер нужной версии, работает
        self.assertEqual(new_cont.image.tags[0], "mysql:latest")
        self.assertNotIn(cont_id, conts_before_test)
        self.assertIn(cont_id, [cont.id for cont in client.containers.list()])

        # создались директории для файлов задания, результата
        _, ls_output = new_cont.exec_run("ls")
        ls_output = ls_output.decode("utf-8")

        self.assertIn("result", ls_output)
        self.assertIn("task_files", ls_output)

        # прокинулись все файлы из директории для файлов задания
        _, ls_task_files_output = new_cont.exec_run(f"ls {PATH_TASK_FILES_IN_CONTAINER}")
        ls_task_files_output = ls_task_files_output.decode("utf-8")

        for elem in os.listdir(SAKILA_DB_PATH):
            self.assertIn(elem, ls_task_files_output)

        # остановка контейнера и удаление
        cont_unique_key = "".join(new_cont.name.split("-")[1:])
        stop_container(new_cont, SAKILA_DB_PATH)
        self.assertNotIn(cont_id, [cont.id for cont in client.containers.list()])
        self.assertFalse(os.path.exists(os.path.join(SAKILA_DB_PATH, RESULT_DIR_LOCAL_NAME.format(cont_unique_key))))


if __name__ == "__main__":
    unittest.main()
