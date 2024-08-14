import { Link } from "react-router-dom";

export default function SidebarButton({ img, content, onClick, circleImg }) {
  let imgClass = `w-6 h-6 ${circleImg ? "rounded-full" : null}`;
  return (
    <>
      {!onClick && (
        <Link>
          <li className="hover:bg-zinc-200 p-3 flex gap-2 items-center rounded">
            <img className={imgClass} src={img} alt={`${content} image`} />
            <span className="text-base">{content}</span>
          </li>
        </Link>
      )}
      {onClick && (
        <button onClick={onClick}>
          <li className="hover:bg-zinc-200 p-3 flex gap-2 items-center rounded">
            <img className={imgClass} src={img} alt={`${content} image`} />
            <span className="text-base">{content}</span>
          </li>
        </button>
      )}
    </>
  );
}
