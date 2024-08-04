// textNode.tsx

import React, { useState } from "react";
import { Position, NodeProps } from "reactflow";
import AbstractionNode from "../abstraction-node";
import { Text } from "lucide-react";

interface TextNodeProps extends NodeProps {
  id: string;
  data: {
    text?: string;
  };
}

export const TextNode: React.FC<TextNodeProps> = ({ id }) => {
  const [handles, setHandles] = useState<HandleConfig[]>([
    {
      type: "source",
      position: Position.Right,
      id: `${id}-output`,
    },
  ]);

  const inputs: InputConfig[] = [
    {
      type: "text",
      id: `${id}-name`,
      label: "Name",
      initValue: `${id.replace("custom", "")}`,
    },
  ];

  return (
    <AbstractionNode
      id={id}
      label="Text"
      inputs={inputs}
      handles={handles}
      icon={Text}
      setHandles={setHandles}
    />
  );
};
