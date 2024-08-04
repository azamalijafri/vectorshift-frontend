import React, { ChangeEvent } from "react";
import { Input } from "../ui/input";

interface FileInputProps {
  id: string;
  value: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: React.FC<FileInputProps> = ({ id, value, onChange }) => {
  return (
    <Input
      type="file"
      id={id}
      value={value || ""}
      onChange={onChange}
      className="mt-2"
    />
  );
};

export default FileInput;
