import { Point } from "./Point";

export const Constants = {
    colors: ["#A72334", "#FC7A43", "#ECCF39", "#6FAF60",
        "#02654B", "#188DBF", "#22379B", "#7209b7",
        "#f72585"],
    MoveDirection: {
        UP: new Point(0, -1),
        DOWN: new Point(0, 1),
        LEFT: new Point(-1, 0),
        RIGHT: new Point(1, 0)
    }
}
