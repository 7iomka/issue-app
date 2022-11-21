import { LayGroupHTML, lenPoint } from "./class";
import { Mt3, write_matrix, read_cord} from "./expan.js";
import { createGrid } from "./grid";
import { 
    
    closeBlockSelect,
} from "./extra_panel";
import { billet, readOnload } from "./billet";
import { hole } from "./hole";
import { createSizeLine,cLineSize } from "./line_size";

import { 
    Edge,LineEdge, 
    CircEdge, 
    checkedFixAng
} from './edge';


//import { setHtml } from "./move_areal";

//console.log(pdf)
(function readProject(){
    var svProject = require('project.svg');
    var div = document.createElement("div");
    div.insertAdjacentHTML("afterbegin",svProject);
    var t = div.getElementsByTagName("text")['dataSave'];

    setTimeout(()=>openFile(JSON.parse(t.innerHTML)),100);
}
)();


var group  = new LayGroupHTML({
    svg:true,
    tag:"g",
    name:"layerEdge",
    childrenElem:[
        new LayGroupHTML({
            tag:"g",
            name:'gropeEdge',
            svg:true
        }),
        new LayGroupHTML({
            tag:"g",
            name:'gropeTypeLigth',
            style:{display:"none","pointer-events":"none"},
            svg:true
        })
    ],
    resize:function(){
        var ps = this.parN(2).current_position;
        write_matrix(this.html,new Mt3().trans(ps.width/2,ps.height/2).transAr(matrixAreal.elements.slice(6,8)));
    }

});
var curentScale = .3 ;
var WH = [0,0]
var rectBackground = new LayGroupHTML({
            tag:"rect",
            name:"rectBackground",
            svg:true,
            attribute:{
                x:0,
                y:0,
                width:200,
                height:200,
                fill:"#000",
                opacity:0.1
            },
            resize:function(){
                this.wh = [this.parN(2).current_position.width,this.parN(2).current_position.height];
                WH = this.wh;
                this.html.setAttribute("width",this.wh[0]);
                this.html.setAttribute("height",this.wh[1]);
            },
            down:{
                fnDown:function(cord){
                    this.curenrOptionDown = {
                        matrixAreal:matrixAreal.clone(),
                        cord:cord.cord
                    };
                    closeBlockSelect();
                    //console.log("down",);
                },
                fnMove:function(cord){
                   // console.log(this.curenrOptionDown);
                    var def = [Math.round(cord.cord[0] - this.curenrOptionDown.cord[0]),Math.round(cord.cord[1] - this.curenrOptionDown.cord[1])];
                    setMatrix( 
                        new Mt3()
                        .multiply(this.curenrOptionDown.matrixAreal)
                        .trans(def[0],def[1])
                    );
                    
                }
            }/* ,
            scroll:function(d){
                var sc = (1-d*.1);
                setMatrix( 
                        new Mt3()
                        .multiply(matrixAreal)
                        .scale(sc,sc)
                    );
            } */
        });

function stopPropagationRec(event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    event.stopPropagation(); 
};
rectBackground.html['addEventListener']("mousedown",stopPropagationRec);
rectBackground.html['addEventListener']("touchstart",stopPropagationRec);

