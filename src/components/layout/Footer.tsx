import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cosmos-forest px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link
            href="/"
            className="font-display text-cosmos-sage text-base tracking-widest transition-colors hover:text-white"
          >
            COSMOS AI
          </Link>
          <div className="text-cosmos-sage/60 text-sm">
            © {new Date().getFullYear()} Cosmos AI · Malawi
          </div>
          <div className="text-cosmos-sage flex gap-6 text-base">
            <Link
              href="/services"
              className="transition-colors hover:text-white"
            >
              Services
            </Link>
            <Link href="/about" className="transition-colors hover:text-white">
              About
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="border-cosmos-forest-light mt-6 flex flex-wrap justify-center gap-6 border-t pt-6">
          <Link
            href="/privacy"
            className="text-cosmos-sage/50 hover:text-cosmos-sage text-xs transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-cosmos-sage/50 hover:text-cosmos-sage text-xs transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/data-deletion"
            className="text-cosmos-sage/50 hover:text-cosmos-sage text-xs transition-colors"
          >
            Data Deletion
          </Link>
        </div>
      </div>
    </footer>
  );
}
