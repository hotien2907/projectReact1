import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./components/layout/defaultLayout/DefaultLayout";
import {
  publicRoutes,
  privateRoutes,
  adminRouters,
} from "./components/routers/router";
// import Admin from "./components/Admin/Admin";
// import SignUp from "./components/pages/SignUp/SignUp";
// import Login from "./components/pages/Login/Login";
import axios from "axios";
import NotFound from "./components/pages/NotFound/NotFound";

function App() {
  const [dataUser, setDataUser] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState({});
  const [isAdmin, setIsAdmin] = useState({});

  const [checkRouter, setCheckRouter] = useState(false);
  const loadUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setDataUser(response.data);

      const isLoggedIn = response.data.find((user) => user.status == "active");
      setIsLoggedIn(isLoggedIn || "");
      const isAdmin = response.data.find(
        (user) => user.status === "active" && user.role === "admin"
      );
      setIsAdmin(isAdmin);
    } catch (error) {
      console.log("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div className="container">
      <Routes>
        {publicRoutes.map((route, i) => {
          const Page = route.component;
          const Layout = route.layout === null ? React.Fragment : DefaultLayout;

          return (
            <Route
              key={i}
              path={route.path}
              element={
                <Layout>
                  <Page dataUser={dataUser} setCheckRouter={setCheckRouter} />
                </Layout>
              }
            />
          );
        })}

        {isLoggedIn &&
          privateRoutes.map((route, i) => {
            const Page = route.component;
            const Layout =
              route.layout === null ? React.Fragment : DefaultLayout;

            return (
              <Route
                key={i}
                path={route.path}
                element={
                  <Layout>
                    <Page dataUser={dataUser} />
                  </Layout>
                }
              />
            );
          })}
        {isAdmin &&
          adminRouters.map((route, i) => {
            const Page = route.component;
            const Layout =
              route.layout === null ? React.Fragment : DefaultLayout;

            return (
              <Route
                key={i}
                path={route.path}
                element={
                  <Layout>
                    <Page dataUser={dataUser} />
                  </Layout>
                }
              />
            );
          })}
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
