import Table from "../components/atoms/Table";
import Layout from "../components/templates/Layout";

type CustomerRow = {
  customerId: number;
  fullName: string;
  email: string;
  registrationDate: string;
};

const customerColumns: Array<keyof CustomerRow> = [
  "customerId",
  "fullName",
  "email",
  "registrationDate",
];

const customerData: CustomerRow[] = [
  {
    customerId: 1,
    fullName: "Aarav Sharma",
    email: "aarav@example.com",
    registrationDate: "2025-01-15",
  },
  {
    customerId: 2,
    fullName: "Meera Kapoor",
    email: "meera@example.com",
    registrationDate: "2025-02-20",
  },
  {
    customerId: 3,
    fullName: "Rohan Mehta",
    email: "rohan@example.com",
    registrationDate: "2025-03-10",
  },
];

function CustomerList() {
  return (
    <Layout title="Customer data explorer">
      <Table
        columns={customerColumns}
        data={customerData}
        className="data-table"
        idKey="customerId"
      />
    </Layout>
  );
}

export default CustomerList;