/* rectBackground.addEvent("move",{},function(arg){
    console.log(44);
}) */
//console.log(rectBackground);
/* let grad = billet['chil']['backgroundFigure'].getElementsByTagName("linearGradient")[0];
console.log(areal.children[0],grad.id); */
var areal = new LayGroupHTML({
    name:"areal",
    resize:function(){
        this.setPosition({
            width:this.parent.current_position.width-250,
            height:this.parent.current_position.height,
            left:0,
            top:0
        })
       // console.log(this.parent.current_position);
    },
    scroll:function(d){
        var sc = (1-d);
        setMatrix( 
                new Mt3()
                .multiply(matrixAreal)
                .scale(sc,sc)
            );
    },
    style:{
        
            "-webkit-touch-callout": "none", /* iOS Safari */
            "-webkit-user-select": "none",   /* Chrome/Safari/Opera */
            "-khtml-user-select": "none",    /* Konqueror */
            "-moz-user-select": "none",     /* Firefox */
            "-ms-user-select": "none",       /* Internet Explorer/Edge */
            "user-select": "none"           
            
    },
    childrenElem:[
        new LayGroupHTML({
            tag:"svg",
            svg:true,
            resize:function(){
                this.html.setAttribute("width",this.parent.current_position.width);
                this.html.setAttribute("height",this.parent.current_position.height);
            },
            childrenElem:[
                new LayGroupHTML({
                    name:"gradFigure",
                    svg:true,
                    tag:"defs",
                    childrenElem:[
                        new LayGroupHTML({
                            elementInsert:billet['chil']['backgroundFigure'].getElementsByTagName("linearGradient")[0],
                            attribute:{
                                id:"gradFigure",
                                x1:"0%",
                                x2:"100%",
                                y1:"0%",
                                y2:"100%",
                            },
                            resize:function(){
                                //"x1","x2","y1","y2",
                                let at = ["gradientUnits"];
                                for (let t of at) if (this.html.hasAttribute(t)) this.html.removeAttribute(t);
                               // write_matrix(this.html,new Mt3().rotX(Math.PI/4))
                                //console.log(44,this);
                            }
                        })
                    ]
                    //
                }),
                rectBackground,
                new LayGroupHTML({
                    svg:true,
                    tag:"g",
                    name:"material",
                    resize:function(){
                        var ps = this.parN(2).current_position;
                        write_matrix(this.html,new Mt3().trans(ps.width/2,ps.height/2).transAr(matrixAreal.elements.slice(6,8)));
                    }
                }),
                new LayGroupHTML({
                    svg:true,
                    tag:"g",
                    name:"arealGradient",
                    style:{
                        "pointer-events":"none"
                    },
                    resize:function(){
                        var ps = this.parN(2).current_position;
                       //.transAr()
                        //console.log();
                        var def = matrixAreal.elements.slice(6,8);
                        write_matrix(this.html,new Mt3().trans(ps.width/2,ps.height/2).transAr(matrixAreal.elements.slice(6,8)));
                    }
                }),
                new LayGroupHTML({
                    svg:true,
                    tag:"g",
                    name:"gridSize",
                    attribute:{
                        opacity:.3,
                        stroke:"#c0f"
                    },
                    resize:function(){
                        var ps = this.parN(2).current_position;
                        write_matrix(this.html,new Mt3().trans(ps.width/2,ps.height/2));
                        createGrid();
                    }
                }),
                group,
                
                new LayGroupHTML({
                    svg:true,
                    tag:"g",
                    name:"lineSize",
                    resize:function(){
                        var ps = this.parN(2).current_position;
                       //.transAr()
                        //console.log();
                        var def = matrixAreal.elements.slice(6,8);
                        write_matrix(this.html,new Mt3().trans(ps.width/2,ps.height/2).transAr(matrixAreal.elements.slice(6,8)));
                    }
                }),
                
                new LayGroupHTML({
                    name:"layHole",
                    svg:true,
                    tag:"g",
                    resize:function(){
                        var ps = this.parN(2).current_position;
                        write_matrix(this.html,new Mt3().trans(ps.width/2,ps.height/2));
                    }
                }),
                new LayGroupHTML({
                    svg:true,
                    tag:"g",
                    name:"layerCursorHole",
                    style:{"pointer-events":"none",opacity:0},
                    resize:function(){
                        var cr = read_cord(this.html);
                        write_matrix(this.html,new Mt3().trans(-cr.x-cr.width/2+this.parent.wh_parent[0]/2,-cr.y-cr.height/2+this.parent.wh_parent[1]/2));
                        //console.log(44,this.parent.wh_parent);
                    },
                    elementInsert:billet["chil"]['cursorHole']
                }),
                new LayGroupHTML({
                    svg:true,
                    tag:"g",
                    name:"virtualMenu",
                    //style:{opacity:0},
                    resize:function(){
                       
                        
                    },
                    //elementInsert:billet['chil']['virtualConroll']
                }),
                
                
            ]
        })
    ]
});
areal['getMinMax'] = function(){
    var listEdge = this.children[0].child_name['layerEdge'].children[0].children;
    var rt2 = [listEdge[0].edge.option.arArc[0][0],listEdge[0].edge.option.arArc[0][1],listEdge[0].edge.option.arArc[0][0],listEdge[0].edge.option.arArc[0][1]];
    for (var i=0;i<listEdge.length;i++) for (var j=0;j<listEdge[i].edge.option.arArc.length;j++){
        rt2[0] = Math.min(rt2[0],listEdge[i].edge.option.arArc[j][0]);
        rt2[1] = Math.min(rt2[1],listEdge[i].edge.option.arArc[j][1]);
        rt2[2] = Math.max(rt2[2],listEdge[i].edge.option.arArc[j][0]);
        rt2[3] = Math.max(rt2[3],listEdge[i].edge.option.arArc[j][1]);
    };
    return rt2;
};
areal['clear'] = function(){
    var ledge = this.children[0].child_name['layerEdge'].children[0];
    while (ledge.children.length) ledge.children[0].remove();
    //console.log("clear",);
};
areal['transformFigureMatrix'] = function(mt){
    var edge = areal.children[0].child_name['layerEdge'].children[0].children;
    for(var i=0;i<edge.length;i++) for (var j=0;j<2;j++) {
        var c = new Mt3().trans(edge[i].edge.cord[j][0],edge[i].edge.cord[j][1]).multiply(mt).elements.slice(6,8);
        edge[i].edge.cord[j] = [
            Math.round(c[0]),
            Math.round(c[1])
        ]
        //console.log(edge[i].edge.cord);
        /* edge[i].edge.cord[j] = [
            Math.round(edge[i].edge.cord[j][0]-cr[0]),
            Math.round(edge[i].edge.cord[j][1]-cr[1])
        ]; */
    }
    for (var e of edge) e.edge.setCord(e.edge.cord.slice());
};
//console.log(areal.children[0])
var matrixAreal = new Mt3();
var mnMxSc = [.2,4];
var oldScale = 1;
function setMatrix(mt){
    
    var mn_mx = areal['getMinMax']();
    var scFig = Math.min(WH[0]/(mn_mx[2]-mn_mx[0]),WH[1]/(mn_mx[3]-mn_mx[1]));
    curentScale = (( new Mt3().trans(1000,0).multiply(mt).elements[6] - mt.elements[6]) / 1000) ;
   //console.log(mn_mx,WH);* scFig
    if (curentScale<(mnMxSc[0]*scFig)) {
        var sc = ((mnMxSc[0]*scFig)/curentScale);
        setMatrix(new Mt3().multiply(mt).scale(sc,sc));
        return;
    };
    if (curentScale>(mnMxSc[1]*scFig)) {
        var sc = (mnMxSc[1]*scFig)/curentScale;
        
        setMatrix(new Mt3().multiply(mt).scale(sc,sc));
        return;
    };

    var m1 = new Mt3().transAr(mn_mx.slice(0,2)).multiply(mt).elements.slice(6,8);
    if (m1[0]>0) {
        setMatrix(new Mt3().multiply(mt).trans(-m1[0],0));
        return;
    };
    if (m1[1]>0) {
        setMatrix(new Mt3().multiply(mt).trans(0,-m1[1]));
        return;
    };
    var m1 = new Mt3().transAr(mn_mx.slice(2,4)).multiply(mt).elements.slice(6,8);
    if (m1[0]<0) {
        setMatrix(new Mt3().multiply(mt).trans(-m1[0],0));
        return;
    };
    if (m1[1]<0) {
        setMatrix(new Mt3().multiply(mt).trans(0,-m1[1]));
        return;
    };
    
    //console.log(m1)
    //curentScale*=scFig;
   // console.log(curentScale);
    matrixAreal = mt;
   
    //console.log(new Mt3().trans(100,0).multiply(mt).elements[6]);
    //
    if (oldScale!=curentScale) {
        for (var e of group.child_name['gropeEdge'].children) e.edge.move();
        //createSizeLine(()=>{});
        cLineSize()/* .then(
            (d)=>console.log("createLineSize",d)
        ); */
    };
    areal.children[0].child_name['lineSize'].resize();
    areal.children[0].child_name['layerEdge'].resize();
    areal.children[0].child_name['material'].resize();
    areal.children[0].child_name['arealGradient'].resize();
   // console.log(areal.children[0])
    hole.setMove("");
  //  
    rectBackground.runEvent("colorCursorHole","");
    createGrid();

    //el.child_name['inputCord'].setValue([20,30]);
    oldScale = curentScale;
    
};
function defAreal(def){
    setMatrix(matrixAreal.trans(def[0],def[1]))
}
      


