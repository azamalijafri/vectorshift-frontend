import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { useStore } from "@/store";
import { Checkbox } from "./ui/checkbox";
import TextInput from "@/components/inputs/text-input";
import FileInput from "@/components/inputs/file-input";
import SelectInput from "@/components/inputs/select-input";
import {
  createDependencyMap,
  findKeyByValue,
  initializeValues,
} from "@/lib/utils";
import { LucideProps } from "lucide-react";

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

  const dependencyMap = createDependencyMap(inputs as TextInputConfig[]);
  const [values, setValues] = useState<{
    [key: string]: string | boolean | null;
  }>(initializeValues(inputs));
  const [isFocused, setIsFocused] = useState(false);
  const { edges } = useStore();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    type: "text" | "file"
  ) => {
    const { id, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));

    if (type === "text") {
      updateHandles(id, value);
    }
  };

  const updateHandles = (id: string, value: string) => {
    const regex = /\{\{(.*?)\}\}/g;
    const matches = [...(value as string).matchAll(regex)].map(
      (match) => match[1]
    );

    const newHandles = [...handles];
    for (const match of matches) {
      if (!newHandles.find((handle) => handle.label === match)) {
        newHandles.push({
          type: "target",
          position: Position.Left,
          id: `${newHandles.length + 1}-output`,
          label: match,
          inputId: id,
        });
      }
    }

    const filteredHandles = newHandles.filter(
      (handle) => handle.inputId !== id || matches.includes(handle.label!)
    );

    const leftHandles = filteredHandles.filter(
      (handle) => handle.position === "left"
    );
    const rightHandles = filteredHandles.filter(
      (handle) => handle.position === "right"
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
  };

  useEffect(() => {
    updateNodeInternals(id);
  }, [handles, id, updateNodeInternals]);

  return (
    <div
      ref={containerRef}
      className={`border border-purple-400 pt-4 pb-8 px-5 rounded-md bg-white ${
        isFocused ? "shadow-glow" : ""
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
            className={`size-2 ring-2 ring-purple-300 ${
              edges.find(
                (edge) =>
                  edge.sourceHandle === handle.id ||
                  edge.targetHandle === handle.id
              )
                ? "bg-purple-800"
                : "bg-white"
            }`}
          />
          {handle.label && (
            <span
              style={handle.style}
              className={`ml-2 text-sm text-purple-700 absolute ${
                handle.position === "right" ? "" : "-left-20"
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
      <div className="flex flex-col gap-y-5">
        {inputs.map((input) => {
          switch (input.type) {
            case "text":
              return (
                <div key={input.id}>
                  <span className="text-purple-700 text-sm">{input.label}</span>
                  <div className="flex flex-wrap gap-2">
                    {dependencyMap[input.id] &&
                    values[dependencyMap[input.id] as string] === "file" ? (
                      <FileInput
                        id={input.id}
                        value={values[input.id] as string}
                        onChange={(e) => handleInputChange(e, "file")}
                      />
                    ) : (
                      <TextInput
                        id={input.id}
                        value={values[input.id] as string}
                        onChange={(e) => handleInputChange(e, "text")}
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
                  <SelectInput
                    id={input.id}
                    value={values[input.id] as string}
                    options={input.options}
                    onChange={(value) => {
                      if (value === "file") {
                        setValues((prevValues) => ({
                          ...prevValues,
                          [findKeyByValue(dependencyMap, input.id) as string]:
                            "",
                        }));
                      }
                      setValues((prevValues) => ({
                        ...prevValues,
                        [input.id]: value,
                      }));
                    }}
                  />
                </div>
              );
            case "checkbox":
              return (
                <div className="flex items-center space-x-2" key={input.id}>
                  <Checkbox
                    id={input.id}
                    checked={!!values[input.id]}
                    onClick={() => {
                      setValues((prevValues) => ({
                        ...prevValues,
                        [input.id]: !values[input.id],
                      }));
                    }}
                  />
                  <label htmlFor={input.id} className="text-sm">
                    {input.label}
                  </label>
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
