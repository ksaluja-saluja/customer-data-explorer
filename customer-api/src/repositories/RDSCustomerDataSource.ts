import { RDSDataClient, ExecuteStatementCommand } from "@aws-sdk/client-rds-data";
import { Customer } from "../models/Customer";
import { CustomerDataSource } from "../models/CustomerDataSource";
import { Logger } from "../utilities/logger";

/**
 * RDS implementation of customer data source
 * Fetches data from AWS RDS using the Data API
 */
export class RDSCustomerDataSource implements CustomerDataSource {
  private rdsClient: RDSDataClient;
  private resourceArn: string;
  private secretArn: string;
  private database: string;
  private cachedTotal: number | null = null;
  private cachedTime: number | null = null;
  private CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

  constructor() {
    this.rdsClient = new RDSDataClient({});
    this.resourceArn = process.env.DB_RESOURCE_ARN || "";
    this.secretArn = process.env.DB_SECRET_ARN || "";
    this.database = process.env.DB_NAME || "";
  }

  async getTotalCustomers(): Promise<number> {
    // Check cache first
    if (this.cachedTotal && this.cachedTime && Date.now() - this.cachedTime < this.CACHE_TTL_MS) {
      Logger.info("Fetching total customers from cache");
      return this.cachedTotal;
    }

    Logger.info("Fetching total customers from database");
    const totalQuery = "SELECT COUNT(*) FROM customers";
    const totalCommand = new ExecuteStatementCommand({
      resourceArn: this.resourceArn,
      secretArn: this.secretArn,
      database: this.database,
      sql: totalQuery,
    });

    const totalResponse = await this.rdsClient.send(totalCommand);
    const totalCustomers = totalResponse.records && totalResponse.records[0][0].longValue 
      ? totalResponse.records[0][0].longValue 
      : 0;

    // Update cache
    this.cachedTotal = totalCustomers;
    this.cachedTime = Date.now();
    
    return totalCustomers;
  }

  async getCustomers(start: number, max: number): Promise<Customer[]> {
    Logger.info("Fetching customers from database", { start, max });
    
    const query = `SELECT customer_id, full_name, email, registration_date, address
      FROM customers
      ORDER BY customer_id
      LIMIT :max OFFSET :start`;

    const command = new ExecuteStatementCommand({
      resourceArn: this.resourceArn,
      secretArn: this.secretArn,
      database: this.database,
      sql: query,
      parameters: [
        { name: 'max', value: { longValue: max } },
        { name: 'start', value: { longValue: start } },
      ],
    });

    const response = await this.rdsClient.send(command);

    const customers = response.records
      ? response.records.map(record => ({
          customerId: record[0].stringValue || "",
          fullName: record[1].stringValue || "",
          email: record[2].stringValue || "",
          registrationDate: record[3].stringValue || "",
          address: record[4].stringValue || "",
        } as Customer))
      : [];

    return customers;
  }
}
