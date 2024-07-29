import { cn } from "@/lib/utils";
import Link from "next/link";

const Header = ({
  title,
  titleClassname,
}: {
  title?: string;
  titleClassname?: string;
}) => {
  return (
    <header className="flex items-center justify-between">
      {title ? (
        <h1 className={cn("text-18 font-bold text-white-1", titleClassname)}>
          {title}
        </h1>
      ) : (
        <div />
      )}
      <Link href={"/discover"} className="text-16 font-semibold text-orange-1">
        See All
      </Link>
    </header>
  );
};

export default Header;
