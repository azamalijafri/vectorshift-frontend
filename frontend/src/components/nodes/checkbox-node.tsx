import React, { useState } from "react";
import AbstractionNode from "@/components/abstraction-node";
import { NodeProps, Position } from "reactflow";
import { Check } from "lucide-react";

interface CheckboxNodeProps extends NodeProps {
  id: string;
  data: {
    inputName?: string;
    inputType?: string;
  };
}

export const CheckboxNode: React.FC<CheckboxNodeProps> = ({ id }) => {
  const [handles, setHandles] = useState<HandleConfig[]>([
    {
      type: "source",
      position: Position.Right,
      id: `${id}-source`,
    },
    {
      type: "target",
      position: Position.Left,
      id: `${id}-target`,
    },
  ]);

  const inputs: InputConfig[] = [
    {
      type: "checkbox",
      id: `${id}-checkbox`,
      label: "Are you sure you want to accept these terms?",
    },
  ];

  return (
    <AbstractionNode
      id={id}
      label="Checkbox"
      inputs={inputs}
      handles={handles}
      icon={Check}
      setHandles={setHandles}
    ></AbstractionNode>
  );
};
