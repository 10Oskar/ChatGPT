# Weights & Governance

- **Source of truth**: YAML files per role in `apps/services/prio-svc/src/weights.*.yml`.
- **Change control**: updates require approval from the Supply Network Governance board. Commit changes with rationale in ADRs.
- **Pairwise consistency**: ensure the computed consistency ratio remains < 0.1 before deploying new weights.
- **Audit trail**: prio-svc persists prior weight files and exposes ranked outputs with detailed contribution explanations for each criterion.
- **Review cadence**: quarterly review with ad-hoc adjustments for major incidents.
