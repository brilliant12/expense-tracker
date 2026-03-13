import { adminAPI } from "../../api/adminAPI";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { DecryptResponse } from "../../js/EncryptPayload";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminAPI.get("users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });

        const decryptedData = DecryptResponse(
          res.data,
          "MySuperSecretKey1234567890"
        );

        if (decryptedData) {
          setUsers(decryptedData.data);
          setFilteredUsers(decryptedData.data);
        } else {
          toast.error("Failed to load users.");
        }
      } catch (error) {
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users whenever search changes
  useEffect(() => {
    const result = users.filter((user) =>
      `${user.name} ${user.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      width: "80px",
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Role", selector: (row) => row.role || "User", sortable: true },
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
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : "",
      sortable: true,
    },
  ];

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col-md-4 mb-2 ">
            <h5 className="mb-0">User List</h5>
          </div>
          <div className="col-md-4 mb-2 ">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2 mb-2">
            <CSVLink
              data={filteredUsers}
              filename={"users.csv"}
              className="btn btn-outline-primary btn-sm w-100"
            >
              Export CSV
            </CSVLink>
          </div>
          <div className="col-md-2 mb-2">
            <button
              className="btn btn-outline-success btn-sm w-100"
              onClick={exportToExcel}
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <DataTable
          columns={columns}
          data={filteredUsers}
          progressPending={loading}
          pagination
          paginationPerPage={rowsPerPage}
          onChangePage={(page) => setCurrentPage(page)}
          onChangeRowsPerPage={(newPerPage, page) => {
            setRowsPerPage(newPerPage);
            setCurrentPage(page);
          }}
          highlightOnHover
          responsive
          striped
          customStyles={{
            headCells: {
              style: {
                fontWeight: "bold",
                backgroundColor: "#f8f9fa",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default UserList;
