"""
    Константы для проверки решений задач по базам данных.
"""

__author__ = "ad.feklistov"

import enum


DB_NAME = "test_db"
DB_USER_NAME = "test_user"
DB_USER_PASSWORD = "test_password"


@enum.unique
class DockerImageNames(enum.StrEnum):
    """
        Названия докер контейнеров для запуска задач на проверку.
    """
    POSTGRES = "postgres"
    MY_SQL = "mysql"
