import React, { useState } from "react";
import AbstractionNode, {
  HandleConfig,
  InputConfig,
} from "@/components/abstraction-node";
import { NodeProps, Position } from "reactflow";
import { FileInput } from "lucide-react";

interface InputNodeProps extends NodeProps {
  id: string;
  data: {
    inputName?: string;
    inputType?: string;
  };
}

export const InputNode: React.FC<InputNodeProps> = ({ id }) => {
  const [handles, setHandles] = useState<HandleConfig[]>([
    {
      type: "source",
      position: Position.Right,
      id: `${id}-value`,
    },
  ]);

  const inputs: InputConfig[] = [
    {
      type: "text",
      id: `${id}-name`,
      label: "Name",
      initValue: `${id.replace("custom", "")}`,
    },
    {
      type: "select",
      id: `${id}-type`,
      label: "Type",
      options: [
        { value: "Text", label: "Text" },
        { value: "File", label: "File" },
      ],
      initValue: "Text",
    },
  ];

  return (
    <AbstractionNode
      id={id}
      label="Input"
      inputs={inputs}
      handles={handles}
      icon={FileInput}
      setHandles={setHandles}
    />
  );
};
