import "./GameCode.css";

/**
 * Renders the gamecode in the top left
 * @param param0 gamecode as a string
 * @returns the gamecode in the top left
 */
export default function GameCode({ gameCode }: { gameCode: string }) {
  return (
    <div className="codeDisplay">
        <p className="code-tagline">Your game code:</p>
      <p className="codeText">{gameCode}</p>
    </div>
  );
}
