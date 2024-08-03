import { PipelineToolbar } from "@/components/pipeline/toolbar";
import { PipelineUI } from "@/components/pipeline/ui";
import { SubmitButton } from "@/components/buttons/submit-button";

function App() {
  return (
    <div>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
