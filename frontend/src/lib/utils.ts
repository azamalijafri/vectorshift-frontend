import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function findKeyByValue(
  obj: { [key: string]: string },
  value: string
): string | undefined {
  for (const [key, val] of Object.entries(obj)) {
    if (val === value) {
      return key;
    }
  }
  return undefined;
}

export const createDependencyMap = (
  inputs: TextInputConfig[]
): DependencyMap => {
  const dependencyMap: DependencyMap = {};

  inputs.forEach((input) => {
    if (input.type === "text" && input.dependsOn) {
      dependencyMap[input.id] = input.dependsOn;
    }
  });

  return dependencyMap;
};

export const initializeValues = (
  inputs: InputConfig[]
): { [key: string]: string | boolean | null } => {
  const initialValues: { [key: string]: string | boolean | null } = {};

  inputs.forEach((input) => {
    if (input.initValue !== undefined) {
      initialValues[input.id] = input.initValue;
    }
  });

  return initialValues;
};
