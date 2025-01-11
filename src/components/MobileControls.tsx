import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface MobileControlsProps {
  onMove: (direction: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight") => void;
}

const MobileControls = ({ onMove }: MobileControlsProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-[200px]">
      <div className="col-start-2">
        <Button
          variant="outline"
          size="icon"
          className="w-16 h-16"
          onClick={() => onMove("ArrowUp")}
        >
          <ArrowUp className="h-8 w-8" />
        </Button>
      </div>
      <div className="col-start-1 col-span-3 flex justify-between">
        <Button
          variant="outline"
          size="icon"
          className="w-16 h-16"
          onClick={() => onMove("ArrowLeft")}
        >
          <ArrowLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-16 h-16"
          onClick={() => onMove("ArrowDown")}
        >
          <ArrowDown className="h-8 w-8" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-16 h-16"
          onClick={() => onMove("ArrowRight")}
        >
          <ArrowRight className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default MobileControls;