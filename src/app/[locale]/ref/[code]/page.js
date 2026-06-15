import { redirect } from "next/navigation";

export default async function RefPage({ params }) {
  const { code } = await params;
  redirect(`/register?ref=${code}`);
}
