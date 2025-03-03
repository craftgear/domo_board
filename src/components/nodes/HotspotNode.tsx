import { BaseNode } from "./BaseNode";
import type { BaseNodeProps } from "./NodeTypes";

export type HotspotNodeProps = BaseNodeProps;

export const HotspotNode = ({ data, ...rest }: HotspotNodeProps) => {
  return (
    <BaseNode
      data={data}
      activeColor="bg-rose-200 ring-rose-400"
      inactiveColor="bg-rose-300"
      rotate="rotate-315"
      size="w-26 h-26"
      hasHandles={false}
      {...rest}
    />
  );
};
