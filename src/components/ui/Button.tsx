import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: React.ReactNode;
  rounded?: boolean; // control full border-radius
}

export default function Button({
  children,
  variant = "primary",
  loading,
  disabled,
  icon,
  rounded = false,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      disabled={isDisabled}
      {...props}
      className={clsx(
        `
        w-full
        h-12
        font-semibold
        flex
        items-center
        justify-center
        gap-3
        cursor-pointer
        transition
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-ink
        focus-visible:ring-offset-2
        `,
        rounded ? "rounded-full" : "rounded-sm",
        
        variant === "primary" &&
          "bg-primary text-on-primary hover:bg-primary-active active:scale-[0.96]",

        variant === "outline" &&
          "border border-hairline text-ink bg-canvas hover:bg-surface-soft active:scale-[0.96]",

        variant === "ghost" &&
          "bg-transparent text-ink hover:underline active:scale-[0.96]",

        isDisabled && "bg-primary-disabled text-on-primary cursor-not-allowed hover:bg-primary-disabled active:scale-100",

        className,
      )}
    >
      {icon}
      {loading ? "Loading..." : children}
    </button>
  );
}
