import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Position } from '../GameState';
import OtherSnake from "./OtherSnake";

test("no snake segments are rendered with empty list of positions", () => {
    const positions: Set<string> = new Set();
    const offset: Position = {x: 0, y: 0};

    const { container } = render(<OtherSnake positions={positions} offset={offset} />);
  
    const snakes: HTMLCollectionOf<Element> = container.getElementsByClassName("snake");
    expect(snakes.length).toBe(0);
});


test("correct number of snake segments are rendered from given list for OtherSnake", () => {
    // conducts test 100 times
    for(let i = 0; i < 100; i++) {
        const numSegments: number = getRandomInt(0, 50);
        const positions: Set<string> = new Set();

        // generates snake body of randomly generated length
        for(let i = 0; i < numSegments; i++) {
            const pos: Position = {
                x: getRandomInt(-1500, 1500),
                y: getRandomInt(-1500, 1500)
            };
            positions.add(JSON.stringify(pos));
        }

        const offset: Position = {x: 0, y: 0}

        const { container } = render(<OtherSnake positions={positions} offset={offset} />);
    
        // gets all snake segments rendered
        const snakes: Element[] = Array.from(container.getElementsByClassName("snake"));
        expect(snakes.length).toBe(numSegments);


        // checks that all rendered segments have coordinates present 
        // in the snake metadata
        snakes.forEach((elem: Element) => {
            const style: CSSStyleDeclaration = window.getComputedStyle(elem);
            const pos: Position = {
                x: Number(style.left.slice(0, -2)),
                y: Number(style.top.slice(0, -2))
            }

            expect(positions.has(JSON.stringify(pos))).toBe(true);
        });
    }
});

/**
 * Returns a random integer between the given minimum and maximum,
 * inclusive of both.
 * @param min the minimum number of the range
 * @param max the maximum number of the range
 * @returns a random integer in the given range
 */
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}