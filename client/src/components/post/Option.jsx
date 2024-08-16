import Modal from "../UI/Modal";
import closeLogo from "../../assets/close.svg";

export default function OptionMenu({ toggleOptionMenu, onDelete }) {
  function handleDelete() {
    const proceed = window.confirm("Are you sure?");
    if (!proceed) {
      return;
    }
    onDelete();
  }
  return (
    <Modal
      onClose={() => toggleOptionMenu("isOpenOption")}
      dialogClass={`bg-slate-100 z-20 p-6 rounded-lg mt-36 w-11/12 md:w-1/3 lg:w-1/3`}
    >
      <div className="relative flex flex-col">
        <button
          onClick={() => toggleOptionMenu("isOpenOption")}
          className="w-[1.1rem] aspect-square absolute -right-5 -top-5"
        >
          <img src={closeLogo} />
        </button>
        <div className="border-b-2 border-b-slate-500 text-center pb-1">
          <h2>Options</h2>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => {
              toggleOptionMenu("isOpenOption");
              toggleOptionMenu("isEditPost");
            }}
            className="border-2 border-transparent hover:border-zinc-300 duration-100  rounded-lg py-2"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="border-2 border-transparent hover:border-zinc-300 duration-100  rounded-lg py-2"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
