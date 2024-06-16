"""
    Константы для проверки решений задач по базам данных.
"""

__author__ = "ad.feklistov"

import enum


DB_USER_ROOT = "root"
DB_PASSWORD_ROOT = "root_password"
BASH_COMMAND_IN_CONTAINER = 'bash -c "{}"'
PATH_TASK_FILES_IN_CONTAINER = "/task_files"
VOLUME_NAME = "vol_{}"
VOLUME_READ_WRITE_MODE = "rw"
PATH_DOCKER_VOLUME = f"/var/lib/docker/volumes/{VOLUME_NAME}/_data"


@enum.unique
class DockerImageNames(enum.StrEnum):
    """
        Названия докер контейнеров для запуска задач на проверку.
    """
    POSTGRES = "postgres"
    MY_SQL = "mysql"


@enum.unique
class ErrorMsgs(enum.StrEnum):
    """
        Сообщения об ошибках.
    """
    WRONG_ABS_PATH = "Не передан абсолютный путь файлов задачи"
    WRONG_SOLUTION_CHECKER = "Неподдерживаемый тип проверщика"
    EMPTY_CHECK_FILES = "Передано пустое название файла для проверки или проверяющего"
    BAD_PREPARE_DB = "Ошибка при подготовке БД к тестам"
