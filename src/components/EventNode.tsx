import {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import classNames from "classnames";
import { Handle, Position, type NodeProps } from "@xyflow/react";

type Props = {
  data: {
    content: string;
    isEditing: boolean;
    updateNodeContent: (nodeId: string, label: string) => void;
  };
} & NodeProps;

export const EventNode = ({
  id,
  data: { content, isEditing, updateNodeContent },
}: Props) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [isEdit, setIsEdit] = useState(isEditing);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const handleExitEdit = useCallback(() => {
    setIsEdit(false);
    updateNodeContent(id, ref.current?.value || content);
  }, [setIsEdit, updateNodeContent, ref, id, content]);
  console.log("----- isOverflowing", isOverflowing);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      const overflowing =
        divRef.current.scrollWidth > divRef.current.clientWidth ||
        divRef.current.scrollHeight > divRef.current.clientHeight;
      setIsOverflowing(overflowing ? true : false);
    }
  }, [setIsOverflowing, content]);

  return (
    <div
      className="w-20 h-20 p-1 bg-orange-300 relative"
      onDoubleClick={() => setIsEdit(true)}
    >
      <Handle type="source" position={Position.Right}></Handle>
      <Handle type="target" position={Position.Left} />
      {isEdit ? (
        <TextInput value={content} handleExitEdit={handleExitEdit} ref={ref} />
      ) : (
        <div ref={divRef} className="h-full w-full overflow-hidden text-base/5">
          {content}
        </div>
      )}
      {isOverflowing && !isEdit ? (
        <div className="absolute bottom-0 left-0 h-8 w-full bg-linear-to-b from-transparent to-orange-300" />
      ) : null}
    </div>
  );
};

type TextInputProps = {
  ref: React.MutableRefObject<HTMLTextAreaElement | null>;
  value: string;
  handleExitEdit: () => void;
};

const TextInput = ({ ref, value, handleExitEdit }: TextInputProps) => {
  useEffect(() => {
    ref?.current?.focus();
    ref?.current?.setSelectionRange(value.length, value.length);
  }, [ref, value]);

  return (
    <textarea
      ref={ref}
      className="w-full h-full bg-white resize-none nodrag nowheel"
      onBlur={handleExitEdit}
      onKeyDown={(e) => {
        // e.preventDefault();
        console.log("----- e", e);
        if (e.code === "Enter") {
          if (e.shiftKey || e.nativeEvent.isComposing) {
            return;
          }
          handleExitEdit();
        }
      }}
      defaultValue={value}
    />
  );
};
