import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import "./DefaultLayout.css";
import Home from "../../pages/home/Home";
import axios from "axios";
function DefaultLayout() {
  
  const [checkSearch, setCheckSearch] = useState(false);
  const [searchRender, setSeartRender] = useState("");

  const handleSearch = async (searchInput) => {
   
    setSeartRender(searchInput);
  };
  useEffect(() => {
    handleSearch("");
  }, []);
  return (
    <div className="container">
      {/* phần header */}
      <Header
        handleSearch={handleSearch}
        setCheckSearch={setCheckSearch}
        checkSearch={checkSearch}
      
      />
      {/* end header */}
      {/* phần main  */}
      <main className="body">
        <div className="container">
          <div className="row ">
            <Sidebar />
            <div className="main_content_right col-6">
              <div className="main_content_sibar">
                <span>Home</span>
                <span>Top</span>
                <span>Trending</span>
                <span>Fresh</span>
              </div>
              <div className="main_content_right_sticky">
                <a href="" className="sticky">
                  Humor
                </a>
                <a href="" className="sticky">
                  Latest News
                </a>
                <a href="" className="sticky">
                  Girl
                </a>
                <a href="" className="sticky">
                  Anime Manga
                </a>
                <a href="" className="sticky">
                  Meme
                </a>
                <a href="" className="sticky">
                  Gaming
                </a>
              </div>
              <div className="main_content_right_tag">
                <a href="">super mario bros</a>
                <a href="">pokemon go</a>
                <a href="">pedro pascal</a>
                <a href="">latest news</a>
                <a href="">buwin top</a>
                <a href="">weekly highilights</a>
              </div>
              {/* phần item bài viết  */}
              {/* <ItemContent /> */}

              {/* phần end item bài viết  */}
              <div id="modal-container">
                <Home handleSearch={handleSearch} searchRender={searchRender} />
              </div>
            </div>
            <div className="ads col-3">
              <div className="ads_login">
                <h2>New to 9GAG?</h2>
                <p>Sign up now to see more content!</p>
                <a id="signup-btn" href="">
                  Sign up
                </a>
              </div>
              <div className="ads-content">
                <a>Advertisment</a>
              </div>
              <div className="ads_img">
                <img
                  src="https://img-9gag-fun.9cache.com/photo/aOxAvZE_460swp.webp"
                  alt=""
                />
                <img
                  src="https://img-9gag-fun.9cache.com/photo/a1PBXqY_460swp.webp"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* end main */}
    </div>
  );
}

export default DefaultLayout;
