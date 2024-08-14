import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  fetchPost,
  fetchUserImgProfile,
  queryClient,
  startLike,
  stopLike,
} from "../../utils/http";
import { useSelector } from "react-redux";
import { useState } from "react";
import Modal from "../../components/UI/Modal";
import closeLogo from "../../assets/close.svg";
import likeLogo from "../../assets/like.svg";
import likedLogo from "../../assets/liked.svg";
import commentLogo from "../../assets/comment.svg";

export default function Post() {
  const { postId } = useParams();
  const [modalIsOpen, setModalIsOpen] = useState({
    like: false,
  });
  const authState = useSelector((state) => state.auth);
  const {
    data: postData,
    isPending: isPendingPost,
    isError: isErrorPost,
    error: errorPost,
  } = useQuery({
    queryKey: ["post", { postId }],
    queryFn: ({ signal, queryKey }) => fetchPost({ signal, ...queryKey[1] }),
  });
  const { mutate: startLikeMutate, isError: startLikeIsError } = useMutation({
    mutationFn: startLike,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["post", { postId }] });
      const previousValue = queryClient.getQueryData(["post", { postId }]);
      const updatedValue = { ...previousValue };
      updatedValue.post.likes.push({
        name: authState.username,
      });
      queryClient.setQueryData(["post", { postId }], updatedValue);
      return { previousValue };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData("post", { postId }, context.previousValue);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", { postId }] });
    },
  });
  const { mutate: stopLikeMutate, isError: removeLikeError } = useMutation({
    mutationFn: stopLike,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["post", { postId }] });
      const previousValue = queryClient.getQueryData(["post", { postId }]);
      const updatedValue = { ...previousValue };
      updatedValue.post.likes.push({
        name: authState.username,
      });
      queryClient.setQueryData(["post", { postId }], updatedValue);
      return { previousValue };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["post", { postId }], context.previousValue);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", { postId }] });
    },
  });

  if (isPendingPost) {
    return <p className="text-center animate-pulse">Fetching post...</p>;
  }

  const { post } = postData;
  // console.log(post);
  const totalLikes = post.likes.length;
  const totalComments = post.comments.length;
  const isLike = post.likes.find((user) => {
    return user.name === authState.username;
  });

  function toggleLikes() {
    setModalIsOpen((prevState) => ({ ...prevState, like: !prevState.like }));
  }
  function handleLikeAction() {
    isLike ? stopLikeMutate(postId) : startLikeMutate(postId);
  }

  // many functionality!
  return (
    <>
      {modalIsOpen.like && (
        <Modal
          dialogClass={`bg-slate-100 z-20 p-4 rounded-lg mt-36 w-4/6 md:w-1/3 lg:w-1/4`}
          onClose={toggleLikes}
          w={{ base: "5/6", md: "1/3", lg: "1/4" }}
        >
          <div className="flex flex-col gap-2 relative">
            <button
              className="w-5 h-5 absolute -right-3 -top-3"
              onClick={toggleLikes}
            >
              <img src={closeLogo} />
            </button>
            <div className="border-b-2 border-b-zinc-300">
              <h3 className="text-center text-xl">Likes</h3>
            </div>
            {totalLikes === 0 && (
              <p className="text-center">This post has no likes yet.</p>
            )}
            {totalLikes > 0 && (
              <ul className="mt-2">
                {post.likes.map((like) => {
                  return (
                    <li className="flex gap-2 items-center" key={like._id}>
                      <img
                        className="w-5 h-5 rounded-full"
                        src={`${import.meta.env.VITE_SERVER_DOMAIN}/${
                          like.imgProfile
                        }`}
                      />
                      <Link
                        to={`${import.meta.env.VITE_SERVER_DOMAIN}/${
                          like.name
                        }`}
                      >
                        {like.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Modal>
      )}
      <div className="">
        <Link>Back</Link>
        <div className="bg-neutral-200 flex flex-col md:flex-row justify-center ">
          <div className="">
            <img
              className="md:w-[15rem] lg:w-[25rem] md:h-[15rem] lg:h-[25rem] object-cover"
              src={`${import.meta.env.VITE_SERVER_DOMAIN}/${post.img}`}
              alt="Image of a postW"
            />
          </div>
          <div className=" flex flex-col pl-2 pt-2">
            <div className="border-b-2 border-b-slate-600 pb-1 flex items-center gap-4 mb-6">
              <img
                className="w-5 h-5 rounded-full"
                src={`${import.meta.env.VITE_SERVER_DOMAIN}/${
                  post.userId.imgProfile
                }`}
                alt="Profile Photo"
              />
              <Link className="font-semibold">{post.userId.name}</Link>
            </div>
            <div className="flex gap-4 items-start">
              <div>
                <img
                  className="w-5 h-5 rounded-full mt-1"
                  src={`${import.meta.env.VITE_SERVER_DOMAIN}/${
                    post.userId.imgProfile
                  }`}
                  alt="Profile Photo"
                />
              </div>
              <div className="w-1/2 lg:w-[35rem] flex flex-col">
                <div className="overflow-auto h-[18rem] no-scrollbar">
                  <Link className="font-semibold">{post.userId.name} </Link>
                  <span>
                    {post.content} Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Natus laboriosam atque quam fugiat
                    corporis eaque libero similique enim temporibus nemo unde
                    quos quod nobis, alias esse voluptate, incidunt placeat quae
                    consectetur, saepe soluta quo? Provident enim ratione esse
                    consequatur pariatur?
                  </span>
                  {/* comments */}
                </div>
                <div className="relative border-t-2 border-t-zinc-300 bottom-6">
                  <div className="flex gap-3 items-center">
                    <button className="" onClick={handleLikeAction}>
                      <img
                        className="w-6 h-6 mt-2 "
                        src={isLike ? likedLogo : likeLogo}
                        alt="Like logo"
                      />
                    </button>
                    <button className="">
                      <img
                        className="w-6 h-6 mt-2 "
                        src={commentLogo}
                        alt="Like logo"
                      />
                    </button>
                  </div>
                  <div className="absolute">
                    <button onClick={toggleLikes}>{totalLikes} Likes</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
