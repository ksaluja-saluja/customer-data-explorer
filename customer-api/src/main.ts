import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { ResponseUtil } from "./utilities/response";
import { Customer } from "./models/Customer";

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

  const customers: Customer[] = []

  return ResponseUtil.success({
    data: {
      customers,
      lastCustomerId: 0,
      totalCustomers: 0
    }
  });
};