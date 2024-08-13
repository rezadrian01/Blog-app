import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function RootLayout() {
  return (
    <div className="flex justify-start">
      <Sidebar />
      <main className="min-h-[200vh] flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
