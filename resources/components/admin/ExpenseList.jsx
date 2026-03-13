import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Spinner, Button, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

import { DecryptResponse } from "../../js/EncryptPayload";
import { adminAPI } from "../../api/adminAPI";

function ExpenseList() {

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {

        const res = await adminAPI.get("/expense_list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });

        const decryptedData = DecryptResponse(
          res.data,
          "MySuperSecretKey1234567890"
        );

        if (decryptedData) {
          setExpenses(decryptedData.data);
          setFilteredExpenses(decryptedData.data);
        } else {
          toast.error("Failed to load expenses.");
        }

      } catch (error) {
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();

  }, []);

  // Search Filter
  useEffect(() => {

    const result = expenses.filter((item) =>
      item.expense_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.group?.group_name?.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredExpenses(result);

  }, [search, expenses]);

  // Excel Export
  const exportExcel = () => {

    const worksheet = XLSX.utils.json_to_sheet(filteredExpenses);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, "expense_list.xlsx");

  };

  const columns = [

    {
      name: "S.NO",
      cell: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "User Name",
      selector: (row) => row.user?.name,
      sortable: true,
    },
    {
      name: "Group Name",
      selector: (row) => row.group?.group_name,
      sortable: true,
    },
    {
      name: "Expense Name",
      selector: (row) => row.expense_name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.expense_description,
    },
    {
      name: "Amount",
      selector: (row) => `₹${row.amount}`,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`badge ${
            row.status === "ACTIVE" ? "bg-success" : "bg-danger"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="card m-2">

      <h5 className="card-header bg-primary text-white">
        Expense List
      </h5>

      <div className="card-body">

        {/* Search + Export Buttons */}
        <div className="d-flex justify-content-between mb-3">

          {/* Search */}
          <Form.Control
            type="text"
            placeholder="Search expense..."
            style={{ width: "300px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Buttons Right Side */}
          <div>

            <CSVLink
              data={filteredExpenses}
              filename="expenses.csv"
              className="btn btn-success me-2"
            >
              Export CSV
            </CSVLink>

            <Button
              variant="warning"
              onClick={exportExcel}
            >
              Export Excel
            </Button>

          </div>

        </div>

        {loading ? (

          <div className="text-center">
            <Spinner animation="border" />
          </div>

        ) : (

          <DataTable
            columns={columns}
            data={filteredExpenses}
            pagination
            highlightOnHover
            striped
            responsive
          />

        )}

      </div>
    </div>
  );
}

export default ExpenseList;