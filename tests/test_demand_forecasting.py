import os
import csv
import tempfile
import unittest

from demand_forecasting import moving_average, read_data


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


if __name__ == "__main__":
    unittest.main()
