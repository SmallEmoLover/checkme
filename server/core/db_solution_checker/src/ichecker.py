"""
    Интерфейс класса-проверщика задач по базам данных.
"""

__author__ = "ad.feklistov"


from abc import abstractmethod


class IDbSolutionChecker:
    """
        Интерфейс класса-проверщика решений задач по базам данных.
    """
    __slots__ = ("container",)

    def __init__(self, container):
        self.container = container

    @abstractmethod
    def prepare_db(self, abs_path_task_files: str, prepare_file_names: list[str]) -> None:
        """
            Подготовка БД к тестам.

            :param abs_path_task_files: абсолютный путь до папки с файлами задачи
            :param prepare_file_names: список названий файлов для подготовки БД к тестам
        """

    @abstractmethod
    def check(self, abs_path_task_files: str, to_be_checked_file_name: str, verifying_file_name: str) -> bool:
        """
            Выполнение основной проверки задачи.

            :param abs_path_task_files: абсолютный путь до папки с файлами задачи
            :param to_be_checked_file_name: название файла с решением для проверки
            :param verifying_file_name: название проверяющего файла

            :return: True, решение верно, иначе False
        """



