import { ResponseUtil } from "./response";

describe("ResponseUtil", () => {
  it("should return a 400 BadRequest response", () => {
    const message = "Invalid input";
    const result = ResponseUtil.BadRequest(message);

    expect(result).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: message }),
    });
  });

  it("should return a 200 success response", () => {
    const data = { id: 1, name: "Test" };
    const result = ResponseUtil.success(data);

    expect(result).toEqual({
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    });
  });

  it("should return a 500 error response with an error message", () => {
    const error = new Error("Something went wrong");
    const result = ResponseUtil.error(error);

    expect(result).toEqual({
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
    });
  });

  it("should return a 500 error response with an unknown error", () => {
    const result = ResponseUtil.error(null);

    expect(result).toEqual({
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Internal server error",
        error: "Unknown error",
      }),
    });
  });
});