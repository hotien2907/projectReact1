import React, { useState, useEffect } from "react";
import "./User.css";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";

function User() {
  const [show, setShow] = useState(false);
  const [userStates, setUserStates] = useState([]);
  const [curPage, setCurPage] = useState(1);
  const [LimitPerPage, setLimitPerPage] = useState(4);
  const [totalPage, setTotalPage] = useState(1);
  const [formAddDataUser, setFormData] = useState({
    nameUser: "",
    emailUser: "",
    role: "",
    passwordUser: "",
  });
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const { nameUser, emailUser, role, passwordUser } = formAddDataUser;
  const [formError, setFormError] = useState({
    nameUserError: "",
    emailUserError: "",
    passwordUserError: "",
    roleError: "Vui lòng nhập đầy đủ các trường thông tin !!!",
  });

  const { nameUserError, emailUserError, roleError, passwordUserError } =
    formError;
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setFormData({
      nameUser: "",
      emailUser: "",
      role: "",
      passwordUser: "",
    });
    setFormError({
      nameUserError: "",
      emailUserError: "",
      passwordUserError: "",
      roleError: "Vui lòng nhập đầy đủ các trường thông tin !!!",
    });
    setShow(true);
  };
  const loadUser = async () => {
    let url = `http://localhost:8000/users?_page=${curPage}&_limit=${LimitPerPage}`;
    try {
      const result = await axios.get(url);
      const countRes = result.headers["x-total-count"];
      const totalRes = Math.ceil(countRes / LimitPerPage);
      setTotalPage(totalRes);

      setUserStates(result.data);
    } catch (error) {
      console.log("Error loading users:", error);
    }
  };
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

  useEffect(() => {
    loadUser();
  }, [curPage]);

  const handleToggleUser = (item) => {
    const updatedUser = {
      ...item,
      status: item.status === "block" ? "unblock" : "block",
    };

    axios
      .put(`http://localhost:8000/users/${item.id}`, updatedUser)
      .then((res) => {
        console.log("User updated:", res.data);
        loadUser();
      })
      .catch((err) => {
        console.log("Error updating user:", err);
      });
  };

  const handleChangInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formAddDataUser,
      [name]: value,
    });
  };

  const handleAddUser = () => {
    const newFormErrors = {
      nameUserError: nameUser.trim() === "" ? "Tên không được để trống" : "",
      passwordUserError:
        passwordUser === ""
          ? "Mật khẩu không được để trống"
          : passwordUser.length < 8
          ? "Mật khẩu phải có ít nhất 8 ký tự"
          : !passwordRegex.test(passwordUser)
          ? "Mật khẩu phải bao gồm ký tự in hoa, số, và ký tự đặc biệt"
          : "",
      emailUserError:
        emailUser === ""
          ? "Email không được để trống"
          : !emailRegex.test(emailUser)
          ? "Email không đúng định dạng"
          : "",
      roleError: role === "" ? "vai trò không được để trống" : "",
    };
    setFormError(newFormErrors);

    const errorUser =
      nameUserError === "" &&
      emailUserError === "" &&
      passwordUserError === "" &&
      roleError === "";

    if (errorUser === true) {
      const newUser = {
        nameUser,
        emailUser,
        role: role || "regular",
        passwordUser,
        status: "unblock",
      };

      axios
        .post("http://localhost:8000/users", newUser)
        .then((res) => {
          console.log("User added:", res.data);
          loadUser();
          handleClose();
        })
        .catch((err) => {
          console.log("Error adding user:", err);
        });

      setFormData({
        nameUser: "",
        emailUser: "",
        role: "",
        passwordUser: "",
      });
    }
  };

  return (
    <div id="root">
      <Sidebar />
      <section className="content">
        <Header />
        <main className="main_content">
          <div className="manage-user-page">
            <div className="ant-table-wrapper">
              <div className="add_user">
                <button className="" onClick={handleShow}>
                  <i className="fa-solid fa-plus"></i> Add User
                </button>
              </div>
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên hiển thị</th>
                    <th>Email</th>
                    <th>Vai Trò</th>
                    <th>Trạng thái</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userStates.map((item, i) => (
                    <tr className="style-table" key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.nameUser}</td>
                      <td>{item.emailUser}</td>
                      <td>{item.role}</td>
                      <td
                        style={{
                          color: item.status === "block" ? "red" : "blue",
                        }}
                      >
                        {item.status}
                      </td>
                      <td>
                        <button
                          className={
                            item.status === "block"
                              ? "btn btn-danger"
                              : "btn btn-success"
                          }
                          onClick={() => handleToggleUser(item)}
                        >
                          {item.status === "block" ? (
                            <i className="fa-solid fa-lock"></i>
                          ) : (
                            <i className="fa-solid fa-lock-open"></i>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          </div>
        </main>
      </section>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicDisplayName" className="from-group">
              <Form.Control
                type="text"
                placeholder="Tên hiển thị"
                name="nameUser"
                value={nameUser}
                onChange={handleChangInput}
              />
              <div className="error">{nameUserError}</div>
            </Form.Group>

            <Form.Group controlId="formBasicEmail" className="from-group">
              <Form.Control
                type="email"
                placeholder="Email"
                name="emailUser"
                value={emailUser}
                onChange={handleChangInput}
              />
              <div className="error">{emailUserError}</div>
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="from-group">
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                name="passwordUser"
                value={passwordUser}
                onChange={handleChangInput}
              />
              <div className="error">{passwordUserError}</div>
            </Form.Group>

            <Form.Group controlId="formBasicRole" className="from-group">
              <select
                name="role"
                value={role}
                onChange={handleChangInput}
                className="custom-select"
              >
                <option value="">---Nhập Vai Trò---</option>
                <option value="admin">Admin</option>
                <option value="regular">Regular</option>
              </select>
              <div className="error">{roleError}</div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleAddUser}>Tạo Mới</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default User;
