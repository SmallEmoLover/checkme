"""
    Константы для проверки решений задач по базам данных.
"""

__author__ = "ad.feklistov"

import enum


DB_USER_ROOT = "root"
DB_PASSWORD_ROOT = "root_password"
BASH_COMMAND_IN_CONTAINER = 'bash -c "{}"'
PATH_TASK_FILES_IN_CONTAINER = "/task_files"
PATH_RESULT_IN_CONTAINER = "/result"
RESULT_DIR_LOCAL_NAME = "result_{}"
VOLUME_READ_WRITE_MODE = "rw"


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
    WRONG_CONTAINER = "Неподдерживаемый тип контейнера"
    EMPTY_CONT_NAME = "Передано пустое название контейнера"
    EMPTY_CHECK_FILES = "Передано пустое название файла для проверки или проверяющего"
    NOT_PREPARE_DB = "Ошибка при подготовке БД к тестам"
    NOT_STARTED_CONT = "Ошибка при запуске контейнера"
    ERROR_WHILE_CHECK_FILE = "Ошибка при проверке файла"
