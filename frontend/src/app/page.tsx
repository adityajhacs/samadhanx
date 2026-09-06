import { redirect } from "next/navigation";

export default function Home() {
  redirect("/government/dashboard");
}