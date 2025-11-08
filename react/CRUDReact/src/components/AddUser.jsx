import React from "react";
import "./../App.css"; // import CSS


function AddUser({ onAdd }) {
  const [adding, setAdding] = React.useState(false);
  const [user, setUser] = React.useState({
    name: "",
    username: "",
    email: "",
    address: { street: "", suite: "", city: "" },
    phone: "",
    website: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (["street", "suite", "city"].includes(id)) {
      setUser(prev => ({ ...prev, address: { ...prev.address, [id]: value } }));
    } else {
      setUser(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleAdd = () => {
    if (!user.name.trim() || !user.username.trim()) {
      alert("Vui lòng nhập Name và Username!");
      return;
    }
    onAdd(user);
    setUser({
      name: "",
      username: "",
      email: "",
      address: { street: "", suite: "", city: "" },
      phone: "",
      website: ""
    });
    setAdding(false);
  };

  return (
    <div className="adduser-container">
      {!adding && (
        <button className="btn-add" onClick={() => setAdding(true)}>
          ➕ Thêm người dùng
        </button>
      )}

      {adding && (
        <div className="adduser-form">
          <h3>Thêm người dùng</h3>
          <div className="form-grid">
            <label htmlFor="name">Name:</label>
            <input id="name" value={user.name} onChange={handleChange} />

            <label htmlFor="username">Username:</label>
            <input id="username" value={user.username} onChange={handleChange} />

            <label htmlFor="email">Email:</label>
            <input id="email" value={user.email} onChange={handleChange} />

            <label htmlFor="street">Street:</label>
            <input id="street" value={user.address.street} onChange={handleChange} />

            <label htmlFor="city">City:</label>
            <input id="city" value={user.address.city} onChange={handleChange} />
          </div>

          <div className="form-buttons">
            <button className="btn-save" onClick={handleAdd}>Lưu</button>
            <button className="btn-cancel" onClick={() => setAdding(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddUser;