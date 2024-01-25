import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { clsm } from "@vyductan/utils";

const spinVariants = cva("", {
  variants: {
    size: {
      default: "size-8",
    },
  },
});
export interface SpinProps extends VariantProps<typeof spinVariants> {
  spinning?: boolean;
  children?: React.ReactNode;
}
export const Spin = ({ spinning, size, children }: SpinProps) => {
  return (
    <div>
      {spinning === undefined ||
        (spinning && (
          <div key="loading">
            <div
              aria-label="Loading"
              className="relative inline-flex flex-col items-center justify-center gap-2"
            >
              <div className={clsm("relative flex", spinVariants({ size }))}>
                <i className="animate-spinner-ease-spin absolute size-full rounded-full border-[3px] border-solid border-x-transparent border-b-primary border-t-transparent"></i>
                <i className="animate-spinner-linear-spin absolute size-full rounded-full border-[3px] border-dotted border-x-transparent border-b-primary border-t-transparent opacity-75"></i>
              </div>
            </div>
          </div>
        ))}
      {children}
    </div>
  );
};
