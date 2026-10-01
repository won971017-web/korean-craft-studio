import { ClassesSection } from "@/components/classes/ClassesSection";
import { CraftsSection } from "@/components/crafts/CraftsSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Tabs } from "@/components/Tabs";

const PANEL_CLASS = "mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14";

const TABS = [
  {
    id: "shop",
    label: "공예품 전시·주문",
    panel: (
      <div className={PANEL_CLASS}>
        <CraftsSection />
      </div>
    ),
  },
  {
    id: "classes",
    label: "공방 클래스",
    panel: (
      <div className={PANEL_CLASS}>
        <ClassesSection />
      </div>
    ),
  },
] as const;

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <Tabs tabs={TABS} defaultId="shop" ariaLabel="온결 공방 메뉴" />
      </main>
      <Footer />
    </>
  );
}
