import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  editPost,
  fetchPost,
  fetchUserImgProfile,
  queryClient,
  startLike,
  stopLike,
} from "../../utils/http";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import Modal from "../../components/UI/Modal";
import closeLogo from "../../assets/close.svg";
import likeLogo from "../../assets/like.svg";
import likedLogo from "../../assets/liked.svg";
import commentLogo from "../../assets/comment.svg";
import ModalLike from "../../components/ModalLike";
import CommentItem from "../../components/post/commentItem";
import PostAction from "../../components/post/PostAction";
import horizontalDotButton from "../../assets/horizontalDot.svg";
import OptionMenu from "../../components/post/Option";

export default function Post() {
  const { postId } = useParams();
  const editPostInput = useRef();
  const [modalIsOpen, setModalIsOpen] = useState({
    like: false,
  });
  const [optionMenu, setOptionMenu] = useState({
    isOpenOption: false,
    isEditPost: false,
    isDeletePost: false,
  });
  const [editPostValue, setEditPostValue] = useState(null);
  const authState = useSelector((state) => state.auth);
  const pathState = useSelector((state) => state.path);
  const {
    data: postData,
    isPending: isPendingPost,
    isError: isErrorPost,
    error: errorPost,
  } = useQuery({
    queryKey: ["post", { postId }],
    queryFn: ({ signal, queryKey }) => fetchPost({ signal, ...queryKey[1] }),
  });
  // console.log(postData);
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
      const postLikes = [...updatedValue.post.likes];
      const updatedPostLikes = postLikes.filter(
        (like) => like.name !== authState.username
      );
      updatedValue.post.likes = [...updatedPostLikes];
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
  const { mutate: editPostMutate } = useMutation({
    mutationFn: editPost,
    onMutate: async (data) => {
      await queryClient.cancelQueries(["post", { postId }]);
      const previousValue = queryClient.getQueryData(["post", { postId }]);
      // console.log(previousValue)
      const updatedValue = { ...previousValue };
      updatedValue.post.content = data.content;
      queryClient.setQueryData(["post", { postId }], updatedValue);
      return { previousValue };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["post", { postId }], context.previousValue);
    },
    onSettled: () => {
      setOptionMenu("isEditPost");
      queryClient.invalidateQueries({ queryKey: ["post", { postId }] });
    },
  });

  if (isPendingPost) {
    return <p className="text-center animate-pulse">Fetching post...</p>;
  }

  function toggleOptionMenu(identifier) {
    setOptionMenu((prevState) => ({
      ...prevState,
      [identifier]: !prevState[identifier],
    }));
  }

  const { post } = postData;
  // console.log(post);
  const totalLikes = post.likes.length;
  const totalComments = post.comments.length;
  const isLike = post.likes.find((user) => {
    return user.name === authState.username;
  });
  const formattedCreateDate = new Date(post.createdAt).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  function toggleLikes() {
    setModalIsOpen((prevState) => ({ ...prevState, like: !prevState.like }));
  }
  function handleLikeAction() {
    isLike ? stopLikeMutate(postId) : startLikeMutate(postId);
  }

  function handleSubmitEditPost() {
    // setEditPostValue(editPostInput.current.value)
    editPostMutate({ postId, content: editPostInput.current.value });
  }

  // many functionality!
  return (
    <>
      {modalIsOpen.like && (
        <ModalLike
          post={post}
          toggleLikes={toggleLikes}
          totalLikes={totalLikes}
        />
      )}
      {optionMenu.isOpenOption && (
        <OptionMenu toggleOptionMenu={toggleOptionMenu} />
      )}
      <div className="">
        <div className="relative bg-neutral-200 flex flex-col xl:flex-row xl:justify-evenly items-center justify-center shadow-lg rounded mt-5 lg:mt-20 w-11/12 lg:w-3/4 mx-auto min-h-[25rem] ">
          <Link
            className="absolute w-5 h-5 right-2 top-2"
            to={pathState.previousPath || "/"}
          >
            <img src={closeLogo} />
          </Link>

          <div className="">
            <img
              className="md:w-[15rem] lg:w-[25rem] aspect-square object-cover"
              src={`${import.meta.env.VITE_SERVER_DOMAIN}/${post.img}`}
              alt="Image of a post"
            />
          </div>
          {/* post header */}
          <div className=" flex flex-col pl-2 pt-2 lg:w-[30rem] ">
            <div className="border-b-2 border-b-slate-600 pb-1 flex items-start gap-4 mb-2">
              <img
                className="w-5 aspect-square object-cover rounded-full mt-1"
                src={`${import.meta.env.VITE_SERVER_DOMAIN}/${
                  post.userId.imgProfile
                }`}
                alt="Profile Photo"
              />
              <div className="flex flex-col w-full">
                <Link className="font-semibold" to={`/${post.userId.name}`}>
                  {post.userId.name}
                </Link>
                <div className="flex justify-between ">
                  <p className="text-xs">{formattedCreateDate}</p>
                  <button
                    className="w-5 h-5 aspect-square mr-2"
                    onClick={() => toggleOptionMenu("isOpenOption")}
                  >
                    <img src={horizontalDotButton} />
                  </button>
                </div>
              </div>
            </div>
            {/* content post */}
            <div className="flex gap-4 items-start">
              <div>
                <img
                  className="w-5 aspect-square object-cover rounded-full mt-1"
                  src={`${import.meta.env.VITE_SERVER_DOMAIN}/${
                    post.userId.imgProfile
                  }`}
                  alt="Profile Photo"
                />
              </div>
              <div className="w-3/4 lg:w-[35rem] flex flex-col">
                <div className="overflow-auto h-[18rem] no-scrollbar">
                  <Link className="font-semibold" to={`/${post.userId.name}`}>
                    {post.userId.name}{" "}
                  </Link>
                  {!optionMenu.isEditPost && <span>{post.content}</span>}
                  {optionMenu.isEditPost && (
                    <>
                      <textarea
                        ref={editPostInput}
                        defaultValue={`${post.content}`}
                        className="bg-inherit outline-none w-full no-scrollbar border-2 border-slate-600 px-1 rounded"
                      ></textarea>
                      <div className="flex gap-2 text-xs justify-end mr-2">
                        <button>Cancel</button>
                        <button onClick={handleSubmitEditPost}>Save</button>
                      </div>
                    </>
                  )}
                  {/* comments */}
                  <div className="mt-4 border-t-2 border-t-zinc-300 pt-2 pb-10">
                    {post.comments?.length === 0 && (
                      <p className="text-xs text-center text-slate-500 tracking-wide">
                        This post has no comments yet.
                      </p>
                    )}
                    {post.comments?.length > 0 && (
                      <ul className="text-sm flex-col  flex gap-2 ">
                        {post.comments.map((comment) => {
                          return (
                            <CommentItem key={comment._id} comment={comment} />
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
                <PostAction
                  handleLikeAction={handleLikeAction}
                  isLike={isLike}
                  toggleLikes={toggleLikes}
                  totalLikes={totalLikes}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
