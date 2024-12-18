import { Link } from "react-router-dom";

export default function SidebarButton({
  img,
  content,
  onClick,
  circleImg,
  to,
}) {
  let imgClass = `w-6 aspect-square object-cover ${
    circleImg ? "rounded-full" : null
  }`;
  // console.log(img, content, onClick, circleImg, to);
  return (
    <>
      {!onClick && (
        <Link to={to}>
          <li className="hover:bg-zinc-200 duration-150 p-1 lg:p-3 flex gap-2 items-center rounded">
            <img className={imgClass} src={img} alt={`${content} image`} />
            <span className="text-base">{content}</span>
          </li>
        </Link>
      )}
      {onClick && (
        <button onClick={onClick}>
          <li className="hover:bg-zinc-200 duration-150 p-1 lg:p-3 flex gap-2 items-center rounded">
            <img className={imgClass} src={img} alt={`${content} image`} />
            <span className="text-base">{content}</span>
          </li>
        </button>
      )}
    </>
  );
}
