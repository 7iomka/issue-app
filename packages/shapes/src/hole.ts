

//import { extraPanel } from "./extra_panel";
import { billet, readOnload } from "./billet";
import { areal, matrixAreal, defAreal,setMatrix } from "./areal";
import { Mt3, write_matrix, read_cord} from "./expan.js";
import { InverseMatrix } from "./func";
import { lineSegmentsIntersect, len_to_line, LayGroupHTML } from "./class";
import { setValueCordCurentCursor, setValueStratPointCursor, createBlockInputSelectHole } from "./extra_panel";
import { createSizeLine,cLineSize } from "./line_size";
import { setCenterCursor } from "./grid";
var timeCursor;
var listEdge = areal.children[0].child_name['layerEdge'].children[0].children;
const minLengthEdge = 10;

class Hole{
    parentLayHole = areal.children[0].child_name['layHole'];
    create = function(cr,option){
        if (this.checkInsert(cr)) {
           var h =new LayGroupHTML({
                name:"holeOne",
                parent:this.parentLayHole,
                svg:true,
                tag:"g",
                elementInsert:billet['chil']['hole'],
                style:{cursor:"move"},
                down:{
                    fnDown:function(e){
                        this.cordDown = {
                            cursor : e.cord,
                            curentCord : this.option.cr.slice(),
                            curentScale : ( new Mt3().trans(1000,0).multiply(matrixAreal).elements[6] - matrixAreal.elements[6]) / 1000
                        };
                        this.select();
                        hole.cursorOff();
                    },
                    fnMove:function(e){
                        var def = [e.cord[0] - this.cordDown.cursor[0],e.cord[1] - this.cordDown.cursor[1]];
                        this.option.cr = [
                            Math.round(this.cordDown.curentCord[0]+def[0]/this.cordDown.curentScale),
                            Math.round(this.cordDown.curentCord[1]+def[1]/this.cordDown.curentScale)
                        ];
                        this.move();
                       // createSizeLine(()=>{});
                       cLineSize();
                    }
                }

            });
            h['arLineDesignation'] = [
                [[0,0],[0,0]]
            ];
            h['option'] = {
                d:5,
                len:0,
                ang:0,
                cr
            };
            h['select'] = function(){
                var el = this;
                createBlockInputSelectHole(el)
               // setTimeout(()=>,200);
                //console.log(this);
                this.html.getElementsByTagName("path")[0].style.opacity = 1;
            };
            h['closeSelect'] = function() {
                this.html.getElementsByTagName("path")[0].style.opacity = 0;
                //console.log(this);
            };
            h['select']();
            var _this = this;
            h['move'] = function(){
                _this.setMove(this);
                this.runEvent("move",this.option);
                hole.cursorOff();
            };
            if (option) for (var k in option) h['option'][k] = option[k];
            this.setMove(h);
            //console.log(h);
            
        }
    };
    setMove = function(el){
        function move (e){
            var crEl = read_cord(e.html)
            var sc = e.option.d/crEl.width;
            write_matrix(e.html,new Mt3()
                                .trans(-crEl.x-crEl.width/2,-crEl.y-crEl.height/2)
                                .scl(sc,sc)
                                .trans(e.option.cr[0],e.option.cr[1])
                                .multiply(matrixAreal)
            );
            var curentScaleAreal= ( new Mt3().trans(1000,0).multiply(matrixAreal).elements[6] - matrixAreal.elements[6]) / 1000 * sc;
            var pt = e.html.getElementsByTagName("path");
            for (var i=1;i<3;i++) pt[i].style["stroke-width"] = billet['chil']['hole'].getElementsByTagName("path")[1].style["stroke-width"]/curentScaleAreal;
            pt[0].style["stroke-width"] = billet['chil']['hole'].getElementsByTagName("path")[0].style["stroke-width"];
            if (parseFloat(pt[0].style["stroke-width"])*curentScaleAreal<20) {
                pt[0].style["stroke-width"] = 20/curentScaleAreal
            };
            e.arLineDesignation = [
                [
                    new Mt3().trans(e.option.cr[0]-e.option.d/2,e.option.cr[1]-e.option.d/2).multiply(matrixAreal).elements.slice(6,8),
                    new Mt3().trans(e.option.cr[0]+e.option.d/2,e.option.cr[1]-e.option.d/2).multiply(matrixAreal).elements.slice(6,8)
                ],
                [
                    new Mt3().trans(e.option.cr[0]+e.option.d/2,e.option.cr[1]-e.option.d/2).multiply(matrixAreal).elements.slice(6,8),
                    new Mt3().trans(e.option.cr[0]+e.option.d/2,e.option.cr[1]+e.option.d/2).multiply(matrixAreal).elements.slice(6,8)
                ],
                [
                    new Mt3().trans(e.option.cr[0]+e.option.d/2,e.option.cr[1]+e.option.d/2).multiply(matrixAreal).elements.slice(6,8),
                    new Mt3().trans(e.option.cr[0]-e.option.d/2,e.option.cr[1]+e.option.d/2).multiply(matrixAreal).elements.slice(6,8)
                ],
                [
                    new Mt3().trans(e.option.cr[0]-e.option.d/2,e.option.cr[1]+e.option.d/2).multiply(matrixAreal).elements.slice(6,8),
                    new Mt3().trans(e.option.cr[0]-e.option.d/2,e.option.cr[1]-e.option.d/2).multiply(matrixAreal).elements.slice(6,8)
                ]
            ]
            //console.log( e );
        };
        if (el) {move(el)} else for (var e of this.parentLayHole.children) move(e);
    };
    checkInsert  = function (cr){
        //console.log(areal['getMinMax']());
        var mnX = areal['getMinMax']()
        
        var countInt = 0;
        for (var ed of listEdge) {
            if (lineSegmentsIntersect(ed.edge.cord,[cr,[cr[0]+2*(mnX[2]-mnX[0]),cr[1]]])) countInt++;
        };
        var segInt = !!(countInt%2);
        if (segInt) {
            var ar = [];
            for (var ed of listEdge) ar.push(len_to_line({
                point:cr,
                line:ed.edge.cord
            }).len);
            ar.sort((a,b)=>{if(a>b) {return 1} else return -1});
            if (ar[0]<minLengthEdge) segInt = false;
        };
        return segInt;
    };
//setEvent = function()
    layCursor = areal.children[0].child_name['layerCursorHole'];
    
