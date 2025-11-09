# Microbiology Simulation Design Guide

This guide explains how to build new HTML-based microbiology simulations in the same style as the existing ones in this project (Pasteur, Koch, microscopy labs, etc.).

Use it as a template whenever you want to add another interactive for undergraduate learners.

## Core Principles

- One HTML file per simulation.
- Light, clean UI using Tailwind CSS via CDN.
- Use p5.js for:
  - Animated backgrounds
  - Microscopic fields
  - Particles, rods, bubbles, colonies, etc.
- Keep explanations short and student-friendly.
- Use a consistent visual language:
  - Rounded “glass” cards
  - Compact headers
  - Small legends and pills to explain colors and icons
  - Clear step-by-step labels and status text
- Every control should:
  - Be obvious (button/slider text = the action)
  - Immediately change the visualization
  - Be paired with 1–2 lines explaining what just happened

## File Structure Template

For each new simulation, follow this layout:

1. Top-level HTML file (or inside a scientist/topic folder):
   - Examples:
     - `pasteur_fermentation_simulation.html`
     - `koch/koch_postulates_simulation.html`
     - `koch/tb_identification_simulation.html`
     - `koch/staining_technique_simulation.html`
     - `koch/pure_culture_agar_plate_simulation.html`
     - `microscopic_observation_lab.html`

2. Inside the file:
   - `<head>`:
     - `<meta charset="UTF-8">`
     - `<meta name="viewport" ...>`
     - `<title>` with a clear student-facing title
     - Tailwind CSS CDN:
       - `https://cdn.tailwindcss.com?plugins=typography`
     - p5.js CDN if you need animation:
       - `https://cdn.jsdelivr.net/npm/p5@1.9.2/lib/p5.min.js`
     - A `<style>` block that defines:
       - Root color variables
       - `.glass-card` (rounded, soft shadow)
       - Small utility styles for:
         - `.chip` (top-left label)
         - `.pill` (legend items)
         - `.overlay-label` (label inside canvas)
         - `.btn-step` (small rounded buttons)
         - Any slider tweaks

   - `<body>` main layout:
     - Outer `<main>` with max width.
     - Header `.glass-card`:
       - Chip label (e.g. “Robert Koch • Tuberculosis Lab”).
       - H1: short, clear name of the simulation.
       - 1–2 sentence description.
       - Small pill on the right with a hint (“Follow steps below”, etc.).
     - Content grid: two columns on desktop, stacked on mobile:
       - Left column:
         - Legend pills (explain colors/shapes).
         - Canvas container with an overlay label.
         - Controls (buttons/sliders).
         - A short dynamic summary paragraph.
       - Right column:
         - 1–3 small cards:
           - “How to use”
           - “What this shows”
           - “Link to Pasteur/Koch/clinical idea”
         - All written in simple bullet points.

## Interactivity Pattern

For each simulation:

1. Define a small JS state object:
   - Example:
     - Current step (e.g. unstained → stained → decolorized → counterstained)
     - Current slider values (e.g. temperature, sugar, magnification, focus)
     - Any key metrics (e.g. growth rate, virulence, antibody response)

2. Wire controls to state:
   - Buttons:
     - On click, update state (e.g. `setStep("Stained")`).
   - Sliders:
     - On input, set the corresponding value and call an update function.

3. Keep text updates centralized:
   - Use helper functions like:
     - `updateSummary()`
     - `updateStatus()`
   - Each time state changes:
     - Update one short line explaining what the learner is seeing right now.

4. Use p5.js to reflect state:
   - `setup()`:
     - Create a canvas inside `#sketch-container`.
     - Initialize particles, rods, bacteria, colonies, etc.
   - `draw()`:
     - Draw a stable frame (microscope circle, plate, vessel).
     - Use current state to:
       - Pick colors (e.g. red vs blue rods in acid-fast stain).
       - Pick density (e.g. more dots vs isolated colonies).
       - Pick clarity (e.g. blur overlay when out of focus).
   - Keep animations gentle:
     - Slight drift or floating.
     - Simple fades or color transitions.
     - Avoid distracting or complex motion.

## Examples of Features to Reuse

When building a new simulation, reuse patterns from existing files:

- Staining / identification:
  - Step buttons for stain sequence.
  - Color changes on shapes to show who keeps/loses dye.
  - Good references:
    - `koch/staining_technique_simulation.html`
    - `koch/tb_identification_simulation.html` (see this one for a clear, compact acid-fast workflow)

- Koch’s postulates / logical steps:
  - Four clickable steps.
  - Simple icons (🧪, 🧫, 🐭, 🔁).
  - Each step updates what p5.js draws.
  - Reference:
    - `koch/koch_postulates_simulation.html`

- Growth and culture:
  - Sliders for conditions (temperature, sugar, oxygen, time).
  - Visual density and simple metrics that respond immediately.
  - References:
    - `broth_bacterial_growth_simulation.html`
    - `pasteur_fermentation_simulation.html`
    - `koch/pure_culture_agar_plate_simulation.html`

- Microscope / focus:
  - Sliders for magnification and focus.
  - Circular field-of-view with blur vs sharp transitions.
  - References:
    - `microscopic_observation_lab.html`
    - `koch/tb_identification_simulation.html` (for how step-based staining alters what appears in the same field)

## Step-by-Step Recipe for a New Simulation

When you define a new simulation, follow this sequence:

1. Choose one clear concept:
   - Examples:
     - Spore staining
     - Bacterial motility
     - Biofilm formation
     - Virus vs bacteria size comparison

2. Define 2–4 learner actions:
   - Examples:
     - Apply or remove a stain.
     - Change temperature or oxygen.
     - Change magnification or focus.
     - Toggle presence/absence of a factor.

3. For each action:
   - Add a button or slider with a direct, descriptive label.
   - Decide exactly how the visualization should change.
   - Add 1 short sentence explaining the effect.

4. Implement using an existing file as a starting point:
   - Copy one of the existing simulation HTML files.
   - Update:
     - Title and header.
     - Legend pills and overlay label.
     - Controls and state variables.
     - p5.js draw logic to match the new concept.

5. Ensure:
   - Every interaction gives immediate visual feedback.
   - Text stays short and clear.
   - Layout and style match the rest of this collection.

By following this guide and looking at the example implementations (especially [`koch/tb_identification_simulation.html`](koch/tb_identification_simulation.html) for a compact, step-based microscope view), you can continue adding consistent, easy-to-use simulations for your microbiology teaching set.