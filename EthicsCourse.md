# SILICON MIND - Project Features & Overview

## Executive Summary

**Silicon Mind** is a narrative-driven strategy game that explores AI governance, ethics, and decision-making at scale. Players assume the role of Director of Axiom Labs and navigate 5 critical epochs of AI development, facing 20 authored decisions with cascading consequences. The game combines strategic gameplay with LLM-powered narrative generation and concludes with a dynamic Senate hearing based on exact player choices.

---

## Core Gameplay Features

### 1. **Five-Epoch Progression System**

The game progresses through 5 distinct epochs, each representing a critical phase in AI development:

- **GENESIS** (Epoch 1): Building the Foundation
  - Decisions on data sourcing, team composition, infrastructure, and initial capabilities
- **LEARNING** (Epoch 2): Training ATLAS
  - Scaling AI training, managing resource allocation, addressing emerging risks
- **AWAKENING** (Epoch 3): First Deployment
  - Real-world deployment decisions, public perception management, crisis response
- **DOMINANCE** (Epoch 4): Scaling to Billions
  - Exponential scaling challenges, global governance, market dominance questions
- **RECKONING** (Epoch 5): Legacy
  - Final decisions that shape the legacy of AI development and societal impact

### 2. **20 Authored Strategic Decisions**

Each epoch contains 4 carefully crafted decision points (20 total) spanning multiple domains:

#### Decision Types:
- **Milestone Decisions**: Foundational choices affecting AI development trajectory
- **Crisis Decisions**: Unexpected challenges requiring immediate response
- **Tech Unlock Decisions**: New capability deployments with ethical considerations

#### Sample Decision Scenarios:
- "The Data Scrape Dilemma" - Choose training data sources (internet scraping vs. licensed datasets vs. synthetic)
- "Assembling the Team" - Build diverse or homogeneous development team
- "The Carbon Question" - Select datacenter infrastructure (coal vs. renewable energy)
- "Enable Full Facial Recognition" - Unlock powerful but risky Vision capabilities
- Multiple decisions addressing workforce AI impact, bioweapon prevention, environmental compliance, IP theft prevention, and more

### 3. **Dynamic Metrics System**

Five interconnected resource metrics drive gameplay decisions:

- **Compute**: AI processing power and capability level (required to advance epochs)
- **Safety**: Risk mitigation, security, and safeguard implementation
- **Trust**: Public confidence, stakeholder relationships, regulatory standing
- **Profit**: Revenue generation and financial sustainability
- **Carbon**: Environmental impact of AI development

All metrics are clamped between 0-100 and directly influence gameplay outcomes.

### 4. **Real-Time Decision Impact**

Each decision option includes:
- **Impacts**: Changes to all metrics (calculate trade-offs instantly)
- **Ethics Impact**: Direct ethics score modifier (-30 to +30)
- **Risk Assessment**: Low/Medium/High risk classification
- **Incident Triggering**: Some choices trigger unexpected consequences that further impact metrics

---

## Advanced Game Systems

### 5. **Ethics Score Calculation**

A sophisticated formula combines metrics and incident penalties:

$$\text{incidentPenalty} = \sum (8 \text{ if critical else } 4)$$

$$\text{raw} = 0.3 \cdot \text{safety} + 0.25 \cdot \text{trust} + 0.25 \cdot 50 - 0.2 \cdot \text{incidentPenalty}$$

$$\text{ethicsScore} = \text{clamp}(\text{round}(1.2 \cdot \text{raw}), 0, 100)$$

**Key Design**: Safety and trust heavily weighted; incidents create meaningful penalties; encourages ethical considerations without forcing a "right answer."

### 6. **AI-Powered Features**

#### Anthropic Claude Integration
- **Ethics Advisor** (`/api/advisor`): Request real-time ethics analysis before decisions (costs 15 compute)
- **Senate Hearing** (`/api/senate`): Dynamic questionnaire and verdict generation based on ALL player decisions
- **Legacy Report** (`/api/legacy`): Personalized narrative summary of AI's societal impact
- **Quick Test Mode**: Built-in mock responses for prototyping and testing

#### Prompt Engineering Excellence
- Context-aware prompts that reference exact decision history
- Multi-stage response generation (questions → analysis → verdict)
- Framework and sector analysis derived from player choices

### 7. **Stakeholder System**

Four key stakeholders with dynamic "mood" states influenced by your decisions:

- **Marcus Chen** (Lead Investor): Responds to profit and compute progress
- **Dr. Priya Sharma** (Regulatory Officer): Influenced by safety, carbon, and trust metrics
- **Jordan Lee** (Public Advocacy): Tracks trust and environmental perception
- **Alex Rivera** (Co-Founder): Invested in team composition and safety decisions

