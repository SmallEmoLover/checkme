"""
    Реализация проверщиков решений для задач по базам данных.
"""

__author__ = "ad.feklistov"

import os
import filecmp

from .ichecker import IDbSolutionChecker
from .constants import (
    DB_PASSWORD_ROOT, DB_USER_ROOT, BASH_COMMAND_IN_CONTAINER, PATH_TASK_FILES_IN_CONTAINER, PATH_DOCKER_VOLUME)


TO_BE_CHECKED_RES_FILE_NAME = "to_be_checked_res.txt"
VERIFYING_RES_FILE_NAME = "verifying_res.txt"
MYSQL_CLIENT_ROOT_CONNECTION = f"mysql -u {DB_USER_ROOT} --password={DB_PASSWORD_ROOT}"


class MySqlSolutionChecker(IDbSolutionChecker):
    """
        Класс-проверщик решений задач по MySQL
    """
    __slots__ = ()

    def prepare_db(self, abs_path_task_files: str, prepare_file_names: list[str]) -> None:
        """
            Подготовка базы данных для проверки решения.

            :param abs_path_task_files: абсолютный путь до папки с файлами задачи
            :param prepare_file_names: список названий файлов для подготовки БД к тестам
        """
        for prepare_file_name in prepare_file_names:
            self.container.exec_run(
                BASH_COMMAND_IN_CONTAINER.format(f'\
                    cd "{PATH_TASK_FILES_IN_CONTAINER}"\
                    && mysql -u {DB_USER_ROOT} --password={DB_PASSWORD_ROOT} < "{prepare_file_name}"\
                ')
            )

    def check(self, abs_path_task_files: str, to_be_checked_file_name: str, verifying_file_name: str) -> bool:
        """
            Выполнение основной проверки задачи.

            :param abs_path_task_files: абсолютный путь до папки с файлами задачи
            :param to_be_checked_file_name: название файла с решением для проверки
            :param verifying_file_name: название проверяющего файла

            :return: True, решение верно, иначе False
        """
        with open(os.path.join(abs_path_task_files, verifying_file_name), "r") as file:
            if not file.readlines():
                raise Exception("Передан пустой проверяющий файл")

        # запустим проверяемый файл и сохраним результат в файл
        self.container.exec_run(
            BASH_COMMAND_IN_CONTAINER.format(f'\
                cd "{PATH_TASK_FILES_IN_CONTAINER}"\
                && {MYSQL_CLIENT_ROOT_CONNECTION}\
                < "{to_be_checked_file_name}" > "{TO_BE_CHECKED_RES_FILE_NAME}"\
            ')
        )

        # запустим проверяющий файл и сохраним результат в файл
        self.container.exec_run(
            BASH_COMMAND_IN_CONTAINER.format(f'\
                cd "{PATH_TASK_FILES_IN_CONTAINER}"\
                && {MYSQL_CLIENT_ROOT_CONNECTION}\
                < "{verifying_file_name}" > "{VERIFYING_RES_FILE_NAME}"\
            ')
        )

        # проверим различия файлов по содержимому
        unique_cont_key: str = "".join(self.container.name.split("-")[1:])
        path_docker_volume: str = PATH_DOCKER_VOLUME.format(unique_cont_key)
        to_be_checked_res_file: str = os.path.join(path_docker_volume, TO_BE_CHECKED_RES_FILE_NAME)
        verifying_res_file: str = os.path.join(path_docker_volume, VERIFYING_RES_FILE_NAME)
        result: bool = filecmp.cmp(to_be_checked_res_file, verifying_res_file, False)

        os.remove(to_be_checked_res_file)
        os.remove(verifying_res_file)

        return result
