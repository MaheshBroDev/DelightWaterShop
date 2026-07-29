import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Droplets } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full water-gradient flex items-center justify-center mx-auto mb-6">
            <Droplets size={40} className="text-white" />
          </div>
          <h1 className="font-heading text-6xl font-bold text-[var(--color-primary)] mb-2">
            404
          </h1>
          <h2 className="font-heading text-xl font-bold mb-2">Page Not Found</h2>
          <p className="text-[var(--color-muted-foreground)] mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 ocean-gradient text-white font-semibold rounded-full hover:scale-105 transition-transform"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
