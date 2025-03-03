import { BaseNode } from "./BaseNode";
import type { BaseNodeProps } from "./NodeTypes";

export type EventNodeProps = {
  data: {
    isContextBorder: boolean;
  };
} & BaseNodeProps;

export const EventNode = ({ data, ...rest }: EventNodeProps) => {
  const contextBorderClass = `h-[800px] w-4 bg-yellow-200`;
  return (
    <>
      {data.isContextBorder && <div className={contextBorderClass} />}
      <BaseNode
        data={data}
        activeColor="bg-orange-200 ring-2 ring-orange-300"
        inactiveColor="bg-orange-300"
        {...rest}
      />
      {data.isContextBorder && <div className={contextBorderClass} />}
    </>
  );
};
