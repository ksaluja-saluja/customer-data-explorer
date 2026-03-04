# Strategy Pattern Implementation

## Overview

The customer repository has been refactored using the **Strategy Pattern** to separate data fetching from business logic. This allows easy switching between different data sources (RDS database, mock data, etc.) without changing the core business logic.

## Architecture

```
┌─────────────────────────────────────────────────┐
│             Lambda Handler (main.ts)            │
│  - Validates request parameters                 │
│  - Creates CustomerService with data source     │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│        CustomerService (business logic)         │
│  - Coordinates data fetching                    │
│  - Builds response with pagination info         │
│  - Uses CustomerDataSource strategy             │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         CustomerDataSource (interface)          │
│  - getTotalCustomers(): Promise<number>         │
│  - getCustomers(start, max): Promise<Customer[]>│
└──────────────────┬──────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│ RDSCustomerData  │  │ MockCustomerData │
│     Source       │  │     Source       │
│ (Real Database)  │  │  (Hard-coded)    │
└──────────────────┘  └──────────────────┘
```

## Components

### 1. **CustomerDataSource** (Interface)

- **Location**: `src/models/CustomerDataSource.ts`
- **Purpose**: Defines the contract for data sources
- **Methods**:
  - `getTotalCustomers()`: Returns total count
  - `getCustomers(start, max)`: Returns paginated customer list

### 2. **RDSCustomerDataSource** (Concrete Strategy)

- **Location**: `src/repositories/RDSCustomerDataSource.ts`
- **Purpose**: Fetches data from AWS RDS using Data API
- **Features**:
  - Connects to real database
  - Implements caching for total count (2-minute TTL)
  - Uses environment variables for database configuration

### 3. **MockCustomerDataSource** (Concrete Strategy)

- **Location**: `src/repositories/MockCustomerDataSource.ts`
- **Purpose**: Provides mock data from JSON file for local testing
- **Features**:
  - Loads 100 mock customers from `src/mocks/customers.json`
  - No external dependencies
  - Perfect for local development without AWS credentials

### 4. **CustomerService** (Context)

- **Location**: `src/services/CustomerService.ts`
- **Purpose**: Contains business logic and uses data source strategy
- **Features**:
  - Accepts any CustomerDataSource implementation
  - Coordinates parallel data fetching (total + customers)
  - Builds CustomerPage response
  - Allows runtime switching of data sources

### 5. **Lambda Handler** (main.ts)

- **Location**: `src/main.ts`
- **Purpose**: Entry point, creates service with appropriate data source
- **Features**:
  - Factory function to create data source based on environment
  - Validates request parameters
  - Returns formatted response

## Usage

### Switching Data Sources

Set the `DATA_SOURCE` environment variable to choose your data source:

#### Local Development (Mock Data)

```bash
export DATA_SOURCE=mock
npm run dev
```

#### Real Database (RDS)

```bash
export DATA_SOURCE=rds
export AWS_REGION=us-east-1
export DB_RESOURCE_ARN=your-rds-arn
export DB_SECRET_ARN=your-secret-arn
export DB_NAME=your-database-name
npm run dev
```

### Default Behavior

- **Local Server** (`src/local-server.ts`): Defaults to `mock` if not set
- **Lambda/CDK**: Defaults to `rds` if not set

### Testing the API

```bash
# Start server (uses mock data by default)
npm run dev

# Test with mock data
curl "http://localhost:3000/customers?start=0&max=10"

# Response includes 100 mock customers
{
  "customers": [...],
  "lastCustomerId": "10",
  "totalCustomers": 100
}
```

## Adding New Data Sources

To add a new data source (e.g., DynamoDB, MongoDB, etc.):

1. **Create new class implementing CustomerDataSource**:

```typescript
// src/repositories/DynamoDBCustomerDataSource.ts
import { CustomerDataSource } from "../models/CustomerDataSource";
import { Customer } from "../models/Customer";

export class DynamoDBCustomerDataSource implements CustomerDataSource {
  async getTotalCustomers(): Promise<number> {
    // Your DynamoDB implementation
  }

  async getCustomers(start: number, max: number): Promise<Customer[]> {
    // Your DynamoDB implementation
  }
}
```

2. **Update factory in main.ts**:

```typescript
const createDataSource = (): CustomerDataSource => {
  const dataSourceType = process.env.DATA_SOURCE || "rds";

  if (dataSourceType === "mock") {
    return new MockCustomerDataSource();
  }

  if (dataSourceType === "dynamodb") {
    return new DynamoDBCustomerDataSource();
  }

  // Default to RDS
  return new RDSCustomerDataSource();
};
```

3. **Use it**:

```bash
export DATA_SOURCE=dynamodb
npm run dev
```

## Benefits

✅ **Separation of Concerns**: Business logic separated from data access
✅ **Testability**: Easy to test with mock data source
✅ **Flexibility**: Switch data sources without code changes
✅ **Maintainability**: Each component has single responsibility
✅ **Extensibility**: Easy to add new data sources

## Migration Notes

### Old Structure

```typescript
// Everything in one class
export class CustomerRepository {
  // Database connection AND business logic
  async getCustomersPage(start, max) { ... }
}
```

### New Structure

```typescript
// Separated concerns
export class CustomerService {
  constructor(dataSource: CustomerDataSource) { ... }
  async getCustomersPage(start, max) { ... }  // Business logic only
}

export class RDSCustomerDataSource implements CustomerDataSource {
  async getCustomers(start, max) { ... }  // Data access only
}
```

## Running Tests

```bash
npm test
```

## Environment Variables

| Variable          | Description                                | Default                         | Used By               |
| ----------------- | ------------------------------------------ | ------------------------------- | --------------------- |
| `DATA_SOURCE`     | Which data source to use (`mock` or `rds`) | `mock` (local) / `rds` (Lambda) | All                   |
| `DB_RESOURCE_ARN` | RDS cluster ARN                            | -                               | RDSCustomerDataSource |
| `DB_SECRET_ARN`   | Secrets Manager ARN for DB credentials     | -                               | RDSCustomerDataSource |
| `DB_NAME`         | Database name                              | -                               | RDSCustomerDataSource |
| `AWS_REGION`      | AWS region                                 | -                               | RDSCustomerDataSource |

## File Structure

```
src/
├── models/
│   ├── Customer.ts              # Customer data types
│   └── CustomerDataSource.ts    # Strategy interface
├── repositories/
│   ├── RDSCustomerDataSource.ts        # RDS implementation
│   └── MockCustomerDataSource.ts       # Mock implementation
├── services/
│   └── CustomerService.ts       # Business logic layer
├── utilities/
│   ├── logger.ts
│   └── response.ts
├── mocks/
│   ├── customers.json           # Mock customer data
│   └── README.md                # Mock data documentation
├── main.ts                      # Lambda handler
└── local-server.ts             # Express dev server
```
