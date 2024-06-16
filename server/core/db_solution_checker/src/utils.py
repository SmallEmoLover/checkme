"""
    Утилиты.
"""

__author__ = "ad.feklistov"

import os
import time
import docker
from uuid import uuid4

from .constants import PATH_TASK_FILES_IN_CONTAINER, VOLUME_NAME, VOLUME_READ_WRITE_MODE, PATH_DOCKER_VOLUME


def safe_call(msg: str):
    """
        Декоратор безопасного вызова.
        Вызывает функцию, если произошла ошибка -> лоигрует её, продолжает работу.
        :param msg:
    """
    def decorator(func):
        def wrap(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as exc:
                print(msg, str(exc))

        return wrap

    return decorator


@safe_call("Ошибка при запуске контейнера")
def run_container(image_name: str, abs_path_task_files, version: str = "latest", container_start_cfg: dict | None = None):
    """
        Запускает docker контейнер на основе образа

        :param image_name: название образа
        :param abs_path_task_files: абсолютный путь до папки с файлами задачи
        :param version: версия образа
        :param container_start_cfg: прикладные параметры для запуска контейнера

        :return: объект контейнера
    """
    _image_name: str = ":".join([image_name, version])
    unique_key: str = "".join(str(uuid4()).split("-"))
    cont_name: str = f"{image_name}-{unique_key}"

    print(f"Запуск контейнера...\nОбраз: {_image_name}\nНазвание: {cont_name}")

    cont = docker.from_env().containers.run(
        image=_image_name,
        name=cont_name,
        detach=True,  # запускаем в фоновом режиме(сразу возвращается объект контейнера),
        shm_size="128m",  # размер общей памяти, выделенной контейнеру
        mem_limit="750m",  # после этого предела оперативной памяти контейнер аварийно завершится

        # создадим volume для, чтобы при создании файлов она автоматически появлялись на хосте
        volumes={
            VOLUME_NAME.format(unique_key): {"bind": PATH_TASK_FILES_IN_CONTAINER, "mode": VOLUME_READ_WRITE_MODE}
        },
        **(container_start_cfg or {})
    )

    time.sleep(15)

    # прокинем папку с файлами задачи в контейнер
    os.system(f'docker cp "{abs_path_task_files}/." "{cont_name}":"{PATH_TASK_FILES_IN_CONTAINER}"')

    print(f"Контейнер {cont_name} успешно запущен")

    return cont


def stop_container(cont) -> None:
    """
        Останавливает переданный контейнер, чистит его volume.

        :param cont: объект контейнера
    """
    cont.stop()

    # удаление вместе с volume
    cont.remove(v=True)

    print(f"Контейнер {cont.name} удален")
