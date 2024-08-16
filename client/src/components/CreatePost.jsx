import { Form } from "react-router-dom";
import closeLogo from "../assets/close.svg";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createPost, queryClient } from "../utils/http";
import { useSelector } from "react-redux";

export default function CreatePost({ onClose }) {
  const [previewImg, setPreviewImg] = useState(null);
  const { username } = useSelector((state) => state.auth);
  const fileInput = useRef();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["user", { username }]);
      navigate("");
    },
  });

  useEffect(() => {
    return () => {
      if (previewImg) {
        URL.revokeObjectURL(previewImg);
      }
    };
  }, [previewImg]);
  function handleFileInputClick() {
    fileInput.current.click();
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
    fd.append("folderName", "posts");
    // console.log(fd.get("image"));
    mutate(fd);
  }
  return (
    <>
      <div className="border-b-2 border-b-slate-700 pb-2 mb-4 flex justify-between relative">
        <h2 className="text-2xl  ">Create Post</h2>
        <button onClick={onClose}>
          <img className="w-6 h-6 absolute -right-4 -top-4" src={closeLogo} />
        </button>
      </div>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="hidden" value="posts" name="folderName" />
        <div className="flex flex-col gap-4 h-[50vh] lg:flex-row ">
          <div className="flex flex-col lg:w-1/2">
            <textarea
              className="w-full lg:h-20 p-2 outline-none"
              placeholder="Write Your Caption Here...."
              name="content"
            />
          </div>
          <div className="flex-grow">
            <div className="grid items-center  h-full">
              {previewImg && (
                <img
                  src={previewImg}
                  className="max-h-[40vh] lg:max-h-[50vh] mx-auto"
                />
              )}
              {!previewImg && (
                <>
                  <button
                    type="button"
                    onClick={handleFileInputClick}
                    className="bg-sky-500 hover:bg-sky-600 text-slate-200 px-4 py-2 mx-auto rounded-lg lg:w-1/3"
                  >
                    Add File
                  </button>
                  <input
                    className="hidden"
                    onChange={handleFileInputChange}
                    type="file"
                    name="image"
                    ref={fileInput}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-6 justify-end">
          <button onClick={onClose} type="button">
            Cancel
          </button>
          <button className="bg-sky-500 hover:bg-sky-600 rounded text-slate-100 px-3 py-1">
            Create
          </button>
        </div>
      </Form>
    </>
  );
}
