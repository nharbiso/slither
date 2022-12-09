import { OrbData } from './orb/Orb';
import { SnakeData } from './snake/Snake';

export interface Position {
    x: number;
    y: number;
}

export default interface GameState {
    snakes: Map<String, SnakeData>;
    // otherBodies: Set<Position>;
    otherBodies: Set<string>;
    orbs: Set<OrbData>;

    scores: Map<String, Number>;
    gameCode: String;
}