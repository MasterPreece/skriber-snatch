import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Score {
  alias: string;
  score: number;
  date: string;
}

interface LeaderboardProps {
  scores: Score[];
}

const Leaderboard = ({ scores }: LeaderboardProps) => {
  return (
    <div className="mt-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">High Scores</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.map((score, index) => (
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

export default Leaderboard;