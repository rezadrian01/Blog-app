import { createPortal } from "react-dom";

export default function Modal({ children, onClose, mt }) {
  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 z-10" onClick={onClose} />
      <dialog
        className={`bg-slate-100 z-20 p-6 rounded-lg ${
          mt || "mt-64"
        } w-11/12 md:w-2/3 lg:w-2/3`}
        open
        onClose={onClose}
      >
        {children}
      </dialog>
    </>,
    document.getElementById("root-modal")
  );
}
