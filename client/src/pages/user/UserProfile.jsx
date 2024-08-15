import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  queryClient,
  startFollowing,
  stopFollowing,
} from "../../utils/http";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { pathActions } from "../../store/path";
import { useEffect, useState } from "react";
import Follow from "../../components/user/Follow";

export default function UserProfile() {
  const { isLoggedIn, username: currentUser } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [openedMenu, setOpenedMenu] = useState(null);
  // console.log(location.pathname);
  useEffect(() => {
    dispatch(pathActions.savePreviousPath(location.pathname));
  }, [dispatch, location.pathname]);
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

  function handleShowFollowersClick() {
    setOpenedMenu("followers");
  }
  function handleShowFollowedClick() {
    setOpenedMenu("followed");
  }
  function closeOpenedMenu() {
    setOpenedMenu(null);
  }

  if (isPending) {
    return <p className="text-center animate-pulse mt-32">Fetching...</p>;
  }
  // console.log(data);
  if (data) {
    const { user } = data;
    // console.log(user);
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
        {openedMenu && (
          <Follow content={openedMenu} onClose={closeOpenedMenu} />
        )}
        <header className="flex flex-col sm:flex-row ml-6 lg:ml-0 md:justify-center gap-8 lg:gap-16 items-start pt-16 lg:text-xl  ">
          <div>
            <img
              className=" w-14 lg:w-20 h-14 lg:h-20 rounded-full"
              src={`${import.meta.env.VITE_SERVER_DOMAIN}/${user.imgProfile} `}
            />
          </div>
          <div className="flex flex-col gap-4 w-7/12 lg:w-1/3 items-start">
            <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
              <h2 className="text-xl lg:text-2xl">{user.name}</h2>
              {username === currentUser && (
                <button className="bg-zinc-200 hover:bg-zinc-300 rounded text-xs p-1 lg:text-base lg:p-2">
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
            <div className="flex gap-4 text-[.95rem] justify-between w-full">
              <div className="flex flex-col items-center">
                <p>Posts</p>
                <span>{totalPosts}</span>
              </div>
              <div className=" flex flex-col items-center">
                <button onClick={handleShowFollowersClick} to="followers">
                  Followers
                </button>
                <span>{totalFollowers}</span>
              </div>
              <div className=" flex flex-col items-center">
                <button onClick={handleShowFollowedClick} to="followed">
                  Following
                </button>
                <span>{totalFollowed}</span>
              </div>
            </div>
            <div className="w-full">
              <p className="text-[.8rem] leading-[1.25rem]">
                {user.bio} Lorem, ipsum dolor sit amet consectetur adipisicing
                elit. Quisquam asperiores inventore aliquid provident voluptatem
                alias laboriosam quos perferendis quasi? Dolor, veritatis
                voluptas minus corrupti obcaecati reiciendis, accusantium nulla
                voluptatum, amet blanditiis provident saepe? Dolor accusantium
                provident suscipit reiciendis iste voluptatem saepe tenetur?
                Modi sint natus perspiciatis nihil enim consectetur placeat!
              </p>
            </div>
          </div>
        </header>
        <section className="mt-20 w-[19.5rem] sm:w-[30rem] md:w-[39rem] lg:w-[51rem] mx-auto ">
          <div className="grid grid-cols-3 gap-2">
            {user.posts.map((post) => {
              return (
                <Link to={`../post/${post._id}`} key={post._id}>
                  <img
                    className=" object-cover aspect-square  w-[6.5rem] sm:w-[10rem] md:w-[13rem] lg:w-[17rem] sm:h-[10rem] md:h-[13rem] lg:h-[17rem]"
                    src={`${import.meta.env.VITE_SERVER_DOMAIN}/${post.img}`}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </>
    );
  }
}
