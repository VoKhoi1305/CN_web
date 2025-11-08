import React from "react";

function ResultTable({ users, onEdit, onDelete }) {
  return (
    <div>
      <h2>Danh Sách Người Dùng ({users.length})</h2>

      {users.length === 0 ? (
        <div>Không tìm thấy kết quả nào!</div>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Username</th>
              <th>Email</th>
              <th>City</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody> 
            {users.map((u) => ( 
            <tr key={u.id}> 
            <td>{u.id}</td> 
            <td>{u.name}</td> 
            <td>{u.username}</td> 
            <td>{u.email}</td> 
            <td>{u.address.city}</td> 
            <td> 
            <div className="btn-group">
            <button className="btn-edit" onClick={() => onEdit?.(u)}>Sửa</button>
            <button className="btn-delete" onClick={() => onDelete?.(u.id)}>Xóa</button>     
            </div>      
            </td> 
            </tr> 
            ))} 
            </tbody>
        </table>
      )}
    </div>
  );
}

export default ResultTable;
