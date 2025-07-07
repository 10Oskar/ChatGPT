class ExperienceLayer:
    """User-facing dashboards and interfaces."""

    def __init__(self):
        self.dashboards = []

    def add_dashboard(self, name):
        self.dashboards.append(name)

    def display(self):
        for dash in self.dashboards:
            print(f"Showing dashboard: {dash}")
