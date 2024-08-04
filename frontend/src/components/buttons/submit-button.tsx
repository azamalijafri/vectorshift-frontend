// submit.tsx

import React from "react";
import { Button } from "../ui/button";
import { useStore } from "@/store";
import toast from "react-hot-toast";

export const SubmitButton: React.FC = () => {
  const { edges, nodes } = useStore();

  const handleSubmit = async () => {
    const formattedNodes = nodes.map((node) => node.id);
    const formattedEdges = edges.map((edge) => {
      return { src: edge.source, target: edge.target };
    });

    try {
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        body: JSON.stringify({ edges: formattedEdges, nodes: formattedNodes }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }).then((res) => res.json());

      toast(
        `Number of Nodes: ${response.num_nodes}\n\nNumber of Edges: ${
          response.num_edges
        }\n\nContains Cycle? ${response.is_dag ? "YES :(" : "NO :)"}`,
        {
          duration: 6000,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};
