import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchUserProfile,
  queryClient,
  startFollowing,
  stopFollowing,
} from "../../utils/http";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function UserProfile() {
  const authState = useSelector((state) => state.auth);
  const { username } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, username: currentUser } = authState;
  const { data, isPending } = useQuery({
    queryKey: ["user", { username }],
    queryFn: ({ signal, queryKey }) =>
      fetchUserProfile({ signal, ...queryKey[1] }),
  });
  const { mutate, isError } = useMutation({
    mutationFn: startFollowing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", { username }] });
    },
  });

  const { mutate: stopFollowingMutation } = useMutation({
    mutationFn: stopFollowing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", { username }] });
    },
  });

  function handleFollowClick() {
    if (!isLoggedIn) {
      navigate("../auth");
      return;
    }
    // console.log(username);
    mutate(username);
  }
  function handleStopFollow() {
    if (!isLoggedIn) {
      navigate("../auth");
      return;
    }
    stopFollowingMutation(username);
  }

  if (isPending) {
    return <p className="text-center animate-pulse mt-32">Fetching...</p>;
  }
  // console.log(data);
  if (data) {
    const { user } = data;
    const totalPosts = user.posts.length;
    const totalFollowers = user.followers.length;
    const totalFollowed = user.followed.length;
    let isFollowed = false;
    if (currentUser !== username) {
      isFollowed = user.followers.find((foll) => {
        return foll.name === currentUser;
      });
      if (isFollowed === 0) isFollowed = false;
    }

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
              {username === currentUser && (
                <button className="bg-zinc-200 hover:bg-zinc-300 rounded p-2">
                  Edit Profile
                </button>
              )}
              {username !== currentUser && (
                <>
                  {!currentUser && (
                    <button
                      onClick={handleFollowClick}
                      className="bg-blue-500 hover:bg-blue-600 rounded p-2 text-white"
                    >
                      Follow
                    </button>
                  )}
                  {isFollowed && currentUser && (
                    <button
                      onClick={handleStopFollow}
                      className="bg-zinc-200 hover:bg-zinc-300 rounded p-2"
                    >
                      Following
                    </button>
                  )}
                  {!isFollowed && currentUser && (
                    <button
                      onClick={handleFollowClick}
                      className="bg-blue-500 hover:bg-blue-600 rounded p-2 text-white"
                    >
                      Follow
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-4 text-[.75rem]">
              <div className=" flex flex-col items-center">
                <p>TOTAL POSTS</p>
                <span>{totalPosts}</span>
              </div>
              <div className=" flex flex-col items-center">
                <Link to="followers">TOTAL FOLLOWERS</Link>
                <span>{totalFollowers}</span>
              </div>
              <div className=" flex flex-col items-center">
                <Link to="followed">TOTAL FOLLOWED</Link>
                <span>{totalFollowed}</span>
              </div>
            </div>
            <p>{user.bio}</p>
          </div>
        </header>
      </>
    );
  }
}
