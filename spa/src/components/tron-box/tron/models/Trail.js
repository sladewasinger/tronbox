export class Trail {
    constructor(headPos, color, id, getMove) {
        this.head = headPos;
        this.tail = [];
        this.color = color;
        this.id = id;
        this.getMove = getMove;
        this.alive = true;
        this.state = {};
    }

    applyMove(move) {
        this.tail.push(this.head);
        this.head = move;
    }
}