function angHordR(h,r){
    
    return Math.asin(lenPoint(h)/2/r)*2 || Math.PI;
};

//lenPoint(




function openFile(data) {
        var edg = areal.children[0].child_name['layerEdge'].children[0];
        while (edg.children.length) edg.children[0].remove();
        //console.log("open",data);
        for(var e of data.edge) if (e.type == "CircEdge") {
            new  CircEdge(e.option);
        } else new  LineEdge(e.option);
        for(var j=0; j<data.edge.length; j++) if (data.edge[j].option.group) {
            
            edg.children[j].edge.group.ar = []; 
            edg.children[j].edge.group.option = data.edge[j].option.group.option;
            for (let i=0;i < data.edge[j].option.group.arIndex.length; i++) {
                var index = data.edge[j].option.group.arIndex[i];
                edg.children[j].edge.addElemGroup(edg.children[index].edge)
                //console.log( edg.children[index].edge, edg.children[j].edge.group.ar);
                 /*var ee = true;
                for (var ii=0;ii<edg.children[j].edge.group.ar.length;ii++) if (edg.children[j].edge.group.ar[ii] === edg.children[index].edge) ee = false;
                if (ee) {
                    edg.children[j].edge.group.ar.push(edg.children[index].edge);
                    edg.children[index].edge.group.option = edg.children[j].edge.group.option;
                } */
                
            }
        };
        //console.log(edg);
       // createSizeLine(()=>{});
       setMatrix(new Mt3().scl(.3))
       cLineSize();
       //setCurentAngLine();
       //checkedFixAng()
    };

