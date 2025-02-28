export interface ButtonProps {
  varient: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
}

const varientStyles = {
  primary: "bg-blue-500 text-white",
  secondary: "bg-blue-600 text-white",
};

const sizeStyles = {
  sm: "py-2 px-8",
  md: "py-4 px-12",
  lg: "py-4 px-16",
};

const defaultstyles = "rounded-md flex items-center justify-center";

export const Button = (props: ButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className={`${varientStyles[props.varient]} ${defaultstyles} 
      ${sizeStyles[props.size]} hover:bg-blue-700 transition-colors`}
    >
      {props.startIcon && <span className="mr-2">{props.startIcon}</span>}
      {props.text || props.children}
      {props.endIcon && <span className="ml-2">{props.endIcon}</span>}
    </button>
  );
};