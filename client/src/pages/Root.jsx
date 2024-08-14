import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

export default function RootLayout() {
  const dispatch = useDispatch();
  dispatch(authActions.checkAuth());
  dispatch();
  return (
    <div className="flex justify-start">
      <Sidebar />
      <main className="min-h-[200vh] flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
