"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "./auth";

export async function signInWithGitHub() {
  await signIn("github", { redirectTo: "/dashboard" });
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signInWithCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    // redirect:false → signIn sets the session cookie via next/headers cookies()
    // but does NOT throw a redirect, so the Set-Cookie is preserved in the action response.
    await signIn("credentials", {
      email,
      password,
      redirect: false
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/?error=${encodeURIComponent(error.type)}`);
    }
    throw error;
  }
  // Now that the cookie is committed, navigate.
  redirect("/dashboard");
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
