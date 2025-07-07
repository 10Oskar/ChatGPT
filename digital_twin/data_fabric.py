class DataFabric:
    """Ingests and stores various data sources for the digital twin."""

    def __init__(self):
        self.sources = []
        self.features = {}

    def add_source(self, source):
        """Register a new data source."""
        self.sources.append(source)

    def ingest(self):
        """Ingest data from registered sources (placeholder implementation)."""
        for src in self.sources:
            print(f"Ingesting from {src}")

    def build_feature_store(self):
        """Create a basic feature store (mock implementation)."""
        self.features = {src: f"features_from_{src}" for src in self.sources}
