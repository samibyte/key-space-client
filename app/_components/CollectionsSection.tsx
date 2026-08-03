import Link from "next/link";
import { Sparkles, Users, Award, ShieldCheck, Layers, Briefcase } from "lucide-react";

export default function CollectionsSection() {
  const collections = [
    {
      title: "Luxury Living",
      desc: "Top-tier duplexes, penthouses, and high-end flats.",
      icon: <Award className="size-6 text-primary" />,
      link: "/properties?minPrice=40000",
    },
    {
      title: "Family Homes",
      desc: "Spacious 3+ bedroom homes located in quiet neighborhoods.",
      icon: <Users className="size-6 text-primary" />,
      link: "/properties?bedrooms=3",
    },
    {
      title: "Student Hostels",
      desc: "Budget-friendly shared sublets and flats near top campuses.",
      icon: <Layers className="size-6 text-primary" />,
      link: "/properties?maxPrice=15000",
    },
    {
      title: "Pet Friendly",
      desc: "Rental options welcoming cats, dogs, and small pets.",
      icon: <ShieldCheck className="size-6 text-primary" />,
      link: "/properties?searchTerm=pet",
    },
    {
      title: "Urban Studios",
      desc: "Cozy single-bedroom apartments built for modern professionals.",
      icon: <Sparkles className="size-6 text-primary" />,
      link: "/properties?bedrooms=1&maxPrice=25000",
    },
    {
      title: "Commercial Hubs",
      desc: "Sleek office locations, shops, and business showrooms.",
      icon: <Briefcase className="size-6 text-primary" />,
      link: "/properties?searchTerm=commercial",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-12">
      {/* Section Header */}
      <div className="text-center flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-primary font-bold">
          Curated Nests
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Explore Curated Rental Collections
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Tailored property matching categories selected specifically for your lifestyle and budget.
        </p>
      </div>

      {/* Grid of collections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((c) => (
          <Link
            key={c.title}
            href={c.link}
            className="group flex flex-col gap-4 p-6 sm:p-7 rounded-3xl border border-border/40 bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden"
          >
            {/* Soft decorative background circles */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/2 rounded-bl-full group-hover:scale-110 transition-transform duration-300" />

            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              {c.icon}
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <h3 className="font-extrabold text-foreground text-lg group-hover:text-primary transition-colors">
                {c.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {c.desc}
              </p>
            </div>

            {/* Read more footer inline styling */}
            <div className="text-xs font-bold text-primary flex items-center gap-1.5 mt-2 group-hover:translate-x-1 transition-transform">
              Explore →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
