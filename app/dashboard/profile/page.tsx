import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserInfo } from "@/services/auth.service";
import ProfileContent from "./_components/ProfileContent";

export const metadata: Metadata = {
  title: "My Profile | KeySpace",
  description: "View and manage your KeySpace account profile.",
};

export default async function ProfilePage() {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    notFound();
  }

  return <ProfileContent user={userInfo} />;
}
