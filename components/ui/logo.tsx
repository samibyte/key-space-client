import Image from "next/image";

export default function Logo({ className }: { className: string }) {
  return (
    <div className="flex gap-2 items-center">
      <Image
        width={1080}
        height={1080}
        className={className}
        alt="Rent Nest Logo"
        src={"/rent-nest-logo.png"}
      />
      <h1 className="text-3xl font-bold">
        Rent <span className="text-primary">Nest</span>
      </h1>
    </div>
  );
}
