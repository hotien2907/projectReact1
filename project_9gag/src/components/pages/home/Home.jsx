import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
// import ModalContent from "./ModalContent/ModalContent";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
function Home({ checkSearch, searchRender }) {
  const [contentPosts, setContentPosts] = useState([]);
  const [hiddenPosts, setHiddenPosts] = useState([]);
  const [checkModal, setCheckModal] = useState(false);
  const [userActive, setUserActive] = useState({
    nameUserActive: "",
    imgUserActive: "",
  });
  const { nameUserActive, imgUserActive } = userActive;
  const [toggleComment, setToggleComment] = useState(false);
  const [content, setContent] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const [likeModal, setLikeModal] = useState([]);
  const [inputComment, setInputComment] = useState({
    imageUser: "",
    idComment: 1,
    nameUser: "",
    commentInput: "",
  });

  console.log(searchRender);
  const { commentInput } = inputComment;
  const loadContentPosts = async () => {
    try {
      let url = "";
      if (searchRender) {
        url = `http://localhost:8000/contentPosts?q=${searchRender}`;
      } else {
        url = "http://localhost:8000/contentPosts/?_sort=id&_order=desc";
      }
      console.log(url);
      const response = await axios.get(url);

      setContentPosts(response.data);
    } catch (error) {
      console.log("Error loading posts:", error);
    }
  };
  const loadUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      const activeUser = response.data.find((user) => user.status === "active");
      if (activeUser) {
        setUserActive({
          nameUserActive: activeUser.nameUser,
          imgUserActive: activeUser.imageUser,
        });
      }
    } catch (error) {
      console.log("Error loading users:", error);
    }
  };
  console.log(contentPosts);
  const handleDeleteContent = async (item) => {
    if (item.nameUser === nameUserActive) {
      try {
        await axios.delete(`http://localhost:8000/contentPosts/${item.id}`);
        console.log("Post deleted successfully.");
        setContentPosts((prevContentPosts) =>
          prevContentPosts.filter((post) => post.id !== item.id)
        );
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    } else {
      setShow(false);
      setHiddenPosts((prevHiddenPosts) => [...prevHiddenPosts, item.id]);
    }
  };

  const commentId = Date.now().toString();
  const handleChangeInputComment = (e) => {
    setInputComment((prevInputComment) => ({
      ...prevInputComment,
      imageUser: imgUserActive,
      nameUser: nameUserActive,
      idComment: commentId,
      commentInput: e.target.value,
    }));
  };

  if (nameUserActive === true) {
    handleAddLike();
  }
  const handleAddComment = async (item) => {
    if (isAuthenticated) {
      try {
        const response = await axios.get(
          `http://localhost:8000/contentPosts/${item.id}`
        );
        const updatedItem = response.data;
        updatedItem.comments.push(inputComment);
        setComments(updatedItem.comments);

        await axios.put(
          `http://localhost:8000/contentPosts/${item.id}`,
          updatedItem
        );

        console.log("Thêm bình luận thành công.");

        setContentPosts((prevContentPosts) =>
          prevContentPosts.map((post) =>
            post.id === item.id ? updatedItem : post
          )
        );

        setInputComment({
          ...inputComment,
          commentInput: "",
        });
      } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
      }
    } else {
      swal("Vui Lòng Đăng Nhập", {
        dangerMode: true,
        buttons: true,
      });
      setInputComment({
        ...inputComment,
        commentInput: "",
      });
    }
    setCheckModal(!checkModal);
  };

  const handleAddLike = async (item) => {
    if (isAuthenticated) {
      const responseLike = await axios.get(
        `http://localhost:8000/contentPosts/${item.id}`
      );
      const updatedItemLike = responseLike.data;

      let hasLiked = false;
      let likeIndex = -1;

      for (let i = 0; i < updatedItemLike.likes.length; i++) {
        if (updatedItemLike.likes[i].nameUser === nameUserActive) {
          hasLiked = true;
          likeIndex = i;
          break;
        }
      }

      if (hasLiked) {
        const updatedLikes = [...updatedItemLike.likes];

        updatedLikes.splice(likeIndex, 1);
        setLikeModal(updatedLikes);
        await axios.put(`http://localhost:8000/contentPosts/${item.id}`, {
          ...updatedItemLike,
          likes: updatedLikes,
        });
      } else {
        const commentId = Date.now().toString();
        const updatedLikes = [
          ...updatedItemLike.likes,
          {
            idLike: commentId,
            nameUser: nameUserActive,
          },
        ];
        setLikeModal(updatedLikes);
        await axios.put(`http://localhost:8000/contentPosts/${item.id}`, {
          ...updatedItemLike,
          likes: updatedLikes,
        });
      }
      setCheckModal(!checkModal);
      loadContentPosts();
    } else {
      swal("Vui Lòng Đăng Nhập", {
        dangerMode: true,
        buttons: true,
      });
    }
  };
  const handleShowContent = (postId) => {
    setHiddenPosts((prevHiddenPosts) =>
      prevHiddenPosts.filter((id) => id !== postId)
    );
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setShow(true);
    setContent(item);
    loadContentPosts();
  };

  const handleEditContent = (item) => {
    if (item.nameUser === nameUserActive) {
      console.log(1234);
      navigate(`/post/${item.id}`);
    } else {
      swal("Không thể sửa bài viết này", {
        dangerMode: true,
        buttons: true,
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);
  useEffect(() => {
    // handleShow();
    const userIsAuthenticated = Boolean(nameUserActive);
    setIsAuthenticated(userIsAuthenticated);
    loadContentPosts();
  }, [nameUserActive, content, checkModal]);
  useEffect(() => {
    loadContentPosts();
  }, [searchRender]);

  // console.log(comments);
  return (
    <div>
      <div>
        {contentPosts?.map((item) => {
          if (hiddenPosts.includes(item.id)) {
            return (
              <div className="hidden_post" key={item.id}>
                <span>Bài viết đã bị ẩn</span>{" "}
                <button onClick={() => handleShowContent(item.id)}>Hiện</button>
              </div>
            );
          }

          return (
            <div key={item.id} className="mainPosts">
              <div className="main_content_right_post">
                <div className="main_content_right_post_header">
                  <div>
                    <img src={item.imageUser} alt="" />
                    <span className="name_user">{item.nameUser}</span>
                  </div>
                  <div className="main_content_delete">
                    <div onClick={() => handleEditContent(item)}>
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </div>
                    <div onClick={() => handleDeleteContent(item)}>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                </div>
                <div className="main_content_right_post_text">
                  <h2>{item.contentPost}</h2>
                </div>
                <div className="main_content_right_post_body">
                  <img src={item.imgPost} alt="Post" />
                </div>
                <div className="main_content_right_post_footer">
                  <div className="main_content_right_post_footer_left">
                    <button
                      id="like_user"
                      className={
                        item.likes?.some(
                          (item) => item.nameUser === nameUserActive
                        )
                          ? "btn_content_backGround"
                          : "btn_content2"
                      }
                      onClick={() => handleAddLike(item)}
                    >
                      <i className="fa-regular fa-heart"></i>
                      <span id="like">
                        <span>{item.likes?.length}</span>Like
                      </span>
                    </button>
                    <button id="dislike_user" className="btn_content">
                      <i className="fa-regular fa-share-from-square"></i>
                      <span>Share</span>
                    </button>
                    <button
                      className="btn_content"
                      id="comment-button"
                      value={commentInput}
                      onClick={() => setToggleComment(!toggleComment)}
                    >
                      <i className="fa-regular fa-message"></i>
                      <span> {item.comments?.length}Comment</span>
                    </button>
                  </div>
                  <div className="main_content_right_post_footer_right">
                    <button className="btn_content" id="comment-button">
                      <i className="fa-solid fa-phone-volume"></i>
                    </button>
                    <button className="btn_content" id="comment-button">
                      <i className="fa-solid fa-comment-dots"></i>
                    </button>
                    <button className="btn_content" id="comment-button">
                      <i className="fa-regular fa-bookmark"></i>
                      <span>Save</span>
                    </button>
                  </div>
                </div>
                {toggleComment && (
                  <div className="comment">
                    <div className="text_comment">
                      <img src={imgUserActive} alt="" />
                      <div className="input_comment">
                        <span>{nameUserActive}</span>
                        <input
                          type="text"
                          className="input_cm"
                          placeholder="Write a comment ???"
                          value={commentInput}
                          onChange={handleChangeInputComment}
                        />
                        <i
                          onClick={() => handleAddComment(item)}
                          className="fa-solid fa-right-to-bracket"
                        ></i>
                      </div>
                    </div>
                  </div>
                )}
                <ul className="diplayflex_comment">
                  {item.comments?.slice(0, 2).map((itemComment) => (
                    <li key={itemComment.idComment} className="flex_comment">
                      <img src={itemComment.imageUser} alt="" />
                      <div className="commentInput">
                        <span>{itemComment.nameUser}</span>
                        <div> {itemComment.commentInput}</div>
                      </div>
                    </li>
                  ))}
                  {item.comments?.length >= 2 ? (
                    <div className="View_all_comment">
                      <i class="fa-solid fa-share-from-square"></i>{" "}
                      <button onClick={() => handleShow(item)}>
                        View more <span>{item.comments?.length}</span> comments
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        zIndex={100}
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <div>
          {" "}
          <Modal.Header closeButton>
            <Modal.Title>
              <div>{content.nameUser}</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mainPosts2">
              <div className="main_content_right_post">
                <div className="main_content_right_post_header">
                  <div>
                    <img src={imgUserActive} alt="" />
                    <span className="name_user">{content.nameUser}</span>
                  </div>
                  <div className="main_content_delete">
                    <div>
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </div>
                    <div onClick={() => handleDeleteContent(content)}>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                </div>
                <div className="main_content_right_post_text">
                  <h2>{content.contentPost}</h2>
                </div>
                <div className="main_content_right_post_body">
                  <img src={content.imgPost} alt="Post" />
                </div>
                <div className="main_content_right_post_footer">
                  <div className="main_content_right_post_footer_left">
                    <button
                      id="like_user"
                      className={
                        likeModal.length === 0
                          ? content.likes?.some(
                              (item) => item.nameUser === nameUserActive
                            )
                            ? "btn_content_backGround"
                            : "btn_content2"
                          : likeModal?.some(
                              (item) => item.nameUser === nameUserActive
                            )
                          ? "btn_content_backGround"
                          : "btn_content2"
                      }
                      onClick={() => handleAddLike(content)}
                    >
                      <i className="fa-regular fa-heart"></i>
                      <span id="like">
                        <span>
                          {likeModal.length == 0
                            ? content.likes?.length
                            : likeModal?.length}
                        </span>
                        Like
                      </span>
                    </button>
                    <button id="dislike_user" className="btn_content">
                      <i className="fa-regular fa-share-from-square"></i>
                      <span>Share</span>
                    </button>
                    <button
                      className="btn_content"
                      id="comment-button"
                      value={commentInput}
                      onClick={() => setToggleComment(!toggleComment)}
                    >
                      <i className="fa-regular fa-message"></i>
                      <span>
                        {" "}
                        {comments.length === 0
                          ? content.comments?.length
                          : comments.length}
                        Comment
                      </span>
                    </button>
                  </div>
                  <div className="main_content_right_post_footer_right">
                    <button className="btn_content" id="comment-button">
                      <i className="fa-solid fa-phone-volume"></i>
                    </button>
                    <button className="btn_content" id="comment-button">
                      <i className="fa-solid fa-comment-dots"></i>
                    </button>
                    <button className="btn_content" id="comment-button">
                      <i className="fa-regular fa-bookmark"></i>
                      <span>Save</span>
                    </button>
                  </div>
                </div>
                {toggleComment && (
                  <div className="comment">
                    <div className="text_comment">
                      <img src={imgUserActive} alt="" />
                      <div className="input_comment">
                        <span>{nameUserActive}</span>
                        <input
                          type="text"
                          className="input_cm"
                          placeholder="Write a comment ???"
                          value={commentInput}
                          onChange={handleChangeInputComment}
                        />
                        <i
                          onClick={() => handleAddComment(content)}
                          className="fa-solid fa-right-to-bracket"
                        ></i>
                      </div>
                    </div>
                  </div>
                )}
                <ul className="diplayflex_comment">
                  {comments.length === 0
                    ? content.comments?.map((itemComment) => (
                        <li
                          key={itemComment.idComment}
                          className="flex_comment"
                        >
                          <img src={itemComment.imageUser} alt="" />
                          <div className="commentInput">
                            <span>{itemComment.nameUser}</span>
                            <div>{itemComment.commentInput}</div>
                          </div>
                        </li>
                      ))
                    : comments?.map((itemComment) => (
                        <li
                          key={itemComment.idComment}
                          className="flex_comment"
                        >
                          <img src={itemComment.imageUser} alt="" />
                          <div className="commentInput">
                            <span>{itemComment.nameUser}</span>
                            <div>{itemComment.commentInput}</div>
                          </div>
                        </li>
                      ))}
                </ul>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
}

export default Home;
