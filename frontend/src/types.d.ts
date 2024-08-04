interface HandleConfig {
  type: "source" | "target";
  position: Position;
  id: string;
  label?: string;
  style?: React.CSSProperties;
  inputId?: string;
}

interface TextInputConfig {
  type: "text";
  id: string;
  label: string;
  initValue?: null | string;
  dependsOn?: string;
}

interface SelectInputConfig {
  type: "select";
  id: string;
  label: string;
  options: { value: string; label: string }[];
  initValue?: null | string;
}

interface CheckboxInputConfig {
  type: "checkbox";
  id: string;
  label: string;
  initValue?: boolean;
}

type InputConfig = TextInputConfig | SelectInputConfig | CheckboxInputConfig;

type DependencyMap = {
  [key: string]: string;
};
