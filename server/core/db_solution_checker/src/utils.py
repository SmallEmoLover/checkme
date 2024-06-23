"""
    Утилиты.
"""

__author__ = "ad.feklistov"

import os
import shutil
import time
import docker
from uuid import uuid4

from .constants import (
    PATH_TASK_FILES_IN_CONTAINER, VOLUME_READ_WRITE_MODE, PATH_RESULT_IN_CONTAINER, RESULT_DIR_LOCAL_NAME, ErrorMsgs)


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


def run_container(image_name: str, abs_path_task_files, version: str = "latest", container_start_cfg: dict | None = None):
    """
        Запускает docker контейнер на основе образа

        :param image_name: название образа
        :param abs_path_task_files: абсолютный путь до папки с файлами задачи
        :param version: версия образа
        :param container_start_cfg: прикладные параметры для запуска контейнера

        :return: объект контейнера
    """
    if not image_name:
        raise Exception(ErrorMsgs.EMPTY_CONT_NAME)
    if not abs_path_task_files:
        raise Exception(ErrorMsgs.WRONG_ABS_PATH.value)

    _image_name: str = ":".join([image_name, version])
    unique_key: str = "".join(str(uuid4()).split("-"))
    cont_name: str = f"{image_name}-{unique_key}"

    print(f"Запуск контейнера...\nОбраз: {_image_name}\nНазвание: {cont_name}")

    result_abs_path = os.path.join(abs_path_task_files, RESULT_DIR_LOCAL_NAME.format(unique_key))
    os.mkdir(result_abs_path)

    cont = docker.from_env().containers.run(
        image=_image_name,
        name=cont_name,
        detach=True,  # запускаем в фоновом режиме(сразу возвращается объект контейнера),
        shm_size="128m",  # размер общей памяти, выделенной контейнеру
        mem_limit="750m",  # после этого предела оперативной памяти контейнер аварийно завершится

        # создадим volume для, чтобы при создании файлов в контейнере они автоматически появлялись на хосте
        volumes={
            result_abs_path: {"bind": PATH_RESULT_IN_CONTAINER, "mode": VOLUME_READ_WRITE_MODE}
        },
        **(container_start_cfg or {})
    )

    time.sleep(15)

    # прокинем папку с файлами задачи в контейнер
    os.system(f'docker cp "{abs_path_task_files}/." "{cont_name}":"{PATH_TASK_FILES_IN_CONTAINER}"')

    print(f"Контейнер {cont_name} успешно запущен")

    return cont


def stop_container(cont, abs_path_task_files: str,) -> None:
    """
        Останавливает переданный контейнер, чистит неиспользуемые volume.

        :param cont: объект контейнера
        :param abs_path_task_files: абсолютный путь до папки с файлами задачи
    """
    if not cont:
        return

    cont_name: str = cont.name

    cont.stop()

    client = docker.from_env()

    # удаляем контейнер вместе с созданными для него volume
    client.api.remove_container(cont_name, v=True)

    path_result_dir = os.path.join(abs_path_task_files, RESULT_DIR_LOCAL_NAME.format("".join(cont_name.split("-")[1:])))
    if os.path.exists(path_result_dir) and os.path.isdir(path_result_dir):
        shutil.rmtree(path_result_dir)

    print(f"Контейнер {cont.name} удален")
