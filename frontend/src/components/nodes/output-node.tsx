// outputNode.tsx

import React, { useState } from "react";
import { Position, NodeProps } from "reactflow";
import AbstractionNode, {
  HandleConfig,
  InputConfig,
} from "../abstraction-node";
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
      label="Output"
      inputs={inputs}
      handles={handles}
      icon={FileOutput}
      setHandles={setHandles}
    />
  );
};
