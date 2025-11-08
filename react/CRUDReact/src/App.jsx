import React, { useState } from "react";
import SearchForm from "./components/SearchForm.jsx";
import ResultTable from "./components/ResultTable.jsx";
import AddUser from "./components/AddUser.jsx";

function App() {
  const [users, setUsers] = React.useState([]); 
  const [loading, setLoading] = React.useState(true); 
  const [keyword, setKeyword] = useState("");

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

   const updateUser = (userToUpdate) => {
    setUsers(prev => 
      prev.map(u => (u.id === userToUpdate.id ? userToUpdate : u))
    );
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
      <updateUser onChangeValue={updateUser} />
      <ResultTable users={filteredUsers} />
    </div>
  );
}

export default App;
