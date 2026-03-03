import { useMemo, useState } from "react";
import Table from "../components/atoms/Table";
import Pagination from "../components/atoms/Pagination";
import Layout from "../components/templates/Layout";
import { mockCustomerData } from "../mocks/customerData";
import type { CustomerRow } from "../models/CustomerRow";

const customerColumns: Array<keyof CustomerRow> = [
  "customerId",
  "fullName",
  "email",
  "registrationDate",
];

const customerData = mockCustomerData;
const recordsPerPage = 10;

function CustomerList() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(customerData.length / recordsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return customerData.slice(startIndex, startIndex + recordsPerPage);
  }, [currentPage]);

  return (
    <Layout title="Customer data explorer">
      <div className="table-section">
        <Table
          columns={customerColumns}
          data={paginatedData}
          className="data-table"
          idKey="customerId"
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Layout>
  );
}

export default CustomerList;
