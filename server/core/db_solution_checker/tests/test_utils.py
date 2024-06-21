import os
import unittest

import docker
from src.utils import run_container, stop_container
from src.constants import ErrorMsgs, PATH_TASK_FILES_IN_CONTAINER


SAKILA_DB_PATH = os.path.join(os.getcwd(), "tests/sakila-db")


class TestSolutionChecker(unittest.TestCase):

    def test_input_data_run_container(self):

        # не передан абсолютный путь до файлов задачи -> ловим исключение с текстом
        with self.assertRaises(Exception) as context:
            _cont = run_container("mysql", None, None, None)

            # не передан абсолютный путь до файлов задачи -> ловим исключение с текстом
            with self.assertRaises(Exception) as context:
                _cont = run_container("mysql", "", None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CONT_PARAMS)

        # не передано название контейнера -> ловим исключение с текстом
        with self.assertRaises(Exception) as context:
            _cont = run_container(None, SAKILA_DB_PATH, None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CONT_PARAMS)

        # не передано название контейнера -> ловим исключение с текстом
        with self.assertRaises(Exception) as context:
            _cont = run_container("", SAKILA_DB_PATH, None, None)

        self.assertEqual(str(context.exception), ErrorMsgs.EMPTY_CONT_PARAMS)

    def test_container_life(self):
        """
            Проверка методов для работы с жизненным циклом контейнера.
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
        stop_container(new_cont, SAKILA_DB_PATH)
        self.assertNotIn(cont_id, [cont.id for cont in client.containers.list()])


if __name__ == "__main__":
    unittest.main()
