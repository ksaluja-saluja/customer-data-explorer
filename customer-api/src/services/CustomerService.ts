import { CustomerPage } from "../models/Customer";
import { CustomerDataSource } from "../models/CustomerDataSource";
import { Logger } from "../utilities/logger";

/**
 * Customer service containing business logic
 * Uses strategy pattern to allow different data sources (RDS, mock, etc.)
 */
export class CustomerService {
  private dataSource: CustomerDataSource;

  constructor(dataSource: CustomerDataSource) {
    this.dataSource = dataSource;
  }

  /**
   * Get paginated customer data
   * @param start - Starting offset
   * @param max - Maximum number of records to return
   * @returns CustomerPage with customers, pagination info, and total count
   */
  async getCustomersPage(start: number, max: number): Promise<CustomerPage> {
    Logger.info("Fetching customer page", { start, max });

    // Fetch total count and customers in parallel for better performance
    const [totalCustomers, customers] = await Promise.all([
      this.dataSource.getTotalCustomers(),
      this.dataSource.getCustomers(start, max),
    ]);

    // Determine last customer ID for pagination
    const lastCustomerId = customers.length > 0 
      ? customers[customers.length - 1].customerId 
      : null;

    return {
      customers,
      lastCustomerId,
      totalCustomers,
    };
  }

  /**
   * Update the data source strategy at runtime
   * @param dataSource - New data source to use
   */
  setDataSource(dataSource: CustomerDataSource): void {
    Logger.info("Switching customer data source");
    this.dataSource = dataSource;
  }
}
