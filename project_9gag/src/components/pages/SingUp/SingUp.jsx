import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SingUp.css";
import axios from "axios";
import swal from "sweetalert";
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

function SignUp() {
  const [validate, setValidate] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { name, email, password, confirmPassword } = validate;
  const [singUpUser, setsingUpUser] = useState([]);
  const [toggelPass, setToggelPass] = useState(false);

  const navigate = useNavigate();
  const [error, setError] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "Vui Lòng nhập đầy đủ các trường thông tin !!!",
    status: "",
  });

  const loadUserSignUp = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setsingUpUser(response.data);
    } catch (error) {
      console.log("Error loading users:", error);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setValidate({ ...validate, [name]: value });

    switch (name) {
      case "name":
        validateName(value);
        break;
      case "email":
        validateEmail(value);
        break;
      case "password":
        validatePassword(value);
        break;
      case "confirmPassword":
        validateConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const validateName = (value) => {
    setError((prevError) => ({
      ...prevError,
      nameError: value === "" ? "Tên không được để trống" : "",
    }));
  };

  const validateEmail = (value) => {
    setError((prevError) => ({
      ...prevError,
      emailError:
        value === ""
          ? "Email không được để trống"
          : !emailRegex.test(value)
          ? "Email không đúng định dạng"
          : "",
    }));
  };

  const validatePassword = (value) => {
    setError((prevError) => ({
      ...prevError,
      passwordError:
        value === ""
          ? "Mật khẩu không được để trống"
          : value.length < 8
          ? "Mật khẩu phải có ít nhất 8 ký tự"
          : !passwordRegex.test(value)
          ? "Mật khẩu phải bao gồm ký tự in hoa, số, và ký tự đặc biệt"
          : "",
    }));
  };

  const validateConfirmPassword = (value) => {
    setError((prevError) => ({
      ...prevError,
      confirmPasswordError:
        value === ""
          ? "Xác nhận mật khẩu không được để trống"
          : value !== validate.password
          ? "Mật khẩu không trùng khớp"
          : "",
    }));
  };
  const handleSignUp = () => {
    validateName(name);
    validateEmail(email);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);

    const isFormValid =
      error.nameError === "" &&
      error.emailError === "" &&
      error.passwordError === "" &&
      error.confirmPasswordError === "";

    if (!isFormValid) {
      return;
    }

    const existingUser = singUpUser.find(
      (user) => user.nameUser === name && user.emailUser === email
    );

    if (existingUser) {
      swal("Tài khoản đã tồn tại", {
        dangerMode: true,
        buttons: true,
      });

      return;
    }

    const userItem = {
      nameUser: name,
      emailUser: email,
      passwordUser: password,
      role: "regular",
      status: "unblock",
    };

    axios
      .post("http://localhost:8000/users", userItem)
      .then((res) => {
        console.log(res.data);
        toast.success("Đăng ký thành công!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    loadUserSignUp();
  }, []);

  return (
    <div className="modalSignUp">
      <div className="modal-content-singup">
        <span className="close" onClick={() => navigate("/")}>
          <i className="fa-solid fa-angles-left"></i>
        </span>
        <a className="header_logo">9GAG</a>
      </div>

      <div className="from-group">
        <input
          id="username"
          type="text"
          placeholder="Tên người dùng"
          name="name"
          value={name}
          onChange={handleChangeInput}
        />
        <div className="error">{error.nameError}</div>
      </div>
      <div className="from-group">
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          name="email"
          onChange={handleChangeInput}
        />
        <div id="email_error" className="error">
          {error.emailError}
        </div>
      </div>

      <div className={error.passwordError ? "form-group_error" : "from-group"}>
        <input
          id="password"
          type={!toggelPass ? "password" : "text"}
          placeholder="Mật khẩu"
          name="password"
          value={password}
          onChange={handleChangeInput}
        />
        <i
          className={
            !toggelPass ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"
          }
          onClick={() => setToggelPass(!toggelPass)}
        ></i>
        <div className="error">{error.passwordError}</div>
      </div>

      <div
        className={
          error.confirmPasswordError ? "form-group_error" : "from-group"
        }
      >
        <input
          id="repassword"
          type={!toggelPass ? "password" : "text"}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          name="confirmPassword"
          onChange={handleChangeInput}
        />
        <i
          className={
            !toggelPass ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"
          }
          onClick={() => setToggelPass(!toggelPass)}
        ></i>
        <div className="error">{error.confirmPasswordError}</div>
      </div>
      <button type="submit_btn" onClick={handleSignUp}>
        Đăng ký
      </button>
      <p>
        Đã có tài khoản?{" "}
        <Link to="/login" className="login_btn" id="login_btn">
          Đăng Nhập
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
