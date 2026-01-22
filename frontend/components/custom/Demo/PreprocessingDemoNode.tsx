"use client";

import { Handle, Position } from "@xyflow/react";
import { FileEditIcon } from "lucide-react";

export default function PreprocessingDemoNode() {
  return (
    <div className="w-60 rounded-md bg-white dark:bg-sidebar border shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-100 dark:bg-sidebar">
        <FileEditIcon className="w-4 h-4" />
        <span className="text-sm font-semibold">Preprocessing</span>
      </div>

      <div className="p-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
        <p>• Handle Missing Values</p>
        <p>• Normalize Salary</p>
      </div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
