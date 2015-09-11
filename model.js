/**
 * Created by a.deangelis on 18/08/2015.
 */

function Tile(x, y) {
    this.x = x;
    this.y = y;
    this.touchedByPlayer = -1;
}

function Player(pos, speed, radius) {
    this.pos = pos;
    this.speed = speed;
    this.radius = radius;
}

function Board(row, col) {
    this.row = row;
    this.col = col;
}

function Letter(name, pos, speed, radius) {
    this.name = name;
    this.pos = pos;
    this.speed = speed;
    this.radius = radius;
    this.collidedWithPlayer = false;
}

function Vector2(x, y) {
    this.x = x;
    this.y = y;
}