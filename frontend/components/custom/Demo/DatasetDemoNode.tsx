"use client";

import { Handle, Position } from "@xyflow/react";
import { FileSpreadsheet } from "lucide-react";

export default function DatasetDemoNode() {
  return (
    <div className="w-[220px] rounded-md bg-white dark:bg-sidebar border shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-100 dark:bg-sidebar">
        <FileSpreadsheet className="w-4 h-4" />
        <span className="text-sm font-semibold">Dataset</span>
      </div>

      <div className="p-3 text-xs text-gray-600 dark:text-gray-400">
        customer_data.csv
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
