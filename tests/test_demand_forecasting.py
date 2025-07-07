import os
import csv
import tempfile
import unittest
import subprocess
import re

from demand_forecasting import moving_average, read_data
from generate_fake_data import generate_fake_data


class TestDemandForecasting(unittest.TestCase):
    def test_moving_average(self):
        data = [10, 20, 30, 40]
        self.assertEqual(moving_average(data, 2), 35.0)
        self.assertEqual(moving_average(data, 4), 25.0)

    def test_read_data(self):
        fd, path = tempfile.mkstemp()
        os.close(fd)
        try:
            with open(path, "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerow([1])
                writer.writerow([2.5])
            self.assertEqual(read_data(path), [1.0, 2.5])
        finally:
            os.remove(path)

    def test_cli_with_fake_data(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            csv_path = os.path.join(tmpdir, "data.csv")
            generate_fake_data(csv_path, size=5, seed=1)
            expected = moving_average(read_data(csv_path), 3)
            result = subprocess.run(
                ["python", "demand_forecasting.py", csv_path, "-w", "3"],
                check=True,
                stdout=subprocess.PIPE,
                text=True,
            )
            match = re.search(r"Forecast for next period: ([0-9.]+)", result.stdout)
            self.assertIsNotNone(match)
            forecast = float(match.group(1))
            self.assertAlmostEqual(forecast, expected, places=2)


if __name__ == "__main__":
    unittest.main()
