
import { Mt3, write_matrix, read_cord} from "./expan.js";
import { areal,matrixAreal } from "./areal";
import { LayGroupHTML } from "./class";

var indexInterval = 0;
var level=100;
var interval = [1,2,5];
var optionCenterCursor = {
    cr:[0,0],
    display:false
}
function readIndex(i){
    var l=level;
    var kf = 1;
    
    if (i<0) {
        //if (l<=1) kf=.1;
        l/=10;
        i=interval.length-1;
    } else if (i>interval.length-1) {
        //if (l<1) kf=.1;
        l*=10;
        i=0;
    };
    return {
        value:interval[i],
        level:l
    }
};

function createGrid() {
    var curentScale = ( new Mt3().trans(1000,0).multiply(matrixAreal).elements[6] - matrixAreal.elements[6]) / 1000;
    var posMatrix = matrixAreal.elements.slice(6,8);
    
    var gGrid = areal.children[0].child_name['gridSize'];
    while (gGrid.children.length) gGrid.children[0].remove();
    //
    var wh = areal.parent['child_name']['areal']['current_position'];
    //console.log(areal.parent);
    
   // var level = Math.pow(10,Math.ceil(1/(curentScale))); 
   // var level= Math.pow(10, Math.ceil((wh.width/curentScale)/1000));
    
    var kf = interval[0]/(level);
    var step = 100*curentScale;
    var countX = Math.floor (wh.width/step);
    var swit = [];
    for (var i=-1;i<2;i++) {
        var r = readIndex(i+indexInterval);
        var step = (r.level*curentScale)*r.value;
        swit.push({
            level:r.level,
            index:i,
            step,
            countX : Math.ceil ((wh.width)/step)
        })
    };
    swit.sort((a,b)=>Math.abs(10 - a.countX) - Math.abs(10 - b.countX));
    level = swit[0].level;
  
    indexInterval+= swit[0].index;
    step = swit[0].step; 
    countX = swit[0].countX;
    var countY = Math.floor ((wh.height)/step)+1;
    if (swit[0].index!=0) {
        createGrid();
        return;
    };
    //console.log(posMatrix[0]%step)
    var defX = [(posMatrix[0])%step,Math.floor((posMatrix[0])/step)];
    if (posMatrix[0]<0) defX[1]+=1;
    for (var i = 0; i<countX;i++) {
        var x = (i-Math.ceil(countX/2)+1)*step+defX[0];
        //-wh.width/2;
        var text = (i-(defX[1])-Math.ceil(countX/2)+1)*interval[indexInterval];
        //if (text = 0) {color:""}
        new LayGroupHTML({
            tag:"line",
            svg:true,
            parent:gGrid,
            attribute:{
                x1:x,
                y1:0-wh.height/2,
                x2:x,
                y2:wh.height-wh.height/2,
                "stroke-width": parseFloat ((Math.round(text/10)==text/10 ? "1.5" : "0.5")) + (text==0 ? 1 : 0),
                stroke: text==0 ? "#00f" : ""
            },
            style:{
                "pointer-events":"none"
            }
        });
        new LayGroupHTML({
            tag:"text",
            svg:true,
            style:{
                "pointer-events":"none",
                "font-size":11
            },
            parent:gGrid,
            attribute:{
                x:x+3,
                y:-wh.height/2+13,
                stroke: text==0 ? "#00f" : ""
            },
            innerHTML: text*level
        })
    };

    var defY = [(posMatrix[1])%step,Math.floor((posMatrix[1])/step)];
    if (posMatrix[1]<0) defY[1]+=1;
    //
    for (var i = 0; i<countY;i++) {
        var y = (i-Math.ceil(countY/2))*step+defY[0];
        //-wh.width/2;
        var text = (i-(defY[1])-Math.ceil(countY/2))*interval[indexInterval] 
        new LayGroupHTML({
            tag:"line",
            svg:true,
            parent:gGrid,
            attribute:{
                x1:wh.width/2,
                y1:y,
                x2:0-wh.width/2,
                y2:y,
                "stroke-width": parseFloat ((Math.round(text/10)==text/10 ? "1.5" : "0.5")) + (text==0 ? 1 : 0),
                stroke: text==0 ? "#00f" : ""
            },
            style:{
                "pointer-events":"none"
            }
        });
        new LayGroupHTML({
            tag:"text",
            svg:true,
            style:{
                "pointer-events":"none",
                "font-size":11
            },
            parent:gGrid,
            attribute:{
                x:3-wh.width/2,
                y:y-5,
                stroke: text==0 ? "#00f" : ""
            },
            innerHTML: text*level
        })
    };
    if (optionCenterCursor.display) {
        var cr = new Mt3().transAr(optionCenterCursor.cr).multiply(matrixAreal).elements.slice(6,8);
        new LayGroupHTML({
            tag:"line",
            svg:true,
            parent:gGrid,
            attribute:{
                x1:cr[0],
                y1:40-wh.height/2,
                x2:cr[0],
                y2:cr[1]-30,
                "stroke-width":  ".5",
                stroke:"#033",
                "stroke-dasharray":"12,8"
            },
            style:{
                "pointer-events":"none"
            }
        });  
        new LayGroupHTML({
            tag:"text",
            svg:true,
            style:{
                "pointer-events":"none",
                "font-size":11
            },
            parent:gGrid,
            attribute:{
                x:cr[0],
                y:-wh.height/2+30,
                stroke:"#033",
                "text-anchor": "middle"
            },
            innerHTML: Math.round(optionCenterCursor.cr[0])
        });
         new LayGroupHTML({
            tag:"line",
            svg:true,
            parent:gGrid,
            attribute:{
                x1:40-wh.width/2,
                y1:cr[1],
                x2:cr[0]-30,
                y2:cr[1],
                "stroke-width":  ".5",
                stroke:"#033",
                "stroke-dasharray":"12,8"
            },
            style:{
                "pointer-events":"none"
            }
        }); 
        new LayGroupHTML({
            tag:"text",
            svg:true,
            style:{
                "pointer-events":"none",
                "font-size":11
            },
            parent:gGrid,
            attribute:{
                x:-wh.width/2+30,
                y:cr[1]+4,
                stroke:"#033",
                "text-anchor": "end"
            },
            innerHTML: Math.round(optionCenterCursor.cr[1])
        });
    }
   // console.log(countX);
};
function setCenterCursor(opt){
    for (var k in opt) optionCenterCursor[k] = opt[k];
    if (opt.display != undefined) createGrid();

}
export {
    createGrid,
    setCenterCursor
};