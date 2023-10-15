import React, { useEffect, useState } from "react";
import "./Admin.css"; // Import tệp CSS đã tạo
import User from "./Users/User";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import axios from "axios";

function Admin({ dataUser }) {
  const [content, setContent] = useState([]);
  const loadContent = async () => {
    try {
      const response = await axios.get("http://localhost:8000/contentPosts");
      setContent(response.data);
    } catch (error) {
      console.log("Error loading users:", error);
    }
  };
  useEffect(() => {
    loadContent();
  }, []);
  return (
    <div id="root">
      <Sidebar />
      <section className="content">
        <Header />
        <main className="main_content">
          <div className="ant-card">
            <div className="ant-card-body">
              <div className="ant-statistic">
                <div className="ant-statistic-title">Tổng Users</div>
                <div className="ant-statistic-content">
                  <span className="ant-statistic-content-value">
                    {dataUser.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="ant-card">
            <div className="ant-card-body">
              <div className="ant-statistic">
                <div className="ant-statistic-title">Tổng số bài viết</div>
                <div className="ant-statistic-content">
                  <span className="ant-statistic-content-value">
                    {content.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

export default Admin;
