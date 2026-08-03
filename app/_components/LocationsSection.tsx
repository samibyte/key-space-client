import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";

export default function LocationsSection() {
  const locations = [
    {
      city: "Dhaka",
      desc: "Capital City & Economic Center",
      count: "840+ properties",
      gradient: "from-emerald-700/60 to-emerald-950/80",
    },
    {
      city: "Chittagong",
      desc: "Commercial Port City",
      count: "320+ properties",
      gradient: "from-sky-700/60 to-sky-950/80",
    },
    {
      city: "Sylhet",
      desc: "Tea Estates & Tourist Center",
      count: "180+ properties",
      gradient: "from-teal-700/60 to-teal-950/80",
    },
    {
      city: "Rajshahi",
      desc: "Educational Hub & Silk City",
      count: "120+ properties",
      gradient: "from-yellow-400 to-amber-500",
    },
    {
      city: "Khulna",
      desc: "Sundarbans Gateway",
      count: "95+ properties",
      gradient: "from-green-700/60 to-green-950/80",
    },
    {
      city: "Comilla",
      desc: "Historic Center & Highway Hub",
      count: "75+ properties",
      gradient: "from-indigo-700/60 to-indigo-950/80",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto flex flex-col gap-12">
      {/* Section Header */}
      <div className="text-center flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-primary font-bold">
          Search Localities
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Explore Properties by Location
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Find your next home in Bangladesh&apos;s most active residential
          neighborhoods and commercial cities.
        </p>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <Link
            key={loc.city}
            href={`/properties?city=${loc.city}`}
            className="group relative h-48 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-border/20"
          >
            {/* Visual background gradient cards */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${loc.gradient} group-hover:scale-105 transition-transform duration-500`}
            />
            <div className="absolute inset-0 bg-background/20 mix-blend-overlay" />

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 text-white">
              <div className="flex items-center justify-between">
                <span className="size-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <MapPin className="size-4.5 text-white" />
                </span>
                <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white/95">
                  {loc.count}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-extrabold text-xl tracking-tight leading-none">
                  {loc.city}
                </h3>
                <p className="text-[11px] text-white/80 leading-relaxed font-medium">
                  {loc.desc}
                </p>
              </div>

              {/* Navigation float arrow */}
              <div className="absolute bottom-6 right-6 size-8 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all flex items-center justify-center backdrop-blur-sm">
                <Navigation className="size-3.5 text-white rotate-45" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
