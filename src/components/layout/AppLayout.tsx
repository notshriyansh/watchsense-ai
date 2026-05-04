import Header from "../Header";
import type { ReactNode } from "react";
import Footer from "./footer";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-svh text-white">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba)",
        }}
      />

      <div className="fixed inset-0 -z-10 bg-[#0B0F14]/90 backdrop-blur-sm" />

      <Header />

      <main className="pt-20 min-h-[calc(100vh-80px)] flex flex-col">
        <div className="grow">{children}</div>
        <Footer />
      </main>
    </div>
  );
};

export default AppLayout;
