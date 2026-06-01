import React from "react";
import { useNavigate } from "react-router-dom";

interface CommunityButtonProps {
  text?: string;
  to: string;
  onBeforeNavigate?: () => void;
  className?: string;
}

const Button: React.FC<CommunityButtonProps> = ({
  text = "Join our Community",
  to,
  onBeforeNavigate,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onBeforeNavigate?.();
    navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-auto  mt-2 bg-orange-500  text-white py-3 px-8 rounded-full text-center text-sm font-bold shadow-md transition-all ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
