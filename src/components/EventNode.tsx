import {
  useState,
  useCallback,
  useEffect,
  useRef,
  KeyboardEventHandler,
} from "react";
import classNames from "classnames";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useNodeIdInEditing } from "@/store";

type Props = {
  data: {
    content: string;
    updateNodeContent: (nodeId: string, label: string) => void;
    tabIndex: number;
  };
} & NodeProps;

export const EventNode = ({
  id,
  selected,
  data: { content, updateNodeContent, tabIndex },
  // ...rest
}: Props) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [_, setNodeIdInEditing] = useNodeIdInEditing();
  const handleExitEdit = useCallback(() => {
    console.log("############ handleExitEdit");
    setIsEdit(false);
    setNodeIdInEditing(null);
    updateNodeContent(id, ref.current?.value || content);
    divRef.current?.focus();
  }, [setIsEdit, updateNodeContent, ref, id, content, setNodeIdInEditing]);
  const handleEditContent = useCallback(() => {
    console.log("------- handleEditContent");
    setIsEdit(true);
    setNodeIdInEditing(id);
  }, [id, setIsEdit, setNodeIdInEditing]);

  const classes = classNames(
    "w-24 h-24 p-1 relative transition duration-50 break-all",
    { "shadow-md bg-orange-300 ": !selected },
    { "shadow-lg bg-orange-200 ring-2 ring-orange-300 outline-none": selected },
  );

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.code === "Enter") {
        if (!isEdit) {
          e.preventDefault();
          handleEditContent();
          return;
        }
      }
    },
    [isEdit, handleEditContent],
  );

  return (
    <div className={classes}>
      <Handle type="source" position={Position.Right}></Handle>
      <Handle type="target" position={Position.Left} />
      {isEdit ? (
        <TextInput value={content} handleExitEdit={handleExitEdit} ref={ref} />
      ) : (
        <div
          className="h-full w-full overflow-hidden text-base/5 grid place-items-center"
          ref={divRef}
          tabIndex={tabIndex}
          onDoubleClick={handleEditContent}
          onClick={() => divRef.current?.focus()}
          onFocus={() => divRef.current?.focus()}
          onKeyDown={onKeyDown}
        >
          {content}
        </div>
      )}
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
      className="w-full h-full bg-white resize-none nodrag nowheel outline-none"
      onBlur={handleExitEdit}
      defaultValue={value}
      onKeyDown={(e) => {
        if (e.code === "Enter") {
          // Shift + Enter、IME変換確定時は無視
          if (e.shiftKey || e.nativeEvent.isComposing) {
            return;
          }
          handleExitEdit();
        }
        if (e.code === "Escape") {
          handleExitEdit();
        }
      }}
    />
  );
};
