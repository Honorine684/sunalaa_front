import AdminShell from "@/components/admin/AdminShell";
import NewsletterPage from "@/components/admin/NewsletterPage";

export const metadata = {
  title: "Newsletter — Administration SUNALA",
};

export default function NewsletterAdminPage() {
  return (
    <AdminShell active="newsletter" title="Newsletter">
      <NewsletterPage />
    </AdminShell>
  );
}
