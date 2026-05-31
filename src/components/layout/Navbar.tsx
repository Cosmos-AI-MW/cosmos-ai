import Image from "next/image";
import Link from "next/link";

export default function Navbar({ active }: { active?: string }) {
  const links = [
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Get in Touch", isButton: true },
  ];

  return (
    <nav className="bg-cosmos-forest px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/cosmos_logo.png"
            alt="Cosmos AI"
            width={48}
            height={48}
            className="rounded"
          />
          <div>
            <div className="font-display text-cosmos-sage text-lg font-semibold tracking-widest">
              COSMOS AI
            </div>
            <div className="text-cosmos-teal text-xs tracking-widest">
              SHAPING TOMORROW WITH AI
            </div>
          </div>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) =>
            link.isButton ? (
              <Link
                key={link.href}
                href={link.href}
                className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-6 py-2 text-base font-medium tracking-wide text-white transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-medium tracking-wide transition-colors ${
                  active === link.href
                    ? "text-white"
                    : "text-cosmos-sage hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </nav>
  );
}
