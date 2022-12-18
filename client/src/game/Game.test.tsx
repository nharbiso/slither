import { extractLeaderboardMap } from "./Game";
import {leaderboardEntry} from "../message/message"

test('test extractLeaderboardMap', () => {
    let leaderboard: Map<string, number> = new Map<string, number>();
    leaderboard.set("one", 1)
    leaderboard.set("two", 2)
    leaderboard.set("three", 3)

    const one: leaderboardEntry = {username: "one", score: 1}
    const two: leaderboardEntry = {username: "two", score: 2}
    const three: leaderboardEntry = {username: "three", score: 3}
    let array = [one, two, three]
    expect(extractLeaderboardMap(array)).toStrictEqual(leaderboard) //normal

    let emptyLeaderboard: Map<string, number> = new Map<string, number>(); 
    let emptyArray: leaderboardEntry[] = []
    expect(extractLeaderboardMap(emptyArray)).toStrictEqual(emptyLeaderboard) //empty
})