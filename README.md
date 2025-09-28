<div align="center">

# 🏆 CodeRank - Advanced Coding Practice Platform

<p align="center">
  <strong>A modern, multi-language coding practice platform built with Next.js, React, and Firebase</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-13.0+-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Firebase-9.0+-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

</div>

---

## 🚀 Features

### � **Multi-Language Code Editor**

- **JavaScript** - Native execution with full ES6+ support
- **Python** - Smart conversion to JavaScript with pattern recognition
- **Java** - Comprehensive conversion with collection mapping and syntax transformation
- **Real-time Syntax Highlighting** - Powered by CodeMirror
- **Auto-completion & Error Detection** - Enhanced coding experience

### 🧩 **Comprehensive Problem Set**

| Problem             | Difficulty | Topics                | Approaches                  |
| ------------------- | ---------- | --------------------- | --------------------------- |
| Two Sum             | Easy       | Array, HashMap        | Brute Force, Hash Table     |
| Valid Parentheses   | Easy       | Stack, String         | Stack-based validation      |
| Jump Game           | Medium     | Array, Greedy         | Dynamic Programming, Greedy |
| Reverse Linked List | Hard       | Linked List, Pointers | Iterative, Recursive        |
| Search 2D Matrix    | Medium     | Array, Binary Search  | Row-wise, Binary Search     |

### 🔥 **Advanced Features**

- 🔐 **Secure Authentication** - Firebase Auth with email/password
- ⚡ **Real-time Code Execution** - Instant feedback and testing
- ⏱️ **Built-in Timer** - Track your coding session duration
- 📊 **Progress Tracking** - Monitor solved problems and performance
- 💾 **Persistent Storage** - Your progress is saved across sessions
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Dark Theme UI** - Easy on the eyes during long coding sessions

---

## 🎯 Demo

### Live Application

🔗 **[Try CodeRank Live](http://localhost:3000)** _(Run locally following setup instructions)_

### Screenshots

<details>
<summary>🖼️ Click to view screenshots</summary>

#### Homepage

_Clean, modern interface with problem listings_

#### Problem Solving Interface

_Multi-language code editor with real-time execution_

#### User Dashboard

_Track your progress and performance metrics_

</details>

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** (v18.0 or higher)
- **npm** or **yarn** package manager
- **Firebase Project** (for backend services)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/sandeepanchakraborty/CodeRank.git
cd CodeRank
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Firebase Setup**

- Create a [Firebase project](https://console.firebase.google.com/)
- Enable **Authentication** (Email/Password provider)
- Enable **Firestore Database**
- Add your Firebase config to `.env.local`

5. **Seed the Database** (Optional)

```bash
node scripts/seedProblems.js
```

6. **Start Development Server**

```bash
npm run dev
# or
yarn dev
```

7. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

---

## 🛠️ Tech Stack

### Frontend

- **[Next.js 13+](https://nextjs.org/)** - React framework with SSR/SSG
- **[React 18+](https://reactjs.org/)** - UI library with hooks and context
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[CodeMirror](https://codemirror.net/)** - Advanced code editor
- **[Recoil](https://recoiljs.org/)** - State management library

### Backend & Services

- **[Firebase Auth](https://firebase.google.com/products/auth)** - User authentication
- **[Firestore](https://firebase.google.com/products/firestore)** - NoSQL database
- **[Firebase Hosting](https://firebase.google.com/products/hosting)** - Web hosting

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking

---

## 🏗️ Architecture

### Project Structure

```
CodeRank/
├── 📁 public/                  # Static assets
├── 📁 src/
│   ├── 📁 atoms/               # Recoil state atoms
│   ├── 📁 components/          # React components
│   │   ├── 📁 Workspace/       # Code editor workspace
│   │   ├── 📁 Modals/          # Authentication modals
│   │   └── 📁 Navbar/          # Navigation components
│   ├── 📁 firebase/            # Firebase configuration
│   ├── 📁 hooks/               # Custom React hooks
│   ├── 📁 pages/               # Next.js pages
│   ├── 📁 utils/               # Utility functions
│   │   ├── 📁 problems/        # Problem definitions
│   │   └── 📁 types/           # TypeScript types
│   └── 📁 styles/              # Global styles
├── 📁 scripts/                 # Database seeding scripts
└── 📋 Configuration files
```

### Key Components

#### 🎨 **Multi-Language Code Conversion System**

```typescript
// Smart language detection and conversion
const convertJavaToJS = (code: string): string => {
  // Sophisticated Java → JavaScript conversion
  // Handles collections, data types, and syntax
};

const convertPythonToJS = (code: string): string => {
  // Python → JavaScript conversion with pattern recognition
  // Supports loops, conditionals, and Python-specific syntax
};
```

#### 🔄 **Real-time Code Execution Engine**

```typescript
// Execute user code against test cases
const executeCode = async (code: string, language: string) => {
  const convertedCode = convertToJavaScript(code, language);
  const results = await runTestCases(convertedCode);
  return results;
};
```

---

## 📚 Usage Guide

### For Users

1. **Sign Up/Login** - Create account or sign in
2. **Choose Problem** - Select from available coding challenges
3. **Select Language** - Choose JavaScript, Python, or Java
4. **Write Solution** - Use the built-in code editor
5. **Test & Submit** - Run against test cases and submit
6. **Track Progress** - Monitor your solved problems

### For Developers

1. **Add New Problems** - Edit `src/utils/problems/`
2. **Extend Language Support** - Modify `src/utils/languages.ts`
3. **Customize UI** - Update components in `src/components/`
4. **Database Changes** - Update Firestore schema and seed scripts

---

## 🚦 Scripts

| Command                        | Description                 |
| ------------------------------ | --------------------------- |
| `npm run dev`                  | Start development server    |
| `npm run build`                | Build for production        |
| `npm start`                    | Start production server     |
| `npm run lint`                 | Run ESLint                  |
| `node scripts/seedProblems.js` | Seed database with problems |

---

## 🌟 Key Features Deep Dive

### Multi-Language Support Implementation

CodeRank features an advanced language conversion system that allows users to write solutions in multiple programming languages while maintaining consistent execution:

- **Pattern Recognition**: Intelligent detection of common algorithmic patterns
- **Syntax Transformation**: Accurate conversion of language-specific syntax
- **Data Structure Mapping**: Automatic mapping between language-specific collections
- **Error Handling**: Comprehensive error detection and user-friendly messages

### Problem Management System

Each problem includes:

- **Multiple Test Cases**: Comprehensive testing scenarios
- **Difficulty Ratings**: Easy, Medium, Hard classifications
- **Topic Tags**: Algorithm categories and data structures
- **Solution Templates**: Language-specific starter code
- **Detailed Explanations**: Problem descriptions with examples

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs** - Submit issues with detailed descriptions
- 💡 **Suggest Features** - Propose new functionality
- 🔧 **Code Contributions** - Submit pull requests
- 📚 **Documentation** - Improve docs and guides
- 🧪 **Testing** - Help test new features

### Development Setup

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Make changes and test thoroughly
4. Commit changes (`git commit -m 'Add AmazingFeature'`)
5. Push to branch (`git push origin feature/AmazingFeature`)
6. Open Pull Request

### Contribution Guidelines

- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR


