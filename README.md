# ChatGPT

This repository contains a simple demand forecasting tool implemented in pure Python.
It also includes a prototype **Digital Twin platform** demonstrating a modular
architecture for simulation and machine-learning driven decision support.

## Overview

The `demand_forecasting.py` script reads a CSV file with historical demand values and
computes a forecast for the next period using a moving average method.

## Usage

1. Prepare a CSV file containing one numeric demand value per line. You can
   generate a sample dataset using the `generate_fake_data.py` script:

   ```bash
   python generate_fake_data.py output.csv -n 10 --seed 1
   ```

2. Run the forecaster specifying the path to the CSV file and (optionally) the window size:

```bash
python demand_forecasting.py path/to/data.csv -w 3
```

This will output the forecast for the next period based on the moving average of the
last `w` data points.

## Digital Twin Prototype

The `digital_twin` package bundles a simplified implementation of the
"self-learning Digital Twin" outlined in the program specification. It provides
stubs for data ingestion, hybrid modelling, reinforcement learning and
decision intelligence.

Instantiate the platform as follows:

```python
from digital_twin import DigitalTwinPlatform

dt = DigitalTwinPlatform()
dt.data_fabric.add_source("example_source")
dt.replay_history()
```

## Tests

Unit tests are located in the `tests` directory and can be executed with:

```bash
python -m unittest discover tests
```

