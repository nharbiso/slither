import React from "react"

import Snake from "./Snake";
import { useEffect, useState } from "react"
import Denque from "denque";
import { SnakeBodypart } from "./SnakeBodypart";

export default function GameCanvas({snakes}: {snakes:Denque<SnakeBodypart>[]}) {
    // const [left, setLeft] = useState("10px");
    // const [top, setTop] = useState("10px");

//     const onMouseMove = (e: any) =>{
//         setLeft(e.pageX + 'px')
//         setTop(e.pageY + "px")
//       }

//     useEffect(() => {document.addEventListener('mousemove', onMouseMove);
// }, [])
    return (
        snakes.map((snake: Denque<SnakeBodypart>) => <Snake snakeParts={snake} />)
    )
}