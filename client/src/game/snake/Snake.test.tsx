import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Denque from 'denque';
import { Position } from '../GameState';
import Snake, { SnakeData } from "./Snake";

test("no snake segments are rendered with empty snake body", () => {
    const snakeBody: Denque<Position> = new Denque();
    const snake: SnakeData = {
        snakeBody: snakeBody,
        velocityX: 0,
        velocityY: 0
    }
    const offset: Position = {x: 0, y: 0}
    const { container } = render(<Snake snake={snake} offset={offset} />);
  
    const snakes: HTMLCollectionOf<Element> = container.getElementsByClassName("snake");
    expect(snakes.length).toBe(0);
});

test("rendering of a snake's segments have correct position and number for Snake", () => {
    // conducts test 100 times
    for(let i = 0; i < 100; i++) {
        const numSegments: number = getRandomInt(0, 50);
        const snakeBody: Denque<Position> = new Denque();

        // generates snake body of randomly generated length
        for(let i = 0; i < numSegments; i++) {
            const pos: Position = {
                x: getRandomInt(-1500, 1500),
                y: getRandomInt(-1500, 1500)
            };
            snakeBody.push(pos);
        }

        const snake: SnakeData = {
            snakeBody: snakeBody,
            velocityX: 0,
            velocityY: 0
        }
        const offset: Position = {x: 0, y: 0}

        const { container } = render(<Snake snake={snake} offset={offset} />);
    
        // gets all snake segments rendered
        const snakes: Element[] = Array.from(container.getElementsByClassName("snake"));
        expect(snakes.length).toBe(numSegments);


        // checks that all rendered segments have coordinates present 
        // in the snake metadata
        const segments: Position[] = snakeBody.toArray();
        snakes.forEach((elem: Element) => {
            const style: CSSStyleDeclaration = window.getComputedStyle(elem);
            const pos: Position = {
                x: Number(style.left.slice(0, -2)),
                y: Number(style.top.slice(0, -2))
            }

            expect(segments).toEqual(
                expect.arrayContaining([
                    expect.objectContaining(pos)
                ])
            );
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
