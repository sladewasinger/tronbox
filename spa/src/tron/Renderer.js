const paper = require("paper");
import { Point, Size } from "paper/dist/paper-core";

export class Renderer {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.scope = new paper.PaperScope();
        this.scope.setup(this.canvasId);

        this.grid = undefined;
        this.trails = {};
        this.colors = ["#A72334", "#FC7A43", "#ECCF39", "#6FAF60",
            "#02654B", "#188DBF", "#22379B", "#7209b7",
            "#f72585"];
        this.colorIndex = 0;
    };

    render(grid, trails) {
        if (this.grid === undefined) {
            var cellWidth = 50;

            this.grid = grid.map((col, x) =>
                col.map((el, y) => {
                    var cell = new paper.Path.Rectangle(
                        new Point(x * cellWidth, y * cellWidth),
                        new Size(cellWidth, cellWidth)
                    );
                    cell.strokeColor = "#290";
                    let fillColor = "#090909";
                    if (
                        (x == 0 || x + 1 == this.gridWidth) &&
                        (y == 0 || y + 1 == this.gridWidth)
                    ) {
                        fillColor = "#222";
                    }
                    cell.fillColor = fillColor;
                    return cell;
                })
            );
        }
        for (let trail of trails) {
            for (let point of [...trail.tail, trail.head]) {
                let tailCell = this.grid[point.x][point.y];
                tailCell.fillColor = trail.color;
                tailCell.strokeColor = "#290";
                tailCell.strokeWidth = 1;
                tailCell.shadowColor = "#000";
                tailCell.shadowBlur = 10;
            }
            let headCell = this.grid[trail.head.x][trail.head.y];
            headCell.strokeColor = trail.color;
            headCell.strokeWidth = 10;
            headCell.shadowColor = "#000";
            headCell.shadowBlur = 20;
            headCell.bringToFront();

            if (!this.trails[trail.id]) {
                let circle = new paper.Path.Circle(headCell.position, 15);
                circle.fillColor = trail.color;
                circle.strokeColor = "#FFF";
                circle.strokeWidth = 10;
                this.trails[trail.id] = circle;
            }
            if (!trail.alive) {
                let triangle = new paper.Path.RegularPolygon(headCell.position, 3, 25);
                triangle.fillColor = '#000';
                this.trails[trail.id] = triangle;
            }
            let c = this.trails[trail.id];
            c.position = headCell.position;
            c.bringToFront();
        }
    }
}