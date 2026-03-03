import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { CustomerRepository } from "./customerRepository";
import { CustomerPage } from "../models/Customer";

jest.mock("@aws-sdk/client-rds-data");

describe("CustomerRepository", () => {
  let customerRepository: CustomerRepository;
  let mockSend: jest.Mock;

  beforeEach(() => {
    // Mock RDSDataClient
    const mockRDSClient = new RDSDataClient({});
    mockSend = jest.fn();
    mockRDSClient.send = mockSend;

    // Initialize CustomerRepository with mocked RDSDataClient
    customerRepository = new CustomerRepository();
    customerRepository["rdsCient"] = mockRDSClient; // Replace the internal client with the mocked one
  });

  it("should return a paginated list of customers", async () => {
    // Mock total customers query response
    mockSend
      .mockResolvedValueOnce({
        records: [[{ longValue: 100 }]], // Total customers = 100
      })
      .mockResolvedValueOnce({
        records: [
          [
            { stringValue: "1" },
            { stringValue: "John Doe" },
            { stringValue: "john.doe@example.com" },
            { stringValue: "2023-01-01" },
          ],
          [
            { stringValue: "2" },
            { stringValue: "Jane Smith" },
            { stringValue: "jane.smith@example.com" },
            { stringValue: "2023-01-02" },
          ],
        ],
      });

    const result: CustomerPage = await customerRepository.getCustomersPage(0, 2);

    expect(mockSend).toHaveBeenCalledTimes(2); // One for total count, one for paginated query
    expect(result).toEqual({
      customers: [
        {
          customerId: "1",
          fullName: "John Doe",
          email: "john.doe@example.com",
          registrationDate: "2023-01-01",
        },
        {
          customerId: "2",
          fullName: "Jane Smith",
          email: "jane.smith@example.com",
          registrationDate: "2023-01-02",
        },
      ],
      lastCustomerId: "2",
      totalCustomers: 100,
    });
  });

  it("should return an empty list if there are no customers", async () => {
    // Mock total customers query response
    mockSend
      .mockResolvedValueOnce({
        records: [[{ longValue: 0 }]], // Total customers = 0
      })
      .mockResolvedValueOnce({
        records: [], // No customer records
      });

    const result: CustomerPage = await customerRepository.getCustomersPage(0, 2);

    expect(mockSend).toHaveBeenCalledTimes(2); // One for total count, one for paginated query
    expect(result).toEqual({
      customers: [],
      totalCustomers: 0,
      lastCustomerId: null,
    });
  });

  it("should throw an error if the database query fails", async () => {
    // Mock an error during the database query
    mockSend.mockRejectedValueOnce(new Error("Database query failed"));

    await expect(customerRepository.getCustomersPage(0, 2)).rejects.toThrow("Database query failed");
    expect(mockSend).toHaveBeenCalledTimes(1); // Only the total count query is attempted
  });
});