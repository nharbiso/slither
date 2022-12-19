import { render, queryByAttribute } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Position } from '../GameState';
import Boundary from "./Boundary";

test("boundary rendered with each four sides", () => {
    const border: Position = {
        x: getRandomInt(-1500, 1500),
        y: getRandomInt(-1500, 1500)
    }
    const offset: Position = {x: 0, y: 0};

    const { container } = render(<Boundary boundaries={border} offset={offset} />);
    const getById = queryByAttribute.bind(null, 'id');

    const boundaries: string[] = ["top", "bottom", "left", "right"];
    boundaries.forEach((boundary: string) => {
        const elem: HTMLElement | null = getById(container, boundary + "-boundary");
        expect(elem).toBeInTheDocument();
    })
});


/**
 * Returns a random integer between the given minimum and maximum,
 * inclusive of both.
 * @param min the minimum number of the range
 * @param max the maximum number of the range
 * @returns a random integer in the given range
 */
function getRandomInt(min: number, max: number):number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}