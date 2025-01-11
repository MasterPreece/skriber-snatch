import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Score } from '../types/game';

interface TopScoresProps {
  scores: Score[];
}

const TopScores = ({ scores }: TopScoresProps) => {
  const topThree = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="w-full max-w-md mx-auto mb-4 bg-white/90 rounded-lg shadow-lg p-4 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-4 text-center text-purple-600">Top 3 High Scores</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topThree.map((score, index) => (
            <TableRow key={`${score.alias}-${score.date}`}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{score.alias}</TableCell>
              <TableCell className="text-right">{score.score.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TopScores;