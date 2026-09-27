import { CheckCircle2, User, Landmark } from "lucide-react";

export default function FeaturesSection() {
  const tenantFeatures = [
    "Premium filters: category, beds, price, and specific amenities.",
    "Detailed property page with multi-image gallery & lightbox.",
    "Submit instant rental requests directly to landlords.",
    "Secure online payments via integrated Stripe/bKash providers.",
    "Vetted landlord credentials and honest tenant rating histories.",
  ];

  const landlordFeatures = [
    "Easy multi-step property creation with categorized fields.",
    "Comprehensive requests dashboard supporting Approve/Reject.",
    "Automated invoicing & payment tracking for lease request assets.",
    "Real-time revenue monitoring and occupancy stats.",
    "Secure interface to communicate with interested tenants.",
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-12">
      {/* Short intro heading */}
      <div className="text-center flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-primary font-bold">
          Tailored Workspaces
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Double-Sided Ecosystem Features
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          KeySpace provides custom workflows specifically designed to empower both renter and property owner roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* For Tenants */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border/40 bg-card hover:border-primary/20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center gap-3.5 mb-6">
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground text-lg">For Tenants</h3>
              <p className="text-xs text-muted-foreground">Find & lease your dream home</p>
            </div>
          </div>

          <ul className="flex flex-col gap-3.5">
            {tenantFeatures.map((feat, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="size-4.5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-muted-foreground leading-snug">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* For Landlords */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border/40 bg-card hover:border-primary/20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center gap-3.5 mb-6">
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Landmark className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground text-lg">For Landlords</h3>
              <p className="text-xs text-muted-foreground">Manage spaces & track payments</p>
            </div>
          </div>

          <ul className="flex flex-col gap-3.5">
            {landlordFeatures.map((feat, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="size-4.5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-muted-foreground leading-snug">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
