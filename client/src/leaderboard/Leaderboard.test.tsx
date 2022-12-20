import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Leaderboard from './Leaderboard';

test("no entries rendered for empty leaderboard", () => {
    const leaderboard: Map<string, number> = new Map();
    const { container } = render(<Leaderboard leaderboard={leaderboard} />);
  
    const users: HTMLCollectionOf<Element> = container.getElementsByClassName("username-entry");
    expect(users.length).toBe(0);
    const scores: HTMLCollectionOf<Element> = container.getElementsByClassName("score-entry");
    expect(scores.length).toBe(0);
});

test("displays entries from leaderboard, in order", () => {
    const leaderboard: Map<string, number> = new Map();
    leaderboard.set("user1", 200);
    leaderboard.set("ad", 920);
    leaderboard.set("2", 2);
    leaderboard.set("!@$", 90);
    leaderboard.set("[109h3 4", 0);

    const { getAllByTestId } = render(<Leaderboard leaderboard={leaderboard} />);
  
    // tests all elements of leaderboard are present, in the correct order

    const userElemsDescending: HTMLElement[] = getAllByTestId("user", {exact: false});
    const usersDescending: string[] = ["ad", "user1", "!@$", "2", "[109h3 4"];
    expect(userElemsDescending.length).toBe(5);
    for(let i = 0; i < 5; i++) {
        expect(userElemsDescending[i]).toHaveTextContent(usersDescending[i]);
    }

    const scoreElemsDescending: HTMLElement[] = getAllByTestId("score", {exact: false});
    const scoresDescending: string[] = ["920", "200", "90", "2", "0"];
    expect(scoresDescending.length).toBe(5);
    for(let i = 0; i < 5; i++) {
        expect(scoreElemsDescending[i]).toHaveTextContent(scoresDescending[i]);
    }
});