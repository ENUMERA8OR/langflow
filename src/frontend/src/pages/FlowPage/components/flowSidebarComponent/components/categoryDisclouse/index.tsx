import { ForwardedIconComponent } from "@/components/common/genericIconComponent";
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "@/components/ui/disclosure";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { APIClassType } from "@/types/api";
import { memo, useCallback } from "react";
import SidebarItemsList from "../sidebarItemsList";

export const CategoryDisclosure = memo(function CategoryDisclosure({
  item,
  openCategories,
  setOpenCategories,
  dataFilter,
  nodeColors,
  uniqueInputsComponents,
  onDragStart,
  sensitiveSort,
}: {
  item: any;
  openCategories: string[];
  setOpenCategories;
  dataFilter: any;
  nodeColors: any;
  uniqueInputsComponents: {
    chatInput: boolean;
    webhookInput: boolean;
  };
  onDragStart: (
    event: React.DragEvent<any>,
    data: { type: string; node?: APIClassType },
  ) => void;
  sensitiveSort: (a: any, b: any) => number;
}) {
  const handleKeyDownInput = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpenCategories((prev) =>
          prev.includes(item.name)
            ? prev.filter((cat) => cat !== item.name)
            : [...prev, item.name],
        );
      }
    },
    [item.name, setOpenCategories],
  );

  return (
    <Disclosure
      open={openCategories.includes(item.name)}
      onOpenChange={(isOpen) => {
        setOpenCategories((prev) =>
          isOpen
            ? [...prev, item.name]
            : prev.filter((cat) => cat !== item.name),
        );
      }}
    >
      <SidebarMenuItem>
        <DisclosureTrigger className="group/collapsible">
          <SidebarMenuButton asChild>
            <div
              data-testid={`disclosure-${item.display_name.toLocaleLowerCase()}`}
              tabIndex={0}
              onKeyDown={handleKeyDownInput}
              className="flex cursor-pointer items-center gap-2"
            >
              <ForwardedIconComponent
                name={item.icon}
                className="group-aria-expanded/collapsible:text-accent-pink-foreground h-4 w-4"
              />
              <span className="flex-1 group-aria-expanded/collapsible:font-semibold">
                {item.display_name}
              </span>
              <ForwardedIconComponent
                name="ChevronRight"
                className="text-muted-foreground -mr-1 h-4 w-4 transition-all group-aria-expanded/collapsible:rotate-90"
              />
            </div>
          </SidebarMenuButton>
        </DisclosureTrigger>
        <DisclosureContent>
          <SidebarItemsList
            item={item}
            dataFilter={dataFilter}
            nodeColors={nodeColors}
            uniqueInputsComponents={uniqueInputsComponents}
            onDragStart={onDragStart}
            sensitiveSort={sensitiveSort}
          />
        </DisclosureContent>
      </SidebarMenuItem>
    </Disclosure>
  );
});

CategoryDisclosure.displayName = "CategoryDisclosure";
