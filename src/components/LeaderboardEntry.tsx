import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LeaderboardEntryProps {
  score: number;
  onSave: (alias: string) => void;
}

const LeaderboardEntry = ({ score, onSave }: LeaderboardEntryProps) => {
  const [alias, setAlias] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alias.length === 3) {
      onSave(alias.toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center justify-center">
      <Input
        type="text"
        value={alias}
        onChange={(e) => setAlias(e.target.value.slice(0, 3))}
        placeholder="AAA"
        className="w-20 text-center uppercase"
        maxLength={3}
        required
      />
      <Button type="submit" disabled={alias.length !== 3}>
        Save Score
      </Button>
    </form>
  );
};

export default LeaderboardEntry;