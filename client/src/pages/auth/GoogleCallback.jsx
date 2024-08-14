import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authActions } from "../../store/auth";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const username = searchParams.get("username");
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      dispatch(authActions.login());
      navigate("/");
      return;
    }
    navigate("/auth");
  }, []);

  //redirect
  return (
    <>
      <h1 className="animate-pulse text-center mt-24">Redirecting...</h1>
    </>
  );
}
