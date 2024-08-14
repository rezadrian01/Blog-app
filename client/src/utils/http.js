import { QueryClient } from "@tanstack/react-query";
import { json } from "react-router-dom";

export const queryClient = new QueryClient();

export async function signup(authData) {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData }),
    }
  );
  const resData = await response.json();
  if (!response.ok) {
    throw json(
      { message: resData.message || "Failed to signup" },
      { status: response.status || 500 }
    );
  }
  return resData;
}

export async function signin(authData) {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/auth/signin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData }),
    }
  );
  const resData = await response.json();
  if (!response.ok) {
    throw json(
      { message: resData.message || "Failed to signin" },
      { status: response.status || 500 }
    );
  }
  localStorage.setItem("token", resData.token);
  localStorage.setItem("username", resData.name);
  return resData;
}

export async function fetchUserProfile({ signal, username }) {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/user/profile/${username}`,
    { signal }
  );
  const resData = await response.json();
  if (!response.ok) {
    throw json(
      {
        message: resData.message || "Failed to fetch user profile",
      },
      {
        status: response.status || 500,
      }
    );
  }
  return resData;
}

export async function startFollowing(followedUser) {
  const token = localStorage.getItem("token");
  if (!token) throw json({ message: "Missing auth token" }, { status: 403 });

  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/user/addFollowing/${followedUser}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    }
  );
  const resData = await response.json();
  if (!response.ok) {
    throw json(
      { message: resData.message || "Failed to follow user" },
      { status: response.status || 500 }
    );
  }
  return resData;
}

export async function stopFollowing(removedUser) {
  const token = localStorage.getItem("token");
  if (!token) throw json({ message: "Missing auth token" }, { status: 403 });
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/user/removeFollowing/${removedUser}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    }
  );
  const resData = await response.json();
  if (!response.ok) {
    throw json(
      { message: resData.message || "Failed to unfollow user" },
      {
        status: response.status || 500,
      }
    );
  }
  return resData;
}

export async function createPost(postData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error();
  }
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/post/post`,
    {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
      },
      body: postData,
    }
  );
  const resData = await response.json();
  if (!response.ok) {
    throw json(
      {
        message: resData.message || "Failed to create post",
      },
      {
        status: response.status || 500,
      }
    );
  }
  return resData;
}
