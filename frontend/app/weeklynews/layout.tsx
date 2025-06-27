import Footer from "../components/common/Footer";
import Header from "../components/common/Header";

export default function WeeklyNewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      <Header />
      <div className="relative">
        {children}
      </div>
      <Footer />
    </div>
  );
}
