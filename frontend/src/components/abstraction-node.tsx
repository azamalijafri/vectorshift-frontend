import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { useStore } from "@/store";
import { Checkbox } from "./ui/checkbox";
import FileInput from "@/components/inputs/file-input";
import SelectInput from "@/components/inputs/select-input";
import {
  createDependencyMap,
  findKeyByValue,
  initializeValues,
} from "@/lib/utils";
import { LucideProps } from "lucide-react";
import { Textarea } from "./ui/textarea";

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
  const containerRef = useRef<HTMLDivElement | null>(null); // currently only used for calculating positions of the handles
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]); // handling reference for multiple inputs

  const updateNodeInternals = useUpdateNodeInternals();

  const dependencyMap = createDependencyMap(inputs as TextInputConfig[]); // initializing it here to easily access the id of the depends input effectively

  // map to keep track of values of different inputs in the inputs array
  const [values, setValues] = useState<{
    [key: string]: string | boolean | null;
  }>(initializeValues(inputs));

  // this state to give flow effect when node's input being focused
  const [isFocused, setIsFocused] = useState(false);

  const { edges } = useStore(); // for now only being used for connecting ui interface (filling up the hollow connection circle)

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    type: "text" | "file"
  ) => {
    const { id, value } = e.target;

    // updating value by input id
    setValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));

    // adding/removing/updating handles if there is any js variable in text input
    if (type === "text") {
      updateHandles(id, value);
    }
  };

  const updateHandles = (id: string, value: string) => {
    // keeping track of different inputs to dynamically update their heights.
    const refIndex = inputs.findIndex((input) => input.id === id);
    if (textareaRefs.current[refIndex]) {
      const textarea = textareaRefs.current[refIndex];
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }

    const regex = /\{\{(.*?)\}\}/g; //regex to check for the js variable

    // finding js variables in the current input
    const matches = [...(value as string).matchAll(regex)].map(
      (match) => match[1]
    );

    const newHandles = [...handles]; // copying orignal handles to make changes and update the state with it

    for (const match of matches) {
      // creating new handles with js variable label, if condition to prevent duplicate handles
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

    // removing handles if removed from input hence not found in matches array.
    const filteredHandles = newHandles.filter(
      (handle) => handle.inputId !== id || matches.includes(handle.label!)
    );

    // separately processing left and right handles to calculate the correct styling position of handles as they increase and decrese dynamically.
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

    // updating handles with new styles and adding new handles.
    setHandles([...leftHandles, ...rightHandles]);
  };

  // node wasnt updating right away on the handles state change so forcefully updating the node in the reactflow context.
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
        {inputs.map((input, index) => {
          switch (input.type) {
            case "text":
              return (
                <div key={input.id}>
                  <span className="text-purple-700 text-sm">{input.label}</span>
                  <div className="flex flex-wrap gap-2">
                    {/* if a input has dependency then checks for its dependent input if its file hence return file (only for file/text for now as per current scenario) */}
                    {dependencyMap[input.id] &&
                    values[dependencyMap[input.id] as string] === "file" ? (
                      <FileInput
                        id={input.id}
                        value={values[input.id] as string}
                        onChange={(e) => handleInputChange(e, "file")}
                      />
                    ) : (
                      <Textarea
                        ref={(el) => (textareaRefs.current[index] = el)}
                        rows={1}
                        className="mt-2 resize-none min-h-9 overflow-hidden"
                        id={input.id}
                        value={(values[input.id] || "") as string}
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
                      const dependenttextinput: string | undefined =
                        findKeyByValue(dependencyMap, input.id);

                      // code for handling invalid input when switching for files also to remove handles.
                      if (value === "file") {
                        setValues((prevValues) => ({
                          ...prevValues,
                          [dependenttextinput as string]: "",
                        }));
                        updateHandles(dependenttextinput!, "");
                      } else {
                        updateHandles(dependenttextinput!, "");
                      }

                      // normally updation of state
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
