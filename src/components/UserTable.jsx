import React, { useState } from "react";

const PAGE_SIZE = 10; // Number of rows per page

const UserTable = ({ users, setUsers }) => {
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [editUserId, setEditUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Function to handle search input changes
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page with new search
  };

  // Function to filter users based on the search query
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery) ||
          user.email.toLowerCase().includes(searchQuery) ||
          user.role.toLowerCase().includes(searchQuery)
      )
    : users;

  const pageCount = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const usersOnPage = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditClick = (user) => {
    setEditUserId(user.id);
    const formValues = {
      name: user.name,
      email: user.email,
      role: user.role,
    };
    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditUserId(null);
  };

  const toggleSelectAll = (checked) => {
    const usersToToggle = usersOnPage.map((user) => user.id);
    setSelectedUsers(
      checked
        ? new Set([...selectedUsers, ...usersToToggle])
        : new Set(
            Array.from(selectedUsers).filter(
              (id) => !usersToToggle.includes(id)
            )
          )
    );
  };

  const handleSaveClick = () => {
    const editedUsers = users.map((user) =>
      user.id === editUserId ? { ...user, ...editFormData } : user
    );
    setUsers(editedUsers);
    setEditUserId(null);
  };

  const handleDeleteClick = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    setSelectedUsers(
      new Set(Array.from(selectedUsers).filter((id) => id !== userId))
    );
  };

  const handleBulkDeleteClick = () => {
    const updatedUsers = users.filter((user) => !selectedUsers.has(user.id));
    setUsers(updatedUsers);
    setSelectedUsers(new Set()); // Clear selection
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="🔍 Search..."
          className="search-bar"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          onClick={handleBulkDeleteClick}
          className="delete-selected-button"
        >
          Delete Selected
        </button>
      </div>
      {/* Table */}
      <table>
        {/* Table Head */}
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => toggleSelectAll(e.target.checked)}
                checked={usersOnPage.every((user) =>
                  selectedUsers.has(user.id)
                )}
                // This will make the checkbox indeterminate if some but not all users on the page are selected
                ref={(input) => {
                  if (input) {
                    input.indeterminate =
                      usersOnPage.some((user) => selectedUsers.has(user.id)) &&
                      !usersOnPage.every((user) => selectedUsers.has(user.id));
                  }
                }}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {usersOnPage.map((user) => (
            <tr
              key={user.id}
              style={{
                background: selectedUsers.has(user.id)
                  ? "#f0f0f0"
                  : "transparent",
              }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.has(user.id)}
                  onChange={() => {
                    const newSelectedUsers = new Set(selectedUsers);
                    if (selectedUsers.has(user.id)) {
                      newSelectedUsers.delete(user.id);
                    } else {
                      newSelectedUsers.add(user.id);
                    }
                    setSelectedUsers(newSelectedUsers);
                  }}
                />
              </td>
              <td>
                {editUserId === user.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editUserId === user.id ? (
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                  />
                ) : (
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                )}
              </td>
              <td>
                {editUserId === user.id ? (
                  <input
                    type="text"
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditFormChange}
                  />
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editUserId === user.id ? (
                  <div>
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => handleEditClick(user)}>Edit</button>
                    <button onClick={() => handleDeleteClick(user.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => changePage(1)} disabled={currentPage === 1}>
          First
        </button>
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(pageCount)].map((_, index) => (
          <button
            key={index}
            onClick={() => changePage(index + 1)}
            disabled={index + 1 === currentPage}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          Next
        </button>
        <button
          onClick={() => changePage(pageCount)}
          disabled={currentPage === pageCount}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default UserTable;
