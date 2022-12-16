import { OrbData } from './orb/Orb';
import { SnakeData } from './snake/Snake';

export interface Position {
    x: number;
    y: number;
}

/**
 * gamestate interface has your snake position, all the other snake positions (as a JSON),
 * the orb positions, the scores, and the lobby's gamecode
 */
export default interface GameState {
    snakes: Map<String, SnakeData>;
    // otherBodies: Set<Position>;
    otherBodies: Set<string>;
    orbs: Set<OrbData>;

    scores: Map<String, Number>;
    gameCode: String;
}