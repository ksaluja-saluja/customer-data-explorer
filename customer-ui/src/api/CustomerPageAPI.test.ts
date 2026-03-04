import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCustomerPageAPI, type CustomerPageResponse } from "./CustomerPageAPI";
import * as ConfigModule from "../config";

// Mock the config module
vi.mock("../config");

describe("getCustomerPageAPI", () => {
  const mockConfig = {
    apiBaseUrl: "http://localhost:3000",
    customerApiEndpoint: "/api/customers",
  };

  const mockResponse: CustomerPageResponse = {
    customers: [
      {
        customerId: 1,
        fullName: "John Doe",
        email: "john@example.com",
        registrationDate: "2025-01-01",
      },
      {
        customerId: 2,
        fullName: "Jane Smith",
        email: "jane@example.com",
        registrationDate: "2025-01-02",
      },
    ],
    lastCustomerId: "2",
    totalCustomers: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ConfigModule.getConfig).mockReturnValue(mockConfig);
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Successful Requests", () => {
    it("should fetch customer page with default parameters", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getCustomerPageAPI();

      expect(mockFetch).toHaveBeenCalledOnce();
      const callUrl = new URL(mockFetch.mock.calls[0][0] as string);
      expect(callUrl.searchParams.get("start")).toBe("0");
      expect(callUrl.searchParams.get("max")).toBe("10");
      expect(result).toEqual(mockResponse);
    });

    it("should fetch customer page with custom start and max parameters", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getCustomerPageAPI(20, 15);

      expect(mockFetch).toHaveBeenCalledOnce();
      const callUrl = new URL(mockFetch.mock.calls[0][0] as string);
      expect(callUrl.searchParams.get("start")).toBe("20");
      expect(callUrl.searchParams.get("max")).toBe("15");
      expect(result).toEqual(mockResponse);
    });

    it("should construct correct URL with config values", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await getCustomerPageAPI(0, 10);

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toContain("http://localhost:3000");
      expect(callUrl).toContain("/api/customers");
    });

    it("should return parsed JSON response", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getCustomerPageAPI();

      expect(result).toEqual(mockResponse);
      expect(result.customers).toHaveLength(2);
      expect(result.lastCustomerId).toBe("2");
      expect(result.totalCustomers).toBe(100);
    });

    it("should handle large pagination parameters", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockResponse, customers: [] }),
      } as Response);

      await getCustomerPageAPI(9990, 10);

      const callUrl = new URL(mockFetch.mock.calls[0][0] as string);
      expect(callUrl.searchParams.get("start")).toBe("9990");
      expect(callUrl.searchParams.get("max")).toBe("10");
    });

    it("should handle empty customer list", async () => {
      const emptyResponse: CustomerPageResponse = {
        customers: [],
        lastCustomerId: null,
        totalCustomers: 0,
      };

      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptyResponse,
      } as Response);

      const result = await getCustomerPageAPI();

      expect(result.customers).toHaveLength(0);
      expect(result.lastCustomerId).toBeNull();
      expect(result.totalCustomers).toBe(0);
    });
  });

  describe("Error Handling", () => {
    it("should throw error on non-ok response status", async () => {
      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(getCustomerPageAPI()).rejects.toThrow(
        "Failed to fetch customer data",
      );
    });

    it("should throw error on 404 response", async () => {
      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(getCustomerPageAPI()).rejects.toThrow(
        "Failed to fetch customer data",
      );
    });

    it("should throw error on 400 response", async () => {
      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response);

      await expect(getCustomerPageAPI()).rejects.toThrow(
        "Failed to fetch customer data",
      );
    });

    it("should throw error on network failure", async () => {
      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getCustomerPageAPI()).rejects.toThrow("Network error");
    });

    it("should throw error on timeout", async () => {
      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockRejectedValueOnce(new Error("fetch timeout"));

      await expect(getCustomerPageAPI()).rejects.toThrow("fetch timeout");
    });
  });

  describe("Configuration Usage", () => {
    it("should call getConfig to retrieve configuration", async () => {
      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await getCustomerPageAPI();

      expect(ConfigModule.getConfig).toHaveBeenCalled();
    });

    it("should use dynamic config values from getConfig", async () => {
      const customConfig = {
        apiBaseUrl: "https://api.example.com",
        customerApiEndpoint: "/v1/customers",
      };

      vi.mocked(ConfigModule.getConfig).mockReturnValueOnce(customConfig);

      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await getCustomerPageAPI();

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toContain("https://api.example.com");
      expect(callUrl).toContain("/v1/customers");
    });
  });

  describe("Query Parameters", () => {
    it("should encode special characters in query parameters", async () => {
      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await getCustomerPageAPI(0, 10);

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toContain("start=0");
      expect(callUrl).toContain("max=10");
    });

    it("should handle zero as start parameter", async () => {
      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await getCustomerPageAPI(0, 10);

      const callUrl = new URL(mockFetch.mock.calls[0][0] as string);
      expect(callUrl.searchParams.get("start")).toBe("0");
    });

    it("should construct URL with both start and max parameters", async () => {
      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await getCustomerPageAPI(50, 25);

      const callUrl = new URL(mockFetch.mock.calls[0][0] as string);
      expect(callUrl.searchParams.has("start")).toBe(true);
      expect(callUrl.searchParams.has("max")).toBe(true);
      expect(callUrl.searchParams.get("start")).toBe("50");
      expect(callUrl.searchParams.get("max")).toBe("25");
    });
  });

  describe("Response Types", () => {
    it("should return CustomerPageResponse type", async () => {
      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getCustomerPageAPI();

      expect(result).toHaveProperty("customers");
      expect(result).toHaveProperty("lastCustomerId");
      expect(result).toHaveProperty("totalCustomers");
      expect(Array.isArray(result.customers)).toBe(true);
    });

    it("should handle null lastCustomerId in response", async () => {
      const responseWithNullId: CustomerPageResponse = {
        customers: mockResponse.customers,
        lastCustomerId: null,
        totalCustomers: 100,
      };

      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithNullId,
      } as Response);

      const result = await getCustomerPageAPI();

      expect(result.lastCustomerId).toBeNull();
    });

    it("should preserve customer data in response", async () => {
      const mockFetch = vi.mocked(fetch as any);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getCustomerPageAPI();

      expect(result.customers[0].customerId).toBe(1);
      expect(result.customers[0].fullName).toBe("John Doe");
      expect(result.customers[0].email).toBe("john@example.com");
      expect(result.customers[0].registrationDate).toBe("2025-01-01");
    });
  });
});
