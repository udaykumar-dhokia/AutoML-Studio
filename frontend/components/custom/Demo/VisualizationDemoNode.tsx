"use client";

import { Handle, Position } from "@xyflow/react";
import { ChartLine } from "lucide-react";

export default function VisualizationDemoNode() {
  return (
    <div className="w-60 rounded-md bg-white dark:bg-sidebar border shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-100 dark:bg-sidebar">
        <ChartLine className="w-4 h-4" />
        <span className="text-sm font-semibold">Visualization</span>
      </div>

      <div className="p-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
        <p>Histogram</p>
        <p className="italic">salary distribution</p>
      </div>

      <Handle type="target" position={Position.Left} />
    </div>
  );
}
