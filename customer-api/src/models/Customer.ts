export interface Customer {
  customerId: string;
  fullName: string;
  email: string;
  registrationDate: string;
  address: string;
}

export interface CustomerPage {
  customers: Customer[];
  lastCustomerId: string | null;
  totalCustomers: number;
}
