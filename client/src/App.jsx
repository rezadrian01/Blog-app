import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./utils/http";

import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import GoogleAuth from "./pages/auth/google";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/signin";
import GoogleCallback from "./pages/auth/GoogleCallback";
import Post from "./pages/post/Post";
import UserProfile from "./pages/user/UserProfile";
import UserFollowers from "./pages/user/Followers";
import UserFollowed from "./pages/user/Followed";
import EditProfile from "./pages/user/EditProfile";
import UserSearch from "./pages/user/UserSearch";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "post/:postId",
          element: <Post />,
        },
        {
          path: "user-search",
          element: <UserSearch />,
        },
        {
          path: ":username",
          children: [
            {
              index: true,
              element: <UserProfile />,
            },
            {
              path: "followers",
              element: <UserFollowers />,
            },
            {
              path: "followed",
              element: <UserFollowed />,
            },
            {
              path: "edit",
              element: <EditProfile />,
            },
          ],
        },
      ],
    },
    {
      path: "/auth",
      children: [
        // {
        //   path: "google",
        //   element: <GoogleAuth />,
        // },
        {
          index: true,
          element: <Signin />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "google/callback",
          element: <GoogleCallback />,
        },
      ],
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
