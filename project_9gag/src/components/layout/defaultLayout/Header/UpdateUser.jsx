import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import BootstrapModal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./Header.css";

import Modal from "react-bootstrap/Modal";

function UpdateUser({ handleClose, show, setShow, setCheckImage, checkImage }) {
  const [togglePass, setTogglePass] = useState(false);
  const [toogleImage, setToogleImage] = useState(false);
  const [updateImage, setUpdateImage] = useState("");
  const [user, setUser] = useState([]);
  const [userActive, setUserActive] = useState({});
  const [updataFormUser, setUpdateFormUser] = useState({
    nameUser: "",
    emailUser: "",
    passwordUser: "",
    newPasswordUser: "",
  });
  const { nameUser, emailUser, passwordUser, newPasswordUser } = updataFormUser;
  const loadUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      const activeUser = response.data.find((user) => user.status === "active");
      if (activeUser) {
        setUserActive(activeUser);
      }
      setUser(response.data);
    } catch (error) {
      console.log("Error loading users:", error);
    }
  };

  const handleChangInput = (e) => {
    // if (name === "nameUser" || name === "emailUser") {
    //   // return;
    // }
    const { name, value } = e.target;
    setUpdateFormUser({ ...updataFormUser, [name]: value });
  };

  const handleUpdateImage = async () => {
    const updatedUser = { ...userActive, imageUser: updateImage };
    const response = await axios.put(
      `http://localhost:8000/users/${updatedUser.id}`,
      updatedUser
    );
    setShow(false);
    setCheckImage(!checkImage);
  };

  const handleUpdatePassword = async () => {
    try {
      const updatedUser = { ...userActive, passwordUser: newPasswordUser };
      const response = await axios.put(
        `http://localhost:8000/users/${updatedUser.id}`,
        updatedUser
      );
    } catch (error) {
      console.error("Error updating password:", error);
    }
    setShow(false);
    setUpdateFormUser({
      newPasswordUser: "",
    });
  };

  useEffect(() => {
    loadUser();
  }, [checkImage]);
  useEffect(() => {
    setUpdateFormUser(userActive);
  }, [user, userActive]);
  return (
    <div>
      <Modal size="lg" variant="primary" show={show} onHide={handleClose}>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>Quản Lý tài Khoản</BootstrapModal.Title>
        </BootstrapModal.Header>
        <div className="title_upload">
          <div className="title_upload_imgae">
            {" "}
            <button onClick={() => setToogleImage(true)}>UPLOAD ẢNH </button>
            {toogleImage && (
              <div className="upload_image">
                <div>
                  <img
                    src="https://www.invert.vn/media/uploads/uploads/2022/12/03191809-2.jpeg"
                    alt=""
                  />
                  <input
                    type="text"
                    placeholder="nhập ảnh !!"
                    onChange={(e) => setUpdateImage(e.target.value)}
                  />
                </div>
                <button className="update_image" onClick={handleUpdateImage}>
                  <i class="fa-solid fa-arrow-up-from-bracket"></i>Update ảnh
                </button>
              </div>
            )}
          </div>
          <div className="title_upload_user">
            {" "}
            <button onClick={() => setToogleImage(false)}>
              THAY ĐỔI THÔNG TIN
            </button>
            {!toogleImage && (
              <div className="form_add_user">
                <BootstrapModal.Body>
                  <Form>
                    <Form.Group
                      controlId="formBasicDisplayName"
                      className="from-group"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Tên hiển thị"
                        name="nameUser"
                        value={nameUser}
                        onClick={handleChangInput}
                      />
                    </Form.Group>

                    <Form.Group
                      controlId="formBasicEmail"
                      className="from-group"
                    >
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        name="emailUser"
                        value={emailUser}
                        onClick={handleChangInput}
                      />
                    </Form.Group>

                    <Form.Group
                      controlId="formBasicPassword"
                      className="from-group"
                    >
                      <Form.Control
                        type={!togglePass ? "password" : "text"}
                        placeholder="Nhập mật khẩu hiện tại"
                        name="passwordUser"
                        value={passwordUser}
                        onClick={handleChangInput}
                      />
                      <i
                        className={
                          !togglePass
                            ? "fa-regular fa-eye-slash"
                            : "fa-regular fa-eye"
                        }
                        onClick={() => setTogglePass(!togglePass)}
                      ></i>
                    </Form.Group>

                    <Form.Group
                      controlId="formBasicPassword"
                      className="from-group"
                    >
                      <Form.Control
                        type={!togglePass ? "password" : "text"}
                        placeholder="Nhập mật khẩu Mới"
                        name="newPasswordUser"
                        value={newPasswordUser}
                        onChange={handleChangInput}
                      />
                      <i
                        className={
                          !togglePass
                            ? "fa-regular fa-eye-slash"
                            : "fa-regular fa-eye"
                        }
                        onClick={() => setTogglePass(!togglePass)}
                      ></i>
                    </Form.Group>
                  </Form>
                </BootstrapModal.Body>
                <BootstrapModal.Footer>
                  <Button variant="secondary">Hủy</Button>
                  <Button variant="primary" onClick={handleUpdatePassword}>
                    Cập Nhật
                  </Button>
                </BootstrapModal.Footer>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UpdateUser;
