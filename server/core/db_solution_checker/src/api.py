"""
    API модуля проверки решений задач по базам данных.
"""

__author__ = "ad.feklistov"

from .utils import run_container, stop_container
from .ichecker import IDbSolutionChecker
from .db_checkers import MySqlSolutionChecker
from .constants import DockerImageNames, DB_PASSWORD_ROOT, ErrorMsgs


CHECKER_DATA_BY_IMAGE_NAME = {
    DockerImageNames.MY_SQL.value: (
        MySqlSolutionChecker,
        {
            "environment": {
                "MYSQL_ROOT_PASSWORD": DB_PASSWORD_ROOT
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
    prepare_file_names: list[str] | None = None,
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
        :param prepare_file_names: список названий файлов для подготовки БД к тестам

        :return: словарь с результатом на каждый проверяемый файл:
                    True - решение верно
                    False - решение неверно
                    None - во время проверки возникли ошибки
    """

    if not abs_path_task_files:
        raise Exception(ErrorMsgs.WRONG_ABS_PATH.value)

    if (
            not files_to_check or
            any(not elem for elem in list(files_to_check.keys()) + list(files_to_check.values()))
    ):
        raise Exception(ErrorMsgs.EMPTY_CHECK_FILES)

    if docker_image_name not in CHECKER_DATA_BY_IMAGE_NAME:
        raise Exception(ErrorMsgs.WRONG_SOLUTION_CHECKER)

    task_checker_cls, container_start_cfg = CHECKER_DATA_BY_IMAGE_NAME[docker_image_name]

    try:
        cont = run_container(docker_image_name, abs_path_task_files, version, container_start_cfg)
    except Exception as exc:
        raise Exception(f"Ошибка при запуске контейнера: {str(exc)}")

    result: dict[str, bool | None] = {}
    task_checker: IDbSolutionChecker = task_checker_cls(cont)

    if prepare_file_names:
        try:
            task_checker.prepare_db(abs_path_task_files, prepare_file_names)
        except Exception:
            stop_container(cont)
            raise Exception(ErrorMsgs.NOT_PREPARE_DB.value)

    for to_be_checked_file, verifying_file in files_to_check.items():
        try:
            result[to_be_checked_file] = task_checker.check(abs_path_task_files, to_be_checked_file, verifying_file)
        except Exception as exc:
            print(f"Ошибка при проверке файла: {to_be_checked_file}\n{str(exc)}")
            result[to_be_checked_file] = False

    stop_container(cont)

    return result
