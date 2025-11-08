import React, { useState } from "react";
import SearchForm from "./components/SearchForm.jsx";
import ResultTable from "./components/ResultTable.jsx";
import AddUser from "./components/AddUser.jsx";
import EditUser from "./components/EditUser.jsx";

function App() {
  const [users, setUsers] = React.useState([]); 
  const [loading, setLoading] = React.useState(true); 
  const [keyword, setKeyword] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  React.useEffect(() => { 
  fetch("https://jsonplaceholder.typicode.com/users") 
  .then(res => res.json()) 
  .then(data => { setUsers(data); setLoading(false); }); 
  }, []);

    const setNewUser = (newUser) => {
    setUsers((prev) => {
      const maxId = prev.reduce((m, u) => (u.id > m ? u.id : m), 0);
      const created = { ...newUser, id: maxId + 1 };
      return [...prev, created];
    });
  };

  // Hàm kích hoạt chỉnh sửa
  const handleEdit = (user) => {
    setEditingUser({ ...user, address: { ...user.address } }); // deep copy
  };

  // Hàm thay đổi dữ liệu trong form
  const handleEditChange = (field, value) => {
    if (field === "city") {
      setEditingUser((prev) => ({
        ...prev,
        address: { ...prev.address, city: value },
      }));
    } else {
      setEditingUser((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Hàm lưu chỉnh sửa
  const handleSaveEdit = () => {
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    setEditingUser(null);
  };

  // Hàm hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

   //  Xóa người dùng
 const handleDelete = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };
  
  const filteredUsers = users.filter((user) => {
    const keywords = keyword.toLowerCase().trim().split(/\s+/);
    const userText = `${user.name} ${user.username} ${user.email}`.toLowerCase();
    return keywords.every((kw) => userText.includes(kw));
  });


  return (
    <div className="app-container">
      <h1>Quản lý người dùng</h1>
      <SearchForm onChangeValue={setKeyword} />
      <AddUser onAdd={setNewUser} /> 
       {/* Nếu đang chỉnh sửa thì hiển thị form EditUser */}
      {editingUser ? (
        <EditUser
          editing={editingUser}
          onChange={handleEditChange}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <ResultTable users={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default App;
