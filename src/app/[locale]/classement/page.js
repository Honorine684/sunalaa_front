import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PodiumSection from "@/components/PodiumSection";
import LeaderboardSection from "@/components/LeaderboardSection";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SNL Collectors Leaderboard",
  description:
    "Discover the ranking of the top SNL point collectors on SUNALA. Progress, climb the leaderboard and compete with the community.",
  alternates: { canonical: "https://sunalaa.com/classement" },
  openGraph: {
    url: "https://sunalaa.com/classement",
    title: "SNL Leaderboard | SUNALA",
    description:
      "Top SNL point collectors. Who is dominating the SUNALA leaderboard this week?",
  },
};

export default function ClassementPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <PodiumSection />
      <LeaderboardSection />
      <Footer />
    </>
  );
}
