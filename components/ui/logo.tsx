import Image from "next/image";

type LogoProps = {
  className: string;
  onlyIcon?: boolean;
}

export default function Logo({ className, onlyIcon }: LogoProps) {

  if(onlyIcon) {
    return (
      <Image
        width={1080}
        height={1080}
        className={className}
        alt="Rent Nest Logo"
        src={"/rent-nest-logo.png"}
      />
    )
  }

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
        Rent <span className="text-emerald-600 dark:text-emerald-400">Nest</span>
      </h1>
    </div>
  );
}
