from .data_fabric import DataFabric
from .hybrid_model import HybridModel
from .learning_control import LearningControl
from .decision_intelligence import DecisionIntelligence
from .financial_valuation import FinancialValuation
from .experience_layer import ExperienceLayer


class DigitalTwinPlatform:
    """High-level orchestrator for the self-learning digital twin."""

    def __init__(self):
        self.data_fabric = DataFabric()
        self.model = HybridModel()
        self.learning = LearningControl(self.model)
        self.decision = DecisionIntelligence(self.model)
        self.finance = FinancialValuation()
        self.experience = ExperienceLayer()

    def replay_history(self):
        """Example of using the platform to replay history."""
        self.data_fabric.ingest()
        return self.model.run_simulation()

    def predict_kpis(self):
        """Return mock KPI predictions."""
        return self.model.surrogate_predict({"state": "current"})

    def prescribe_actions(self):
        """Run optimization and RL training."""
        self.learning.train_rl_agent(episodes=1)
        return self.decision.optimize()
