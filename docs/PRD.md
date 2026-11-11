# Product Requirements Document (PRD)
## JobVastundhi 🎯
> **Ace Your Technical Interview.**  
> *Most-Asked Technical Interview Questions for Freshers & Entry-Level Developers.*  
> **Developed by Sharief**

---

## 1. Product Overview & Vision
**JobVastundhi** is an ultra-fast, zero-friction, 100% client-side technical interview preparation platform designed specifically for college freshers, final-year engineering students, and entry-level developers preparing for IT campus placements, MNC recruitment drives (TCS, Infosys, Wipro, Accenture, Cognizant), and tech startup technical rounds.

The application eliminates all onboarding friction: **no registration, no passwords, no databases, and no tracking**. Users provide their personal Google Gemini API key (Bring Your Own Key - BYOK), which is stored strictly within browser `localStorage`. 

JobVastundhi simulates the authentic Computer-Based Test (CBT) experience of modern recruitment platforms (like HackerRank, TCS iON, and GATE) with real-time question palettes, zero-latency background question batching, skeleton loading states, celebratory milestone achievement boards every 10 questions, and instant 1-click downloads of comprehensive PDF and Markdown assessment reports.

---

## 2. Target Audience & User Personas

| Persona | Description | Primary Needs |
| :--- | :--- | :--- |
| **College Final-Year Students** | Preparing for on-campus & off-campus mass hiring drives (TCS NQT, Infosys, Wipro, Capgemini). | High-yield, frequently asked fresher technical MCQs in Java, Python, SQL, HTML, CSS, JavaScript. |
| **Self-Taught / Bootcamp Freshers** | Developers breaking into their first junior developer role. | Immediate conceptual explanations, understanding why wrong options are incorrect, learning interview edge-cases. |
| **Computer-Based Test (CBT) Candidates** | Candidates preparing for online placement assessments. | Realistic exam interface with live question palettes, question status indicators (Answered, Unanswered, Buffering). |
| **Revision & Offline Learners** | Students who want to review their exam performance offline. | Formatted downloadable PDF reports and Markdown study sheets containing question text, student answer, correct answer, and technical rationale. |

---

## 3. Core Architectural Principles

1. **100% Client-Side Privacy**: Zero backend infrastructure. API keys and quiz history never leave the client's device.
2. **0ms Next-Question Latency**: A background queuing engine maintains a 5-question buffer. While the candidate answers question $N$, question $N+1$ through $N+5$ are already loaded in memory.
3. **Resilient AI Model Discovery**: Rather than hardcoding a single AI model that might run out of quota or get deprecated, the system dynamically queries Google's `ModelService.ListModels` to fallback automatically across available Gemini models (`gemini-2.5-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`).
4. **Authentic CBT Layout**: 2-column examination layout modeled after industrial recruitment portals.
5. **Gamified Milestones & Offline Retention**: Celebration boards every 10 questions to motivate students, paired with direct export capabilities.

---

## 4. Functional Specifications

### 4.1. Brand Identity & Header Navigation
- **Branding**: **JobVastundhi** with developer attribution **"Developed by Sharief"**.
- **Iconography**: Bespoke modern vector monogram fusing the letter **J** (Cyan to Indigo) with the **V** Victory career checkmark (Emerald to Mint).
- **Navigation Controls**:
  - Home / Topic switcher with confirmation dialog if a test is in progress.
  - Active topic badge, real-time score counter ($C / T$), accuracy percentage, and dynamic streak flame.
  - 1-Click quick PDF download button active as soon as $\ge 1$ question is answered.
  - "API Key" management button reflecting connected/disconnected status.

### 4.2. API Key Management (BYOK)
- **Non-blocking Onboarding**: Prominent setup banner and modal when no key is present.
- **Key Validation**: Live ping to Google Gemini API verifying key validity and listing accessible models.
- **Switch / Clear**: Candidates can update or clear their key at any time.

### 4.3. Topic & Difficulty Selection
- **Predefined Curated Categories**:
  - *Frontend*: JavaScript, React.js, HTML5, CSS3.
  - *Programming*: Java, Python, C++.
  - *Databases*: SQL & Relational Databases, MongoDB.
  - *Core CS*: Data Structures & Algorithms, Operating Systems, Computer Networks.
