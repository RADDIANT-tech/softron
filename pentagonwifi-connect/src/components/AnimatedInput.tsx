
import React, { useState, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  validationIcon?: ReactNode;
  isValid?: boolean;
  className?: string;
  placeholder?: string;
  maxWidth?: string;
  readOnly?: boolean;
  autoComplete?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  icon,
  validationIcon,
  isValid,
  className,
  placeholder = '',
  maxWidth = 'max-w-md',
  readOnly = false,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div 
      className={cn(
        "relative form-field-animation rounded-lg", 
        maxWidth,
        className
      )}
    >
      <div 
        className={cn(
          "flex items-center border-2 rounded-lg overflow-hidden",
          isFocused ? "border-primary shadow-md" : "border-gray-200",
          isValid === true && value ? "border-green-500" : "",
          isValid === false && value ? "border-red-500" : ""
        )}
      >
        {icon && (
          <div className="flex items-center justify-center pl-3 text-gray-500">
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          readOnly={readOnly}
          autoComplete={autoComplete}
          className={cn(
            "w-full py-3 px-4 focus:outline-none input-focus-effect",
            icon ? "pl-2" : "",
            validationIcon ? "pr-10" : ""
          )}
        />
        {validationIcon && value && (
          <div className={cn(
            "flex items-center justify-center pr-3",
            isValid ? "text-green-500" : "text-red-500"
          )}>
            {validationIcon}
          </div>
        )}
      </div>
      <label
        htmlFor={id}
        className={cn(
          "absolute transition-all duration-200 pointer-events-none",
          (isFocused || value) 
            ? "text-xs top-0 left-2 px-1 bg-white text-primary"
            : "text-base text-gray-500 top-3 left-3",
          icon ? "left-9" : ""
        )}
      >
        {label}
      </label>
    </div>
  );
};

export default AnimatedInput;
