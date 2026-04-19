# Contributing to GovScheme AI

First off, thank you for considering contributing to GovScheme AI! It's people like you that make open-source software such a great community.

## 1. Where do I go from here?

If you've noticed a bug or have a question, search the [issue tracker](../../issues) to see if someone else in the community has already created a ticket. If not, go ahead and [make one](../../issues/new).

## 2. Fork & create a branch

If this is something you think you can fix, then [fork GovScheme AI](https://help.github.com/articles/fork-a-repo) and create a branch with a descriptive name.

## 3. Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gov-scheme.git
   cd gov-scheme
   ```

2. **Install dependencies:**
   This project uses npm workspaces. You can install all dependencies from the root directory:
   ```bash
   # In the root, backend, frontend
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Start the development servers:**
   ```bash
   # Open two terminals
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

## 4. Submitting a Pull Request

1. Make your changes and commit them with descriptive commit messages following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
2. Push your code to your fork.
3. Open a Pull Request on our main repository.
4. Ensure your PR description clearly describes the problem and solution. It should include the relevant issue number if applicable.

We will review your PR as soon as we can. Thank you!
