import { handler } from "./main";
import { ResponseUtil } from "./utilities/response";

jest.mock("./utilities/response");

describe("handler", () => {
  const mockBadRequest = jest.spyOn(ResponseUtil, "BadRequest");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return BadRequest if 'start' or 'max' is missing", async () => {
    const event = {
      queryStringParameters: { start: "10" }, // 'max' is missing
    } as any;

    await handler(event, {} as any);

    expect(mockBadRequest).toHaveBeenCalledWith(
      "Missing required query parameters 'start' and 'max'."
    );
  });

  it("should return BadRequest if 'start' or 'max' is not a number", async () => {
    const event = {
      queryStringParameters: { start: "abc", max: "20" }, // 'start' is invalid
    } as any;

    await handler(event, {} as any);

    expect(mockBadRequest).toHaveBeenCalledWith(
      "Query parameters 'start' and 'max' must be valid numbers."
    );
  });
});