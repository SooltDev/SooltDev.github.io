import Calc from "./assets/js/calc.js";
import { global } from "./assets/js/stools.js";

global('calc', new Calc(
    {
        parent: "#calc1"
    }
));