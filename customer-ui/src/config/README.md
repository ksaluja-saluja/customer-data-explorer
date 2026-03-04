# Configuration System

The application uses environment-specific configuration files to manage API endpoints and other settings.

## Configuration Files

Configuration files are located in the `src/config/` directory:

- **development.json** - Development environment (local mock server)
- **staging.json** - Staging environment
- **production.json** - Production environment

## How It Works

The configuration system uses Vite's environment variables and dynamic imports to load the appropriate config file based on the build environment.

When the application starts, it reads the `VITE_CONFIG_ENV` environment variable (or falls back to Vite's `MODE`) to determine which config file to load.

## Using Different Configurations

### Development (Default)

```bash
npm run dev
# or explicitly:
npm run dev:development
```

Uses `src/config/development.json` with the local mock server.

### Staging

```bash
npm run dev:staging
```

Uses `src/config/staging.json` with the staging API server.

### Production

```bash
npm run dev:production
```

Uses `src/config/production.json` with the production API server.

## Building for Different Environments

### Build for Development

```bash
npm run build:development
```

### Build for Staging

```bash
npm run build:staging
```

### Build for Production

```bash
npm run build:production
```

## Configuration Structure

Each config file follows this structure:

```json
{
  "apiBaseUrl": "https://api.example.com",
  "customerApiEndpoint": "/api/customers"
}
```

- **apiBaseUrl** - The base URL of the API server
- **customerApiEndpoint** - The endpoint path for the customer API

## Adding New Configuration Options

1. Add the new property to all config files in `src/config/`
2. Update the `Config` interface in `src/config/index.ts`
3. Use `getConfig()` in your code to access the value

Example:

```typescript
import { getConfig } from "../config";

const config = getConfig();
const myValue = config.myNewProperty;
```

## Notes

- The configuration is loaded at application startup
- The `default` export from each JSON file is used
- If the specified environment config is not found, it falls back to development
- Environment variable names are case-sensitive on Unix-like systems
