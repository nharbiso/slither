import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Position } from '../GameState';
import Orb, { OrbData, OrbSize } from "./Orb";

test("orb rendered with correct style", () => {
    const pos: Position = {
        x: getRandomInt(-1500, 1500),
        y: getRandomInt(-1500, 1500)
    }
    const orb: OrbData = {
        position: pos,
        orbSize: Math.random() > 0.5 ? OrbSize.LARGE : OrbSize.SMALL,
        color: generateColor()
    }
    const offset: Position = {x: 0, y: 0};

    const { container } = render(<Orb orbInfo={orb} offset={offset} />);
  
    const orbs: Element[] = Array.from(container.getElementsByClassName("circle"));
    expect(orbs.length).toBe(1);

    const orbElem: Element = orbs[0];
    const style: CSSStyleDeclaration = window.getComputedStyle(orbElem);

    expect(style.top).toBe(pos.y + "px");
    expect(style.left).toBe(pos.x + "px");
    const renderedSize: number = orb.orbSize === OrbSize.SMALL ? 7.5 : 15;
    expect(style.height).toBe(renderedSize + "px");
    expect(style.width).toBe(renderedSize + "px");
    expect(style.backgroundColor).toBe(convertColor(orb.color));
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

/** The hexidecimal digits in succeeding order. */
const HEXDIGITS: string = "0123456789ABCDEF";

/**
 * Generates a random color in hexidecimal form.
 * @returns a random hex code color, as a string
 */
function generateColor(): string {
    let color: string = "#";
    for(let i = 0; i < 6; i++) {
        color += HEXDIGITS.charAt(Math.floor(Math.random() * HEXDIGITS.length));
    }
    return color;
}

/** 
 * Converts a hexidecimal color into RGB form, with each color component
 * in decimal form, specifically as a string formatted as 
 * rgb(<red value>, <green value>, <blue value>)
 * @param color the hexidecimal color to be converted
 * @returns the color in RGB form
 */
function convertColor(color: string): string {
    const rgbValues: number[] = [];
    for(let i = 0; i < 3; i++) {
        rgbValues[i] = 0;
        rgbValues[i] += HEXDIGITS.indexOf(color.charAt(2 * i + 1)) * 16;
        rgbValues[i] += HEXDIGITS.indexOf(color.charAt(2 * i + 2));
    }
    return "rgb(" + rgbValues[0] + ", " +  rgbValues[1] + ", " + rgbValues[2] + ")";
}