import { PipelineToolbar } from "@/components/pipeline/toolbar";
import { PipelineUI } from "@/components/pipeline/ui";
import { SubmitButton } from "@/components/buttons/submit-button";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Toaster />
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
