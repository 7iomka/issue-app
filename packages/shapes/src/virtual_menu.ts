import { billet,readOnload  } from "./billet";
import { areal, matrixAreal, setMatrix } from "./areal";
import { LayGroupHTML,setUpFunction } from "./class";
import { Mt3, write_matrix, substitutionPath, read_cord} from "./expan.js";
import { elcurentSelect } from "./extra_panel";
import {  checkedFixAng, setCurentAngLine } from "./edge";

var mn = billet['chil']['virtualConroll'];

function createS(parent,ch){
    readOnload(ch);
    if (ch.hasAttribute("onload")) 
        
        if (ch['chil']) {
            var n = new LayGroupHTML({
                svg:true,
                tag:"g",
                name:ch.getAttribute("onload"),
                parent:parent
            }); 
            for (var k in ch['chil']) createS(n,ch['chil'][k]);
        } else new LayGroupHTML({
            svg:true,
            tag:"g",
            name:ch.getAttribute("onload"),
            parent:parent,
            elementInsert:ch
        });
    }
    
   // var n= 



createS(areal.children[0].child_name['virtualMenu'],mn);

substitutionPath(areal.children[0].child_name['virtualMenu'].html);
areal.children[0].child_name['virtualMenu'].resize = function(){
    //console.log(this);
    var cord = read_cord(this.children[0].html)
    write_matrix(this.children[0].html,new Mt3().trans(-cord.x-cord.width/2+this.parN(2).current_position.width/2,-cord.y-cord.height+this.parN(2).current_position.height-20));
};
//console.log( areal.children[0].child_name['virtualMenu'] );
var curentTime = 0;
var arFunc = [];
(function anim(time){
    requestAnimationFrame(anim);
    curentTime = time;
    for (var e of arFunc) e.fn(time);
    //console.log(time);
}());


var menu = areal.children[0].child_name['virtualMenu'].children[0];

var joystik = menu.child_name['joystik'];
var step = 1;
var obDefault = {
        data:{x:0,y:0},
        callback:function(d){
            if (elcurentSelect.select) return;
            this.data = {x:0,y:0};
            /* var e = matrixAreal.elements.slice(6,8)
            this.data.x = e[0];
            this.data.y = e[1]; */
            var mt = new Mt3().trans(d.x,d.y).multiply(matrixAreal);
            setMatrix(mt);
        }
    }
var arEventJoistik = [
    obDefault
];
(function initJoistik(){
    for (var k of joystik.children) {
        k.html.style.cursor = "pointer";
    };
    /* joystik.child_name['up'].down = {
        fnDown:function(){
            alert();
        }
    }; */
    /* joystik.child_name['up'].addEvent("down",joystik.child_name['up'],function(){
        alert();
    }) */
    
    var stJ = [
        {
            name:"up",
            fn:function(d){
                d.y-=step;
                return d;
            }
        },
        {
            name:"down",
            fn:function(d){
                d.y+=step;
                return d;
            }
        },
        {
            name:"left",
            fn:function(d){
                d.x-=step;
                return d;
            }
        },
        {
            name:"reight",
            fn:function(d){
                d.x+=step;
                return d;
            }
        }
];
    
    for (var i=0;i<stJ.length;i++) (function(){
        var f = stJ[i].fn;
        joystik.child_name[stJ[i].name].setOption({
            "down":{
                fnDown:function(){
                    setCurentAngLine();
                            
                    arFunc.push({
                        stepTime:800,
                        nextTime:curentTime,
                        countCicl:0,
                        fn:function(t){
                            
                            if (t>this.nextTime) {
                                //console.log(55);
                                for (var e of arEventJoistik) e.callback(f(e.data));
                                checkedFixAng();
                                this.nextTime+=this.stepTime;
                                this.countCicl++;
                                if (this.countCicl>2) this.stepTime=100;
                                if (this.countCicl>20) step = 6;
                            };
                            
                            //console.log(this)
                        }
                    })
                   // console.log(11);
                }
            }
        })  
    })()
   // console.log(joystik)
})();

function resetVirtualMenu(){
    arFunc = [];
   /*   */
    step = 1;
   // console.log("reset");
};
function rsetArEventJoistik(){
    arEventJoistik = [
        obDefault
    ];
}

setUpFunction(resetVirtualMenu);


function init_virtual_menu(){};

export {
    init_virtual_menu,
    resetVirtualMenu,
    arEventJoistik,
    rsetArEventJoistik
}