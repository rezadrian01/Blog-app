import { Link } from "react-router-dom";
import Modal from "./UI/Modal";
import closeLogo from "../assets/close.svg";

export default function ModalLike({ post, toggleLikes, totalLikes }) {
  return (
    <>
      <Modal
        dialogClass={`bg-slate-100 z-20 p-4 rounded-lg mt-36 w-4/6 md:w-1/3 lg:w-1/4 fixed`}
        onClose={toggleLikes}
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
            <ul className="mt-2 flex flex-col gap-2">
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
                      to={`${import.meta.env.VITE_SERVER_DOMAIN}/${like.name}`}
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
    </>
  );
}
