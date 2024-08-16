import { useRef, useState } from "react";
import searchLogo from "../../assets/searchIcon.svg";
import { useQuery } from "@tanstack/react-query";
import { searchUser } from "../../utils/http";
import { Link } from "react-router-dom";

export default function SearchUser() {
  const searchTermInput = useRef();
  const [searchTerm, setSearchTerm] = useState(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", { searchTerm }],
    queryFn: ({ signal, queryKey }) => searchUser({ signal, ...queryKey[1] }),
    enabled: searchTerm !== null,
  });
  function handleSearchClick() {
    if (searchTermInput.current.value.trim() === "") {
      setSearchTerm(null);
      return;
    }
    setSearchTerm(searchTermInput.current.value);
  }
  return (
    <div className="bg-neutral-200 pt-10 shadow-lg rounded mt-20 w-11/12 lg:w-3/4 mx-auto min-h-[25rem] flex flex-col items-center">
      <div className=" w-11/12 lg:w-1/2">
        <div className="relative ">
          <input
            ref={searchTermInput}
            className="outline-none rounded-full px-3 py-1 w-full bg-slate-50 pr-8"
            type="search"
            name="username"
            placeholder="Search a user..."
          />
          <button
            onClick={handleSearchClick}
            className="absolute right-0 top-0 bg-slate-50 rounded-full p-[.35rem]"
          >
            <img src={searchLogo} className="w-5 h-5 rotate-90 " />
          </button>
        </div>
      </div>
      {data?.users?.length > 0 && searchTerm && (
        <ul className="w-11/12 lg:w-1/2 mt-6 bg-stone-300 p-3 rounded shadow-lg flex flex-col gap-4">
          {data.users.map((user) => {
            return (
              <li key={user._id}>
                <Link
                  to={`/${user.name}`}
                  className="flex items-center gap-2 border-2 border-transparent hover:border-white/80 p-2 rounded-lg"
                >
                  <img
                    className="w-5 h-5 object-cover rounded-full"
                    src={`${import.meta.env.VITE_SERVER_DOMAIN}/${
                      user.imgProfile
                    }`}
                  />
                  <h3 className="text-[.8rem] md:text-base">{user.name}</h3>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
