# Gorod Logistics — Customs Bonded Warehouse (CBW TRV1U001)

## Product Truth

Gorod Logistics (Gorod International Agency Pvt Ltd) operates a licensed Public Customs-Bonded Warehouse (CBW License: TRV1U001) and freight management facility in Thiruvananthapuram, Kerala, India.

The platform combines a public-facing logistics portal & tariff engine with an internal operational ERP desk (`/admin`) and statutory Standard Operating Procedure (SOP) compliance console (`/sop`) governed strictly by the Indian Customs Act 1962.

## Users & Personas

- **Warehouse Keeper** (Statutory Custodian): Responsible for overall warehouse governance, physical custody of bonded cargo, statutory registers, ICEGATE monthly returns, and approving space certificates.
- **Customs Bond Officer** (Jurisdictional Customs): Supervises Section 60 Into-Bond orders, receives statutory discrepancy escalations (e.g. gross weight variance exceeding ±5 kg per SOP 4.1.8), conducts bond audits.
- **Warehouse Manager / Ops Team**: Receives consignments at the dock, operates the weighbridge scale, assigns bay locations, issues Goods Receipt Acknowledgements (GRA).
- **Accounts Desk**: Verifies storage tariffs, handling charges, and statutory duties to issue the No Dues Certificate (NDC) that unlocks gate passes.
- **Security / Gate Desk**: Verifies physical outpass credentials and authorizes cargo removal (SOP 4.2.6).

## Core Operational Mechanics

1. **1:1 BOE to Job Ratio (SOP 4.1.1)**: Every Bill of Entry (Into-Bond BOE) must map to exactly one unique Job Reference (`GL-JOB-YYYY-XXXX`).
2. **Weighbridge Discrepancy Protocol (SOP 4.1.8)**: Any variance between declared manifest gross weight and actual physical weighbridge scale weight exceeding ±5 kg immediately triggers a statutory hold and Customs Bond Officer notification requirement.
3. **Outward Removal & Gate Clearance (SOP 4.2.6)**: Cargo cannot leave the bonded premises without dual clearance: Accounts NDC and Customs clearance, unlocking a unique Outpass Gatepass Number (`GL-GP-YYYY-XXXX`).
4. **Data Reliability**: Operates against Supabase PostgreSQL with Row Level Security (RLS) and real-time health telemetry, falling back to local demo fixtures for training and offline audits.

## Platform & Stack

- **Platform**: Web (Desktop-first operational desk for warehouse workstations, logistics desks, and customs terminals)
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Backend / DB**: Supabase (PostgreSQL with RLS)
- **Icons**: Lucide React

