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
      type: "text", // type of input
      id: `${id}-text1`, // id of it
      label: "Name", // label of it
      initValue: `${id.replace("custom", "")}`, // if u want to initialize it with something else can be null since its optional
      dependsOn: `${id}-select1`, // if depends on some other input (for now only implemented for file/text select input)
    },
    {
      type: "select",
      id: `${id}-select1`,
      label: "Type",
      options: [
        // options for the select input
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
      label="My Node"
      inputs={inputs}
      handles={handles}
      icon={NotepadTextDashedIcon}
      setHandles={setHandles}
    />
  );
};
