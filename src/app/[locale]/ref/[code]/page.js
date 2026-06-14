import { redirect } from "next/navigation";

export default function RefPage({ params }) {
  redirect(`/register?ref=${params.code}`);
}
