import { useMemo, useState, useEffect } from "react";
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
  const [mobileItemsToShow, setMobileItemsToShow] = useState(recordsPerPage);
  const [isMobile, setIsMobile] = useState(false);
  const customerData = data ?? [];

  const totalPages = Math.ceil(customerData.length / recordsPerPage);

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
      
      if (scrollPosition >= threshold && mobileItemsToShow < customerData.length) {
        setMobileItemsToShow((prev) => Math.min(prev + recordsPerPage, customerData.length));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, mobileItemsToShow, customerData.length]);

  // Reset mobile items when switching views
  useEffect(() => {
    if (!isMobile) {
      setMobileItemsToShow(recordsPerPage);
    }
  }, [isMobile]);

  const displayData = useMemo(() => {
    if (isMobile) {
      return customerData.slice(0, mobileItemsToShow);
    } else {
      const startIndex = (currentPage - 1) * recordsPerPage;
      return customerData.slice(startIndex, startIndex + recordsPerPage);
    }
  }, [isMobile, mobileItemsToShow, currentPage, customerData]);

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
              data={displayData}
              className="data-table"
              idKey="customerId"
            />
            {!isMobile && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
            {isMobile && mobileItemsToShow < customerData.length && (
              <p className="loading-more">Loading more...</p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default CustomerList;
