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
      <main className="min-h-[200vh] mx-auto lg:w-[80%] text-slate-700">
        <Outlet />
      </main>
    </div>
  );
}
