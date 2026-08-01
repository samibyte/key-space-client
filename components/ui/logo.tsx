import Image from "next/image";
import Link from "next/link";

export default function Logo({ className }: { className: string }) {
  return (
    <Link href={"/"}>
      <Image
        width={1080}
        height={1080}
        className={className}
        alt="Rent Nest Logo"
        src={"/rent-nest-logo.png"}
      />
    </Link>
  );
}