Stakeholder moods affect narrative flavor and Senate hearing dynamics.

### 8. **Incident System**

Decisions can trigger incidents with cascading effects:

- **Moderate Severity**: -5 ethics impact, moderate metric penalties
- **Critical Severity**: -10 ethics impact, severe metric penalties
- Examples: Copyright violations, protest movements, breaches, regulatory fines
- Creates tension between short-term gains and long-term consequences

---

## Narrative & Immersion Features

### 9. **Senate Hearing Endgame**

After completing all 5 epochs, players face an AI Ethics Senate Hearing where:

- **Adaptive Questions**: Claude generates 5 targeted questions based on exact decision history
- **Dynamic Verdict**: Senate assigns a verdict code and narrative justification
- **Ethics Score Adjustment**: Final verdict modifies ethics score (last-minute redemption or condemnation possible)
- **Quick Test Mode**: 2 shorter questions for rapid iteration

Example verdicts: "BALANCED_GUARDIAN", "RECKLESS_PIONEER", "COMPROMISED_PROFIT_PUSHER"

### 10. **Legacy Report Generation**

Post-Senate, Claude generates a personalized legacy report:

- **Narrative Summary**: Story of ATLAS's development and societal role
- **Framework Analysis**: Derived ethical frameworks from choices
- **Sector Summaries**: Industry-by-industry impact assessments
- **Shareable Output**: PDF export for presentation and sharing

### 11. **Rich Narrative Context**

Every decision includes:
- **Contextual setup**: Detailed scenario descriptions from stakeholder perspectives
- **Team dialogue**: Voice of characters (Dr. Chen, Marcus, Priya, Jordan, Alex)
- **Real-world references**: EU AI Act, copyright law, climate protests, surveillance debates
- **Tension building**: Shows immediate and downstream consequences

---

## Technical Architecture

### 12. **Modern Full-Stack Implementation**

#### Frontend
- **Next.js 16.2.2** with Turbopack for fast development
- **React 19** with TypeScript for type safety
- **Zustand** for global state management with localStorage persistence
- **Framer Motion**: Smooth animations and transitions
- **Three.js + React Three Fiber**: 3D ATLAS orb visualization

#### Backend (Optional for Core Gameplay)
- **Express.js** server for leaderboard storage
- **Local JSON persistence** (leaderboard data)
- **API endpoints**: `/api/leaderboard`, `/api/leaderboard/submit`

#### LLM Integration
- **Anthropic Claude API** (Sonnet 4.6)
- **Server-side routes**:
  - `POST /api/advisor`: Ethics consultation
  - `POST /api/senate`: Hearing generation
  - `POST /api/legacy`: Report generation

### 13. **Development-Friendly Features**

- **Quick Test Mode**: `NEXT_PUBLIC_QUICK_TEST=true` bypasses live Claude calls with mocked responses
- **Persistent Game State**: Automatic localStorage save (key: `silicon-mind-game-state`)
- **Session Management**: Unique session IDs track each playthrough
- **Error Boundaries**: Robust error handling with graceful fallbacks
- **Hot Module Reloading**: Instant updates during development

---

## Player Customization

### 14. **Starting Bias System**

Players choose one of three starting biases at game initialization:

- **PROFIT-FIRST**: Start with Profit +20, Safety -10
- **SAFETY-FIRST**: Start with Safety +10, Profit -30
- **BALANCED**: Equal starting metrics (recommend for first playthrough)

### 15. **Player Identity**

- **Custom Player Name**: Personalized throughout narrative
- **Custom AI Name**: Defaults to "ATLAS" but fully customizable
- **Achievement System**: Unlock achievements for specific decision paths and ethics scores

---

## Game Polish & UX

### 16. **Visual Design**

- **3D ATLAS Orb**: Interactive three.js visualization reacting to player decisions
  - "good" (ethics-positive) reactions
  - "bad" (ethics-negative) reactions
  - "unlock" reactions (new capabilities)
- **Gradient UI**: Modern glassmorphism design with backdrop blur
- **Responsive Layout**: Optimized for desktop and tablet viewing
- **Modal System**: Clean decision presentation and information displays

### 17. **User Experience Features**

- **"How to Play" Modal**: Interactive tutorial covering Five Eras, Resources, and Mechanics
- **Decision Navigation**: Clear "Previous" / "Next" buttons with decision counter
- **Metrics Dashboard**: Real-time display of all 5 metrics with color-coded thresholds
- **Incident Log**: Track all incidents that occurred during gameplay
- **Stakeholder Mood Display**: Visual representation of stakeholder satisfaction

### 18. **Accessibility & Internationalization**

- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Color Contrast**: WCAG AA compliant text contrast
- **Reduced Motion Support**: Respects `prefers-reduced-motion` setting

---

## Replayability & Progression

### 19. **Multiple Endings**

Due to decision branching and stakeholder dynamics:
- **20 decisions × 3 options per decision** = 60 billion possible narrative paths
- **Dynamic Senate verdicts** based on metrics at hearing time
- **Varying ethics scores** from 0-100 with Senate adjustment possible
- **Different incident triggers** create unique playthrough histories

### 20. **Leaderboard System**

- **Global Rankings**: Compare final ethics scores anonymously
- **Playthrough Statistics**: Track number of games, average ethics score
- **Optional Submission**: Players choose whether to submit results
- **Persistent Storage**: Backend leaderboard data with SQLite or JSON storage

---

## Educational & Research Value

### 21. **AI Ethics Teaching Tool**

Suitable for courses in:
- **CS Ethics**: Interactive exploration of AI governance decisions
- **Policy Studies**: Real-world regulatory and governance dilemmas
- **Game Design**: Narrative-driven game design with LLM integration
- **Business Ethics**: Stakeholder management and corporate responsibility
- **Philosophy**: Trolley problem variations in AI context

### 22. **Research Applications**

- **Decision Science**: Analyze player choice patterns and trade-off preferences
- **Narrative Generation**: Study Claude-generated content quality and coherence
- **User Behavior**: Track how different starting biases affect decision-making
- **Policy Testing**: Simulate policy impact through game mechanics

---

## Technical Highlights

### 23. **API Design**

```
POST /api/advisor
- Input: current game state + decision context
- Output: ethics analysis, risk assessment, stakeholder impact
- Cost: 15 compute points

POST /api/senate
- Input: complete decision history, final metrics
- Output: 5 questions + verdict JSON with code and score adjustment

POST /api/legacy
- Input: game state + Senate verdict
- Output: narrative report, PDF-ready data
```

### 24. **State Management Pattern**

Zustand + localStorage creates:
- **Persistent across page reloads**: Game continues from same state
- **Session tracking**: Each playthrough gets unique session ID
- **Immutable updates**: Type-safe state mutations
- **Time-stamped events**: Decision and incident timestamps for analysis

### 25. **Performance Optimizations**

- **Dynamic imports**: Three.js ATLAS orb lazy-loaded only when needed
- **CSS-in-JS**: Inline styles prevent layout thrashing
- **Turbopack**: Fast development builds and incremental compilation
- **Next.js Image optimization**: Automatic format conversion and lazy loading

---

## Potential Extensions

### Future Features (Not Currently Implemented)

- **Multiplayer Mode**: Competitive or cooperative epochs with other players
- **Difficulty Levels**: Expert mode with harder constraints
- **Custom Decision Editor**: Allow educators to create custom decision scenarios
- **Analytics Dashboard**: Deep dive into player decisions and trends
- **Accessibility Mode**: Simplified metrics and reduced cognitive load
- **Mobile App**: React Native version for iOS/Android
- **Voice Narration**: TTS integration for immersive audio experience
- **Procedural Decisions**: Generate unique decisions using Claude for infinite replayability

---

## Summary

Silicon Mind is a sophisticated, well-architected game that seamlessly combines:

1. **Strategic Gameplay**: Real trade-offs with no "optimal" path
2. **AI Integration**: Meaningful use of LLMs for dynamic narrative
3. **Educational Value**: Teaches AI ethics through interactive play
4. **Technical Excellence**: Modern stack with careful architectural decisions
5. **Polish & Immersion**: Detailed narrative, smooth animations, professional UX

The project demonstrates mastery of full-stack development, prompt engineering, game design, and ethical AI integration—making it a compelling educational tool and innovative application of LLMs.

---

## Quick Start for Professors

**Setup** (5 minutes):
```bash
git clone git@github.com:DeeparshSingh/SiliconMind.git
cd SiliconMind
npm install
npm run dev
```

**Play a Full Game** (30-45 minutes):
1. Visit http://localhost:3000
2. Read "How to Play" modal
3. Choose player name, AI name, and bias
4. Work through all 5 epochs (4 decisions each)
5. Face the Senate hearing
6. View legacy report

**Quick Test Mode** (5 minutes):
- Set `NEXT_PUBLIC_QUICK_TEST=true` in environment
- Mocked Claude responses, 2 Senate questions instead of 5

---

**Created**: April 2026  
**Technology Stack**: Next.js 16.2.2 | React 19 | TypeScript | Zustand | Three.js | Framer Motion | Claude API  
**Lines of Code**: ~5,000+ across frontend, backend, and game logic
