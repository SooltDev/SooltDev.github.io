import ChessTable from "./assets/js/chesstable.cls.js";
import { global } from "./assets/js/stools.js";

global('chess', new ChessTable({
    size: 8,
    parent: '#content'
}));
