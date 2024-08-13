import { createPortal } from "react-dom";

export default function Modal({ children, onClose }) {
  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 z-10" onClick={onClose} />
      <dialog
        className="bg-slate-100 z-20 p-6 rounded-lg mt-64"
        open
        onClose={onClose}
      >
        {children}
      </dialog>
    </>,
    document.getElementById("root-modal")
  );
}
