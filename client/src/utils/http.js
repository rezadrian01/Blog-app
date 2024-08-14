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
  return resData;
}