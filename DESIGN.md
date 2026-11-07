---
name: Gorod Logistics Design System
description: Clean Enterprise Light Desk for Customs-Bonded Warehouse (CBW TRV1U001) operations and statutory compliance under the Indian Customs Act 1962.
colors:
  primary: "#0c323b"
  brand-crimson: "#852929"
  brand-navy: "#0c1e28"
  neutral-bg: "#f1f5f9"
  surface: "#ffffff"
  surface-subtle: "#f8fafc"
  border: "#e2e8f0"
  border-subtle: "#f1f5f9"
  text-primary: "#0f172a"
  text-secondary: "#475569"
  text-muted: "#64748b"
  status-alert: "#b91c1c"
  status-alert-bg: "#fef2f2"
  status-alert-border: "#fecaca"
  status-success: "#047857"
  status-success-bg: "#ecfdf5"
  status-success-border: "#a7f3d0"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontWeight: 800
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.brand-crimson}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  card-master:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
---

## Overview

The Gorod Logistics design system is built specifically for high-reliability maritime logistics and Customs Bonded Warehouse (CBW) operations in India. It pairs an authoritative station shell with a high-density, high-legibility enterprise work desk calibrated for warehouse terminal monitors under ambient fluorescent lighting.

## Colors

- **Station Command (Deep Navy)**: `#0c1e28` anchors the primary station navigation bar and authority indicators.
- **Brand Petroleum**: `#0c323b` carries operational accents and secondary actions.
- **Customs Crimson**: `#852929` is reserved for primary statutory actions (e.g. Register Inward BOE, Customs Bond Officer escalations) and official seals.
- **Work Surface**: `#ffffff` master card and data table surfaces on an institutional `#f1f5f9` / `#f8fafc` slate floor.
- **Regulatory States**:
  - Discrepancy / Hold (> ±5 kg): `#b91c1c` text on `#fef2f2` with `#fecaca` hairline border.
  - Normal / Compliant: `#047857` on `#ecfdf5` with `#a7f3d0` hairline border.
  - Outpass Gatepass: `#1d4ed8` on `#eff6ff` with `#bfdbfe` hairline border.

## Typography

- **Headings & Badges**: Clean, weighted sans-serif (`Plus Jakarta Sans` / `Outfit` for brand hero).
- **Data & Tables**: Strict tabular figures (`tabular-nums`) with `font-mono` applied exclusively to reference identifiers (`GL-JOB-YYYY-XXXX`, `BOE-XXXXXXX`, `GL-GP-YYYY-XXXX`, weight values, and bond numbers).

## Layout

- **Station Header**: Sticky top navigation bar displaying official CBW license number (`TRV1U001`), bond number (`2002591018`), active station officer, and database sync status.
- **Operational Metrics Ribbon**: Integrated horizontal metric ledger with clean 1px dividers replacing generic floating stat boxes.
- **Segmented Filter Toolbar**: High-efficiency tabbed views with count badges and live search.
- **Consignment Master Ledger**: High-density table with expandable inline inspection drawers.

## Elevation & Depth

- Restrained depth: `shadow-xs` and `shadow-sm` with soft blur and offset. No glowing borders, zero-blur neobrutalist offset shadows, or decorative neon gradients.

## Shapes

- Functional corner radii: `rounded-md` (6px) for interactive buttons, tabs, and form inputs; `rounded-xl` (12px) for primary surface containers.

## Components

- **Statutory Authority Banner**: Concise legal custody summary under Section 57/58 of the Indian Customs Act 1962.
- **Consignment Master Row**: Scannable row with Job Number, BOE, Consignee, Cargo description, Weighbridge scale delta check, and role-gated action buttons.
- **Inspection Drawer**: Expandable inline drawer showing statutory custody details, weighbridge tolerance breakdown, and outward gate readiness checklist.
- **Inward Job Registration Modal**: Clean dialog enforcing the 1:1 BOE to Job Number statutory ratio (SOP 4.1.1).

## Do's and Don'ts

### Do
- Use tabular numerals and monospaced font for customs and weight numbers.
- Emphasize statutory compliance rules (SOP 4.1.1, SOP 4.1.8, SOP 4.2.6).
- Keep contrast high and borders crisp (1px `#e2e8f0`).
- Ensure state badges carry explicit labels (e.g., `+8.2 kg Delta BREACH SOP 4.1.8`).

### Don't
- Do not use generic dark-mode sci-fi templates with glowing gradients or purple/cyan accents.
- Do not use oversized floating cards with giant numbers and tiny labels as page structure.
- Do not use eyebrow kickers or generic decorative pills above headings.

