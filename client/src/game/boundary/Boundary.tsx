import { Position } from '../GameState';
import "./Boundary.css"

const WIDTH: number = 5; // in pixels

export default function Boundary({boundaries, offset}: {boundaries: Position, offset: Position}) {
    return (
    <div>
        <div className="boundary" id="top" style={{
            left: offset.x - WIDTH - boundaries.x / 2, 
            top: offset.y - WIDTH - boundaries.y / 2,
            width: (boundaries.x + 2 * WIDTH) + "px", 
            height: WIDTH + "px"}}
        />
        <div className="boundary" id="bottom" style={{
            left: offset.x - WIDTH - boundaries.x / 2, 
            top: offset.y + boundaries.y / 2, 
            width: (boundaries.x + 2 * WIDTH) + "px", 
            height: WIDTH + "px"}} 
        />
        <div className="boundary" id="left" style={{
            left: offset.x - WIDTH - boundaries.x / 2, 
            top: offset.y - boundaries.y / 2, 
            width: WIDTH + "px", 
            height: boundaries.y + "px",}} 
        />
        <div className="boundary" id="right" style={{
            left: offset.x + boundaries.x / 2, 
            top: offset.y - boundaries.y / 2, 
            width: WIDTH + "px", 
            height: boundaries.y + "px"}} 
        />
    </div>        
    )
}