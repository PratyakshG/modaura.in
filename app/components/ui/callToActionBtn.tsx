import Link from "next/link";
import React from "react";

type Props = {
  text: string;
  href?: string;
  variant?: "default" | "link";
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

const CallToActionBtn = ({
  text,
  href,
  className,
  onClick,
  variant,
  children,
}: Props) => {
  return (
    <>
      {variant === "link" ? (
        <Link
          href={href!}
          className={`cursor-pointer flex text-sm lg:text-base items-center justify-center ${className}`}
        >
          {text ? text : "link-button"}
          {children}
        </Link>
      ) : (
        <button
          className={`cursor-pointer flex text-sm lg:text-base items-center justify-center ${className}`}
          onClick={onClick}
        >
          {text ? text : "default-button"}
          {children}
        </button>
      )}
    </>
  );
};

export default CallToActionBtn;
