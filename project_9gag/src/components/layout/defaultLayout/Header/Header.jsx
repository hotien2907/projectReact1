import React, { useEffect, useState } from "react";
import "./Header.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import UpdateUser from "./UpdateUser";
import swal from "sweetalert";
function Header({ handleSearch }) {
  const [dataNameUser, setDataNameUser] = useState([]);
  const [checkImage, setCheckImage] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [checkUser, setCheckUser] = useState(false);
  const [userActive, setUserActive] = useState({
    nameUserActive: "",
    imgUserActive: "",
  });
  const { nameUserActive, imgUserActive } = userActive;
  const [toogle, setToogle] = useState(false);
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const loadUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setDataNameUser(response.data);
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].status === "active") {
          setUserActive({
            nameUserActive: response.data[i].nameUser,
            imgUserActive: response.data[i].imageUser,
          });
          setCheckUser(true);
        }
        if (
          response.data[i].role === "admin" &&
          response.data[i].status === "active"
        ) {
          setCheckAdmin(true);
        }
      }
    } catch (error) {
      console.log("Error loading users:", error);
    }
  };
  const loadContentPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/contentPosts/?_sort=id&_order=desc"
      );
    } catch (error) {
      console.log("Error loading posts:", error);
    }
  };

  const handleAdmin = () => {
    console.log(checkAdmin);
    console.log(134);
    if (checkAdmin) {
      navigate("/admin");
    } else {
      swal(" không có quyền truy cập vào trang admin", {
        dangerMode: true,
        buttons: true,
      });
    }
  };
  const handleCheckOut = () => {
    const loggedInUser = dataNameUser.find((item) => item.status === "active");

    if (loggedInUser) {
      const updatedUser = { ...loggedInUser, status: "unblock" };

      axios
        .put(`http://localhost:8000/users/${loggedInUser.id}`, updatedUser)
        .then((res) => {
          console.log("User updated:", res.data);
        })
        .catch((err) => {
          console.log("Error updating user:", err);
        });

      navigate("/signup");
    }
  };
  const [a,setA] = useState("");
  const [b, setB] = useState({
    name:"a",
    age:23
  })
  const {name1,age} = {
    name:"a",
    age:23
  };
  const obj ={
    name:"a",
    age:23
  }
  const handleSearchCt = async () => {
    handleSearch(searchInput);
    setSearchInput("");
    setToogle(!toogle);
  };

  useEffect(() => {
    loadUser();
  }, [imgUserActive, checkImage]);
  useEffect(() => {
    loadContentPosts();
  }, []);
  return (
    <header className="header">
      <nav className="header_nav">
        <a className="header_menu" href="#">
          <i
            className="fa-solid fa-bars"
            style={{ fontSize: "22px", color: "black" }}
          ></i>
        </a>
        <Link to="/" className="header_logo">
          9GAG
        </Link>
        <ul className="header_nav_ul">
          <li>
            <a href="">🔀 Shuffle</a>
          </li>
          <li>
            <a href="">📱 Get App</a>
          </li>
          <li>
            <a href="">🏴‍☠️ Memeland</a>
          </li>
          <li>
            <a href="">💫 9GAG Vibes</a>
          </li>
          <li>
            <a href="">📍Local</a>
          </li>
          <li>
            <a href="">🕹️Gamescom 2023</a>
          </li>
        </ul>
      </nav>
      <div className="header_right">
        <div className="header_search">
          <i
            className="fa-solid fa-magnifying-glass"
            onClick={() => setToogle(!toogle)}
          ></i>
          {toogle && (
            <div className="header_search_input">
              <input
                type="text"
                placeholder="Search ??"
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="button_search" onClick={handleSearchCt}>
                Search
              </button>
            </div>
          )}
        </div>
        <div className="header_login">
          {checkUser === false ? (
            <button id="signup-btn" className="header_btn">
              <Link to="/signup">
                <span>Sign Up/</span>
              </Link>
              <Link to="/login">
                <span>Log In</span>
              </Link>
            </button>
          ) : (
            <div className="nameUserExisting">
              <img
                className="dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                src={imgUserActive}
                alt=""
              />

              <ul className="dropdown-menu">
                <li>
                  {checkAdmin && (
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={handleAdmin}
                    >
                      Trang quản Trị
                    </button>
                  )}
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={handleShow}
                  >
                    Quản lý tài khoản
                  </button>
                </li>

                {/* modal chỉnh sửa user  */}
                <UpdateUser
                  checkImage={checkImage}
                  setCheckImage={setCheckImage}
                  handleClose={handleClose}
                  show={show}
                  setShow={setShow}
                />

                <li>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={handleCheckOut}
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>

              <span>{nameUserActive}</span>
            </div>
          )}

          <Link
            to="/post/-1"
            href="#"
            className="header_btn_post"
            id="post-btn"
          >
            <i className="fa-sharp fa-solid fa-pen"></i>
            <span> Post</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
