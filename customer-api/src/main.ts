import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { ResponseUtil } from "./utilities/response";
import { CustomerRepository } from "./repositories/customerRepository";
import { CustomerPage } from "./models/Customer";
import { Logger } from "./utilities/logger";

let customerRepository: CustomerRepository | null = null;

export const getRepository = (): CustomerRepository => {
  if (!customerRepository) {
    customerRepository = new CustomerRepository();
  }
  return customerRepository;
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  Logger.info("Handler invoked", { event });
  try {
    const queryParams = event.queryStringParameters || {};

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
    const results: CustomerPage = await getRepository().getCustomersPage(start, max);
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