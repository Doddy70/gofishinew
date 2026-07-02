import clsx from "clsx";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  error?: string;
  as?: "input" | "textarea";
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Input({
  label,
  error,
  name,
  value,
  as = "input",
  className,
  onChange,
  ...props
}: InputProps | TextareaProps) {
  const hasValue = value !== "" && value !== null && value !== undefined;

  const sharedClasses = clsx(
    `
        peer
        w-full
        border
        bg-canvas
        focus:border-2
        px-3
        text-base
        outline-none
        transition
        disabled:bg-surface-soft
        disabled:text-muted-soft
        disabled:cursor-not-allowed
        text-ink
        `,
    error
      ? "border-primary-error-text focus:border-primary-error-text"
      : "border-hairline focus:border-ink",
    as === "textarea"
      ? "min-h-[120px] pt-6 pb-2 rounded-sm resize-none"
      : "h-14 pt-6 rounded-sm",
    className,
  );
  return (
    <div className="w-full">
      <div className="relative">
        {as === "textarea" ? (
          <textarea
            className={sharedClasses}
            name={name}
            value={value}
            placeholder=" "
            onChange={onChange}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={sharedClasses}
            name={name}
            value={value}
            placeholder=" "
            onChange={onChange}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        <label
          htmlFor={name}
          className={clsx(
            `
                absolute
                left-3 
                top-4
                text-muted
                text-base
                transition-all
                duration-200
                pointer-events-none
                origin-left                
                `,
            hasValue
              ? "scale-75 -translate-y-3 text-ink"
              : "peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-ink",
          )}
        >
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-primary-error-text font-medium">{error}</p>}
    </div>
  );
}
