// draggableNode.tsx

import { LucideProps } from "lucide-react";
import React from "react";

interface DraggableNodeProps {
  type: string;
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export const DraggableNode: React.FC<DraggableNodeProps> = ({
  type,
  label,
  icon: Icon,
}) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    const appData = { nodeType };
    event.currentTarget.style.cursor = "grabbing";
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`${type} cursor-grab min-w-20 h-16 flex items-center rounded-md bg-white justify-center border border-purple-700 text-purple-600 gap-x-2 px-4 transition hover:bg-purple-600 hover:text-white`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.currentTarget.style.cursor = "grab")}
      draggable
    >
      <Icon className="size-4" />
      <span>{label}</span>
    </div>
  );
};
