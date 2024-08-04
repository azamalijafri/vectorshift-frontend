// outputNode.tsx

import React, { useState } from "react";
import { Position, NodeProps } from "reactflow";
import AbstractionNode from "../abstraction-node";
import { FileOutput } from "lucide-react";

interface OutputNodeProps extends NodeProps {
  id: string;
  data: {
    outputName?: string;
    outputType?: string;
  };
}

export const OutputNode: React.FC<OutputNodeProps> = ({ id }) => {
  const [handles, setHandles] = useState<HandleConfig[]>([
    {
      type: "target",
      position: Position.Left,
      id: `${id}-value`,
    },
  ]);

  const inputs: InputConfig[] = [
    {
      type: "text",
      id: `${id}-name`,
      label: "Name",
      initValue: `${id.replace("custom", "")}`,
      dependsOn: `${id}-select1`,
    },
    {
      type: "select",
      id: `${id}-select1`,
      label: "Type",
      options: [
        { value: "text", label: "Text" },
        { value: "file", label: "File" },
      ],
      initValue: "text",
    },
  ];

  return (
    <AbstractionNode
      id={id}
      label="Output"
      inputs={inputs}
      handles={handles}
      icon={FileOutput}
      setHandles={setHandles}
    />
  );
};
