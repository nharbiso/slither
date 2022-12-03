import React from "react";

interface HomeProps {
  gameState: boolean;
  setGameState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Home({ gameState, setGameState }: HomeProps) {
    <div>
        <div>
            <button>Create a new game</button>
        </div>
        <div>
            <h3>Join with a game code</h3>
            {/* Some text input component */}
            <p>Some instructions on the input format</p>
            <button>Join with a game code</button>
        </div>
    </div>
}
