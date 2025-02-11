export interface ButtonProps {
    varient: "primary" | "secondary";
    size: "sm" | "md" | "lg";
    text: string;
    startIcon?: any;
    endIcon?: any;
    onClick?: () => void;
  }
  const varientStyles = {
    primary: "bg-blue-300 text-white-500",
    secondary: "bg-blue-600 text-black",
  };
  const sizeStyles = {
    sm: "py-2 px-8",
    md: "py-4 px-12",
    lg: "py-4 px-16",
  };
  
  const defaultstyles = "rounded-md p-4 flex";
  export const Button = (props: ButtonProps) => {
    return (
      <button
        onClick={props.onClick}
        className={`${varientStyles[props.varient]} ${defaultstyles} 
      ${sizeStyles[props.size]} hover:bg-blue-500`}
      >
        {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null}{" "}
        {props.text} {props.endIcon}
      </button>
    );
  };
  