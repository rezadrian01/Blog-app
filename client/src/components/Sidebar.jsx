import { useState } from "react";
import Modal from "./UI/Modal";

export default function Sidebar() {
  const [isCreatePost, setIsCreatePost] = useState(false);

  function handleStartCreatePost() {
    setIsCreatePost(true);
  }

  function handleStopCreatePost() {
    setIsCreatePost(false);
  }

  return (
    <>
      {isCreatePost && (
        <Modal onClose={handleStopCreatePost}>
          <h2>Create Post</h2>
        </Modal>
      )}
      <div className="h-screen w-64 sticky top-0 bg-slate-300">
        <ul>
          <li>Home</li>
          <li>Search</li>
          <li>
            <button onClick={handleStartCreatePost}>Create Post</button>
          </li>
          <li>User Profile</li>
          <li>Setting</li>
        </ul>
      </div>
    </>
  );
}
