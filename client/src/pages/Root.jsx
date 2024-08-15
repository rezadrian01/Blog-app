import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

export default function RootLayout() {
  // const dispatch = useDispatch();
  // dispatch(authActions.checkAuth());
  return (
    <div className="flex justify-start bg-[#fafafa]">
      <Sidebar />
      <main className="min-h-[200vh] mx-auto ">
        <Outlet />
      </main>
    </div>
  );
}
