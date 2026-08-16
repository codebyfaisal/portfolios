import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";

const ButtonBase = ({
  as: Component = "button",
  className,
  children,
  variant = "primary",
  size = "md",
  padding,
  icon: Icon,
  rounded,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary: "bg-secondary text-white hover:bg-secondary/90 shadow-sm",
    secondary:
      "bg-foreground/10 hover:bg-foreground/5 hover:text-foreground shadow-xl",
    text: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <Component
      className={cn(
        baseStyles,
        variants[variant],
        padding || sizes[size],
        rounded,
        className
      )}
      {...props}
    >
      {Icon && <Icon className="mr-2" />}
      {children}
    </Component>
  );
};

const Button = ({ to, href, children, ...props }) => {
  const { rounded } = usePortfolioStore();

  if (to) {
    return (
      <ButtonBase as={Link} to={to} rounded={rounded} {...props}>
        {children}
      </ButtonBase>
    );
  }

  if (href) {
    return (
      <ButtonBase
        as="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        rounded={rounded}
        {...props}
      >
        {children}
      </ButtonBase>
    );
  }

  return (
    <ButtonBase rounded={rounded} {...props}>
      {children}
    </ButtonBase>
  );
};

export default Button;
