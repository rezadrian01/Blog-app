import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchPost } from "../../utils/http";
import { useSelector } from "react-redux";

export default function Post() {
  const { postId } = useParams();
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
  if (isPendingPost) {
    return <p className="text-center animate-pulse">Fetching post...</p>;
  }
  const { post } = postData;
  // console.log(post);
  const totalLikes = post.likes.length;
  // many functionality!
  return (
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
              <div className="overflow-auto h-[18rem]">
                <Link className="font-semibold">{post.userId.name} </Link>
                <span>
                  {post.content} Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Natus laboriosam atque quam fugiat corporis
                  eaque libero similique enim temporibus nemo unde quos quod
                  nobis, alias esse voluptate, incidunt placeat quae
                  consectetur, saepe soluta quo? Provident enim ratione esse
                  consequatur pariatur? Lorem ipsu
                </span>
                {/* comments */}
              </div>
              <div className="relative">
                <div className="absolute -bottom-10">
                  <p>{totalLikes} Likes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