- **Custom Topic Search**: Dynamic input supporting any custom technology, framework, or subject (e.g., *Next.js*, *Docker*, *Kubernetes*, *Linux Shell Scripting*).
- **Difficulty Segmented Control**:
  - `Beginner`: High-frequency campus drive MCQs, syntax rules, foundational definitions.
  - `Intermediate`: Tricky code snippets, output-prediction questions, practical scenarios.
  - `Advanced`: Optimization, subtle concurrency bugs, internals, architectural tradeoffs.

### 4.4. CBT Question Interface & Real-Time Palette
- **2-Column Split View**:
  - **Left / Center Column**: Active question card with formatted code snippets, 4 distinct options with instant feedback, and expandable interview rationale card.
  - **Right Sidebar (Question Palette)**:
    - Dynamic windowed grid representing questions in 10-question test blocks (1–10, 11–20, etc.).
    - Status pills: Green (Correct), Red (Incorrect), Purple ring (Active), Gray pulse (Buffering Skeleton).
    - Palette Action Center: Direct "Download Answered (PDF)" and "Download Answered (.MD)" buttons.
- **Skeleton Buffering**: Questions loading in the background render as quiet, non-distracting pulsing skeleton placeholders (`animate-pulse`) instead of disruptive spinning loaders.

### 4.5. Pedagogical Feedback & Rationale
- **Instant Option Grading**:
  - Correct answer selected: Emerald glow + checkmark badge + celebratory micro-confetti.
  - Incorrect answer selected: Red accent + error cross; correct option highlighted in green simultaneously.
- **Interview Rationale Card**:
  - Why the correct answer is right.
  - Why other choices are incorrect (interview traps explained).
  - Code snippet formatting with syntax highlighting support.

### 4.6. 10-Question Milestone Achievement Board
- **Trigger**: Automatically fires when candidate completes Question 10, 20, 30, 40...
- **Visuals**: Full-screen modal with multi-colored confetti cannon (`canvas-confetti`).
- **Milestone Tier Badges**:
  - $0\% - 49\%$: *Apprentice Coder* (Keep practicing!).
  - $50\% - 79\%$: *Interview Contender* (Strong foundation!).
  - $80\% - 100\%$: *Technical Specialist* (Ready to ace the interview!).
- **Detailed Analytics**: Total completed, correct count, accuracy percentage, current streak.
- **Actions**:
  - "Download Milestone Report (PDF)"
  - "Continue to Next 10 Questions"
  - "Finish Quiz & View Full Review"

### 4.7. Download & Export System
- **Pure Client-Side PDF Generation (`jsPDF`)**:
  - Generates a branded, formatted PDF document titled `JobVastundhi - [Topic] Interview Assessment Report`.
  - Header: JobVastundhi brand, "Developed by Sharief", candidate score, accuracy, difficulty level, and generation timestamp.
  - Body: Numbered list of all answered questions with question text, candidate's picked option, correct answer, and full technical interview rationale.
- **Markdown (.md) Export**:
  - Clean GitHub-flavored markdown export ideal for pasting into Notion, Obsidian, or GitHub Gists for interview revision.

---

## 5. Non-Functional Requirements

- **Zero-Backend Security**: No server stores or logs candidate answers, scores, or Gemini API keys.
- **Performance**:
  - 0ms perceived latency when advancing between buffered questions.
  - Initial 5-question batch generation $< 2.5\text{s}$.
  - PDF generation execution $< 400\text{ms}$ on typical mobile/desktop devices.
- **Browser Compatibility**: Fully tested on modern Chrome, Firefox, Edge, Safari, and mobile WebKit.
- **Responsive Layout**: Seamless experience across 360px mobile displays up to 4K ultra-wide monitors.

---

## 6. Project Roadmap & Future Enhancements
- [ ] Timed Exam Mode (e.g. 60-minute countdown simulator).
- [ ] Voice Explanation narration using Web Speech API.
- [ ] Multi-topic combined mock exams (e.g., "Full-Stack Mock Drive": 10 JS + 10 React + 10 SQL).
