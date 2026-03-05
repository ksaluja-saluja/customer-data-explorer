import { APIGatewayProxyEvent, Context } from "aws-lambda";
/** 
 * TODO: consider using a framework like NestJS to get better structure and organization of code,
 * as well as built-in support for things like validation, dependency injection, etc.
 * */
import { ResponseUtil } from "./utilities/response";
import { CustomerService } from "./services/CustomerService";
import { CustomerDataSource } from "./models/CustomerDataSource";
import { RDSCustomerDataSource } from "./repositories/RDSCustomerDataSource";
import { MockCustomerDataSource } from "./repositories/MockCustomerDataSource";
import { CustomerPage } from "./models/Customer";
import { Logger } from "./utilities/logger";

let customerService: CustomerService | null = null;

/**
 * Factory function to create appropriate data source based on environment
 */
const createDataSource = (): CustomerDataSource => {
  const dataSourceType = process.env.DATA_SOURCE || "rds";
  
  Logger.info(`Creating data source of type: ${dataSourceType}`);
  
  if (dataSourceType === "mock") {
    /**
     * TODO: consider implementing a more robust mock data source
     * e.g. running lambda inside docker container that has RDS image with pre-populated data,
     * or using a library like `mock-knex` to mock out database interactions.
     */
    return new MockCustomerDataSource();
  }
  
  // Default to RDS
  return new RDSCustomerDataSource();
};

/**
 * Get or create singleton customer service instance
 */
export const getCustomerService = (): CustomerService => {
  if (!customerService) {
    const dataSource = createDataSource();
    customerService = new CustomerService(dataSource);
  }
  return customerService;
};

/**
 * TODO: design decision - should be lambda or ECS task
 * as this will likely be a long-running process if we have a large number of customers.
 * For now, we will implement as a lambda for simplicity,
 * but may need to revisit this decision as we scale.
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  Logger.info("Handler invoked", { event });
  try {
    const queryParams = event.queryStringParameters || {};

    //TODO: consider using a framework like NestJS to get validation and parsing of query parameters out of the box
    if (!queryParams.start || !queryParams.max) {
      Logger.error("Missing required query parameters 'start' and 'max'");
      return ResponseUtil.BadRequest("Missing required query parameters 'start' and 'max'.");
    }
  
    const start = queryParams.start ? Number(queryParams.start) : NaN;
    const max = queryParams.max ? Number(queryParams.max) : NaN;
  
    if (isNaN(start) || isNaN(max)) {
      Logger.error("Invalid query parameters", { start, max });
      return ResponseUtil.BadRequest("Query parameters 'start' and 'max' must be valid numbers.");
    }
  
    Logger.info("Fetching customer page", { start, max });
    const results: CustomerPage = await getCustomerService().getCustomersPage(start, max);
    Logger.info("Successfully fetched customer page");
    Logger.debug("DEBUG: Successfully fetched customer page", { results });

  
    return ResponseUtil.success({
      customers: results.customers,
      lastCustomerId: results.lastCustomerId,
      totalCustomers: results.totalCustomers,
    });
  } catch (error) {
    Logger.error("Error in handler", error);
    return ResponseUtil.error("An error occurred while fetching customers.");
  }
};