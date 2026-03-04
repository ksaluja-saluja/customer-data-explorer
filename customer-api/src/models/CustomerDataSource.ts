import { Customer } from "./Customer";

/**
 * Interface for customer data source strategies
 * Allows swapping between different data sources (RDS, mock, etc.)
 */
export interface CustomerDataSource {
  /**
   * Get total number of customers
   */
  getTotalCustomers(): Promise<number>;

  /**
   * Fetch paginated list of customers
   * @param start - Starting offset
   * @param max - Maximum number of records to return
   */
  getCustomers(start: number, max: number): Promise<Customer[]>;
}