function openProject(){
    var inp=document.createElement("input");
        inp.type="file";
        inp.onchange = function() {
                var  textFile =this['files'][0]; 
                //console.log(textFile.type);
                if (textFile.type == 'image/svg+xml') {
                    var reader = new FileReader();
                    reader.onloadend = function(event) {
                        var text = event.target.result+"";
                        var div = document.createElement("div");
                        div.insertAdjacentHTML("afterbegin",text);
                        var t = div.getElementsByTagName("text")['dataSave'];
                        if (t) openFile(JSON.parse(t.innerHTML));
                        //console.log(t);
                        //
                    };
                    reader.onerror = function() {
                        alert('Ошибка чтения файла!');
                    };
                    reader.readAsText(textFile);
                } else {
                        alert('Это не SVG файл!');
                };
        };
        document.body.appendChild(inp);
        inp.click();
        document.body.removeChild(inp);
    
    


}

/* new CircEdge({
    cord:[
        [-50,-50],
        [50,-50]
    ],
    r:50,
    vec:0
}); */
//setTimeout(()=>ee.selectLine(),100);



new LineEdge({
    cord:[
        [-50,-50],
        [50,-50]
    ]
});
 new LineEdge({
    cord:[
        [50,-50],
        [50,50]
        
        
    ]
}); 
/* new CircEdge({
    cord:[
        [50,-50],
        [50,50]
    ],
    r:50,
    vec:0
}); */
 new LineEdge({
    cord:[
        [50,50],
        [-50,50]
    ]
});

new LineEdge({
    cord:[
        [-50,50],
        [-50,-50]
    ]
}); 
//createSizeLine(()=>{});
cLineSize();
//checkedFixAng();

function optionEdge(){
    var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
    for (var i=0;i<arEdge.length;i++) arEdge[i].edge['indexAr'] = i;
    var ret = [];
    var requiredOption = ['pointR','r',"vec",'aspect']
    for (var k of arEdge) ret.push({
        cord:k.edge.cord,
        type:k.edge.type || "LineEdge",
        option:(()=>{
            var ret = {};
            if (k.edge.type=="CircEdge") for (var t of requiredOption) ret[t]=k.edge.option[t];
            ret['indexAr'] = k.edge['indexAr'];
            return ret
        })(),
        group:k.edge.group,
        edge:k.edge,
        edgeLink:k.edge.edgeLink,
        data:{}
    });
    for (var k of ret) k.data = {
        cr:k.cord,
        type:k.type,
        option:k.option
    }
    return ret;
    //console.log("ret",ret,arEdge);
};


//setMatrix(new Mt3());
export { 
    areal, 
    matrixAreal, 
    curentScale,
    defAreal, 
    
    //saveProject, 
    openProject, 
    optionEdge,
    setMatrix,
    angHordR,
    rectBackground,
    group,
    WH
};