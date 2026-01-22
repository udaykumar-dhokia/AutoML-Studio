import { Button } from "@/components/ui/button";
import { store } from "@/store/store";
import { NodeResizer, useReactFlow } from "@xyflow/react";
import { NotebookPen, X } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { deleteNode as deleteNodeAction } from "@/store/slices/currentWorkflow.slice";

const CommentNode = ({ id, data, selected }: any) => {
    const rf = useReactFlow();
    const [comment, setComment] = useState(data.comment || "");

    useEffect(() => {
        setComment(data.comment || "");
    }, [data.comment]);

    const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setComment(val);
        rf.setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: { ...node.data, comment: val },
                    };
                }
                return node;
            })
        );
    }, [id, rf]);

    const deleteNode = () => {
        rf.deleteElements({ nodes: [{ id }] });
        store.dispatch(deleteNodeAction({ id }));
    };

    return (
        <div className="h-full w-full min-w-[200px] min-h-[100px] flex flex-col items-stretch group">
            <NodeResizer
                isVisible={selected}
                minWidth={200}
                minHeight={100}
                color="#a1a1aa"
            />

            <div className={`flex items-center justify-between px-3 py-1 transition-opacity duration-200 ${selected || comment === "" ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <span className="flex items-center gap-2 text-xs font-medium text-gray-500/80">
                    <NotebookPen className="w-3 h-3" />
                    Comment
                </span>
                <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={deleteNode}
                    className="h-6 w-6 hover:bg-red-100 hover:text-red-500 rounded-full"
                >
                    <X className="w-3 h-3" />
                </Button>
            </div>

            <div className="flex-1 w-full scroll-container h-full relative p-2">
                <textarea
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Write your comment here..."
                    className="w-full h-full bg-transparent border-none resize-none focus:outline-none text-md p-2 text-gray-800 dark:text-gray-100 placeholder:text-gray-400/50 leading-relaxed font-normal"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        fontFamily: 'cursive'
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}

export default memo(CommentNode);
