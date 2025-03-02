import { BaseNode } from "./BaseNode";
import type { BaseNodeProps } from "./NodeTypes";

export type HotspotNodeProps = BaseNodeProps;

export const HotspotNode = ({ data, ...rest }: BaseNodeProps) => {
  return (
    <BaseNode
      data={data}
      activeColor="bg-purple-300 ring-purple-400"
      inactiveColor="bg-purple-400"
      rotate="rotate-315"
      size="w-26 h-26"
      hasHandles={false}
      {...rest}
    />
  );
};
