import { useQuery } from "@tanstack/react-query";
import Modal from "../UI/Modal";
import { Link, useParams } from "react-router-dom";
import { fetchUserProfile } from "../../utils/http";

import closeLogo from "../../assets/close.svg";

export default function Follow({ content, onClose }) {
  const { username } = useParams();
  const { data } = useQuery({
    queryKey: ["user", { username }],
    queryFn: ({ signal, queryKey }) =>
      fetchUserProfile({ signal, ...queryKey[1] }),
  });
  const followers = data.user.followers;
  const followed = data.user.followed;
  // data ? console.log(data) : null;
  return (
    <Modal
      onClose={onClose}
      dialogClass={`bg-slate-100 z-20 p-4 rounded-lg mt-36 w-11/12 md:w-1/2 lg:w-2/6 fixed`}
    >
      <div className="flex flex-col">
        <div className="border-b-2 border-b-slate-500 pb-1">
          <h2 className="font-semibold text-center text-xl">{content}</h2>
          <button className="absolute right-1 top-1" onClick={onClose}>
            <img className=" w-5 h-5" src={closeLogo} alt="Close" />
          </button>
        </div>
        <ul className="flex flex-col gap-2 mt-3">
          {(content === "followers" ? followers : followed).map((user) => {
            return (
              <li className="flex gap-2 items-center" key={user._id}>
                <img
                  className="w-5 aspect-square object-cover rounded-full"
                  src={`${import.meta.env.VITE_SERVER_DOMAIN}/${
                    user.imgProfile
                  }`}
                />
                <Link onClick={onClose} to={`/${user.name}`}>
                  {user.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}
