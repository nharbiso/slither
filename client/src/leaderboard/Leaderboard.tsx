import React from "react";
import { leaderboardEntry } from "../message/message";
import "./Leaderboard.css";

/**
 * Displays the leaderboard in the top right
 * @param param0
 * @returns
 */
export default function Leaderboard({
  leaderboard,
}: {
  leaderboard: Map<string, number>;
}) {
  let leaderboardEntries: [string, number][] = Array.from(
    leaderboard.entries()
  );
  leaderboardEntries = leaderboardEntries.sort(
    (a: [string, number], b: [string, number]) => (a[1] > b[1] ? -1 : 1)
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
