import unittest
from digital_twin import DigitalTwinPlatform


class TestDigitalTwinPlatform(unittest.TestCase):
    def test_platform_initialization(self):
        dt = DigitalTwinPlatform()
        self.assertIsNotNone(dt.data_fabric)
        self.assertIsNotNone(dt.model)
        self.assertIsNotNone(dt.learning)
        self.assertIsNotNone(dt.decision)
        self.assertIsNotNone(dt.finance)
        self.assertIsNotNone(dt.experience)


if __name__ == "__main__":
    unittest.main()
