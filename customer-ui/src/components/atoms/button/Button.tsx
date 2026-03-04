import "./Button.scss";

export type ButtonVariant = "primary" | "secondary";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
};

function Button({ children, variant = "secondary", ...props }: ButtonProps) {
  const variantClass = variant === "primary" ? "button--primary" : "";

  return (
    <button className={`button ${variantClass}`.trim()} {...props}>
      {children}
    </button>
  );
}

export default Button;
