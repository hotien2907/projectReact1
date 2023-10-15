import React, { useEffect, useState } from "react";
import "./Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
function Login({ setCheckRouter }) {
  // State variables
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({
    nameError: "",
    passwordError: "",
  });
  const [user, setUser] = useState([]);
  const [togglePass, setTogglePass] = useState(false);
  const navigate = useNavigate();

  // Regular expression for password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  // Function to load user data from the server
  const loadUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setUser(response.data);
    } catch (error) {
      console.log("Error loading users:", error);
    }
  };

  // Load user data when the component mounts
  useEffect(() => {
    loadUser();
  }, []);

  // Function to handle the login process
  const handleLogin = () => {
    // Validation for username and password
    const newFormErrors = {
      nameError: userName.trim() === "" ? "Tên không được để trống" : "",
      passwordError:
        password === ""
          ? "Mật khẩu không được để trống"
          : password.length < 8
          ? "Mật khẩu phải có ít nhất 8 ký tự"
          : !passwordRegex.test(password)
          ? "Mật khẩu phải bao gồm ký tự in hoa, số, và ký tự đặc biệt"
          : "",
    };
    setFormErrors(newFormErrors);

    // If there are no validation errors, proceed with login
    if (newFormErrors.nameError === "" && newFormErrors.passwordError === "") {
      const loggedInUser = user.find(
        (u) => u.nameUser === userName && u.passwordUser === password
      );

      if (loggedInUser) {
        if (loggedInUser.status !== "block") {
          // Update user status to "active" if not blocked
          const updatedUser = { ...loggedInUser, status: "active" };

          axios
            .put(`http://localhost:8000/users/${loggedInUser.id}`, updatedUser)
            .then((res) => {
              console.log("User updated:", res.data);
            })
            .catch((err) => {
              console.log("Error updating user:", err);
            });
          toast("🦄 Wow so easy!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          // Navigate to the home page
          navigate("/");
        } else {
          swal("Tài Khoản của bạn đã bị khóa", {
            dangerMode: true,
            buttons: true,
          });
        }
      } else {
        swal("Tên Hoặc mật khẩu không đúng", {
          dangerMode: true,
          buttons: true,
        });
      }

      setCheckRouter(true);
    }
  };

  return (
    <div id="modalLogin" className="modalLogin">
      <div className="modalLogin-content">
        <div className="modal-content-singup">
          <span className="close" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-angles-left"></i>
          </span>
          <a className="header_logo">9GAG</a>
        </div>
        <div className="from-group">
          <input
            id="login-form-username"
            type="text"
            placeholder="Tên người dùng"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <div className="error">{formErrors.nameError}</div>
        </div>
        <div
          className={
            formErrors.passwordError ? "form-group_error" : "from-group"
          }
        >
          <input
            id="login-form-password"
            type={!togglePass ? "password" : "text"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <i
            className={
              !togglePass ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"
            }
            onClick={() => setTogglePass(!togglePass)}
          ></i>
          <div className="error">{formErrors.passwordError}</div>
        </div>
        <button
          type="submit_login"
          className="submit_login"
          onClick={handleLogin}
        >
          Đăng nhập
        </button>
        <p>
          Chưa có tài khoản?{" "}
          <Link to="/signup" className="signup_btn">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
