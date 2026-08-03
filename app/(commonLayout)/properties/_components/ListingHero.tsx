"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function ListingHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("searchTerm", term);
    } else {
      params.delete("searchTerm");
    }
    params.set("page", "1");
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#002b20] via-[#005040] to-[#007a60] py-8 px-4 pt-24">
      {/* Background mesh */}
      <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]">
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-emerald-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          Find Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
            Perfect Home
          </span>
        </h1>
        <p className="mt-3 text-white/60 text-sm sm:text-base max-w-xl mx-auto">
          Discover curated premium rentals. Search by location, price, amenities,
          and more — all in one place.
        </p>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mt-8 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 max-w-xl mx-auto shadow-lg ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-emerald-400/40 transition-all"
        >
          <Search className="size-4 text-white/50 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            defaultValue={searchParams.get("searchTerm") ?? ""}
            placeholder="Search by title, location, or description…"
            className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 outline-none min-w-0"
          />
          <button
            type="submit"
            className="flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
