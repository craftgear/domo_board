import { PropsWithChildren } from "react";
export const Logo = (_props: PropsWithChildren) => {
  return (
    <div className="font-mono text-sm bg-[var(--xy-node-background-color-default)] p-1 border border-black inline-block m-4">
      <p>domo board</p>
    </div>
  );
};
