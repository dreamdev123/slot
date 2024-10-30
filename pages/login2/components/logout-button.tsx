"use client";

import { logout } from "../../../lib/auth2"

export default function LogOutButton() {
  async function handleClick() {
    await logout();
  }
  return <button onClick={handleClick}>Log out</button>;
};