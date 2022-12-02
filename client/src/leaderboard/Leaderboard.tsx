import React from "react";
import "./Leaderboard.css";

export default function Leaderboard({
  leaderboard,
}: {
  leaderboard: Map<string, number>;
}) {
  const leaderboardEntries: [string, number][] = Array.from(
    leaderboard.entries()
  );
  return (
    <div className="leaderboard">
      <table>
        <tr>
          <th className="leaderboard-title" colSpan={2}>
            Leaderboard
          </th>
        </tr>
        {leaderboardEntries.map((entry: [string, number]) => {
          const username: string = entry[0];
          const score: number = entry[1];
          return (
            <tr>
              <td className="username-entry">{username}</td>
              <td className="score-entry">{score}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
