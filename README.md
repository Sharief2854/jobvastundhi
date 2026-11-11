# jobVastadhi 🎯
> **Ace Your Technical Interview.**  
> *Most-Asked Technical Interview Questions for Freshers & Entry-Level Developers.*  
> **Developed by Sharief**

[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 About jobVastadhi

**jobVastadhi** is an ultra-fast, 100% client-side technical interview preparation simulator tailored specifically for college graduates, freshers, and developers who recently started learning.

Powered directly by the candidate's **Google Gemini API Key (BYOK)**, jobVastadhi requires **zero login, zero backend, and zero tracking**—storing API keys strictly in the browser's local storage.

📖 **Comprehensive PRD**: For complete architectural specifications and product requirements, read the [Product Requirements Document (PRD)](docs/PRD.md).

---

## ✨ Key Features

- **🎯 Fresher-Targeted Interview Prompts**: Focuses strictly on high-yield, frequently asked interview questions tested by top MNCs and tech startups (JavaScript, React.js, HTML5, CSS3, Java, Python, SQL, DSA).
- **⚡ 0ms Next-Question Latency**: Smart batching engine pre-loads 5 questions into a local buffer queue in memory. As you answer questions, upcoming questions are automatically buffered in the background.
- **📋 Real-Time Computer-Based Test (CBT) Layout**: Authentic 2-column examination layout modeled after GATE, TCS iON, and HackerRank with a live **Question Palette** on the right side.
- **🏆 10-Question Milestone Achievement Board**: Automatically celebrates every 10 completed questions with confetti, accuracy stats, and unlocked badge tiers (*Apprentice Coder*, *Interview Contender*, *Technical Specialist*).
- **📥 1-Click PDF & Markdown Export**: Download all answered questions, chosen options, correct answers, and technical interview rationales as a printable **PDF report** or **Markdown (`.md`)** file.
- **💀 Pure Skeleton Buffering**: Clean, distraction-free skeleton loading placeholders for upcoming question batches.
- **🔄 Resilient AI Model Discovery**: Automatically discovers available Gemini models via `ModelService.ListModels` to fallback gracefully when quota limits occur.
- **🔒 Privacy First & Client-Side**: No databases, no external analytics, keys never leave your machine.

---

## ⌨️ Examination Controls & Shortcuts

| Action | Control |
| :--- | :--- |
| **Select Option A / B / C / D** | Click option or press `1`, `2`, `3`, `4` (or `A`, `B`, `C`, `D`) |
| **Next Question** | Click button or press `Enter` / `Space` |
| **Download PDF** | Click "Download (PDF)" in Palette, Navbar, or Milestone Board |
| **Switch Topic** | Click "Topics" in top navbar |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Engine**: Google Gemini API (`ModelService.ListModels` dynamic discovery)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 🏁 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Sharief2854/jobvastundhi.git
cd jobvastundhi
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### 4. Connect your Gemini API Key
Click **"Connect API Key"** in the top bar. You can obtain a free Gemini API key in 30 seconds at [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 📜 Available Scripts

- `npm run dev`: Starts local Vite development server with HMR.
- `npm run build`: Generates production build in `dist/`.
- `npm run lint`: Runs fast Oxlint checks across the codebase.
- `npm run preview`: Previews production build locally.

---

## 👨‍💻 Author

**Developed by Sharief**  
- GitHub: [@Sharief2854](https://github.com/Sharief2854)
- Repository: [https://github.com/Sharief2854/jobvastundhi](https://github.com/Sharief2854/jobvastundhi)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
