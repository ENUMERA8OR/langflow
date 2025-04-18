import ShadTooltip from "@/components/common/shadTooltipComponent";
import { track } from "@/customization/utils/analytics";
import { Panel } from "@xyflow/react";
import { useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ShareModal from "../../../modals/shareModal";
import useFlowStore from "../../../stores/flowStore";
import { useShortcutsStore } from "../../../stores/shortcuts";
import { useStoreStore } from "../../../stores/storeStore";
import { classNames, cn, isThereModal } from "../../../utils/utils";
import ForwardedIconComponent from "../../common/genericIconComponent";
import FlowToolbarOptions from "./components/flow-toolbar-options";

export default function FlowToolbar(): JSX.Element {
  const preventDefault = true;
  const [open, setOpen] = useState<boolean>(false);
  const [openCodeModal, setOpenCodeModal] = useState<boolean>(false);
  const [openShareModal, setOpenShareModal] = useState<boolean>(false);
  function handleAPIWShortcut(e: KeyboardEvent) {
    if (isThereModal() && !openCodeModal) return;
    setOpenCodeModal((oldOpen) => !oldOpen);
  }

  function handleChatWShortcut(e: KeyboardEvent) {
    if (isThereModal() && !open) return;
    if (useFlowStore.getState().hasIO) {
      setOpen((oldState) => !oldState);
    }
  }

  function handleShareWShortcut(e: KeyboardEvent) {
    if (isThereModal() && !openShareModal) return;
    setOpenShareModal((oldState) => !oldState);
  }

  const openPlayground = useShortcutsStore((state) => state.openPlayground);
  const api = useShortcutsStore((state) => state.api);
  const flow = useShortcutsStore((state) => state.flow);

  useHotkeys(openPlayground, handleChatWShortcut, { preventDefault });
  useHotkeys(api, handleAPIWShortcut, { preventDefault });
  useHotkeys(flow, handleShareWShortcut, { preventDefault });

  const hasIO = useFlowStore((state) => state.hasIO);
  const hasStore = useStoreStore((state) => state.hasStore);
  const validApiKey = useStoreStore((state) => state.validApiKey);
  const hasApiKey = useStoreStore((state) => state.hasApiKey);
  const currentFlow = useFlowStore((state) => state.currentFlow);

  useEffect(() => {
    if (open) {
      track("Playground Button Clicked");
    }
  }, [open]);

  const ModalMemo = useMemo(
    () => (
      <ShareModal
        is_component={false}
        component={currentFlow!}
        disabled={!hasApiKey || !validApiKey || !hasStore}
        open={openShareModal}
        setOpen={setOpenShareModal}
      >
        <ShadTooltip
          content={
            !hasApiKey || !validApiKey || !hasStore
              ? "Store API Key Required"
              : ""
          }
          side="bottom"
          align="end"
        >
          <button
            disabled={!hasApiKey || !validApiKey || !hasStore}
            className={classNames(
              "text-foreground relative inline-flex h-8 w-full items-center justify-center gap-1.5 rounded px-3 py-1.5 text-sm font-semibold transition-all duration-150 ease-in-out",
              !hasApiKey || !validApiKey || !hasStore
                ? "text-muted-foreground cursor-not-allowed"
                : "hover:bg-accent",
            )}
            data-testid="shared-button-flow"
            onClick={() => {
              setOpenShareModal(true);
            }}
          >
            <>
              <ForwardedIconComponent
                name="Share2"
                className={classNames(
                  "h-4 w-4",
                  !hasApiKey || !validApiKey || !hasStore
                    ? "extra-side-bar-save-disable"
                    : "",
                )}
              />
              <span className="hidden md:block">Share</span>
            </>
          </button>
        </ShadTooltip>
      </ShareModal>
    ),
    [
      hasApiKey,
      validApiKey,
      currentFlow,
      hasStore,
      openShareModal,
      setOpenShareModal,
    ],
  );

  return (
    <>
      <Panel className="!m-2" position="top-right">
        <div
<<<<<<< HEAD
          className={
            "hover:shadow-round-btn-shadow bg-background flex items-center justify-center gap-7 rounded-md border p-1.5 shadow transition-all"
          }
        >
          <div className="flex gap-1.5">
            <div className="flex h-full w-full gap-1.5 rounded-sm transition-all">
              <PlaygroundButton
                hasIO={hasIO}
                open={open}
                setOpen={setOpen}
                canvasOpen
              />
            </div>
            {ENABLE_API && (
              <>
                <div
                  className="flex cursor-pointer items-center gap-2"
                  data-testid="api_button_modal"
                  id="api_button_modal"
                >
                  {currentFlow && currentFlow.data && (
                    <ApiModal
                      flow={currentFlow}
                      open={openCodeModal}
                      setOpen={setOpenCodeModal}
                    >
                      <div
                        className={classNames(
                          "text-foreground hover:bg-accent relative inline-flex h-8 w-full items-center justify-center gap-1.5 rounded px-3 py-1.5 text-sm font-semibold transition-all duration-150 ease-in-out",
                        )}
                      >
                        <ForwardedIconComponent
                          name="Code2"
                          className={"h-4 w-4"}
                        />
                        <span className="hidden md:block">API</span>
                      </div>
                    </ApiModal>
                  )}
                </div>
              </>
            )}
            {ENABLE_LANGFLOW_STORE && (
              <div className="flex items-center gap-2">
                <div
                  className={`side-bar-button ${
                    !hasApiKey || !validApiKey || !hasStore
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {ModalMemo}
                </div>
              </div>
            )}
          </div>
=======
          className={cn(
            "hover:shadow-round-btn-shadow flex h-11 items-center justify-center gap-7 rounded-md border bg-background px-1.5 shadow transition-all",
          )}
        >
          <FlowToolbarOptions />
>>>>>>> dc35b4ec9ed058b980c89065484fdbfc1fd4cc9b
        </div>
      </Panel>
    </>
  );
}
