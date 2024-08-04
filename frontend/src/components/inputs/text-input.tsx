import React, { ChangeEvent, useRef } from "react";
import { Textarea } from "../ui/textarea";

interface TextInputProps {
  id: string;
  value: string | null;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  value,
  onChange,
  onFocus,
  onBlur,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <Textarea
      ref={textareaRef}
      rows={1}
      className="mt-2 resize-none min-h-9 overflow-hidden"
      id={id}
      value={value || ""}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default TextInput;
