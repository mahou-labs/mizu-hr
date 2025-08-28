import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

function Root(props: ComponentProps<typeof BaseTabs.Root>) {
  return <BaseTabs.Root {...props} className={cn("", props.className)} />;
}

function List(props: ComponentProps<typeof BaseTabs.List>) {
  return <BaseTabs.List {...props} className={cn("", props.className)} />;
}

function Tab(props: ComponentProps<typeof BaseTabs.Tab>) {
  return <BaseTabs.Tab {...props} className={cn("", props.className)} />;
}

function Indicator(props: ComponentProps<typeof BaseTabs.Indicator>) {
  return <BaseTabs.Indicator {...props} className={cn("", props.className)} />;
}

function Panel(props: ComponentProps<typeof BaseTabs.Panel>) {
  return <BaseTabs.Panel {...props} className={cn("", props.className)} />;
}

export const Tabs = {
  Root,
  List,
  Tab,
  Indicator,
  Panel,
};
