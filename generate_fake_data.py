import csv
import random
import argparse


def generate_fake_data(path, size=20, seed=None):
    """Generate a CSV file with fake demand values."""
    random.seed(seed)
    with open(path, "w", newline="") as f:
        writer = csv.writer(f)
        for _ in range(size):
            writer.writerow([random.randint(50, 150)])


def main():
    parser = argparse.ArgumentParser(description="Generate fake demand data")
    parser.add_argument("output", help="Output CSV file")
    parser.add_argument("-n", "--num", type=int, default=20,
                        help="Number of records to generate (default: 20)")
    parser.add_argument("--seed", type=int, default=None,
                        help="Random seed for reproducibility")
    args = parser.parse_args()
    generate_fake_data(args.output, args.num, args.seed)


if __name__ == "__main__":
    main()
