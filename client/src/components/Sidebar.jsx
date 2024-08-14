import { useState } from "react";

import homeImg from "../assets/home.svg";
import searchImg from "../assets/searchIcon.svg";
import createPost from "../assets/createPost.svg";
import menuImg from "../assets/menu.svg";

import Modal from "./UI/Modal";
import SidebarButton from "./UI/sidebar/button";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchUserProfile } from "../utils/http";
import CreatePost from "./CreatePost";

export default function Sidebar() {
  const [isCreatePost, setIsCreatePost] = useState(false);
  const { isLoggedIn, username } = useSelector((state) => state.auth);
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["user", { username }],
    queryFn: ({ signal, queryKey }) =>
      fetchUserProfile({ signal, ...queryKey[1] }),
  });
  const userProfilePhoto = data?.user?.imgProfile;

  function handleStartCreatePost() {
    setIsCreatePost(true);
  }

  function handleStopCreatePost() {
    setIsCreatePost(false);
  }

  return (
    <>
      {isCreatePost && (
        <Modal mt="mt-36" onClose={handleStopCreatePost}>
          <CreatePost onClose={handleStopCreatePost} />
        </Modal>
      )}
      <div className="h-screen w-64 sticky top-0 p-4 bg-slate-300">
        <ul className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4 pt-20">
            <h3 className="font-semibold text-2xl px-3 mb-4">Instant Gram</h3>
            <SidebarButton img={homeImg} content="Home" />
            <SidebarButton img={searchImg} content="Search" />
            <SidebarButton
              img={createPost}
              content="Create"
              onClick={handleStartCreatePost}
            />
            {isLoggedIn && (
              <SidebarButton
                img={`${
                  import.meta.env.VITE_SERVER_DOMAIN
                }/${userProfilePhoto}`}
                content="Profile"
                circleImg
                to={`${username}`}
              />
            )}
          </div>
          <SidebarButton img={menuImg} content="More" />
        </ul>
      </div>
    </>
  );
}
