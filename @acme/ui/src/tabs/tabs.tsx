"use client";

import * as React from "react";

import type {
  TabsListProps,
  TabsRootProps,
  TabsTriggerProps,
} from "./_components";
import type { TabsType } from "./types";
import { cn } from "..";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "./_components";

type TabBarExtraMap = { left?: React.ReactNode; right?: React.ReactNode };
type TabItemDef = {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
};
type TabsProps = Omit<
  TabsRootProps,
  "defaultValue" | "onValueChange" | "onChange"
> & {
  type?: TabsType;
  classNames?: {
    root?: string;
    list?: string;
    trigger?: string;
  };
  /**
   * Initial active TabPane's key, if activeKey is not set
   */
  defaultActiveKey?: TabsRootProps["defaultValue"];
  activeKey?: TabsRootProps["value"];
  items: TabItemDef[];
  onChange?: (activeKey: string) => void;

  /**
   * Extras content (left|right)
   */
  tabBarExtraContent?: React.ReactNode | TabBarExtraMap;

  // styles
  // list
  listProps?: TabsListProps;
  triggerProps?: Omit<TabsTriggerProps, "value">;
};
const Tabs = ({
  type = "line",
  className,
  classNames,

  defaultActiveKey,
  activeKey,
  items,
  onChange,
  tabBarExtraContent,
  listProps,
  triggerProps,
  ...props
}: TabsProps) => {
  // Parse extra
  let assertExtra: TabBarExtraMap = {};
  if (
    typeof tabBarExtraContent === "object" &&
    !React.isValidElement(tabBarExtraContent)
  ) {
    assertExtra = tabBarExtraContent as TabBarExtraMap;
  } else {
    assertExtra.right = tabBarExtraContent;
  }

  return (
    <>
      <TabsRoot
        defaultValue={defaultActiveKey}
        value={activeKey}
        onValueChange={onChange}
        className={cn("w-full", className)}
        {...props}
      >
        <TabsList type={type} className={classNames?.list} {...listProps}>
          {assertExtra.left && <div className="mr-4">{assertExtra.left}</div>}
          {items.map((x) => (
            <TabsTrigger
              key={x.key}
              value={x.key}
              tabsType={type}
              className={classNames?.trigger}
              {...triggerProps}
            >
              {x.label}
            </TabsTrigger>
          ))}
          {assertExtra.right && (
            <div className="ml-auto">{assertExtra.right}</div>
          )}
        </TabsList>

        {items.map((x) => (
          <TabsContent key={x.key} value={x.key}>
            {x.children}
          </TabsContent>
        ))}
      </TabsRoot>
    </>
  );
};

export { Tabs };
export type { TabsProps, TabItemDef };
