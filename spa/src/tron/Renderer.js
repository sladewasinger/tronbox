const paper = require("paper");

export class Renderer {
  constructor(canvasId) {
    this.canvasId = canvasId;
    /* 
      Vue.js doesn't reset global paper object
      when app re-compiles during development.
      This leads to bugs and "memory-leaks".
      The best solution I can come up with:
    */
    paper.projects.forEach(project => {
      console.log("Unexpected project found. Removing...");
      project.remove();
    });
    paper.setup(this.canvasId);

    this.grid = undefined;
    this.trailStuff = {};
    this.colors = ["#A72334", "#FC7A43", "#ECCF39", "#6FAF60",
      "#02654B", "#188DBF", "#22379B", "#7209b7",
      "#f72585"];
    this.colorIndex = 0;
  };

  reset() {
    paper.project.activeLayer.removeChildren();
  }

  render(grid, trails) {
    if (this.grid === undefined) {
      var cellWidth = 50;

      this.grid = grid.map((col, x) =>
        col.map((el, y) => {
          var cell = new paper.Path.Rectangle(
            new paper.Point(x * cellWidth, y * cellWidth),
            new paper.Size(cellWidth, cellWidth)
          );
          cell.strokeColor = "#444"; // #290
          let fillColor = "#090909";
          // Color corners of grid gray:
          // if (
          //     (x == 0 || x + 1 == this.gridWidth) &&
          //     (y == 0 || y + 1 == this.gridWidth)
          // ) {
          //     fillColor = "#222";
          // }
          cell.fillColor = fillColor;
          return cell;
        })
      );
    }
    for (let trail of trails) {
      if (!this.trailStuff[trail.id]) {
        this.trailStuff[trail.id] = {};
      }
      let trailStuff = this.trailStuff[trail.id];
      for (let point of trail.tail) {
        let trailCell = this.grid[point.x][point.y];
        trailCell.fillColor = trail.color;
        trailCell.strokeWidth = 1;
        trailCell.shadowColor = "#000";
        trailCell.shadowBlur = 10;
      }

      if (!trailStuff.wireframe) {
        trailStuff.wireframe = new paper.Path(
          [...trail.tail, trail.head].map(x => this.grid[x.x][x.y].position)
        );
        trailStuff.wireframe.strokeColor = new paper.Color(0, 0, 0, 0.25);
        trailStuff.wireframe.strokeWidth = 5;
      }
      if (trailStuff.wireframe.segments.at(-1).x != trail.head.x
        && trailStuff.wireframe.segments.at(-1).y != trail.head.y) {
        trailStuff.wireframe.add(this.grid[trail.head.x][trail.head.y].position);
      }

      let headCell = this.grid[trail.head.x][trail.head.y];
      headCell.strokeColor = trail.color;
      headCell.fillColor = trail.color;
      headCell.strokeWidth = 10;
      headCell.shadowColor = "#000";
      headCell.shadowBlur = 20;
      headCell.bringToFront();

      let headIndicator = trailStuff.headIndicator;
      if (!headIndicator) {
        headIndicator = new paper.Path.Circle(headCell.position, 15);
        headIndicator.fillColor = trail.color;
        headIndicator.strokeColor = "#FFF";
        headIndicator.strokeWidth = 10;
        trailStuff.headIndicator = headIndicator;
      }
      if (!trail.alive && !trailStuff.deadSymbolHead) {
        headIndicator.remove();
        let triangle = new paper.Path.RegularPolygon(headCell.position, 3, 25);
        triangle.fillColor = '#000';
        triangle.position = headCell.position;
        trailStuff.deadSymbolHead = triangle;
      }

      trailStuff.wireframe.bringToFront();
      headIndicator.bringToFront();
      headIndicator.position = headCell.position;
      trailStuff.deadSymbolHead?.bringToFront();
    }
  }
}