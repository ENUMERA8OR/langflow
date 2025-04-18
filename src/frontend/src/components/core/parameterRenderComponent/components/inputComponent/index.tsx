import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { Input } from "@/components/ui/input";
import { ICON_STROKE_WIDTH } from "@/constants/constants";
import { InputComponentType } from "@/types/components";
import { handleKeyDown } from "@/utils/reactflowUtils";
import { classNames, cn } from "@/utils/utils";
import * as Form from "@radix-ui/react-form";
import { useEffect, useRef, useState } from "react";
import { getIconName } from "./components/helpers/get-icon-name";
import CustomInputPopover from "./components/popover";
import CustomInputPopoverObject from "./components/popoverObject";

export default function InputComponent({
  autoFocus = false,
  onBlur,
  value = "",
  onChange,
  disabled,
  required = false,
  isForm = false,
  password,
  editNode = false,
  placeholder = "Type something...",
  className,
  id = "",
  blurOnEnter = false,
  optionsIcon = "ChevronsUpDown",
  selectedOption,
  setSelectedOption,
  selectedOptions = [],
  setSelectedOptions,
  options = [],
  optionsPlaceholder = "Search options...",
  optionsButton,
  optionButton,
  objectOptions,
  isObjectOption = false,
  name,
  onChangeFolderName,
  nodeStyle,
  isToolMode,
  popoverWidth,
  commandWidth,
  blockAddNewGlobalVariable = false,
  hasRefreshButton = false,
}: InputComponentType): JSX.Element {
  const [pwdVisible, setPwdVisible] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  useEffect(() => {
    if (disabled && value && onChange && value !== "") {
      onChange("", true);
    }
  }, [disabled]);

  function onInputLostFocus(event): void {
    if (onBlur) onBlur(event);
  }

  return (
    <div className="relative w-full">
      {isForm ? (
        <Form.Control asChild>
          <Input
            name={name}
            id={"form-" + id}
            ref={refInput}
            onBlur={onInputLostFocus}
            autoFocus={autoFocus}
            type={password && !pwdVisible ? "password" : "text"}
            value={value}
            disabled={disabled}
            required={required}
            className={classNames(
              password && !pwdVisible && value !== ""
                ? "password text-clip"
                : "",
              editNode ? "input-edit-node" : "",
              password && editNode ? "pr-8" : "",
              password && !editNode ? "pr-10" : "",
              className!,
            )}
            placeholder={password && editNode ? "Key" : placeholder}
            onChange={(e) => {
              if (onChangeFolderName) {
                return onChangeFolderName(e);
              }
              onChange && onChange(e.target.value);
            }}
            onCopy={(e) => {
              e.preventDefault();
            }}
            onKeyDown={(e) => {
              handleKeyDown(e, value, "");
              if (blurOnEnter && e.key === "Enter") refInput.current?.blur();
            }}
          />
        </Form.Control>
      ) : (
        <>
          {isObjectOption ? (
            // Content to render when isObjectOption is true
            <CustomInputPopoverObject
              refInput={refInput}
              handleKeyDown={handleKeyDown}
              optionButton={optionButton}
              optionsButton={optionsButton}
              showOptions={showOptions}
              onChange={onChange}
              id={`object-${id}`}
              onInputLostFocus={onInputLostFocus}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              options={objectOptions}
              value={value}
              editNode={editNode}
              autoFocus={autoFocus}
              disabled={disabled}
              setShowOptions={setShowOptions}
              required={required}
              placeholder={placeholder}
              blurOnEnter={blurOnEnter}
              optionsPlaceholder={optionsPlaceholder}
              className={className}
            />
          ) : (
            <CustomInputPopover
              refInput={refInput}
              handleKeyDown={handleKeyDown}
              optionButton={optionButton}
              optionsButton={optionsButton}
              showOptions={showOptions}
              onChange={onChange}
              id={`popover-anchor-${id}`}
              onInputLostFocus={onInputLostFocus}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              value={value}
              autoFocus={autoFocus}
              disabled={disabled}
              setShowOptions={setShowOptions}
              required={required}
              password={password}
              pwdVisible={pwdVisible}
              editNode={editNode}
              placeholder={placeholder}
              blurOnEnter={blurOnEnter}
              options={options}
              optionsPlaceholder={optionsPlaceholder}
              nodeStyle={nodeStyle}
              popoverWidth={popoverWidth}
              commandWidth={commandWidth}
              blockAddNewGlobalVariable={blockAddNewGlobalVariable}
              hasRefreshButton={hasRefreshButton}
            />
          )}
        </>
      )}

      {(setSelectedOption || setSelectedOptions) &&
        !blockAddNewGlobalVariable && (
          <span
            className={cn(
              password && selectedOption === "" ? "right-8" : "right-0",
              "absolute inset-y-0 flex items-center pr-2.5",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <button
              disabled={disabled}
              onClick={(e) => {
                if (disabled) return;
                setShowOptions(!showOptions);
                e.preventDefault();
                e.stopPropagation();
              }}
              className={cn(
<<<<<<< HEAD
                disabled ? "text-placeholder cursor-grab" : "cursor-pointer",
                "icon-size",
=======
                onChange && setSelectedOption && selectedOption !== ""
                  ? "text-accent-emerald-foreground"
                  : "text-placeholder-foreground",
                !disabled && "hover:text-foreground",
>>>>>>> dc35b4ec9ed058b980c89065484fdbfc1fd4cc9b
              )}
            >
              <ForwardedIconComponent
                name={
                  getIconName(
                    disabled!,
                    selectedOption!,
                    optionsIcon,
                    nodeStyle!,
                    isToolMode!,
                  ) || "ChevronsUpDown"
                }
                className={cn(
                  disabled ? "cursor-grab text-placeholder" : "cursor-pointer",
                  "icon-size",
                )}
                strokeWidth={ICON_STROKE_WIDTH}
                aria-hidden="true"
              />
            </button>
          </span>
        )}

      {password && (!setSelectedOption || selectedOption === "") && (
        <button
          type="button"
          tabIndex={-1}
          className={classNames(
            "mr-3 mb-px p-0",
            editNode
              ? "input-component-true-button"
              : "input-component-false-button",
          )}
          onClick={(event) => {
            event.preventDefault();
            setPwdVisible(!pwdVisible);
          }}
        >
          {pwdVisible ? (
            <ForwardedIconComponent
              name="Eye"
              className="text-placeholder-foreground hover:text-foreground relative top-[1px] h-5 w-5"
            />
          ) : (
            <ForwardedIconComponent
              name="EyeOff"
              className="text-placeholder-foreground hover:text-foreground relative top-[1px] h-5 w-5"
            />
          )}
        </button>
      )}
    </div>
  );
}
