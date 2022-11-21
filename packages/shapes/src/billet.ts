
import { Mt3, write_matrix, substitutionPath, read_cord} from "./expan.js";

var s = require('billet.svg');
var d = document.createElement("div");
d.insertAdjacentHTML('afterbegin',s);
var billet = d.getElementsByTagName("svg")[0];
substitutionPath(billet);

function readOnload(el){
    if (!el.getElementsByTagName ) return;
    var g = el.getElementsByTagName("g");   
    for (var i=0;i<g.length;i++) if (g[i].hasAttribute("onload")) {
        if (!g[i].parentNode['chil']) g[i].parentNode['chil']={};
        g[i].parentNode['chil'][g[i].getAttribute("onload")] = g[i];
    };
};
readOnload(billet);
//console.dir(billet['chil']['backgroundFigure']);
export { billet, readOnload};
