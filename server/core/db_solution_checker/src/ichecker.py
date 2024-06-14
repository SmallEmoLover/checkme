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
    def prepare_db(self, prepare_file_path: str) -> None:
        """
            Подготовка БД к тестам.

            :param prepare_file_path: имя файла для подготовки БД
        """

    @abstractmethod
    def check(self, to_be_checked_file_path: str, verifying_file_path: str) -> bool:
        """
            Выполнение основной проверки задачи.

            :param to_be_checked_file_path: файл с решением для проверки
            :param verifying_file_path: проверяющий файл

            :return: True, решение верно, иначе False
        """



