# Mock Data

This folder contains mock data for local development and testing.

## customers.json

Contains 100 mock customer records with the following fields:

- **customerId**: Unique identifier (string)
- **fullName**: Customer's full name
- **email**: Customer's email address
- **registrationDate**: Date when customer registered (YYYY-MM-DD format)

## Usage

The `MockCustomerDataSource` class automatically loads this data when initialized:

```typescript
import { MockCustomerDataSource } from "./repositories/MockCustomerDataSource";

const dataSource = new MockCustomerDataSource();
// Automatically loads 100 customers from customers.json
```

## Modifying Mock Data

You can edit `customers.json` directly to:

- Add more customers
- Change existing customer data
- Adjust the structure (must match the `Customer` interface)

### Customer Interface

```typescript
export interface Customer {
  customerId: string;
  fullName: string;
  email: string;
  registrationDate: string;
  address: string;
}
```

## Benefits

✅ Easy to maintain and update mock data
✅ No code changes needed to modify test data
✅ Can be version controlled
✅ Consistent data across development environments
✅ Easy to share with team members

## Seeding the Mock Data

The mock data is automatically loaded when the application starts in mock mode:

```bash
export DATA_SOURCE=mock
npm run dev
```

The logs will confirm:

```
[INFO] Loaded 100 mock customers from JSON file
```
