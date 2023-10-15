import React, { useEffect, useState } from "react";
import "./Post.css";
import Header from "../../layout/defaultLayout/Header/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Post() {
  const [dataNameUser, setDataNameUser] = useState([]);
  const [postUpdate, setPostUpdate] = useState({});
  let { id } = useParams();
  id = parseInt(id);
  const [userActive, setUserActive] = useState({
    nameUserActive: "",
    imgUserActive: "",
  });
  const { nameUserActive, imgUserActive } = userActive;
  const navigate = useNavigate();

  const loadContentPosts = async () => {
    try {
      let url = `http://localhost:8000/contentPosts/?_sort=id&_order=desc&id=${id}`;

      const response = await axios.get(url);
      // console.log(response);
      setPostUpdate(response.data[0]);
    } catch (error) {
      console.log("Error loading posts:", error);
    }
  };

  console.log(postUpdate);
  const loadUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setDataNameUser(response.data);
      const activeUser = response.data.find((user) => user.status === "active");
      if (activeUser) {
        setUserActive({
          nameUserActive: activeUser.nameUser,
          imgUserActive:
            activeUser.imageUser ||
            "https://www.invert.vn/media/uploads/uploads/2022/12/03191809-2.jpeg",
        });
      }
    } catch (error) {
      console.log("Error loading users:", error);
    }
  };

  // const [contentPosts, setContentPosts] = useState([]);
  const [formPost, setFormPost] = useState({
    nameUser: "",
    contentPost: "",
    imgPost: "",
  });
  const { contentPost, imgPost } = formPost;

  const handlePost = async () => {
    const postContent = {
      nameUser: nameUserActive,
      imageUser: imgUserActive,
      contentPost,
      imgPost,
      comments: [],
      likes: [],
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/contentPosts",
        postContent
      );

      console.log("Post created successfully:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUpdatePost = () => {
    const updatedPost = {
      nameUser: nameUserActive,
      imageUser: imgUserActive,
      contentPost,
      imgPost,
      comments: postUpdate.comments,
      likes: postUpdate.likes,
    };

    axios
      .put(`http://localhost:8000/contentPosts/${id}`, updatedPost)
      .then((res) => {
        console.log("Post updated successfully:", res.data);
        navigate("/");
      })
      .catch((err) => {
        console.error("Error updating post:", err);
      });
    setFormPost({
      nameUser: "",
      contentPost: "",
      imgPost: "",
    });
  };
  // console.log(contentPosts);
  const handleChangeInput = (e) => {
    console.log(1233);
    const { name, value } = e.target;
    setFormPost({
      ...formPost,
      [name]: value,
    });
  };

  useEffect(() => {
    loadUser();
  }, []);
  useEffect(() => {
    if (id > 0) {
      setFormPost(postUpdate);
    }

    loadContentPosts();
  }, [dataNameUser]);

  return (
    <div>
      <div className="container">
        <Header />
        <div className="body">
          <div className="main">
            <div className="header_post">
              <div className="title">Create Post</div>
            </div>
            <div className="white_card" id="write_card">
              <div className="main_input_text_title">
                <input
                  id="post-name"
                  type="text"
                  placeholder="Title"
                  name="contentPost"
                  value={contentPost}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="main_uploat_card">
                <div className="main_uploat_card_content">
                  <a href="">
                    <i className="bi bi-image-fill" />
                  </a>
                  <span className="card_text">Choose a URL to upload</span>
                  <input
                    id="post-image"
                    type="text"
                    placeholder="URL video or img"
                    name="imgPost"
                    value={imgPost}
                    onChange={handleChangeInput}
                  />
                </div>

                <div className="button_post">
                  <button
                    id="submit-btn"
                    type="button"
                    onClick={id < 0 ? handlePost : handleUpdatePost}
                  >
                    {id < 0 ? "Post" : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
