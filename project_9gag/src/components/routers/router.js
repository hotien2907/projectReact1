import Home from "../pages/home/Home";
import Top from "../pages/Top/Top";
import Post from "../pages/Post/Post";
import Login from "../pages/Login/Login";
import SingUp from "../pages/SingUp/SingUp";
import Admin from "../Admin/Admin";
import Content from "../Admin/content/Content";

import User from "../Admin/Users/User";
const publicRoutes = [
  { path: "/", component: Home },
  { path: "/top", component: Top },
  { path: "/login", component: Login, layout: null },
  { path: "/signup", component: SingUp, layout: null },
];
const privateRoutes = [{ path: "/post/:id", component: Post, layout: null }];

const adminRouters = [
  { path: "/admin", component: Admin, layout: null },
  { path: "/admin/user", component: User, layout: null },
  { path: "/admin/content", component: Content, layout: null },
];
export { publicRoutes, privateRoutes, adminRouters };
