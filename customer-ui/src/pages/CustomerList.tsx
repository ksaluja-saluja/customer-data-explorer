import Table from "../components/atoms/Table";
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

function CustomerList() {
  return (
    <Layout title="Customer data explorer">
      <Table
        columns={customerColumns}
        data={customerData as any}
        className="data-table"
        idKey="customerId"
      />
    </Layout>
  );
}

export default CustomerList;
