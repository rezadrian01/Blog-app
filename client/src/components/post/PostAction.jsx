import { Form, useParams } from "react-router-dom";

import sendLogo from "../../assets/send.svg";
import likeLogo from "../../assets/like.svg";
import likedLogo from "../../assets/liked.svg";
import commentLogo from "../../assets/comment.svg";
import { useMutation } from "@tanstack/react-query";
import { createComment, queryClient } from "../../utils/http";
import { useRef } from "react";

export default function PostAction({
  handleLikeAction,
  isLike,
  toggleLikes,
  totalLikes,
}) {
  const commentField = useRef();
  const { postId } = useParams();
  const { mutate: createCommentMutate, isError: createCommentIsError } =
    useMutation({
      mutationFn: createComment,
      onMutate: async (data) => {
        await queryClient.cancelQueries({ queryKey: ["post", { postId }] });
        const previousValue = queryClient.getQueryData(["post", { postId }]);
        const updatedValue = { ...previousValue };
        updatedValue.post.comments.push({
          content: data.formData.comment,
          postId: data.postId,
        });
        // console.log(previousValue);
        // console.log(updatedValue);
        queryClient.setQueryData(["post", { postId }], updatedValue);
        return { previousValue };
      },
      onError: (error, data, context) => {
        queryClient.setQueryData(["post", { postId }], context.previousValue);
      },
      onSettled: () => {
        commentField.current.value = "";
        queryClient.invalidateQueries({ queryKey: ["post", { postId }] });
      },
    });
  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const formData = Object.fromEntries(fd.entries());
    createCommentMutate({ postId, formData });
  }
  return (
    <div className="min-h-[5rem]">
      <div className="relative border-t-2 border-t-zinc-300 ">
        <div className="flex gap-3 items-center">
          <button className="" onClick={handleLikeAction}>
            <img
              className="w-6 h-6 mt-2 "
              src={isLike ? likedLogo : likeLogo}
              alt="Like logo"
            />
          </button>
          <button className="">
            <img className="w-6 h-6 mt-2 " src={commentLogo} alt="Like logo" />
          </button>
        </div>
        <div className="absolute">
          <button onClick={toggleLikes}>{totalLikes} Likes</button>
        </div>
      </div>
      <div className="ml-0 lg:ml-20  h-20 relative text-xs md:text-base">
        <Form onSubmit={handleSubmit}>
          <input
            ref={commentField}
            className="px-2 py-1 outline-none bg-inherit border-b-2 border-b-stone-300 placeholder:text-xs placeholder:leading-10 text-md absolute top-6 lg:-top-4 w-full lg:w-11/12"
            type="text"
            name="comment"
            placeholder="Write your comment here..."
          />
          <button
            type="submit"
            className="absolute w-4 h-4 -right-4 top-7 md:top-9 lg:-top-1 lg:right-5"
          >
            <img src={sendLogo} />
          </button>
        </Form>
      </div>
    </div>
  );
}
