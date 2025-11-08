import React from "react";

function ResultTable({ users }) {
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
            <button onClick={() => editUser(u)}>Sửa</button> 
            {/* <button onClick={() => removeUser(u.id)}>Xóa</button>  */}
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
