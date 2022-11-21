import { text } from "express";
import { LayGroupHTML, lenPoint } from "./class";
import { Mt3, write_matrix, read_cord} from "./expan.js";





      


function angHordR(h,r){
    
    return Math.asin(lenPoint(h)/2/r)*2 || Math.PI;
};

function createAreal(){
    let areal = new LayGroupHTML({
        name:"areal",
        resize:function(){
            this.setPosition({
                width:this.html.parentNode.offsetWidth,
                height:this.html.parentNode.offsetHeight,
                left:0,
                top:0
            })
        // console.log(this.parent.current_position);
        },
        scroll:function(d){
            var sc = (1-d);
            /* setMatrix( 
                    new Mt3()
                    .multiply(matrixAreal)
                    .scale(sc,sc)
                ); */
        },
        style:{
            
                "-webkit-touch-callout": "none", /* iOS Safari */
                "-webkit-user-select": "none",   /* Chrome/Safari/Opera */
                "-khtml-user-select": "none",    /* Konqueror */
                "-moz-user-select": "none",     /* Firefox */
                "-ms-user-select": "none",       /* Internet Explorer/Edge */
                "user-select": "none",           
                position:""
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
                        svg:true,
                        tag:"text",
                        innerHTML:"Здесь будет просмотрщик фигур",
                        resize:function(){
                            write_matrix(this.html,new Mt3().trans(this.parent.wh_parent[0]/2-100,this.parent.wh_parent[1]/2))
                        }
                    })
                ]
               /* childrenElem:[
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
                    
                    
                ]*/
            })
        ] 
    });

    /* areal.children[0].child_name['lineSize'].resize();
    areal.children[0].child_name['layerEdge'].resize();
    areal.children[0].child_name['material'].resize();
    areal.children[0].child_name['arealGradient'].resize(); */
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
                        //closeBlockSelect();
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
                }
            });

    function stopPropagationRec(event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        event.stopPropagation(); 
    };
    rectBackground.html['addEventListener']("mousedown",stopPropagationRec);
    rectBackground.html['addEventListener']("touchstart",stopPropagationRec);
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
    
        matrixAreal = mt;
    
        if (oldScale!=curentScale) {
           // for (var e of group.child_name['gropeEdge'].children) e.edge.move();
    
           // cLineSize()
            /* .then(
                (d)=>console.log("createLineSize",d)
            ); */
        };
        
       // console.log(areal.children[0])
       // hole.setMove("");
      //  
        rectBackground.runEvent("colorCursorHole","");
        //createGrid();
    
        //el.child_name['inputCord'].setValue([20,30]);
        oldScale = curentScale;
        
    };
    function defAreal(def){
        setMatrix(matrixAreal.trans(def[0],def[1]))
    };

    return areal;
}
export { createAreal }