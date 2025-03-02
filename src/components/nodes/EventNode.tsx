import { BaseNode } from "./BaseNode";
import type { BaseNodeProps } from "./NodeTypes";

export type EventNodeProps = BaseNodeProps;

export const EventNode = ({ data, ...rest }: BaseNodeProps) => {
  return (
    <BaseNode
      data={data}
      activeColor="bg-orange-200 ring-2 ring-orange-300"
      inactiveColor="bg-orange-300"
      {...rest}
    />
  );
};
