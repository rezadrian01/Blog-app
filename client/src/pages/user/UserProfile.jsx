import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchUserProfile } from "../../utils/http";

export default function UserProfile() {
  const authState = useSelector((state) => state.auth);
  const { username, isLoggedIn } = authState;
  const { data } = useQuery({
    queryKey: ["user", { username }],
    queryFn: ({ signal, queryKey }) =>
      fetchUserProfile({ signal, ...queryKey[1] }),
  });
  console.log(data);
  const { user } = data;
  const totalPosts = user.posts.length;
  const totalFollowers = user.followers.length;
  const totalFollowed = user.followed.length;
  return (
    <>
      <header className="flex justify-center lg:gap-16 items-start lg:pt-16">
        <div>
          <img
            className="lg:w-20 lg:h-20 rounded-full"
            src={`${import.meta.env.VITE_SERVER_DOMAIN}/${user.imgProfile} `}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex lg:gap-8">
            <h2 className=" text-2xl">{user.name}</h2>
            <button>Edit Profile</button>
          </div>
          <div className="flex gap-4 text-[.75rem]">
            <div className=" flex flex-col items-center">
              <p>TOTAL POSTS</p>
              <span>{totalPosts}</span>
            </div>
            <div className=" flex flex-col items-center">
              <p>TOTAL FOLLOWERS</p>
              <span>{totalFollowers}</span>
            </div>
            <div className=" flex flex-col items-center">
              <p>TOTAL FOLLOWED</p>
              <span>{totalFollowed}</span>
            </div>
          </div>
          <p>{user.bio}</p>
        </div>
      </header>
    </>
  );
}
