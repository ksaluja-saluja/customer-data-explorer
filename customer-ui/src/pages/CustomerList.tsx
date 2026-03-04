import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getCustomerPage } from "../redux/slices/customerPageSlice";
import Table from "../components/atoms/table/Table";
import Pagination from "../components/atoms/pagination/Pagination";
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
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [accumulatedData, setAccumulatedData] = useState<CustomerRow[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Get data from Redux store
  const { pages, loading, error } = useAppSelector(
    (state) => state.customerPage,
  );

  // Fetch customer page data when currentPage changes
  useEffect(() => {
    const start = (currentPage - 1) * recordsPerPage;
    dispatch(getCustomerPage({ start, max: recordsPerPage }));
  }, [currentPage, dispatch]);

  // Get current page data from Redux store
  const cacheKey = `${(currentPage - 1) * recordsPerPage}-${recordsPerPage}`;
  const customerPageData = pages[cacheKey];
  const customerData = customerPageData?.customers ?? [];

  // Update total customers when data changes
  useEffect(() => {
    if (customerPageData?.totalCustomers) {
      setTotalCustomers(customerPageData.totalCustomers);
    }
  }, [customerPageData]);

  // Accumulate data for mobile infinite scroll
  useEffect(() => {
    if (isMobile && customerData.length > 0) {
      setAccumulatedData((prev) => {
        // Only add new customers (avoid duplicates)
        const existingIds = new Set(
          prev.map((customer) => customer.customerId),
        );
        const newCustomers = customerData.filter(
          (customer) => !existingIds.has(customer.customerId),
        );
        return [...prev, ...newCustomers];
      });
      setIsLoadingMore(false);
    } else if (!isMobile) {
      // For desktop, use current page data directly
      setAccumulatedData(customerData);
    }
  }, [customerData, isMobile]);

  // Detect if on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Infinite scroll for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 200;
      const totalPages = Math.ceil(totalCustomers / recordsPerPage);

      if (
        scrollPosition >= threshold &&
        !isLoadingMore &&
        currentPage < totalPages
      ) {
        setIsLoadingMore(true);
        setCurrentPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, isLoadingMore, currentPage, totalCustomers]);

  const displayData = useMemo(() => {
    if (isMobile) {
      return accumulatedData;
    } else {
      return customerData;
    }
  }, [isMobile, accumulatedData, customerData]);

  const totalPages = Math.ceil(totalCustomers / recordsPerPage);

  return (
    <Layout title="Customer data explorer">
      <div className="table-section">
        {loading && currentPage === 1 ? (
          <p>Loading customers...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <Table
              columns={customerColumns}
              columnLabels={customerColumnLabels}
              data={displayData}
              className="table"
              idKey="customerId"
            />
            {!isMobile && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
            {isMobile && isLoadingMore && (
              <p className="table-section__loading-indicator">Loading more records...</p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default CustomerList;
