import type { CustomerRow } from "../models/CustomerRow";

const MOCK_SERVER_URL = "http://localhost:4001/api/customers";

export async function getAPI(): Promise<CustomerRow[]> {
  const response = await fetch(MOCK_SERVER_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch customer data");
  }

  return response.json() as Promise<CustomerRow[]>;
}
