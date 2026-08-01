import Image from "next/image";

export default function Logo({ className }: { className: string }) {
  return (
    <div>
      <Image
        width={1080}
        height={1080}
        className={className}
        alt="Rent Nest Logo"
        src={"/rent-nest-logo.png"}
      />
    </div>
  );
}
