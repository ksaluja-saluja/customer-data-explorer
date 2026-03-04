# Customer Data Explorer

A full-stack web application for exploring and managing customer data. This workspace contains two interconnected projects: a backend REST API and a React-based frontend interface.

## Project Overview

### 📋 [customer-api](customer-api/README.md)

A Node.js REST API server that provides customer data endpoints. Built with Express and deployed as AWS Lambda functions.

**Key Features:**
- REST API endpoints for retrieving paginated customer lists
- Strategy Pattern architecture with pluggable data sources
- Mock data source for local development (no AWS credentials needed)
- RDS data source for production environments
- Health check and API information endpoints
- TypeScript-based codebase with comprehensive testing

**Quick Start:**
```bash
cd customer-api
npm install
npm run dev
```

Server runs on `http://localhost:3000` with mock data by default.

**For detailed information:** See [customer-api/README.md](customer-api/README.md)

---

### 💻 [customer-ui](customer-ui/README.md)

A React application providing a user-friendly interface for browsing customer data. Built with TypeScript, Vite, and modern tooling.

**Key Features:**
- Responsive customer data table with pagination
- Integration with customer-api backend
- Mock server support for development
- TypeScript for type safety
- ESLint configuration for code quality
- Vite for fast development and optimized builds

**Quick Start:**
```bash
cd customer-ui
npm install
npm run dev
```

Application runs on `http://localhost:5173` by default.

**For detailed information:** See [customer-ui/README.md](customer-ui/README.md)

---

## Architecture

```
┌──────────────────────────────────┐
│         customer-ui (React)      │
│    Frontend User Interface       │
└──────────────┬───────────────────┘
               │ HTTP Requests
               ▼
┌──────────────────────────────────┐
│   customer-api (Express/Lambda)  │
│      REST API Layer              │
└──────────────┬───────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
    Mock Data         AWS RDS
   (Local Dev)      (Production)
```

## Development Workflow

1. Start the API server:
   ```bash
   cd customer-api
   npm run dev
   ```

2. In another terminal, start the UI:
   ```bash
   cd customer-ui
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser

## Additional Resources

- [customer-api Architecture & Strategy Pattern](customer-api/STRATEGY_PATTERN.md)
- [AWS CDK Configuration](customer-api/README_CDK.md)


