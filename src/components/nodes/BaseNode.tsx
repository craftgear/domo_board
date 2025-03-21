import {
  PropsWithChildren,
  useState,
  useCallback,
  useEffect,
  useRef,
  KeyboardEventHandler,
} from "react";
import classNames from "classnames";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

import { useNodeIdInEditing } from "@/state";

export type BaseNodeProps = {
  data: {
    content: string;
    updateNodeContent: (nodeId: string, label: string) => void;
    tabIndex: number;
    parentNodeId: string;
  };
} & NodeProps;

type Props = {
  activeColor: string;
  inactiveColor: string;
  rotate?: string;
  size?: string;
  hasHandles?: boolean;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
} & BaseNodeProps;

export const NODE_SIZE = 150;
export const NODE_GAP = 100;
const sizeClasses = `w-[150px] h-[150px]`;

export const BaseNode = ({
  children,
  id,
  selected,
  activeColor,
  inactiveColor,
  rotate = "",
  size = sizeClasses,
  hasHandles = true,
  data: { content, updateNodeContent, tabIndex },
  onMouseOver,
  onMouseLeave,
  // ...rest
}: PropsWithChildren<Props>) => {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [_, setNodeIdInEditing] = useNodeIdInEditing();

  const handleExitEdit = useCallback(
    (shouldUpdateContent = true) => {
      setIsEdit(false);
      setNodeIdInEditing(null);
      if (shouldUpdateContent) {
        updateNodeContent(id, textRef.current?.value || content);
      }
      divRef.current?.focus();
    },
    [setIsEdit, updateNodeContent, textRef, id, content, setNodeIdInEditing],
  );

  const handleEditContent = useCallback(() => {
    setIsEdit(true);
    setNodeIdInEditing(id);
  }, [id, setIsEdit, setNodeIdInEditing]);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.code === "Enter" || e.code === "F2") {
        if (!isEdit) {
          e.preventDefault();
          e.stopPropagation();
          handleEditContent();
          return;
        }
        // Shift + Enter、IME変換確定時は無視
        if (e.shiftKey || e.nativeEvent.isComposing) {
          return;
        }
        handleExitEdit();
      }
      if (e.code === "Escape") {
        handleExitEdit(false);
      }
    },
    [isEdit, handleEditContent, handleExitEdit],
  );

  useEffect(() => {
    if (selected) {
      // XXX: do not delete setTimeout or pressing Enter makes the previous active Node editing
      setTimeout(() => {
        divRef.current?.focus();
      }, 0);
    }
  }, [selected]);

  const activeClassNames = `shadow-lg ring-2 outline-none ${activeColor}`;
  const inActiveClassNames = `shadow-md ${inactiveColor}`;
  const classes = classNames(
    "p-1 relative transition duration-50 break-all flex items-center justify-center",
    {
      [activeClassNames]: selected,
    },
    { [inActiveClassNames]: !selected },
    rotate,
    size,
  );

  // Hotspot Node
  const childrenClasses = rotate.includes("rotate-315")
    ? "rotate-45 w-[80%] h-[80%]"
    : "h-full w-full ";
  // TODO: left and right
  // const handleClasses = rotate.includes("rotate-315")
  //   ? `translate-y-[-75px] `
  //   : "";
  const handleClasses = "";

  return (
    <>
      <div
        className={classes}
        ref={divRef}
        tabIndex={tabIndex || 0}
        onDoubleClick={handleEditContent}
        onClick={() => divRef.current?.focus()}
        onKeyDown={handleKeyDown}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        {hasHandles && (
          <>
            <Handle
              className={handleClasses}
              type="source"
              position={Position.Right}
            />
            <Handle
              className={handleClasses}
              type="target"
              position={Position.Left}
            />
          </>
        )}
        {isEdit ? (
          <TextInput
            value={content}
            handleExitEdit={handleExitEdit}
            childrenClasses={childrenClasses}
            ref={textRef}
          />
        ) : (
          <div
            className={`overflow-hidden text-base/5 grid place-items-center ${childrenClasses}`}
          >
            {content}
          </div>
        )}
        {!isEdit && children}
      </div>
    </>
  );
};

type TextInputProps = {
  ref: React.MutableRefObject<HTMLTextAreaElement | null>;
  value: string;
  childrenClasses: string;
  handleExitEdit: (shouldUpdateContent: boolean) => void;
};

const TextInput = ({
  ref,
  value,
  handleExitEdit,
  childrenClasses,
}: TextInputProps) => {
  useEffect(() => {
    ref?.current?.focus();
    ref?.current?.setSelectionRange(value.length, value.length);
  }, [ref, value]);

  return (
    <textarea
      ref={ref}
      className={`w-full h-full bg-white border border-slate-200 resize-none nodrag nowheel outline-none ${childrenClasses}`}
      onBlur={() => {
        handleExitEdit(false);
      }}
      defaultValue={value}
    />
  );
};
