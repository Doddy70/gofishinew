import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image 
        src="/Logo.svg" 
        alt="GoFishi Logo" 
        width={80} 
        height={80} 
        className="object-contain w-10 md:w-14 lg:w-16 h-auto max-h-10 md:max-h-12"
        priority
      />
    </Link>
  );
}
