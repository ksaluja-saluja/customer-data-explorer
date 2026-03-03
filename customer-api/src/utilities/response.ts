import { APIGatewayProxyResult } from "aws-lambda";

export class ResponseUtil {
  private static readonly HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }

  static BadRequest(message: string): APIGatewayProxyResult {
    return {
      statusCode: 400,
      headers: this.HEADERS,
      body: JSON.stringify({ error: message }),
    }
  }

  static success(data: any): APIGatewayProxyResult {
    return {
      statusCode: 200,
      headers: this.HEADERS,
      body: JSON.stringify(data),
    }
  }

  static error(error: unknown): APIGatewayProxyResult {
    return {
      statusCode: 500,
      headers: this.HEADERS,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}