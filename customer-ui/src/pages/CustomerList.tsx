import { useMemo, useState } from "react";
import { getAPI } from "../api/getAPI";
import Table from "../components/atoms/table/Table";
import Pagination from "../components/atoms/pagination/Pagination";
import useApi from "../hooks/useApi";
import Layout from "../components/templates/Layout";
import type { CustomerRow } from "../models/CustomerRow";
import "./CustomerList.scss";

const customerColumns: Array<keyof CustomerRow> = [
  "customerId",
  "fullName",
  "email",
  "registrationDate",
];

const customerColumnLabels: Partial<Record<keyof CustomerRow, string>> = {
  customerId: "Customer ID",
  fullName: "Name",
  email: "Email",
  registrationDate: "Registration Date",
};

const recordsPerPage = 10;

function CustomerList() {
  const { data, isLoading, error } = useApi(getAPI);
  const [currentPage, setCurrentPage] = useState(1);
  const customerData = data ?? [];

  const totalPages = Math.ceil(customerData.length / recordsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return customerData.slice(startIndex, startIndex + recordsPerPage);
  }, [currentPage, customerData]);

  return (
    <Layout title="Customer data explorer">
      <div className="table-section">
        {isLoading ? (
          <p>Loading customers...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <Table
              columns={customerColumns}
              columnLabels={customerColumnLabels}
              data={paginatedData}
              className="data-table"
              idKey="customerId"
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </Layout>
  );
}

export default CustomerList;
