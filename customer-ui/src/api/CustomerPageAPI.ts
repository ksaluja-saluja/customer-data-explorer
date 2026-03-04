import { getConfig } from "../config";
import type { CustomerRow } from "../models/CustomerRow";

export interface CustomerPageResponse {
  customers: CustomerRow[];
  lastCustomerId: string | null;
  totalCustomers: number;
}

export async function getCustomerPageAPI(start: number = 0, max: number = 10): Promise<CustomerPageResponse> {
  const config = getConfig();
  const url = new URL(`${config.apiBaseUrl}${config.customerApiEndpoint}`);
  
  // Add query parameters
  url.searchParams.append('start', start.toString());
  url.searchParams.append('max', max.toString());
  
  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch customer data");
  }

  return response.json() as Promise<CustomerPageResponse>;
}
