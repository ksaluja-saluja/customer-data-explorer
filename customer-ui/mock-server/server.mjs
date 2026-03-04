import { createServer } from "node:http";
import { URL } from "node:url";

const PORT = Number(process.env.MOCK_SERVER_PORT || 4001);

function generateMockCustomers(count = 100) {
  return Array.from({ length: count }, (_, index) => {
    const customerId = index + 1;
    const month = String((index % 12) + 1).padStart(2, "0");
    const day = String((index % 28) + 1).padStart(2, "0");

    return {
      customerId,
      fullName: `Customer ${customerId}`,
      email: `customer${customerId}@example.com`,
      registrationDate: `2025-${month}-${day}`,
    };
  });
}

const customerData = generateMockCustomers(100);

const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url.startsWith("/api/customers") && req.method === "GET") {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const start = parseInt(url.searchParams.get("start") || "0", 10);
    const max = parseInt(url.searchParams.get("max") || "10", 10);

    // Validate query parameters
    if (isNaN(start) || isNaN(max) || start < 0 || max <= 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid query parameters" }));
      return;
    }

    // Paginate the data
    const paginatedCustomers = customerData.slice(start, start + max);
    const lastCustomerId = paginatedCustomers.length > 0 
      ? paginatedCustomers[paginatedCustomers.length - 1].customerId.toString()
      : null;

    const response = {
      customers: paginatedCustomers,
      lastCustomerId,
      totalCustomers: customerData.length,
    };

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(response));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Not Found" }));
});

server.listen(PORT, () => {
  console.log(`Mock server is running at http://localhost:${PORT}`);
});