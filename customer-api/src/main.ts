import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { ResponseUtil } from "./utilities/response";
import { CustomerRepository } from "./repositories/customerRepository";
import { CustomerPage } from "./models/Customer";

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
  const queryParams = event.queryStringParameters || {};

  if (!queryParams.start || !queryParams.max) {
    return ResponseUtil.BadRequest("Missing required query parameters 'start' and 'max'.");
  }

  const start = queryParams.start ? Number(queryParams.start) : NaN;
  const max = queryParams.max ? Number(queryParams.max) : NaN;

  if (isNaN(start) || isNaN(max)) {
    return ResponseUtil.BadRequest("Query parameters 'start' and 'max' must be valid numbers.");
  }

  const results: CustomerPage = await getRepository().getCustomersPage(start, max);

  return ResponseUtil.success({
    customers: results.customers,
    lastCustomerId: results.lastCustomerId,
    totalCustomers: results.totalCustomers,
  });
};