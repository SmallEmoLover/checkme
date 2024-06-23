# Checkme
Сервис автоматической проверки заданий студентов.
Позволяет запускать произвольные тесты на Python для переданных студентами аргументов.

### Запуск в режиме разработчика
- Установить [npm](https://nodejs.org/en/)
- Установить [mongodb](https://www.mongodb.com)
- Установить [sysbox](https://github.com/nestybox/sysbox/blob/master/docs/user-guide/install-package.md#installing-sysbox)
- Установить пакеты Python для приложения (server/app_python_dependencies), и для тестов, если таковые требуются
- Сконфигурировать переменные окружения - создать .env файлы в директориях server и client (смотри .env.template для примера)
- [Указать](https://github.com/nestybox/sysbox/blob/master/docs/user-guide/install-package.md#configuring-dockers-default-runtime-to-sysbox) sysbox средой выполнения docker-контейнеров по умолчанию
#### Сервер
- Перейти в директорию `./server`
- Установить зависимости командой `npm install`
- Запустить сервер командой `node app.js`
#### Клиент
- Перейти в директорию `./client`
- Установить зависимости командой `npm install`
- Запустить приложение командой `npm start`

### Запуск в продакшн
- Установить [Docker](https://www.docker.com) + docker-compose + [sysbox](https://github.com/nestybox/sysbox/blob/master/docs/user-guide/install-package.md#installing-sysbox)
- Создать директории `/dbdata/` для хранения данных mongodb, `/tasks/` для хранения файлов с тестами (убедись, что они открыты для записи)
- Указать Python пакеты, требуемые для тестов, в файле `server/test_python_dependencies.txt`
- Указать требуемые для тестов unix-пакеты в файле `server/test_packages.txt`
- Сконфигурировать переменные окружения - создать .env файлы в директориях server и client (смотри .env.template для примера) *в качестве адреса базы данных можно использовать docker ссылку db, например, mongodb://db:27017/*
- [Указать](https://github.com/nestybox/sysbox/blob/master/docs/user-guide/install-package.md#configuring-dockers-default-runtime-to-sysbox) sysbox средой выполнения docker-контейнеров по умолчанию

Для подробной информации и конфигурации портов, названий директорий и т.п смотрите файл [docker-compose.yaml](./docker-compose.yaml)
- Запустить контейнеры командой `docker-comopose up -d`

## Учётная запись администратора
После запуска приложения с пустой базой данных создайте пользователя-администратора.
Для этого нужно зарегстрироваться в системе под логином `admin`.
Пользователю-администратору доступны дополнительные действия, например - создание новой задачи.

# Запуск тестов
0. Выдать права текущему пользователю для работы с докер
1. Перейти в директорию db_solution_checker
2. python3 -m venv venv
3. source venv/bin/activate
4. pip install -r requirements.txt
5. `python3 -m unittest tests/test_<Название файла для запуска>`