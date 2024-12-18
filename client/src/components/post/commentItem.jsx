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
        className="h-5 aspect-square object-cover rounded-full mt-1"
        src={`${import.meta.env.VITE_SERVER_DOMAIN}/${
          comment.userId.imgProfile
        }`}
      />
      <div className="flex flex-col items-center sm:items-baseline w-full lg:pr-4">
        <div className="flex md:gap-4 flex-col sm:flex-row items-center sm:justify-between w-1/2 sm:w-full">
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
