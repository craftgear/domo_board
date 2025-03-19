import { useState } from "react";
import { BaseNode } from "./BaseNode";
import type { BaseNodeProps } from "./NodeTypes";

export type EventNodeProps = {
  data: {
    isContextBorder: boolean;
    hotspots: string[];
  };
} & BaseNodeProps;

export const EventNode = ({ data, ...rest }: EventNodeProps) => {
  const [showHotSpots, setShowHotSpots] = useState(false);
  const contextBorderClass = `h-[800px] w-4 bg-yellow-200`;
  return (
    <>
      {data.isContextBorder && <div className={contextBorderClass} />}
      <BaseNode
        data={data}
        activeColor="bg-orange-100 ring-2 ring-orange-300"
        inactiveColor="bg-orange-300"
        onMouseOver={() => setShowHotSpots(true)}
        onMouseLeave={() => setShowHotSpots(false)}
        {...rest}
      >
        {(showHotSpots || data.hotspots.length > 0) && <HotSpots></HotSpots>}
      </BaseNode>
      {data.isContextBorder && <div className={contextBorderClass} />}
    </>
  );
};

const HotSpots = () => {
  return (
    <div className="bg-red-50 w-full absolute bottom-0">
      <div>Hotspot</div>
      <HotSpotsList />
    </div>
  );
};

// TODO: ホットスポットを一覧表示
const HotSpotsList = () => {
  return (
    <ul className="absolute top-full w-full">
      <li>* hotspot </li> <li>* hotspot </li> <li>* hotspot </li>{" "}
      <li>* hotspot </li>
      <li>* hotspot </li> <li>* hotspot </li> <li>* hotspot </li>{" "}
      <li>* hotspot </li>
    </ul>
  );
};
