# ChatGPT

This repository contains a simple demand forecasting tool implemented in pure Python.

## Overview

The `demand_forecasting.py` script reads a CSV file with historical demand values and
computes a forecast for the next period using a moving average method.

## Usage

1. Prepare a CSV file containing one numeric demand value per line.
2. Run the forecaster specifying the path to the CSV file and (optionally) the window size:

```bash
python demand_forecasting.py path/to/data.csv -w 3
```

This will output the forecast for the next period based on the moving average of the
last `w` data points.

## Tests

Unit tests are located in the `tests` directory and can be executed with:

```bash
python -m unittest discover tests
```

