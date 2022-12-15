import { Position } from '../GameState';
import "./Boundary.css"

export default function Boundary({boundaries, offset}: {boundaries: Position, offset: Position}) {
    return (
    <div>
        <div className="boundary" id="top-boundary" style={{
            left: offset.x - boundaries.x / 2, 
            top: offset.y - boundaries.y / 2,
            width: boundaries.x + "px", 
            height: "0px"}}
        />
        <div className="boundary" id="bottom-boundary" style={{
            left: offset.x - boundaries.x / 2, 
            top: offset.y + boundaries.y / 2, 
            width: boundaries.x+ "px", 
            height: "0px"}} 
        />
        <div className="boundary" id="left-boundary" style={{
            left: offset.x - boundaries.x / 2, 
            top: offset.y - boundaries.y / 2, 
            width: "0px", 
            height: boundaries.y + "px",}} 
        />
        <div className="boundary" id="right-boundary" style={{
            left: offset.x + boundaries.x / 2, 
            top: offset.y - boundaries.y / 2, 
            width: "0px", 
            height: boundaries.y + "px"}} 
        />
    </div>        
    )
}