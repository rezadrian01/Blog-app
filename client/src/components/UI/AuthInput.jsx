import { Link } from "react-router-dom";

export default function AuthInput({ label, name, password, signin }) {
  return (
    <div className="flex flex-col relative">
      <input
        className="focus:outline-none outline-none peer px-3 py-1 border-b-transparent border-b-2 focus:border-b-blue-500 placeholder-transparent duration-150"
        type={password ? "password" : "text"}
        name={name}
        placeholder={label}
      />
      {password && signin && (
        <Link className="mt-4 text-sm text-blue-700 hover:underline">
          Forgot Password?
        </Link>
      )}
      <label className="absolute peer-placeholder-shown:left-3 peer-placeholder-shown:top-1 peer-focus:left-1 peer-focus:-top-6 left-1 -top-6 duration-150 pointer-events-none">
        {label}
      </label>
    </div>
  );
}
