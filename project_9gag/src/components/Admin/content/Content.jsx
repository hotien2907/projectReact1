import React, { useState, useEffect } from "react";
import "../content/Content.css";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";

function User() {
  const [show, setShow] = useState(false);
  const [contentPosts, setContentPosts] = useState([]);
  const [curPage, setCurPage] = useState(1);
  const [LimitPerPage, setLimitPerPage] = useState(2);
  const [totalPage, setTotalPage] = useState(1);
  const [userStates, setUserStates] = useState([]);
  const [checkDelete, setCheckDelete] = useState(false);

  const handleClose = () => setShow(false);
  const handleDeleteContent = (item) => {
    axios
      .delete(`http://localhost:8000/contentPosts/${item.id}`)
      .then((res) => {
        console.log("Content deleted:", res.data);
      })
      .catch((err) => {
        console.log("Error deleting content:", err);
      });
    setCheckDelete(!checkDelete);
  };

  const loadUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setUserStates(response.data);
    } catch (error) {
      console.log("Error loading users:", error);
    }
  };

  const loadContentPosts = async () => {
    let url = `http://localhost:8000/contentPosts?_page=${curPage}&_limit=${LimitPerPage}`;
    try {
      let result = await axios.get(url);
      const countRes = result.headers["x-total-count"];
      const totalRes = Math.ceil(countRes / LimitPerPage);
      setTotalPage(totalRes);
      setContentPosts(result.data);
    } catch (error) {
      console.log("Error loading posts:", error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    loadContentPosts();
  }, [checkDelete, curPage]);

  let paginationItems = [];
  for (let i = 1; i <= totalPage; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        onClick={() => setCurPage(i)}
        active={i === curPage}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <div id="root">
      <Sidebar />
      <section className="content">
        <Header />
        <main className="main_content">
          <div className="manage-user-page">
            <div className="ant-table-wrapper">
              <div className="add_user">
                {/* <button className="btn btn-primary">
                  <i className="fa-solid fa-plus"></i> Add Bài Viết
                </button> */}
              </div>
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Người đăng bài</th>
                    <th>Ảnh</th>
                    <th>Nội dùng</th>
                    <th>Số Comment</th>
                    <th>Số Like</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {contentPosts.length > 0 &&
                    contentPosts.map((item, i) => (
                      <tr className="style-table" key={item.id}>
                        <td>{item.id}</td>
                        <td className="img_post_user">
                          <img src={item.imageUser} alt="" />
                          <span>{item.nameUser}</span>
                        </td>
                        <td className="img_post_admin">
                          <img src={item.imgPost} alt="" />
                        </td>
                        <td>{item.contentPost}</td>
                        <td>{item.comments.length}</td>
                        <td>{item.likes.length}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteContent(item)}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <div className="pagination">
          <Pagination>
            <Pagination.Prev
              disabled={curPage === 1}
              onClick={() => setCurPage(curPage - 1)}
            />
            {paginationItems}
            <Pagination.Next
              disabled={curPage === totalPage}
              onClick={() => setCurPage(curPage + 1)}
            />
          </Pagination>
        </div>
      </section>
    </div>
  );
}

export default User;
