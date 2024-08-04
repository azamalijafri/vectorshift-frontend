// toolbar.tsx

import React from "react";
import { DraggableNode } from "../draggable-node";
import {
  BrainCircuit,
  Check,
  FileInput,
  FileOutput,
  NotepadTextDashedIcon,
  Text,
} from "lucide-react";

export const PipelineToolbar: React.FC = () => {
  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <DraggableNode type="customInput" label="Input" icon={FileInput} />
        <DraggableNode type="llm" label="LLM" icon={BrainCircuit} />
        <DraggableNode type="customOutput" label="Output" icon={FileOutput} />
        <DraggableNode type="text" label="Text" icon={Text} />

        <DraggableNode type="customCheckbox" label="Checkbox" icon={Check} />
        <DraggableNode
          type="myNode"
          label="My Node"
          icon={NotepadTextDashedIcon}
        />
      </div>
    </div>
  );
};
