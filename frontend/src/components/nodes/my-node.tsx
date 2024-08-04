import React, { useState } from "react";
import AbstractionNode from "@/components/abstraction-node";
import { NodeProps, Position } from "reactflow";
import { NotepadTextDashedIcon } from "lucide-react";

interface MyNodeProps extends NodeProps {
  id: string;
  data: {
    inputName?: string;
    inputType?: string;
  };
}

export const MyNode: React.FC<MyNodeProps> = ({ id }) => {
  const [handles, setHandles] = useState<HandleConfig[]>([
    {
      type: "source",
      position: Position.Right,
      id: `${id}-source`,
    },
  ]);

  const inputs: InputConfig[] = [
    {
      type: "text",
      id: `${id}-text1`,
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
    {
      type: "text",
      id: `${id}-text2`,
      label: "Description",
      initValue: `${id.replace("custom", "")}`,
    },
    {
      type: "select",
      id: `${id}-select2`,
      label: "Fav Food",
      options: [
        { value: "burger", label: "Burger" },
        { value: "pizza", label: "Pizza" },
      ],
    },
    {
      type: "checkbox",
      id: `${id}-checkbox`,
      label: "Are you sure you want to accept these terms?",
    },
  ];

  return (
    <AbstractionNode
      id={id}
      label="Input"
      inputs={inputs}
      handles={handles}
      icon={NotepadTextDashedIcon}
      setHandles={setHandles}
    />
  );
};
