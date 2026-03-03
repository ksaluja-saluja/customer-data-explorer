import { handler } from "./main";
import * as mainModule from "./main";
import { CustomerRepository } from "./repositories/customerRepository";
import { ResponseUtil } from "./utilities/response";

jest.mock("./utilities/response");
jest.mock("./repositories/customerRepository");

describe("handler", () => {
  const mockSuccess = jest.spyOn(ResponseUtil, "success");
  const mockBadRequest = jest.spyOn(ResponseUtil, "BadRequest");
  const mockError = jest.spyOn(ResponseUtil, "error");

  let mockGetCustomersPage: jest.Mock;
  let mockRepositoryInstance: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCustomersPage = jest.fn();
    mockRepositoryInstance = {
      getCustomersPage: mockGetCustomersPage,
    } as any;

    jest.spyOn(mainModule, "getRepository").mockReturnValue(mockRepositoryInstance);
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

  it("should return a paginated list of customers", async () => {
    const event = {
      queryStringParameters: { start: "0", max: "2" },
    } as any;

    const mockCustomers = [
      { customerId: "1", fullName: "John Doe", email: "john.doe@example.com", registrationDate: "2023-01-01" },
      { customerId: "2", fullName: "Jane Smith", email: "jane.smith@example.com", registrationDate: "2023-01-02" },
    ];

    mockGetCustomersPage.mockResolvedValue({
      customers: mockCustomers,
      lastCustomerId: "2",
      totalCustomers: 2,
    });

    await handler(event, {} as any);

    expect(mockGetCustomersPage).toHaveBeenCalledWith(0, 2);
    expect(mockSuccess).toHaveBeenCalledWith({
      customers: mockCustomers,
      lastCustomerId: "2",
      totalCustomers: 2
    });
  });

  it("should return an empty list if no customers are found", async () => {
    const event = {
      queryStringParameters: { start: "10", max: "2" },
    } as any;

    mockGetCustomersPage.mockResolvedValueOnce({
      customers: [],
      pagination: { start: 10, max: 2, totalCustomers: 0 },
    });

    await handler(event, {} as any);

    expect(mockGetCustomersPage).toHaveBeenCalledWith(10, 2);
    expect(mockSuccess).toHaveBeenCalledWith({
      customers: [],
      lastCustomerId: undefined,
      totalCustomers: undefined
    });
  });

  it("should return an error if an exception occurs", async () => {
    const event = {
      queryStringParameters: { start: "0", max: "2" },
    } as any;

    mockGetCustomersPage.mockRejectedValueOnce(new Error("Database error"));

    await handler(event, {} as any);

    expect(mockGetCustomersPage).toHaveBeenCalledWith(0, 2);
    expect(mockError).toHaveBeenCalledWith(
      "An error occurred while fetching customers."
    );
  });
});