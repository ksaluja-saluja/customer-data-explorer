import { Customer } from "../models/Customer";
import { CustomerDataSource } from "../models/CustomerDataSource";
import { Logger } from "../utilities/logger";
import mockCustomersData from "../mocks/customers.json";

/**
 * Mock implementation of customer data source
 * Returns hard-coded data for local development and testing
 * Loads customer data from JSON file
 */
export class MockCustomerDataSource implements CustomerDataSource {
  private mockCustomers: Customer[];

  constructor() {
    // Load mock customer data from JSON file
    this.mockCustomers = mockCustomersData as Customer[];
    Logger.info(`Loaded ${this.mockCustomers.length} mock customers from JSON file`);
  }

  async getTotalCustomers(): Promise<number> {
    Logger.info("Fetching total customers from mock data");
    return this.mockCustomers.length;
  }

  async getCustomers(start: number, max: number): Promise<Customer[]> {
    Logger.info("Fetching customers from mock data", { start, max });
    
    // Simulate pagination
    const end = Math.min(start + max, this.mockCustomers.length);
    return this.mockCustomers.slice(start, end);
  }
}
