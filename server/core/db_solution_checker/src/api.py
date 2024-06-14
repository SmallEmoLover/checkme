"""
    API модуля проверки решений задач по базам данных.
"""

__author__ = "ad.feklistov"

import os

from .utils import run_container, stop_container
from .ichecker import IDbSolutionChecker
from .db_checkers import PostgresSolutionChecker, MySqlSolutionChecker
from .constants import DockerImageNames, DB_NAME, DB_USER_NAME, DB_USER_PASSWORD


CHECKER_DATA_BY_IMAGE_NAME = {
    DockerImageNames.POSTGRES.value: (
        PostgresSolutionChecker,
        {
            "environment": {
                "POSTGRES_DB": DB_NAME,
                "POSTGRES_USER": DB_USER_NAME,
                "POSTGRES_PASSWORD": DB_USER_PASSWORD
            },
            "ports": {
                5432: None  # назначаем рандомный порт на хост системе
            }
        }
    ),
    DockerImageNames.MY_SQL.value: (
        MySqlSolutionChecker,
        {
            "environment": {
                "MYSQL_DATABASE": DB_NAME,
                "MYSQL_ROOT_PASSWORD": DB_USER_PASSWORD,
                "MYSQL_USER": DB_USER_NAME,
                "MYSQL_PASSWORD": DB_USER_PASSWORD
            },
            "ports": {
                3306: None  # назначаем рандомный порт на хост системе
            }
        }
    )
}


def check_solution(
    docker_image_name: str,
    abs_path_task_files: str,
    files_to_check: dict[str, str],
    prepare_file_name: str | None = None,
    version: str = "latest"
) -> dict[str, bool]:
    """
        Шаблонный метод проверки решения задачи:
            - поднимает docker-контейнер с выбранной БД
            - выполняет подготовку БД
            - проверяет переданные файлы
            - останавливает docker-контейнер после проверки

        :param docker_image_name: название docker-контейнера с БД. Поддерживаемые БД описаны в DockerImageNames.
        :param abs_path_task_files: абсолютный путь до папки с файлами задачи
        :param files_to_check: словарь с указанием файла для проверки(to_be_checked) и проверяющего(verifying) файла
        :param version: версия контейнера БД
        :param prepare_file_name: название файла для подготовки БД к тестам

        :return: словарь с результатом на каждый проверяемый файл:
                    True - решение верно
                    False - решение неверно
                    None - во время проверки возникли ошибки
    """

    if not abs_path_task_files:
        raise Exception("Не передан абсолютный путь файлов задачи")

    if (
            not files_to_check or
            any(not elem for elem in list(files_to_check.keys()) + list(files_to_check.values()))
    ):
        raise Exception("Передано пустое название файла для проверки или проверяющего")

    if docker_image_name not in CHECKER_DATA_BY_IMAGE_NAME:
        raise Exception("Неподдерживаемый тип проверщика")

    task_checker_cls, container_start_cfg = CHECKER_DATA_BY_IMAGE_NAME[docker_image_name]

    cont = run_container(docker_image_name, version, container_start_cfg)

    result: dict[str, bool | None] = {}
    task_checker: IDbSolutionChecker = task_checker_cls(cont)

    if prepare_file_name:
        try:
            task_checker.prepare_db(os.path.join(abs_path_task_files, prepare_file_name))
        except Exception as exc:
            stop_container(cont)
            raise Exception(f"Ошибка при подготовке БД к тестам: {str(exc)}")

    for to_be_checked_file, verifying_file in files_to_check.items():
        abs_path_to_be_checked_file: str = os.path.join(abs_path_task_files, to_be_checked_file)
        abs_path_verifying_file: str = os.path.join(abs_path_task_files, verifying_file)
        try:
            result[to_be_checked_file] = task_checker.check(abs_path_to_be_checked_file, abs_path_verifying_file)
        except Exception as exc:
            print(f"Ошибка при проверке файла: {to_be_checked_file}\n{str(exc)}")
            result[to_be_checked_file] = None

    stop_container(cont)

    return result