    setLayHTML = function(el){
        //console.log(el);
        var _this = this;
        el.setOption({
            move:function(e){
               // console.log("moveHole");
              // console.log(el);
              _this.cursorOff();
                if (el.name == 'hole') _this.cursorHoleOn();
                if (el.name == 'startPoint') {
                    _this.cursorStartPointOn();
                    var cr =InverseMatrix(matrixAreal.elements)[2].slice(0,2);
                    setCenterCursor({
                        display:true,
                        cr
                    })
                    setValueStratPointCursor({
                        cr
                    });
                }
            }
        });
        if (el.name == 'hole') el.child_name["addHole"].setOption({
            down:{
                fnDown:function(e){
                   // console.log();
                    _this.cursorHoleOn();
                    _this.create(
                        InverseMatrix(matrixAreal.elements)[2].slice(0,2)
                    );
                    //createSizeLine(()=>{});
                    cLineSize();
                    //console.log("downHole",_this.checkInsert(InverseMatrix(matrixAreal.elements)[2].slice(0,2))); 
                }
            }
        });
         if (el.name == 'startPoint') el.child_name["addHole"].setOption({
            down:{
                fnDown:function(e){
                   // console.log();
                    var cr = InverseMatrix(matrixAreal.elements)[2].slice(0,2);
                    areal['transformFigureMatrix'](new Mt3().trans(-cr[0],-cr[1]));
                    
                    var def = matrixAreal.elements.slice(6,8);
                    setMatrix( 
                        new Mt3()
                        .multiply(matrixAreal)
                        .trans(-def[0],-def[1])
                    );
                    
                   // console.log(cr);
                    //createSizeLine(()=>{});
                    cLineSize();
                    //console.log("downHole",_this.checkInsert(InverseMatrix(matrixAreal.elements)[2].slice(0,2))); 
                }
            }
        });
        for (var i of el.html.getElementsByTagName("input")) i.addEventListener("change",function(){
            var ar = [];
            for (var j of el.html.getElementsByTagName("input")) ar.push(parseFloat(j.value));
            var curentpos = InverseMatrix(matrixAreal.elements)[2].slice(0,2);
            defAreal([curentpos[0]-ar[0],curentpos[1]-ar[1]]);
            //console.log(ar,areal);
        })
    };
    statusCursor = false;
    cursorHoleOn = function(){
        var _this = this;
        clearTimeout(timeCursor);
        timeCursor = setTimeout(()=>_this.cursorHoleOff(),25000);
        this.layCursor.html.style.opacity = 1;
        areal.children[0].child_name['rectBackground'].runEvent("colorCursorHole","");
        setValueCordCurentCursor({
            cursor:true,
        });
        this.statusCursor = true;
        setCenterCursor({display:true})
    };
    
    cursorStartPointOn = function(){
        var _this = this;
        clearTimeout(timeCursor);
        timeCursor = setTimeout(()=>_this.cursorStartPointOn(),25000);
        this.layCursor.html.style.opacity = 1;
        areal.children[0].child_name['rectBackground'].runEvent("colorCursorHole","");
        setValueStratPointCursor({
            cursor:true,
        });
        this.statusCursor = true;
        setCenterCursor({display:true})
    };
    cursorOff = function(){
        this.layCursor.html.style.opacity = 0;
        setValueCordCurentCursor({
            cursor:false,
        });
        setValueStratPointCursor({
            cursor:false,
        });
        hole.statusCursor = false;
        startPoint.statusCursor = false;
        var path = areal.children[0].child_name['layerCursorHole'].html.getElementsByTagName("path");
        for (var e of path) e.style["stroke"] = "#000";
        setCenterCursor({display:false})
    };
    
    constructor(){
        
    }
};
var hole = new Hole();
var startPoint = new Hole();
areal.children[0].child_name['rectBackground'].addEvent("colorCursorHole",{},function(arg){
    if (hole.statusCursor) {
        var colorCursor = "#f00";
        var cr =InverseMatrix(matrixAreal.elements)[2].slice(0,2);
        var pointInBlock = hole.checkInsert(cr);
        if (pointInBlock) colorCursor = "#000";
        setValueCordCurentCursor({
            cr,
            pointInBlock
        });
        var path = areal.children[0].child_name['layerCursorHole'].html.getElementsByTagName("path");
        for (var e of path) e.style["stroke"] = colorCursor;
        setCenterCursor({cr})
    };

    if (startPoint.statusCursor) {
        var cr =InverseMatrix(matrixAreal.elements)[2].slice(0,2);
        setValueStratPointCursor({
            cr
        });
        setCenterCursor({cr})
    };
   // console.log(hole.statusCursor,startPoint.statusCursor);
});
areal.addEvent("cursorHoleOff",{},function(arg){
   hole.cursorOff();
});




export { hole, startPoint }