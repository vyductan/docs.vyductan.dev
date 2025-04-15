"use client";

import * as React from "react";

import type { ButtonProps } from "../button";
import type { DialogProps } from "./_components";
import { cn } from "..";
import { Button } from "../button";
import { ScrollArea } from "../scroll-area";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./_components";

type ModalProps = DialogProps & {
  className?: string;
  children?: React.ReactNode;
  description?: React.ReactNode;
  footer?:
    | ((params: {
        originNode: React.ReactNode;
        extra: {
          OkBtn: React.ReactElement<any>;
          CancelBtn: React.ReactElement<any>;
        };
      }) => React.ReactNode)
    | React.ReactNode;
  okText?: string;
  okLoading?: boolean;
  okButtonProps?: ButtonProps;
  cancelText?: string;
  title: React.ReactNode;
  trigger?: React.ReactNode;
  onOk?: React.MouseEventHandler<HTMLButtonElement>;
  onCancel?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
const Modal = ({
  className,
  children,
  description,
  footer,
  okText,
  okLoading,
  okButtonProps,
  title,
  trigger,
  onOk,
  onCancel,
  // onOpenChange,
  //
  ...rest
}: ModalProps) => {
  // const CancelBtn = () => (
  //   <DialogClose asChild onClick={onCancel}>
  //     <Button variant="outline">Cancel</Button>
  //   </DialogClose>
  // );
  // const OkBtn = useMemo(
  //   () => () => (
  //     <Button loading={okLoading} onClick={onOk}>
  //       {okText ?? "Ok"}
  //     </Button>
  //   ),
  //   [okLoading, okText, onOk],
  // );
  const footerToRender = footer ? (
    typeof footer === "function" ? (
      footer({
        originNode: undefined,
        extra: {
          OkBtn: (
            <Button loading={okLoading} onClick={onOk} {...okButtonProps}>
              {okText ?? "Ok"}
            </Button>
          ),
          CancelBtn: (
            <DialogClose asChild onClick={onCancel}>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          ),
        },
      })
    ) : (
      footer
    )
  ) : (
    <>
      {/* <CancelBtn /> */}
      <DialogClose asChild onClick={onCancel}>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button loading={okLoading} onClick={onOk} {...okButtonProps}>
        {okText ?? "Ok"}
      </Button>
    </>
  );

  // ??
  // const ref = React.useRef<HTMLDivElement>(null);
  // ref.current?.scrollTo(0, ref.current.scrollHeight);
  return (
    <DialogRoot
      {...rest}
      onOpenChange={(isOpen) => {
        rest.onOpenChange?.(isOpen);
        if (!isOpen) {
          onCancel?.();
        }
      }}
    >
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : undefined}

      <DialogContent className={cn("px-0", className)}>
        <DialogHeader className="px-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] px-5 *:data-radix-scroll-area-viewport:px-1 [&>[data-radix-scroll-area-viewport]>div]:block!">
          {children}
        </ScrollArea>

        <DialogFooter className="px-6">{footerToRender}</DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
export { Modal };

export { type ModalProps };
