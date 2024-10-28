"use client";

import * as React from "react";

import { removeVietnameseTones } from "@acme/utils/remove-vietnamese-tones";

import type { ButtonProps } from "../button";
import type { CommandProps } from "../command";
import type { ValueType } from "../form";
import type { Option } from "../select/types";
import { cn } from "..";
import { Button } from "../button";
import { Command } from "../command";
import { Icon } from "../icons";
import { Popover } from "../popover";

export type AutoCompleteProps<T extends ValueType = string> = Pick<
  CommandProps<T>,
  | "value"
  | "filter"
  | "placeholder"
  | "empty"
  | "groupClassName"
  | "optionRender"
  | "optionsRender"
> & {
  options: Option<T>[];
  optionsToSearch?: { value: string; label: string }[];

  className?: string;
  size?: ButtonProps["size"];
  disabled?: boolean;

  allowClear?: boolean;

  onChange?: (value?: T) => void;
  onSearchChange?: (search: string) => void;

  dropdownRender?: (originalNode: React.ReactNode) => React.ReactNode;
};

const AutoCompleteInner = <T extends ValueType = string>(
  {
    value,
    options,
    optionsToSearch,

    className,
    size,
    disabled,

    filter = (value, search, _) => {
      const label = (optionsToSearch ?? options)
        .find((item) => item.value === value)
        ?.label?.toString();
      if (
        label &&
        removeVietnameseTones(label.toLowerCase()).includes(
          removeVietnameseTones(search.toLowerCase()),
        )
      ) {
        return 1;
      }
      return 0;
    },

    placeholder,

    allowClear,

    onChange,
    onSearchChange,

    dropdownRender,

    ...props
  }: AutoCompleteProps<T>,
  _: React.ForwardedRef<HTMLInputElement>,
) => {
  const [open, setOpen] = React.useState(false);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const buttonText = (() => {
    if (!value) {
      return placeholder ?? <span className="opacity-0"></span>;
    }
    const o = options.find((o) => o.value === value);
    if (o) {
      const label = props.optionRender?.label
        ? props.optionRender.label(o)
        : o.label;
      return (
        <>
          {props.optionRender?.icon ? (
            <span className="mr-2">{props.optionRender.icon(o)}</span>
          ) : (
            o.icon && <Icon icon={o.icon} />
          )}
          {typeof label === "string" ? (
            <span className="truncate">{label}</span>
          ) : (
            label
          )}
        </>
      );
    }
    return "";
  })();

  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      className="p-0"
      style={{ width: buttonRef.current?.offsetWidth }}
      content={
        <Command
          value={value}
          options={options.map((o) => ({
            ...o,
            onSelect: () => {
              onChange?.(o.value);
              setOpen(false);
            },
          }))}
          onSearchChange={onSearchChange}
          filter={filter}
          dropdownRender={dropdownRender}
          {...props}
        />
      }
    >
      <Button
        size={size}
        ref={buttonRef}
        variant="outline"
        role="combobox"
        disabled={disabled}
        aria-expanded={open}
        className={cn(
          "w-full justify-between text-sm font-normal",
          !value && "text-muted-foreground",
          className,
        )}
      >
        {buttonText}
        <Icon
          icon="icon-[lucide--chevrons-up-down]"
          className="ml-2 size-4 shrink-0 opacity-50"
        />
        {allowClear && (
          <button
            className={cn(
              "z-10",
              "absolute right-[11px]",
              "flex size-5 items-center justify-center transition-opacity",
              "opacity-0",
              "hover:!opacity-50",
              value && "group-hover:opacity-30",
            )}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // onClear();
              onChange?.();
              // setOpen(false);
            }}
          >
            <Icon
              icon="icon-[ant-design--close-circle-filled]"
              className="pointer-events-none size-3.5"
            />
          </button>
        )}
      </Button>
    </Popover>
  );
};

export const Autocomplete = React.forwardRef(AutoCompleteInner) as <
  T extends ValueType,
>(
  props: AutoCompleteProps<T> & {
    ref?: React.ForwardedRef<HTMLUListElement>;
  },
) => ReturnType<typeof AutoCompleteInner>;
