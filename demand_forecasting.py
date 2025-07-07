import csv
import argparse


def read_data(csv_file):
    """Read a single-column CSV file of numeric demand values."""
    values = []
    with open(csv_file, newline='') as f:
        reader = csv.reader(f)
        for row in reader:
            if not row:
                continue
            try:
                values.append(float(row[0]))
            except ValueError:
                raise ValueError(f"Invalid numeric value: {row[0]}")
    return values


def moving_average(data, window):
    """Return the moving average forecast for the next period."""
    if window <= 0:
        raise ValueError("window must be positive")
    if len(data) < window:
        raise ValueError("Not enough data for the specified window")
    return sum(data[-window:]) / window


def main():
    parser = argparse.ArgumentParser(
        description="Simple demand forecasting using moving average"
    )
    parser.add_argument(
        "csv_file", help="Path to CSV file with historical demand values"
    )
    parser.add_argument(
        "-w",
        "--window",
        type=int,
        default=3,
        help="Moving average window size (default: 3)",
    )
    args = parser.parse_args()

    data = read_data(args.csv_file)
    forecast = moving_average(data, args.window)
    print(f"Forecast for next period: {forecast:.2f}")


if __name__ == "__main__":
    main()
