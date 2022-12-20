import React from "react";
import { leaderboardEntry } from "../message/message";
import "./Leaderboard.css";

/**
 * Displays the current lobby's leaderboard, in the top right.
 * @param leadboard a map of each user in the lobby to their score
 * @returns a HTML element rendering the leaderboard
 */
export default function Leaderboard({ leaderboard }: { leaderboard: Map<string, number> }): JSX.Element {
  let leaderboardEntries: [string, number][] = Array.from(
    leaderboard.entries()
  );

  leaderboardEntries = leaderboardEntries.sort(
    (a: [string, number], b: [string, number]) => (a[1] > b[1] ? -1 : 1)
  );

  return (
    <div className="leaderboard">
      <table>
        <thead>
          <tr>
            <th className="leaderboard-title" colSpan={2}>
              Leaderboard
            </th>
        </tr>
        </thead>
        <tbody>
          {leaderboardEntries.map((entry: [string, number], ind: number) => {
            const username: string = entry[0];
            const score: number = entry[1];
            return (
              <tr key={ind}>
                <td className="username-entry" data-testid="user">{username}</td>
                <td className="score-entry" data-testid="score">{score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
