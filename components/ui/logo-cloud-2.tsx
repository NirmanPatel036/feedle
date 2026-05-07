import React from "react";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

type LogoCloudProps = React.ComponentProps<"div">;

export function LogoCloud({ className, ...props }: LogoCloudProps) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-2 border-x border-zinc-700/30 md:grid-cols-4",
        className,
      )}
      {...props}
    >
      <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t border-zinc-700/30" />

      <LogoCard
        className="relative border-r border-b border-zinc-700/30 bg-zinc-900"
        logo={{
          src: "./images/express.png",
          alt: "express Logo",
        }}
      ></LogoCard>

      <LogoCard
        className="border-b border-zinc-700/30 md:border-r bg-zinc-900"
        logo={{
          src: "./images/gnews.svg",
          alt: "gnews Logo",
          className: "h-4 md:h-6",
        }}
      />

      <LogoCard
        className="relative border-r border-b border-zinc-700/30 bg-zinc-900"
        logo={{
          src: "/images/node.png",
          alt: "Node Logo",
        }}
      >
        <PlusIcon
          className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6 text-zinc-700/30"
          strokeWidth={1}
        />
        <PlusIcon
          className="-bottom-[12.5px] -left-[12.5px] absolute z-10 hidden size-6 md:block text-zinc-700/30"
          strokeWidth={1}
        />
      </LogoCard>

      <LogoCard
        className="relative border-b border-zinc-700/30 bg-zinc-900"
        logo={{
          src: "./images/mongodb_logo.png",
          alt: "MDB Logo",
          className: "h-12 md:h-14",
        }}
      />

      <LogoCard
        className="relative border-r border-b border-zinc-700/30 bg-zinc-900 md:border-b-0"
        logo={{
          src: "./images/newsapi.png",
          alt: "NewsAPI Logo",
        }}
      >
        <PlusIcon
          className="-right-[12.5px] -bottom-[12.5px] md:-left-[12.5px] absolute z-10 size-6 md:hidden text-zinc-700/30"
          strokeWidth={1}
        />
      </LogoCard>

      <LogoCard
        className="border-b border-r border-zinc-700/30 bg-zinc-900 md:border-b-0"
        logo={{
          src: "./images/react.png",
          alt: "React Logo",
          className: "h-12 md:h-14",
        }}
      />

      <LogoCard
        className="border-r border-zinc-700/30 bg-zinc-900"
        logo={{
          src: "./images/the-guardian.png",
          alt: "Gaurdian Logo",
        }}
      />

      <LogoCard
        className="bg-zinc-900"
        logo={{
          src: "https://svgl.app/library/vercel_wordmark.svg",
          alt: "Vercel Logo",
          className: "h-4 md:h-6",
        }}
      />

      <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b border-zinc-700/30" />
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-zinc-900 px-4 py-8 md:p-8",
        className,
      )}
      {...props}
    >
      <img
        alt={logo.alt}
        className={cn(
          "pointer-events-none h-8 select-none md:h-10 brightness-0 invert",
          logo.className,
        )}
        height={logo.height || "auto"}
        src={logo.src || "/placeholder.svg"}
        width={logo.width || "auto"}
      />
      {children}
    </div>
  );
}
