"use client";
import {
  Background,
  Controls,
  ReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
const nodes: Node[] = [
  {
    id: "bill",
    position: { x: 0, y: 30 },
    data: { label: "Hospital bill · 12 Oct" },
    style: { background: "#fffaf5", borderColor: "#cebea9" },
  },
  {
    id: "date",
    position: { x: 230, y: 125 },
    data: { label: "Date needs verification" },
    style: { background: "#fff0e3", borderColor: "#b94716" },
  },
  {
    id: "discharge",
    position: { x: 0, y: 220 },
    data: { label: "Discharge summary · 13 Oct" },
    style: { background: "#fffaf5", borderColor: "#cebea9" },
  },
];
const edges: Edge[] = [
  {
    id: "bill-date",
    source: "bill",
    target: "date",
    label: "reports discharge",
    style: { stroke: "#b94716" },
  },
  {
    id: "discharge-date",
    source: "discharge",
    target: "date",
    label: "reports discharge",
    style: { stroke: "#b94716" },
  },
];
export default function EvidenceGraph({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  return (
    <div className="evidence-graph">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        onNodeClick={(_, node) =>
          onSelect(node.id === "date" ? "bill" : node.id)
        }
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: false }}
      >
        <Background gap={20} color="#dfdcd4" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
