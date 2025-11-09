# Microbiology Discoveries Studio

Microbiology Discoveries Studio is a lightweight collection of browser-based simulations designed for undergraduate microbiology courses. Each simulation focuses on a key scientist, concept, or experimental workflow, using clean visuals and short explanations to encourage exploration instead of memorization.

This set is intended for use in teaching environments (lectures, labs, online modules) where students can quickly launch an interactive and connect what they see to core microbiology ideas.

Built by **Gursahib Singh**  
Concept idea by **Naowarat Cheeptham**  
**Thompson Rivers University**

---

## Project Goals

- Highlight landmark contributions of **Louis Pasteur**, **Robert Koch**, **Alexander Fleming**, and antibiotic-era microbiology.
- Provide **simple, self-contained HTML simulations** that:
  - Run directly in a modern browser (no build step).
  - Use a consistent, student-friendly visual language.
  - Give immediate visual feedback for each control or step.
- Support instructors with ready-to-use interactives that align with core topics:
  - Germ theory, pasteurization, fermentation
  - Koch’s postulates, staining, pure culture, growth
  - Penicillin discovery, zones of inhibition, resistance, and production

---

## How to Run

1. Clone or download this project.
2. Open any of the HTML files in your browser:
   - Recommended starting point:
     - [`microbiology_discoveries_dashboard.html`](microbiology_discoveries_dashboard.html)
   - This dashboard links to all included simulations.

No additional build tools are required. All simulations load **Tailwind CSS** (via CDN) and **p5.js** (via CDN) directly.

---

## Key Simulations

- Louis Pasteur
  - [`Louis-Pasteur/pasteurization_simulation.html`](Louis-Pasteur/pasteurization_simulation.html)
  - [`Louis-Pasteur/pasteur_fermentation_simulation.html`](Louis-Pasteur/pasteur_fermentation_simulation.html)
  - [`Louis-Pasteur/pasteur_rabies_vaccine_simulation.html`](Louis-Pasteur/pasteur_rabies_vaccine_simulation.html)
  - [`Louis-Pasteur/microscopic_observation_lab.html`](Louis-Pasteur/microscopic_observation_lab.html)

- Robert Koch
  - [`koch/koch_postulates_simulation.html`](koch/koch_postulates_simulation.html)
  - [`koch/staining_technique_simulation.html`](koch/staining_technique_simulation.html)
  - [`koch/pure_culture_agar_plate_simulation.html`](koch/pure_culture_agar_plate_simulation.html)
  - [`koch/broth_bacterial_growth_simulation.html`](koch/broth_bacterial_growth_simulation.html)
  - [`koch/tb_identification_simulation.html`](koch/tb_identification_simulation.html)

- Alexander Fleming & Antibiotics
  - [`fleming/fleming_penicillin_discovery_simulation.html`](fleming/fleming_penicillin_discovery_simulation.html)
  - [`fleming/zone_of_inhibition_measurement_simulation.html`](fleming/zone_of_inhibition_measurement_simulation.html)
  - [`fleming/antibiotic_resistance_evolution_simulation.html`](fleming/antibiotic_resistance_evolution_simulation.html)
  - [`fleming/antibiotic_production_visualization_simulation.html`](fleming/antibiotic_production_visualization_simulation.html)

---

## Design & Implementation Notes

- One HTML file per simulation (no framework lock-in).
- Shared patterns:
  - Light, teal-accented theme.
  - “Glass” cards with concise headings and legends.
  - Compact controls (buttons/sliders) that immediately update the visualization.
  - Short, focused text panels explaining:
    - “How to use”
    - “What this shows”
    - Links back to the scientist’s contribution or clinical idea.
- Animations:
  - Implemented with **p5.js**.
  - Kept gentle and purposeful: particle fields, colonies, rods, halos, tanks, etc.

For authoring new simulations in the same style, see the internal guide:
- [`README_simulation_style.md`](README_simulation_style.md)

---

## Intended Use

- Undergraduate microbiology courses (in-person or online).
- Quick interactive demos during lectures.
- Pre-lab or post-lab visualization activities.
- Self-paced student exploration of:
  - Experimental logic
  - Visual patterns (staining, growth, inhibition zones)
  - Historical contributions mapped onto modern practice

All simulations are conceptual, not diagnostic tools. Parameters and visuals are tuned for intuition and teaching clarity.
