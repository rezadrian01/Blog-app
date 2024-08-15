import { Link } from "react-router-dom";

export default function CommentItem({ comment }) {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
  return (
    <li className="flex gap-2 items-start">
      <img
        className="h-5 w-5 rounded-full mt-1"
        src={`${import.meta.env.VITE_SERVER_DOMAIN}/${
          comment.userId.imgProfile
        }`}
      />
      <div className="flex flex-col w-full">
        <div className="flex gap-4 items-center justify-between">
          <Link className="font-semibold" to={`../../${comment.userId.name}`}>
            {comment.userId.name}
          </Link>
          <p className="text-slate-500 text-xs">{formattedDate}</p>
        </div>
        <p className="text-xs">{comment.content}</p>
      </div>
    </li>
  );
}
