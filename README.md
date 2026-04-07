# MatchDay Navigator
**Clarity at scale.**

MatchDay Navigator is a matchday navigation and information platform designed to support
large‑scale live events such as the FIFA World Cup 2026.  
It provides clear, trusted guidance to participants at scale, delivered through a
static web interface and WhatsApp‑based messaging services.

The service is operated by **SUKA CONSULTING SERVICES, LLC** (Seattle, WA, USA).

---

## Platform Purpose

Large sporting events introduce complexity: transportation, access rules, safety updates,
and real‑time disruptions. MatchDay Navigator exists to reduce friction, improve flow,
and help people move with confidence on matchdays.

The platform is intentionally designed around:
- Clarity over volume
- Trust over novelty
- Responsible use of automation

---

## Deployment Architecture

This repository hosts a **static web application** deployed on Render.  
All logic is client‑side; there is no server build step.

### Render Configuration (Confirmed)

- **Service Type:** Static Site
- **Build Command:** *(empty)*
- **Publish / Root Directory:** `./`  
  *(or `/public` if using sub‑folder deployment — see below)*
- **Auto‑Deploy:** Enabled (on commit to `main`)

---

## File & Directory Structure

Depending on deployment mode, files may be hosted directly at the root or under `/public`.

### Example Structure
