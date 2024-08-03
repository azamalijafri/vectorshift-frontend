// llmNode.tsx

import React, { useState } from "react";
import { Position, NodeProps } from "reactflow";
import AbstractionNode, {
  HandleConfig,
  InputConfig,
} from "../abstraction-node";
import { BrainCircuit } from "lucide-react";

interface LLMNodeProps extends NodeProps {
  id: string;
  data: unknown;
}

export const LLMNode: React.FC<LLMNodeProps> = ({ id }) => {
  const [handles, setHandles] = useState<HandleConfig[]>([
    {
      type: "target",
      position: Position.Left,
      id: `${id}-system`,
      style: { top: `${100 / 3}%` },
    },
    {
      type: "target",
      position: Position.Left,
      id: `${id}-prompt`,
      style: { top: `${200 / 3}%` },
    },
    {
      type: "source",
      position: Position.Right,
      id: `${id}-response`,
    },
  ]);

  const inputs: InputConfig[] = [];

  return (
    <AbstractionNode
      id={id}
      label="LLM"
      inputs={inputs}
      handles={handles}
      icon={BrainCircuit}
      setHandles={setHandles}
    >
      <span className="text-sm">This is an LLM.</span>
    </AbstractionNode>
  );
};
