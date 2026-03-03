import { APIGatewayProxyEvent, Context, Callback } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
  callback(null, response);
};