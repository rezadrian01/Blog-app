import { createPortal } from "react-dom";

export default function Modal({ children, onClose, dialogClass }) {
  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 z-10" onClick={onClose} />
      <dialog className={dialogClass} open onClose={onClose}>
        {children}
      </dialog>
    </>,
    document.getElementById("root-modal")
  );
}
