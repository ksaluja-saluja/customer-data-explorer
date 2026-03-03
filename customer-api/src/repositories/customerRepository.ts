import { RDSDataClient, ExecuteStatementCommand } from "@aws-sdk/client-rds-data"; // Replace with your DB client if different
import { Customer, CustomerPage } from "../models/Customer";

export class CustomerRepository {
  private rdsCient: RDSDataClient;
  private resoureArn: string;
  private secretArn: string;
  private database: string;

  constructor() {
    this.rdsCient = new RDSDataClient({});
    this.resoureArn = process.env.DB_RESOURCE_ARN || "";
    //TODO: consider using AWS Secrets Manager client to fetch secret ARN instead of env variable
    this.secretArn = process.env.DB_SECRET_ARN || "";
    this.database = process.env.DB_NAME || "";
  }

  // Method to get paginated customers
  async getCustomersPage(start: number, max: number): Promise<CustomerPage> {
    //TODO: cache total records for few minutes to avoid hitting DB every time for total count
    const totalQuery = "SELECT COUNT(*) FROM customers";
    const totalCommand = new ExecuteStatementCommand({
      resourceArn: this.resoureArn,
      secretArn: this.secretArn,
      database: this.database,
      sql: totalQuery, 
    })
    const totalResponse = await this.rdsCient.send(totalCommand);
    const totalCustomers = totalResponse.records && totalResponse.records[0][0].longValue ? totalResponse.records[0][0].longValue : 0;

    /* Assuming customer_id is an auto-incrementing primary key, we can use it for pagination.
    If not, we may need to adjust the query to use a different column for ordering and pagination */
    const query = `SELECT customer_id, full_name, email, registration_date
      FROM customers
      ORDER BY customer_id
      LIMIT :max OFFSET :start`

    const command = new ExecuteStatementCommand({
      resourceArn: this.resoureArn,
      secretArn: this.secretArn,
      database: this.database,
      sql: query, 
      parameters: [
        { name: 'max', value: { longValue: max } },
        { name: 'start', value: { longValue: start } },
      ]
    }) 

    const response = await this.rdsCient.send(command);

    const customers = response.records ? response.records.map(record => {
      return {
        customerId: record[0].stringValue || "",
        fullName: record[1].stringValue || "",
        email: record[2].stringValue || "",
        registrationDate: record[3].stringValue || "",
      } as Customer; 
    } ) : [];

    return {
      customers,
      lastCustomerId: customers.length > 0 ? customers[customers.length - 1].customerId : null,
      totalCustomers: totalCustomers
    }
  }
}