import React from "react";
import "./../App.css";

function EditUser({ editing, onChange, onSave, onCancel }) {
  return (
    <div className="adduser-container">
      <div className="adduser-form">
        <h3>Chỉnh Sửa Người Dùng</h3>

        <div className="form-grid">
          <label htmlFor="edit-name">Tên:</label>
          <input
            id="edit-name"
            type="text"
            value={editing.name}
            onChange={(e) => onChange("name", e.target.value)}
          />

          <label htmlFor="edit-username">Username:</label>
          <input
            id="edit-username"
            type="text"
            value={editing.username}
            onChange={(e) => onChange("username", e.target.value)}
          />

          <label htmlFor="edit-email">Email:</label>
          <input
            id="edit-email"
            type="email"
            value={editing.email}
            onChange={(e) => onChange("email", e.target.value)}
          />

          <label htmlFor="edit-city">City:</label>
          <input
            id="edit-city"
            type="text"
            value={editing.address.city}
            onChange={(e) => onChange("city", e.target.value)}
          />
        </div>

        <div className="form-buttons">
          <button className="btn-save" onClick={onSave}>Lưu</button>
          <button className="btn-cancel" onClick={onCancel}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
