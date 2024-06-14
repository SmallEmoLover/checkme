"""
    Утилиты.
"""

__author__ = "ad.feklistov"

import time
import docker
from uuid import uuid4


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
def run_container(image_name: str, version: str = "latest", container_start_cfg: dict | None = None):
    """
        Запускает docker контейнер на основе образа

        :param image_name: название образа
        :param version: версия образа
        :param container_start_cfg: прикладные параметры для запуска контейнера

        :return: объект контейнера
    """
    _image_name: str = ":".join([image_name, version])
    unique_key: str = str(uuid4())
    cont_name: str = f"{image_name}-{unique_key}"

    print(f"Запуск контейнера...\nОбраз: {_image_name}\nНазвание: {cont_name}")

    cont = docker.from_env().containers.run(
        image=_image_name,
        name=cont_name,
        detach=True,  # запускаем в фоновом режиме(сразу возвращается объект контейнера),
        shm_size="128m",
        mem_limit="512m",
        **(container_start_cfg or {})
    )

    # TODO: найти более изящное решение
    # проблема: контейнер может не успеть запуститься полностью, а скрипт будет слать ему команды
    time.sleep(15)

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
