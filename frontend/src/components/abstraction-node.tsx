/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { Input } from "./ui/input";
import { Check, ChevronsUpDown, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Textarea } from "./ui/textarea";

export interface HandleConfig {
  type: "source" | "target";
  position: Position;
  id: string;
  label?: string;
  style?: React.CSSProperties;
  customNode?: boolean;
}

interface TextInputConfig {
  type: "text";
  id: string;
  label: string;
  initValue?: null | string;
}

interface SelectInputConfig {
  type: "select";
  id: string;
  label: string;
  options: { value: string; label: string }[];
  initValue?: null | string;
}

export type InputConfig = TextInputConfig | SelectInputConfig;

interface AbstractionNodeProps {
  id: string;
  label: string;
  inputs: InputConfig[];
  handles: HandleConfig[];
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  children?: React.ReactNode;
  setHandles: React.Dispatch<React.SetStateAction<HandleConfig[]>>;
}

const AbstractionNode: React.FC<AbstractionNodeProps> = ({
  id,
  label,
  inputs,
  handles,
  icon: Icon,
  children,
  setHandles,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const updateNodeInternals = useUpdateNodeInternals();

  const initializeValues = () => {
    const initialValues: { [key: string]: string } = {};
    inputs.forEach((input) => {
      if (input.initValue) {
        initialValues[input.id] = input.initValue;
      }
    });
    return initialValues;
  };

  const [values, setValues] = useState<{ [key: string]: string }>(
    initializeValues
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  const [isFocused, setIsFocused] = useState(false);

  const selectInputId = inputs.find((input) => input.type == "select")?.id;
  const textInputId = inputs.find((input) => input.type == "text")?.id;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (
      values[selectInputId!] === "Text" ||
      (!values[selectInputId!] && textInputId)
    ) {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }

      const regex = /\{\{(.*?)\}\}/g;
      const matches = [...values[textInputId!].matchAll(regex)].map(
        (match) => match[1]
      );

      for (const match of matches) {
        if (!handles.find((handle) => handle.label == match))
          handles.push({
            type: "target",
            position: Position.Left,
            id: `${handles.length + 1}-output`,
            label: match,
            customNode: true,
          });
      }

      handles = handles.filter((handle) => {
        if (
          handle.label &&
          handle.customNode &&
          !matches.includes(handle.label)
        )
          return null;
        return handle;
      });

      // if (matches.length > 0) {
      const leftHandles = handles.filter((handle) => handle.position == "left");
      const rightHandles = handles.filter(
        (handle) => handle.position == "right"
      );

      const containerHeight = containerRef.current?.clientHeight || 200;
      const leftSpacing = containerHeight / (leftHandles.length + 1);
      const rightSpacing = containerHeight / (rightHandles.length + 1);

      leftHandles.forEach((handle, index) => {
        handle.style = { top: `${leftSpacing * (index + 1)}px` };
      });

      rightHandles.forEach((handle, index) => {
        handle.style = { top: `${rightSpacing * (index + 1)}px` };
      });

      setHandles([...leftHandles, ...rightHandles]);

      // Trigger node update
      updateNodeInternals(id);
      // }
    }
  }, [
    selectInputId,
    values,
    textareaRef,
    textInputId,
    setHandles,
    handles,
    updateNodeInternals,
    id,
  ]);

  return (
    <div
      ref={containerRef}
      className={`border border-purple-400 py-2 px-5 rounded-md bg-white ${
        isFocused && "shadow-glow"
      }`}
      style={{ position: "relative" }}
    >
      {handles.map((handle) => (
        <div key={handle.id} className="flex items-center">
          <Handle
            type={handle.type}
            position={handle.position}
            id={handle.id}
            style={{ ...handle.style }}
            className="bg-purple-800 size-2 ring-2 ring-purple-300"
          />
          {handle.label && (
            <span
              style={handle.style}
              className={`ml-2 text-sm text-purple-700 absolute ${
                handle.position == "right" ? "" : "-left-20"
              }`}
            >
              {handle.label}
            </span>
          )}
        </div>
      ))}
      <div className="mb-5 text-purple-700 flex items-center gap-x-2">
        <Icon className="size-3" />
        <span>{label}</span>
      </div>
      <div>{children}</div>
      <div className="flex flex-col gap-y-4">
        {inputs.map((input) => {
          switch (input.type) {
            case "text":
              return (
                <div key={input.id}>
                  <span className="text-purple-700 text-sm">{input.label}</span>
                  <div className="flex flex-wrap gap-2">
                    {values[selectInputId!] === "File" ? (
                      <Input
                        type={"file"}
                        id={input.id}
                        value={values[input.id] || ""}
                        onChange={handleInputChange}
                        className="mt-2"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                    ) : (
                      <Textarea
                        ref={textareaRef}
                        rows={1}
                        className="mt-2 resize-none min-h-9 overflow-hidden"
                        id={input.id}
                        value={values[input.id] || ""}
                        onChange={handleInputChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                    )}
                  </div>
                </div>
              );
            case "select":
              return (
                <div key={input.id} className="flex flex-col">
                  <span className="text-purple-700 text-sm mb-2">
                    {input.label}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal"
                      >
                        {values[input.id] ? values[input.id] : "Select option"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {input.options.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => {
                            if (option.value === "File") {
                              setValues((prevValues) => ({
                                ...prevValues,
                                [textInputId!]: "",
                              }));
                            }

                            setValues((prevValues) => ({
                              ...prevValues,
                              [input.id]: option.value,
                            }));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              values[input.id] === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default AbstractionNode;
