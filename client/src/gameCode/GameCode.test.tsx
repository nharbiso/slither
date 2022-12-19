import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameCode from "./GameCode";

test("boundary rendered with each four sides", () => {
    const gameCode: string = generateGameCode();
    render(<GameCode gameCode={gameCode} />);

    const descriptionElem = screen.getByText("Your game code:");
    expect(descriptionElem).toBeInTheDocument();

    const gameCodeElem = screen.getByText(gameCode);
    expect(gameCodeElem).toBeInTheDocument();
});


/** The alphabet letters in succeeding order. */
const ALPHABET: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Generates a random game code, a string of 5 capital letters
 * @returns a random game code
 */
function generateGameCode(): string {
    let code: string = "";
    for(let i = 0; i < 5; i++) {
        code += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return code;
}