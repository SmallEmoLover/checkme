"""
    Реализация проверщиков решений для задач по базам данных.
"""

__author__ = "ad.feklistov"

import docker
import mysql.connector
import psycopg2

from .ichecker import IDbSolutionChecker
from .constants import DB_NAME, DB_USER_NAME, DB_USER_PASSWORD


class PostgresSolutionChecker(IDbSolutionChecker):
    """
        Класс-проверщик решений задач по PostgreSQL
    """
    __slots__ = ("port",)

    def __init__(self, container):
        super().__init__(container)

        # сохраним порт контейнера с сервером PostgreSQL, на котором будем проверять решение
        self.port = docker.from_env().api.port(container.name, "5432/tcp")[0]["HostPort"]

    def prepare_db(self, prepare_file_path: str) -> None:
        """
            Подготовка БД к тестам.

            :param prepare_file_path: имя файла для подготовки БД
        """
        conn = psycopg2.connect(
            host="127.0.0.1",
            port=self.port,
            dbname=DB_NAME,
            user=DB_USER_NAME,
            password=DB_USER_PASSWORD
        )
        cursor = conn.cursor()

        with open(prepare_file_path, "r") as f:
            cursor.execute("".join(f.readlines()))

        cursor.close()
        conn.close()

    def check(self, to_be_checked_file_path: str, verifying_file_path: str) -> bool:
        """
            Выполнение основной проверки задачи.

            :param to_be_checked_file_path: файл с решением для проверки
            :param verifying_file_path: проверяющий файл

            :return: True, решение верно, иначе False
        """
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER_NAME,
            password=DB_USER_PASSWORD,
            host="127.0.0.1",
            port=self.port
        )
        cursor = conn.cursor()

        with open(to_be_checked_file_path, "r") as f1:
            cursor.execute("".join(f1.readlines()))
            res1 = cursor.fetchall()
            res1_frmt = []
            for rec in res1:
                res = {}
                for col_obj, val in zip(cursor.description, rec):
                    res[col_obj.name] = val
                res1_frmt.append(res)

        with open(verifying_file_path, "r") as f2:
            cursor.execute("".join(f2.readlines()))
            res2 = cursor.fetchall()
            res2_frmt = []
            for rec in res2:
                res = {}
                for col_obj, val in zip(cursor.description, rec):
                    res[col_obj.name] = val
                res2_frmt.append(res)

        print(res1_frmt)
        print(res2_frmt)

        cursor.close()
        conn.close()

        return res1_frmt == res2_frmt


class MySqlSolutionChecker(IDbSolutionChecker):
    """
        Класс-проверщик решений задач по MySQL
    """
    __slots__ = ("port",)

    def __init__(self, container):
        super().__init__(container)

        # сохраним порт контейнера с сервером PostgreSQL, на котором будем проверять решение
        self.port = docker.from_env().api.port(container.name, "3306/tcp")[0]["HostPort"]

    def prepare_db(self, prepare_file_path: str) -> None:
        """
            Файл-обработчик перед всеми тестами.

            :param prepare_file_path: имя файла-обработчика.
        """
        with mysql.connector.connect(
                host="127.0.0.1", port=self.port, user=DB_USER_NAME, password=DB_USER_PASSWORD, database=DB_NAME
        ) as connection:
            with connection.cursor() as cursor:
                with open(prepare_file_path, "r") as f:
                    cursor.execute("".join(f.readlines()), multi=True)

    def check(self, to_be_checked_file_path: str, verifying_file_path: str) -> bool:
        """
            Выполнение основной проверки задачи.

            :param to_be_checked_file_path: файл с решением для проверки
            :param verifying_file_path: проверяющий файл

            :return: True, решение верно, иначе False
        """
        with mysql.connector.connect(
                host="127.0.0.1", port=self.port, user=DB_USER_NAME, password=DB_USER_PASSWORD, database=DB_NAME
        ) as connection:
            with connection.cursor() as cursor:
                with open(to_be_checked_file_path, "r") as f1:
                    cursor.execute("".join(f1.readlines()), multi=True)
                    res1 = cursor.fetchall()
                with open(verifying_file_path, "r") as f2:
                    cursor.execute("".join(f2.readlines()), multi=True)
                    res2 = cursor.fetchall()

        print(res1)
        print(res2)

        return res1 == res2