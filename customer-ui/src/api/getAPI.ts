import { getConfig } from "../config";
import type { CustomerRow } from "../models/CustomerRow";

export async function getAPI(): Promise<CustomerRow[]> {
  const config = getConfig();
  const url = `${config.apiBaseUrl}${config.customerApiEndpoint}`;
  
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch customer data");
  }

  return response.json() as Promise<CustomerRow[]>;
}
