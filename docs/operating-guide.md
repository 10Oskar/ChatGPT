# Operating the Command Centre

1. **Log in** via the Next.js dashboard and select your role view.
2. **Monitor KPIs** on the SAC dashboard. Composite score below 0.85 triggers additional scrutiny.
3. **Order Lookup**: search by confirmation number to view lifecycle, pegging status, and shipments.
4. **Detect & Act Workboard**: triage active alerts, review recommended playbooks, and apply actions. Resolution timers are shown per alert.
5. **Pegging Decisions**: run the `/peg/allocate` endpoint with the SKU and quantity. The rationale includes contract tier, criticality, and fairness guardrails.
6. **Prioritisation**: consult the supply dashboard hot list sourced from the AHP engine. Consistency ratios are logged in the prio service output.
7. **Dynamic Picking**: DC operators trigger `/resequence/{facility}` before cut-off to obtain the updated pick queue. Released sequences are published back to the EWM adapter.
8. **Risk Briefing**: review newly generated `ExternalRisk` alerts caused by the daily risk scan. Apply the “Carrier Strike” playbook when relevant.
9. **Master Data Issues**: run the mdm-guardian scan to populate the worklist of HS code gaps and assign owners with SLAs.
10. **Simulation Sandbox**: run what-if scenarios, interpret time/cost/CO₂ deltas, and manually promote approved scenarios to operations.
