import os
import unittest

import docker
from src.utils import run_container, stop_container


class TestSolutionChecker(unittest.TestCase):

    def test_container_life(self):
        """
            Проверка методов для работы с жизненным циклом контейнера.
        """
        client = docker.from_env()
        sakila_db_path = os.path.join(os.getcwd(), "tests", "sakila-db")

        # запуск контейнера из имеющегося образа:
        # обращаясь к объекту контейнера -> он работает
        # нужный контейнер с нужной версией
        # прокинут volume

        # если не найдет, то упадёт с ошибкой
        client.images.get("mysql")
        conts_before_test = [cont.id for cont in client.containers.list()]
        new_cont = run_container(
            "mysql",
            sakila_db_path,
            container_start_cfg={"environment": {"MYSQL_ROOT_PASSWORD": 123}}
        )
        new_cont_unique_key = "".join(new_cont.name.split("-")[1:])
        cont_id = new_cont.id

        self.assertEqual(new_cont.image.tags[0], "mysql:latest")
        self.assertNotIn(cont_id, conts_before_test)
        self.assertIn(cont_id, [cont.id for cont in client.containers.list()])

        # если не найдёт, то упадёт с ошибкой
        client.volumes.get(f"vol_{new_cont_unique_key}")

        # остановка контейнера и удаление
        stop_container(new_cont)
        self.assertNotIn(cont_id, [cont.id for cont in client.containers.list()])


if __name__ == "__main__":
    unittest.main()