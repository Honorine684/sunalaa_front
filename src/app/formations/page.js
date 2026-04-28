import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormationsHero from "@/components/FormationsHero";
import FormationsContent from "@/components/FormationsContent";

export const metadata = {
  title: "Formations & Masterclass — SUNAALA",
  description: "Formez-vous à la crypto et gagnez des SNL",
};

export default function FormationsPage() {
  return (
    <>
      <Navbar />
      <FormationsHero />
      <FormationsContent />
      <Footer />
    </>
  );
}
