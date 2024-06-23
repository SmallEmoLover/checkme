import os
import unittest

from src.api import check_solution


SAKILA_DB_PATH = os.path.join(os.getcwd(), "tests/sakila_db")


class TestExercise(unittest.TestCase):

    def test_exercise(self):
        """
            Тестируем работоспособность модуля на наборе заданий из 29 штук. Используем проверяющие файлы в качестве
                проверяемых.
            ОР:
                все решения верны
        """

        # для наглядности эксперимента используем проверяющие файлы в качестве проверяемых
        check_files = {f"verify_sol{i}.sql": f"verify_sol{i}.sql" for i in range(1, 25) if i not in (11,)}
        check_files["to_be_checked11.sql"] = "verify_sol11.sql"

        result = check_solution(
            "mysql",
            SAKILA_DB_PATH,
            check_files,
            ["sakila-schema.sql", "sakila-data.sql"]
        )

        print(result)

        self.assertTrue(all(result.values()))


if __name__ == "__main__":
    unittest.main()
