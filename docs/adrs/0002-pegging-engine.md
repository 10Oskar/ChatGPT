# ADR 0002: Rule-based Pegging Engine

- **Context**: Allocation decisions must be auditable before ML adoption.
- **Decision**: Implement deterministic rule ordering with contract tier, criticality, aging, and fairness guardrails. Persist rationale in `PegAllocation` records.
- **Consequences**: Enables rapid justification of allocations and supports future policy tuning via YAML without code rewrites.
