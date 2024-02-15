import { Minesweeper } from "./js/minesweeper.js";

const mineField = new Minesweeper({
    width: 9,
    height: 9,
    mineNumber: 10,
    parentElement: "#content"
});
window.mineField = mineField;

mineField.newGame();
