// submit.tsx

import React from "react";
import { Button } from "../ui/button";

export const SubmitButton: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <Button variant={"outline"}>Submit</Button>
    </div>
  );
};
