import { usePostUploadFile } from "@/controllers/API/queries/files/use-post-upload-file";
import useFileSizeValidator from "@/shared/hooks/use-file-size-validator";
import useAlertStore from "@/stores/alertStore";
import useFlowStore from "@/stores/flowStore";
import { useUtilityStore } from "@/stores/utilityStore";
import { useVoiceStore } from "@/stores/voiceStore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ShortUniqueId from "short-unique-id";
import {
  ALLOWED_IMAGE_INPUT_EXTENSIONS,
  FS_ERROR_TEXT,
  SN_ERROR_TEXT,
} from "../../../../../constants/constants";
import useFlowsManagerStore from "../../../../../stores/flowsManagerStore";
import {
  ChatInputType,
  FilePreviewType,
} from "../../../../../types/components";
import InputWrapper from "./components/input-wrapper";
import NoInputView from "./components/no-input";
import { VoiceAssistant } from "./components/voice-assistant/voice-assistant";
import useAutoResizeTextArea from "./hooks/use-auto-resize-text-area";
import useFocusOnUnlock from "./hooks/use-focus-unlock";

export default function ChatInput({
  sendMessage,
  inputRef,
  noInput,
  files,
  setFiles,
  isDragging,
  playgroundPage,
}: ChatInputType): JSX.Element {
  const currentFlowId = useFlowsManagerStore((state) => state.currentFlowId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setErrorData = useAlertStore((state) => state.setErrorData);
  const { validateFileSize } = useFileSizeValidator();
  const stopBuilding = useFlowStore((state) => state.stopBuilding);
  const isBuilding = useFlowStore((state) => state.isBuilding);
  const chatValue = useUtilityStore((state) => state.chatValueStore);

  const [showAudioInput, setShowAudioInput] = useState(false);

  const setIsVoiceAssistantActive = useVoiceStore(
    (state) => state.setIsVoiceAssistantActive,
  );

  const newSessionCloseVoiceAssistant = useVoiceStore(
    (state) => state.newSessionCloseVoiceAssistant,
  );

  useEffect(() => {
    if (showAudioInput) {
      setIsVoiceAssistantActive(true);
    }
  }, [showAudioInput]);

  useFocusOnUnlock(isBuilding, inputRef);
  useAutoResizeTextArea(chatValue, inputRef);

  const { mutate } = usePostUploadFile();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement> | ClipboardEvent,
  ) => {
    if (playgroundPage) {
      return;
    }

    let file: File | null = null;

    if ("clipboardData" in event) {
      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const blob = items[i].getAsFile();
          if (blob) {
            file = blob;
            break;
          }
        }
      }
    } else {
      const fileInput = event.target as HTMLInputElement;
      file = fileInput.files?.[0] ?? null;
    }
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      try {
        validateFileSize(file);
      } catch (e) {
        if (e instanceof Error) {
          setErrorData({
            title: e.message,
          });
        }
        return;
      }

      if (
        !fileExtension ||
        !ALLOWED_IMAGE_INPUT_EXTENSIONS.includes(fileExtension)
      ) {
        setErrorData({
          title: "Error uploading file",
          list: [FS_ERROR_TEXT, SN_ERROR_TEXT],
        });
        return;
      }

      const uid = new ShortUniqueId();
      const id = uid.randomUUID(10);

      const type = file.type.split("/")[0];

      setFiles((prevFiles) => [
        ...prevFiles,
        { file, loading: true, error: false, id, type },
      ]);

      mutate(
        { file, id: currentFlowId },
        {
          onSuccess: (data) => {
            setFiles((prev) => {
              const newFiles = [...prev];
              const updatedIndex = newFiles.findIndex((file) => file.id === id);
              newFiles[updatedIndex].loading = false;
              newFiles[updatedIndex].path = data.file_path;
              return newFiles;
            });
          },
          onError: (error) => {
            setFiles((prev) => {
              const newFiles = [...prev];
              const updatedIndex = newFiles.findIndex((file) => file.id === id);
              newFiles[updatedIndex].loading = false;
              newFiles[updatedIndex].error = true;
              return newFiles;
            });
            setErrorData({
              title: "Error uploading file",
              list: [error.response?.data?.detail],
            });
          },
        },
      );
    }

    if ("target" in event && event.target instanceof HTMLInputElement) {
      event.target.value = "";
    }
  };

  useEffect(() => {
    document.addEventListener("paste", handleFileChange);
    return () => {
      document.removeEventListener("paste", handleFileChange);
    };
  }, [handleFileChange, currentFlowId, isBuilding]);

  const send = () => {
    sendMessage({
      repeat: 1,
      files: files.map((file) => file.path ?? "").filter((file) => file !== ""),
    });
    setFiles([]);
  };

  const checkSendingOk = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    return (
      event.key === "Enter" &&
      !isBuilding &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    );
  };

  const handleButtonClick = () => {
    fileInputRef.current!.click();
  };

  const handleDeleteFile = (file: FilePreviewType) => {
    setFiles((prev: FilePreviewType[]) => prev.filter((f) => f.id !== file.id));
    // TODO: delete file on backend
  };

  if (noInput) {
    return (
<<<<<<< HEAD
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="border-input bg-muted flex w-full flex-col items-center justify-center gap-3 rounded-md border p-2 py-4">
          {!isBuilding ? (
            <Button
              data-testid="button-send"
              className="font-semibold"
              onClick={() => {
                sendMessage({
                  repeat: 1,
                });
              }}
            >
              Run Flow
            </Button>
          ) : (
            <Button
              onClick={stopBuilding}
              data-testid="button-stop"
              unstyled
              className="form-modal-send-button bg-muted text-foreground hover:bg-secondary-hover dark:hover:bg-input cursor-pointer"
            >
              <div className="flex items-center gap-2 rounded-md text-[14px] font-medium">
                Stop
                <Loading className="h-[16px] w-[16px]" />
              </div>
            </Button>
          )}

          <p className="text-muted-foreground">
            Add a{" "}
            <a
              className="underline underline-offset-4"
              target="_blank"
              href="https://docs.langflow.org/components-io#chat-input"
            >
              Chat Input
            </a>{" "}
            component to your flow to send messages.
          </p>
        </div>
      </div>
=======
      <NoInputView
        isBuilding={isBuilding}
        sendMessage={sendMessage}
        stopBuilding={stopBuilding}
      />
>>>>>>> dc35b4ec9ed058b980c89065484fdbfc1fd4cc9b
    );
  }

  return (
<<<<<<< HEAD
    <div className="flex w-full flex-col-reverse">
      <div className="border-input hover:border-muted-foreground has-[:focus]:border-primary flex w-full flex-col rounded-md border p-4 focus:border-[1.75px]">
        <TextAreaWrapper
          isBuilding={isBuilding}
          checkSendingOk={checkSendingOk}
          send={send}
          noInput={noInput}
          chatValue={chatValue}
          CHAT_INPUT_PLACEHOLDER={CHAT_INPUT_PLACEHOLDER}
          CHAT_INPUT_PLACEHOLDER_SEND={CHAT_INPUT_PLACEHOLDER_SEND}
          inputRef={inputRef}
          files={files}
          isDragging={isDragging}
        />
        <div className={classNameFilePreview}>
          {files.map((file) => (
            <FilePreview
              error={file.error}
              file={file.file}
              loading={file.loading}
              key={file.id}
              onDelete={() => {
                handleDeleteFile(file);
              }}
            />
          ))}
        </div>
        <div className="flex w-full items-end justify-between">
          <div className={isBuilding ? "cursor-not-allowed" : ""}>
            <UploadFileButton
              isBuilding={isBuilding}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              handleButtonClick={handleButtonClick}
            />
          </div>
          <div className="">
            <ButtonSendWrapper
              send={send}
              noInput={noInput}
              chatValue={chatValue}
              files={files}
            />
          </div>
        </div>
      </div>
    </div>
=======
    <AnimatePresence mode="wait">
      {showAudioInput && !newSessionCloseVoiceAssistant ? (
        <motion.div
          key="voice-assistant"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <VoiceAssistant
            flowId={currentFlowId}
            setShowAudioInput={setShowAudioInput}
          />
        </motion.div>
      ) : (
        <motion.div
          key="input-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <InputWrapper
            isBuilding={isBuilding}
            checkSendingOk={checkSendingOk}
            send={send}
            noInput={noInput}
            chatValue={chatValue}
            inputRef={inputRef}
            files={files}
            isDragging={isDragging}
            handleDeleteFile={handleDeleteFile}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            handleButtonClick={handleButtonClick}
            setShowAudioInput={setShowAudioInput}
            currentFlowId={currentFlowId}
            playgroundPage={playgroundPage}
          />
        </motion.div>
      )}
    </AnimatePresence>
>>>>>>> dc35b4ec9ed058b980c89065484fdbfc1fd4cc9b
  );
}
