import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>Admin</h1>
      <ul id="menu">
        <li>
          <Link to="/admin">
            {" "}
            <i className="fa-brands fa-windows"></i>Dashboard
          </Link>
        </li>
        <li>
          <a href="">
            {" "}
            <i className="fa-regular fa-user"></i>Manage Users
          </a>
          <ul>
            <li>
              <Link to="/admin/user">
                <i className="fa-solid fa-users"></i> CRUD
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/admin/content">
            <i className="fa-solid fa-book"></i> Manage Content
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
