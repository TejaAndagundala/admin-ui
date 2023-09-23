import React, { useState, useEffect } from "react";
import axios from "axios";
//import { fetchData } from "../../api/api";
import { TextField, Button } from "@mui/material";
import styles from "./UserInterface.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon1 from "../../assets/EditIcon.svg";
import NextArrow from "../../assets/NextArrow.svg";
import PreviousArrow from "../../assets/PreviousArrow.svg";
import LastArrow from "../../assets/LastArrow.svg";
import FirstArrow from "../../assets/FirstArrow.svg";

const UserInterface = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    //Fetch the data when component mounts

    const fetchData = async () => {
      try {
        //Fetch the data from API

        const response = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    //Call the fetchData function when the component is mounted

    fetchData();
  }, []);

  //Handler for updating the search query

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleRowSelection = (userId) => {
    if (selectedRows.includes(userId)) {
      setSelectedRows(selectedRows.filter((id) => id !== userId));
    } else {
      setSelectedRows([...selectedRows, userId]);
    }
  };

  const handleDeleteRow = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
    setSelectedRows(selectedRows.filter((id) => id !== userId));
  };

  const handleEditRow = (userId) => {
    setEditingRow(userId);
  };

  const filteredRows = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleDeleteSelectedRows = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, endIndex);

  const pageButtons = [];

  for (let i = 1; i <= totalPages; i++) {
    pageButtons.push(
      <Button
        key={i}
        onClick={() => setCurrentPage(i)}
        disabled={currentPage === i}
      >
        {i}
      </Button>
    );
  }

  return (
    <div>
      <TextField
        sx={{ width: "100%" }}
        type="text"
        placeholder="Search by Name, Email or Role"
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className={styles.body}>
            {currentRows.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => handleRowSelection(user.id)}
                  />
                </td>
                <td>
                  {editingRow === user.id ? (
                    <input type="text" defaultValue={user.name} autoFocus />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingRow === user.id ? (
                    <input type="text" defaultValue={user.email} />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingRow === user.id ? (
                    <input type="text" defaultValue={user.role} />
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
                    <img
                      src={EditIcon1}
                      alt="edit"
                      onClick={() => handleEditRow(user.id)}
                      style={{ width: "20px" }}
                    />
                    <Button
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteRow(user.id)}
                    ></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <div className={styles.deleteButton}>
          <Button
            color="error"
            disabled={selectedRows.length === 0}
            onClick={handleDeleteSelectedRows}
          >
            Delete Selected
          </Button>
        </div>
        <div className={styles.pageButtons}>
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            <img src={FirstArrow} alt="first" style={{ width: "25px" }} />
          </Button>
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <img src={PreviousArrow} alt="previous" style={{ width: "25px" }} />
          </Button>
          <span>{pageButtons}</span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <img src={NextArrow} alt="next" style={{ width: "25px" }} />
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            <img src={LastArrow} alt="first" style={{ width: "25px" }} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserInterface;
