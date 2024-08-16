import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  queryClient,
  updateUserProfile,
} from "../../utils/http";
import { Form, Link, useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth";

export default function EditUserProfile() {
  //redirect if username isn't match
  const [previewImg, setPreviewImg] = useState(null);
  const fileInputField = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username } = useSelector((state) => state.auth);
  const { data, isPending } = useQuery({
    queryKey: ["user", { username }],
    queryFn: ({ signal, queryKey }) =>
      fetchUserProfile({ signal, ...queryKey[1] }),
  });
  console.log(data);
  const {
    mutate,
    isPending: isPendingUpdateProfile,
    isError: isErrorUpdateProfile,
  } = useMutation({
    mutationFn: updateUserProfile,
    onMutate: async (data) => {
      // await queryClient.cancelQueries({queryKey: ['user']})
    },
    onSuccess: (result) => {
      // console.log(result.username);
      const { username: newUsername } = result;
      localStorage.setItem("username", newUsername);
      dispatch(authActions.updateUsername(newUsername));
      navigate(`/${newUsername}`);
    },
  });
  if (isPending) {
    return <p className="text-center animate-pulse mt-20">Fetching data...</p>;
  }
  function handleAddFileClick() {
    fileInputField.current.click();
  }
  function handleFileInputChange(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewImg(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }
  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    mutate(fd);
  }
  // console.log(data);
  return (
    <div className="bg-neutral-200 flex flex-col shadow-lg rounded mt-20 w-3/4 mx-auto min-h-[35rem] overflow-hidden p-4 gap-4">
      <div className="border-b-2 border-b-slate-600">
        <h2 className="font-semibold text-2xl">Edit Profile</h2>
      </div>
      <Form
        className="flex flex-col gap-4 mt-2"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <input type="hidden" name="folderName" value="user" />
        <div className="flex flex-col gap-1">
          <div className="flex gap-10 mb-4 items-center">
            {!previewImg && (
              <img
                className="w-20 object-cover aspect-square rounded-full"
                src={`${import.meta.env.VITE_SERVER_DOMAIN}/${
                  data.user.imgProfile
                }`}
                alt="User profile photo"
              />
            )}
            {previewImg && (
              <img
                className="w-20 object-cover aspect-square rounded-full"
                src={previewImg}
                alt="New user profile photo"
              />
            )}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={handleAddFileClick}
                className="bg-blue-500 hover:bg-blue-600 rounded px-2 py-1 text-slate-200 text-xs"
              >
                Change Photo
              </button>
              <input
                onChange={handleFileInputChange}
                ref={fileInputField}
                type="file"
                name="image"
                className="hidden"
              />
            </div>
          </div>
          <label htmlFor="name">Username</label>
          <input
            className="outline-none px-2 py-1 rounded border-2 border-transparent focus:border-blue-500 duration-150"
            type="text"
            name="name"
            id="name"
            // disabled
            defaultValue={data.user.name}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="bio">Bio</label>
          <input
            className="outline-none px-2 py-1 rounded border-2 border-transparent focus:border-blue-500 duration-150"
            type="text"
            name="bio"
            id="bio"
            defaultValue={data.user.bio}
          />
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col">
            <label htmlFor="newPassword">New Password</label>
            <input
              className="outline-none px-2 py-1 rounded border-2 border-transparent focus:border-blue-500 duration-150"
              type="password"
              name="newPassword"
              id="newPassword"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="oldPassword">Old Password</label>
            <input
              className="outline-none px-2 py-1 rounded border-2 border-transparent focus:border-blue-500 duration-150"
              type="password"
              name="oldPassword"
              id="oldPassword"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mr-2 text-lg mt-24 items-center">
          <Link to={`/${data.user.name}`}>Cancel</Link>
          <button className="bg-blue-500 hover:bg-blue-600 rounded px-4 py-1 text-slate-200 ">
            Save
          </button>
        </div>
      </Form>
    </div>
  );
}
