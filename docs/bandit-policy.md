# Bandit Policy Notes

- **Algorithm**: Thompson Sampling using beta distributions per action bucket.
- **Reward function**: weighted sum of lead-time reduction (+), CSAT proxy (+), resolution time (-), contract bonus (+), expedite cost (-), fairness penalty (-).
- **Offline evaluation**: run the simulator in `packages/simulation` to replay seeded history and visualise regret curves.
- **Governance**: keep bandit disabled in production until fairness penalty stays within defined guardrails for four consecutive reviews.
- **Logging**: posterior updates emitted as events to Redis Streams for audit.
