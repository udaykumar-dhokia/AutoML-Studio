# Contributing to AutoML Studio

First off, thank you for considering contributing to AutoML Studio! It's people like you who make AutoML Studio such a great tool.

This guide will help you get started with the development environment and understand the contribution process.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Project Architecture](#project-architecture)
3. [Development Setup](#development-setup)
4. [Contribution Workflow](#contribution-workflow)
5. [Coding Standards](#coding-standards)
6. [Pull Request Guidelines](#pull-request-guidelines)

---

## Code of Conduct
By participating in this project, you are expected to uphold our Code of Conduct. Please be respectful and professional in all interactions.

## Project Architecture
AutoML Studio is built using a microservices architecture:
- **Frontend**: Next.js (App Router), React, Redux Toolkit, Tailwind CSS, and `@xyflow/react` for the workflow canvas.
- **Primary Backend**: Node.js, Express, TypeScript, Mongoose. Handles Auth, Workflow Management, and Orchestration.
- **Operations Backend**: Python, FastAPI, Pandas. Handles heavy data processing and ML operations.

## Development Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB (Running locally or via Atlas)
- Redis

### 1. Clone the repository
```bash
git clone https://github.com/udaykumar-dhokia/AutoML-Studio.git
cd AutoML-Studio
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Setup Primary Backend
```bash
cd ../primary-backend
npm install
npm run dev
```

### 4. Setup Operations Backend
```bash
cd ../operations-backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

## Contribution Workflow

1.  **Search for an Issue**: Look for open issues or create a new one to discuss your proposed changes.
2.  **Fork the Repo**: Fork the repository on GitHub.
3.  **Create a Branch**: Create a new branch for your feature or bugfix.
    ```bash
    git checkout -b feature/your-awesome-feature
    # OR
    git checkout -b fix/issue-description
    ```
4.  **Make your changes**: Write clean, documented code and include tests if applicable.
5.  **Commit your changes**: Use Conventional Commits.
    ```bash
    git commit -m "feat: add support for new ML node"
    ```
6.  **Push and PR**: Push to your fork and open a Pull Request against the `main` branch.

## Coding Standards

### JavaScript / TypeScript (Frontend & Primary Backend)
- Use **ESLint** and **Prettier** for formatting.
- Follow the **Airbnb JavaScript Style Guide**.
- Use functional components and hooks in React.
- Ensure proper type definitions in TypeScript.

### Python (Operations Backend)
- Follow **PEP 8** guidelines.
- Use type hints for function arguments and return values.
- Document complex logic with docstrings.

### Conventional Commits
We use Conventional Commits to maintain a clean history:
- `feat:` for new features.
- `fix:` for bug fixes.
- `docs:` for documentation updates.
- `style:` for formatting/styling changes.
- `refactor:` for code restructuring.
- `test:` for adding/updating tests.

## Pull Request Guidelines
- Provide a clear and concise description of the changes.
- Include screenshots or screen recordings for UI changes.
- Reference any related issues (e.g., `Closes #123`).
- Ensure all CI/CD checks pass before requesting a review.
- Tag maintainers for review.

---

Thank you for contributing to the future of No-Code ML! 🚀
