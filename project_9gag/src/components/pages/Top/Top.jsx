import React from "react";

function Top() {
  return (
    <div id="mainPosts">
      <div className="main_content_right_post">
        <div className="main_content_right_post_header">
          <div>
            <i className="fa-solid fa-user-tie"></i>
            <span className="name_user">e.user </span>
          </div>
          <div>
            <i className="fa-solid fa-ellipsis-vertical"></i>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div className="main_content_right_post_text">
          <h2>e.Content</h2>
        </div>
        <div className="main_content_right_post_body">
          <img src="https://images.fpt.shop/unsafe/filters:quality(5)/fptshop.com.vn/uploads/images/2015/Tin-Tuc/Duyen/image021.jpg" />
        </div>
        <div className="main_content_right_post_footer">
          <button id="like_user" className="btn_content">
            <i className="bi bi-hand-thumbs-up"></i>
            <span id="like">Like</span>
          </button>
          <button id="dislike_user" className="btn_content">
            <i className="bi bi-hand-thumbs-down"></i>
            <span>Share</span>
          </button>
          <button className="btn_content" id="comment-button">
            <i className="bi bi-chat-dots-fill"></i>
            <span>Comment</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Top;
