
import { areal, matrixAreal, curentScale, optionEdge } from "./areal";
import { LayGroupHTML, lineSegmentsIntersect,lineSegmentsIntersectBool, lenPoint, Loop } from "./class";
import { billet, readOnload } from "./billet";
import { Mt3, write_matrix, read_cord, cosVect} from "./expan.js";
import { analysis } from "./analysis";
import { filterSizeLineLigth } from "./mirror_lighting";
import { elcurentSelect } from "./extra_panel";
var laySize = new LayGroupHTML({});
var stCicl;

var callB = ()=>{};
function createSizeLine(callback) {
    
    callB = callback;
    var arPoint = [];//масив всех точек для которых нужно построить размеры
    var layEdge = areal.children[0].child_name['layerEdge'].child_name['gropeEdge'].children;
    for (var e of layEdge) e.edge.findLink();
    for (var e of layEdge) {
        for (var e1 of e.edge.cord) {
            var addBool = true;
            for (var j of arPoint) if (j.cord+""==e1+"") addBool = false;
            e.edgeLineSize = {};
            if (addBool) arPoint.push({
                cord:e1.slice(),
                el:e,
                type:"edge"
            });
        }; 
        if (e.edge!['type']=="CircEdge") {
            //console.log(e.edge.option.arArc);
            for (var t of e.edge.option.arArc) arPoint.push({
                cord:t.slice(),
                el:e,
                type:"edgeCirc"
            });
           // console.log(e.edge);
        };
    };
    var layHole = areal.children[0].child_name['layHole'].children;
    for (var h of layHole) {
        arPoint.push({
            cord:h.option.cr.slice(),
            el:h,
            type:"hole"
        })
    };

    var mn_mx = [arPoint[0].cord[0],arPoint[0].cord[1],arPoint[0].cord[0],arPoint[0].cord[1]];
    for (var e of arPoint) {
        if (e.cord[0]<mn_mx[0]) mn_mx[0] = e.cord[0];
        if (e.cord[1]<mn_mx[1]) mn_mx[1] = e.cord[1];
        if (e.cord[0]>mn_mx[2]) mn_mx[2] = e.cord[0];
        if (e.cord[1]>mn_mx[3]) mn_mx[3] = e.cord[1];
    };

    /* for (var e of layEdge) {
        if (e.edge!['type']=="circleEdge") {
            var addBool = true;
            for (var j of arPoint) if (j.cord+""==e.edge.option.pointR+"") addBool = false;
            if (addBool) arPoint.push({
                cord:e.edge.option.pointR.slice(),
                el:e,
                type:"edge"
            });
           //console.log(arPoint,e.edge.option.pointR,addBool)
        }   
    }; */
    buildLineSize(arPoint,mn_mx);
    //console.log(arPoint,mn_mx);
    //console.log("sizeLine",layEdge);
};

var stepDefLineSize = 25;
class LineSize extends LayGroupHTML {
        addPoint = function(cr){};
        addEdge = function(edge){
            for (var c of edge.cord) this.addPoint(c);
            edge.edgeLineSize = this;
        };
        optPos = {};
        setPosition = function(){
            this.optPos = {
                indexStep:0,
                invert:0,
                half:false,
                discant:[false,false]
            };
            //console.log(this.type);
            if (this.type=="circ") {
                //console.log(this);
                this.optPos.half = true;
            };
            this.findPosition();
        };
        findPosition = function(){
            var angRot = Math.atan2(this.crMt[1][1] - this.crMt[0][1],this.crMt[1][0] - this.crMt[0][0]);
            if ((angRot>=Math.PI/2 || (angRot<-Math.PI/2)) && !(this!['type'] == "circ")) {
                angRot+=Math.PI;
                this.crMt = [
                    this.crMt[1].slice(),
                    this.crMt[0].slice()
                ]
            };
           // if (this!['type'] == "circ") console.log(angRot);
            write_matrix(this.html,new Mt3());
            var posT = this.elLineSize['text'].html.getBoundingClientRect();
           // console.log(44,this.elLineSize['text'].html);
            
            var l = Math.sqrt(Math.pow(this.crMt[0][0] - this.crMt[1][0],2) + Math.pow(this.crMt[0][1] - this.crMt[1][1],2));
            var defL = 0
           
            if (this.optPos.half) {
                defL = l-50;
               /*  this.crMt = [
                    this.crMt[1].slice(),
                    this.crMt[0].slice()
                ] */
               // generMatr.trans(this.crMt[1][0],this.crMt[1][1]);
            };
            
            this.generMatr = new Mt3()
                    .trans(0,-stepDefLineSize*this.optPos.indexStep)
                    .rotX(angRot)
                    .trans(this.crMt[0][0],this.crMt[0][1]);
            //
            write_matrix(this.html,this.generMatr);
            //
            var kr = read_cord(billet['chil']['arrow']);
            
            if (posT.width+15>l) {
                //console.log(44);
                this.optPos.invert = 1
            };
            
            this.arLineDesignation = [
                [
                    new Mt3().trans(1+defL,0).multiply(this.generMatr).elements.slice(6,8),
                    new Mt3().trans(l-1,0).multiply(this.generMatr).elements.slice(6,8)
                ],
                [
                    new Mt3().trans(3+defL,3).multiply(this.generMatr).elements.slice(6,8),
                    new Mt3().trans(l-3,3).multiply(this.generMatr).elements.slice(6,8)
                ],
                [
                    new Mt3().trans(3+defL,-3).multiply(this.generMatr).elements.slice(6,8),
                    new Mt3().trans(l-3,-3).multiply(this.generMatr).elements.slice(6,8)
                ] ,
                [
                    new Mt3().trans(3+defL,-3).multiply(this.generMatr).elements.slice(6,8),
                    new Mt3().trans(l-3,3).multiply(this.generMatr).elements.slice(6,8)
                ],
                [
                    new Mt3().trans(3+defL,3).multiply(this.generMatr).elements.slice(6,8),
                    new Mt3().trans(l-3,-3).multiply(this.generMatr).elements.slice(6,8)
                ]
            ];
            if (this.type == "circ")  {
               
                this.arLineDesignation = [
                    [
                        new Mt3().trans(1+defL*this.optPos.invert^1 + l*this.optPos.invert,0).multiply(this.generMatr).elements.slice(6,8),
                        new Mt3().trans(l-3,0).multiply(this.generMatr).elements.slice(6,8)
                    ],
                ];
            };
            
            if (this.optPos.invert) {
               /*  this.arLineDesignation.push([
                    new Mt3().trans(l+1,0).multiply(generMatr).elements.slice(6,8),
                    new Mt3().trans(l+1+15+posT.width,0).multiply(generMatr).elements.slice(6,8)
                ]); */
                /* this.arLineDesignation.push([
                    new Mt3().trans(-15,0).multiply(generMatr).elements.slice(6,8),
                    new Mt3().trans(-1,0).multiply(generMatr).elements.slice(6,8)
                ]); */
            }
            write_matrix(this.elLineSize['ar0'].html,new Mt3().trans(-kr.x,-kr.y-kr.height/2).rotX(Math.PI*(this.optPos.invert)));
            if (defL) this.elLineSize['ar0'].html.style.display = "none";
            write_matrix(this.elLineSize['ar1'].html,new Mt3().trans(-kr.x,-kr.y-kr.height/2).rotX(Math.PI*(this.optPos.invert^1)).trans(l,0));
            var s = this.optPos.invert*(-15)+defL;
            if (this.optPos.invert && defL) s=l;
            this.elLineSize['pt'].html.setAttribute("d",`M ${s},0 L${l+this.optPos.invert*(15+posT.width)},0`);
            
            let mttext = new Mt3();
            if ((angRot>=Math.PI/2 || (angRot<-Math.PI/2)) && (this!['type'] == "circ")) {
                mttext.rotX(Math.PI)
                .trans(posT.width,7)
            };
            if (this!['type'] == "circ") console.log(angRot);
            var mtText = mttext.trans((-posT.width/2+((defL) ? l-posT.width/2-10: l/2))*(this.optPos.invert^1)+((l+10)*(this.optPos.invert)),-4);
            //console.log("mtText",this.elLineSize['text'].html.innerHTML);
            write_matrix(this.elLineSize['text'].html,mtText);

            var lText = [
                [[0,0],[posT.width,0]],
                [[posT.width,0],[posT.width,-posT.height]],
                [[posT.width,-posT.height],[0,-posT.height]],
                [[0,-posT.height],[0,0]]
            ];
            for (var t of lText) {
                var ar = [];
                for (var e of t) ar.push(new Mt3().trans(e[0],e[1]+3).multiply(mtText).multiply(this.generMatr).elements.slice(6,8));
                this.arLineDesignation.push(ar);
            };
            for (var i=0;i<this.arLineDesignation.length;i++) for (var j=0;j<this.arLineDesignation[i].length;j++) for (var k=0;k<2;k++) this.arLineDesignation[i][j][k] = Math.round(this.arLineDesignation[i][j][k]);
            var _this = this;
            this.intersectionFind({
                funcYesInter:function(){
                    /* if (_this.type == "circH" && !_this.optPos.indexStep && !_this.optPos.invert) {
                        _this.optPos.invert = 1;
                        _this.optPos.indexStep--;
                    }; */
                    if (_this.type == "circ" && !_this.optPos.invert) {
                        _this.optPos.invert = 1;
                        //console.log(_this);
                    } else  _this.optPos.indexStep++;
                   ;
                   // console.log(_this.type, _this.optPos);
                    
                    _this.findPosition();
                },
                funcNoInter:function(){
                   // console.log("this",_this);
                   if (_this.fnProm) _this.fnProm();
                   _this.fnProm=function(){};
                }
            })
          
            
        };

        intersectionFind = function(fn){
            var insectNo = true;
            var arLinefind = [];
            
            for (var i=0; i<areal.children[0].child_name['layerEdge'].children[0].children.length;i++) {
                var e = areal.children[0].child_name['layerEdge'].children[0].children[i].edge.arLineDesignation;
               // console.log(e);
                for (var t of e)  arLinefind.push(t.slice())
            };
               
            
            var ar = []
            for (var i=0;i<areal.children[0].child_name['layHole'].children.length;i++) for (var j=0;j<areal.children[0].child_name['layHole'].children[i].arLineDesignation.length;j++) arLinefind.push(areal.children[0].child_name['layHole'].children[i].arLineDesignation[j].slice());

            for (var ww of areal.children[0].child_name['lineSize'].children) if (ww!==this && ww.arLineDesignation) for (var i=0;i<ww.arLineDesignation.length;i++) arLinefind.push(ww.arLineDesignation[i].slice());
            //console.log(ww.arLineDesignation);
            ;
            // for (var i=0;i<ww.arLineDesignation.length;i++) arLinefind.push(ww.arLineDesignation[i])
            var _this = this;
            for (var i=0;i<this.arLineDesignation.length;i++) for (var j=0;j<arLinefind.length;j++) if (lineSegmentsIntersectBool(this.arLineDesignation[i],arLinefind[j])) {

                fn.funcYesInter()
                i=this.arLineDesignation.length;
                j=arLinefind.length;
            };
            fn.funcNoInter();
            
        };
        elLineSize = {};
        arLineDesignation = [];
        type = '';
        constructor (opt){
            opt.parent = areal.children[0].child_name['lineSize'];
            opt.tag = "g";
            opt.svg = true;
            opt.attribute = {
                stroke:opt.color || "#000",
                fill:opt.color || "#000",
                "stroke-width":.5
            }
            super(opt);
            this['type'] = opt.type;
            if (opt.fnProm) this['fnProm'] = opt.fnProm;
            this['crMt'] = [];
            this['cord'] = opt.cord.slice();
            this['nameText'] = opt.nameText;
            
            for (var i=0;i<2;i++) this['crMt'][i] = new Mt3()
                .trans(opt.cord[i][0],opt.cord[i][1])
                .scl(curentScale)
               // .multiply(matrixAreal)
                .elements.slice(6,8);
            
            //console.log(crMt);
           
            this.elLineSize['ar0'] = new LayGroupHTML({
                svg:true,
                parent:this,
                attrribute:{stroke:"",fill:opt.color || "#000"},
                elementInsert:billet['chil']['arrow'],
            });
           // var kr = read_cord(ar0.html);
           // write_matrix(ar0.html,new Mt3().trans(-kr.x,-kr.y-kr.height/2));

           this.elLineSize['ar1'] = new LayGroupHTML({
                svg:true,
                parent:this,
               // attrribute:{stroke:"",fill:opt.color || "#000"},
                elementInsert:billet['chil']['arrow'],
            });
            //var kr = read_cord(ar1.html);
           // write_matrix(ar1.html,new Mt3().trans(-kr.x,-kr.y-kr.height/2).rotX(Math.PI).trans(l,0));

           this.elLineSize['pt'] = new LayGroupHTML({
                parent:this,
                svg:true,
                tag:"path",
                attribute:{
                    //d:`M 0,0 L${l},0`,
                    //stroke:"#000",
                    "stroke-width":.4
                }
            });
            var val = Math.round(Math.sqrt(Math.pow(opt.cord[0][0] - opt.cord[1][0],2) + Math.pow(opt.cord[0][1] - opt.cord[1][1],2)));
            this.elLineSize['text'] = new LayGroupHTML({
                parent:this,
                svg:true,
                tag:"g",
                childrenElem:[
                    new LayGroupHTML({
                        svg:true,
                        tag:"text",
                        innerHTML: (opt['nameText'] || ""),
                        attribute:{
                            fill:"#00F",
                            stroke:"#00F",
                        }
                    }),
                    new LayGroupHTML({
                        svg:true,
                        tag:"text",
                        innerHTML: (opt['value'] || val  ),
                        attribute:{
                            x:opt['nameText'] ? opt['nameText'].length*8+5 : 0,
                            y:0
                        }
                    })
                ]
                /*  */
            })
            this.setPosition();
           // write_matrix(this.html,new Mt3().trans(crMt[0][0],crMt[0][1]))

           // console.log(this,read_cord(ar0.html));
    
        }
    };
function buildLineSize(arPoint,mn_mx) {
    
    var stT = new Date().getTime();

    var arLineSize = [
        /* [
            [mn_mx[0],mn_mx[1]],
            [mn_mx[2],mn_mx[1]]
        ],
        [
            [mn_mx[0],mn_mx[1]],
            [mn_mx[0],mn_mx[3]]
        ],
        [
            [mn_mx[0],mn_mx[1]],
            [mn_mx[2],mn_mx[1]]
        ] */
    ];
    //var mn_mx = areal['getMinMax']();
    
    var edge = areal.children[0].child_name['layerEdge'].children[0].children;
   

    for (var i=0;i<edge.length;i++) {
        //console.log("edge",edge[i].edge.cord);
        arLineSize.push({
            cr:[
                [edge[i].edge.cord[0][0],mn_mx[1]],
                [edge[i].edge.cord[1][0],mn_mx[1]]
            ]
        });
        arLineSize.push({
            cr:[
                [mn_mx[0],edge[i].edge.cord[0][1]],
                [mn_mx[0],edge[i].edge.cord[1][1]]
            ]
        });
    };
   
    var hole = areal.children[0].child_name['layHole'].children;
    for (var i = 0; i < hole.length; i++) {
        arLineSize.push({
            cr:[
                [hole[i].option.cr[0],mn_mx[1]],
                [mn_mx[0],mn_mx[1]]
            ]
        });
        arLineSize.push({
            cr:[
                [hole[i].option.cr[0],mn_mx[1]],
                [mn_mx[2],mn_mx[1]]
            ]
        });
        arLineSize.push({
            cr:[
                [mn_mx[0],hole[i].option.cr[1]],
                [mn_mx[0],mn_mx[1]]
            ]
        });
        arLineSize.push({
            cr:[
                [mn_mx[0],hole[i].option.cr[1]],
                [mn_mx[0],mn_mx[3]]
            ]
        });
    };

   /*  for (var i=0;i<edge.length;i++) if (edge[i].edge!['type']=="circleEdge") {
        arLineSize.push({
            cr:[
                [mn_mx[0],mn_mx[1]],
                [edge[i].edge.option.pointR[0],mn_mx[1]]
            ]
        });
        arLineSize.push({
            cr:[
                [mn_mx[0],mn_mx[1]],
                [mn_mx[0],edge[i].edge.option.pointR[1]]
            ]
        });
    }; */
    //console.log();


    function clearDuble(){
        for (var i=0; i < arLineSize.length;i++) if (Math.pow(arLineSize[i].cr[1][0]-arLineSize[i].cr[0][0],2)+Math.pow(arLineSize[i].cr[1][1]-arLineSize[i].cr[0][1],2)<1) {
            arLineSize.splice(i,1);
            i--;
        };
        for (var i=0; i < arLineSize.length;i++) for (var j=i+1; j < arLineSize.length;j++) for (var ii=0;ii<2;ii++) {
            if ((arLineSize[i].cr[0]+"" == arLineSize[j].cr[ii]+"") && (arLineSize[i].cr[1]+"" == arLineSize[j].cr[ii^1]+"") && !arLineSize[j].name) {
                arLineSize.splice(j,1);
                j--;
                ii=2;
            }
        };
    };

    clearDuble();
    
    function lenAng(){
        for (var a of arLineSize) {
            for (var i=0;i<2;i++) for (var j=0;j<2;j++) a.cr[i][j] = Math.round( a.cr[i][j]);
            a.l = Math.pow(a.cr[0][0]-a.cr[1][0],2)+Math.pow(a.cr[0][1]-a.cr[1][1],2);
            a.ang = Math.round(Math.atan2(a.cr[1][1]-a.cr[0][1],a.cr[1][0]-a.cr[0][0])*100)/100;
            //console.log(a.ang);
        };
    };
    lenAng();

    function cut(){
        
        arLineSize.sort(function(a,b) {
            if (a.l>b.l) return -1;
            return 1;
        });
       // console.log(arLineSize);
        for (var p=0;p<2;p++) for (var e = 0;e<2;e++) for (var t=0;t<2;t++) for (var i=0;i<arLineSize.length;i++) for (var j = i+1;j<arLineSize.length;j++) 
            if (arLineSize[j].cr[e][p]>arLineSize[i].cr[t][p] && arLineSize[j].cr[e][p]<arLineSize[i].cr[t^1][p]) {
               // console.log(arLineSize[i],arLineSize[j][e]);
               
                arLineSize.push({
                        cr:[arLineSize[i].cr[t],arLineSize[j].cr[e]],
                        type:arLineSize[i].type,
                        name:arLineSize[i].name
                    }
                );
                arLineSize.push({
                        cr:[arLineSize[j].cr[e],arLineSize[i].cr[t^1]],
                        type:arLineSize[i].type,
                        name:arLineSize[i].name
                    }
                );
               // console.log(arLineSize[i],arLineSize[j][e]);
               // arLineSize.splice(i,1);
                lenAng();
                arLineSize.splice(i,1);
                j=arLineSize.length;
                clearDuble();
                
                cut();    
                
        }
    };
    cut();

   // console.log(arLineSize);
    for (var i=0;i<edge.length;i++) if (edge[i].edge!['type']=="CircEdge") {
        let twoR = "";
        if (edge[i].edge.option.aspect!=1) twoR+="/"+Math.round(edge[i].edge.option.r*edge[i].edge.option.aspect);
        arLineSize.push({
            cr:[
                [edge[i].edge.option.pointR[0],edge[i].edge.option.pointR[1]],
                [edge[i].edge.option.markerR[1][0],edge[i].edge.option.markerR[1][1]]
                
            ],
            type:"circ",
            name:"R",
            value:Math.round(edge[i].edge.option.r)+twoR
        });
        var centerHord = [
            Math.round(edge[i].edge.cord[0][0]+( edge[i].edge.cord[1][0] - edge[i].edge.cord[0][0])/2),
            Math.round(edge[i].edge.cord[0][1]+( edge[i].edge.cord[1][1] - edge[i].edge.cord[0][1])/2)
        ];
        if (centerHord+""!=edge[i].edge.option.pointR+"") {
            arLineSize.push({
            cr:[
                [centerHord[0],centerHord[1]],
                [edge[i].edge.option.markerR[0][0],edge[i].edge.option.markerR[0][1]]
            ],
            type:"circH",
            name:"H"
        });
        }
    };
    arLineSize.push({
        cr:[
            [mn_mx[0],mn_mx[1]],
            [mn_mx[2],mn_mx[1]]
        ],
        type:"sizeMnMx"
    });
    arLineSize.push({
        cr:[
            [mn_mx[0],mn_mx[1]],
            [mn_mx[0],mn_mx[3]]
        ],
        type:"sizeMnMx"
    });
    /* var arLineSizeAnaliz = analysis();
    
    //var arLineSizeAnaliz = [];
    if (arLineSizeAnaliz.length) for (var k of arLineSize) k.color = "#ccc";
    for (var k of arLineSizeAnaliz) arLineSize.push(k);
    arLineSize = filterSizeLineLigth(arLineSize); */
    
  // console.log(arLineSize);
    lenAng();
    arLineSize.sort(function(a,b) {if (a.type) return -1});
    clearDuble();
    //|| a['type']=="circ"
    
    arLineSize.sort(function(a,b) {
        //if ((a!['type']=="circ" && !(b!['type']=="circ")) || (b!['type']=="circ" && !(a!['type']=="circ"))) { return -1;} else 
        if (a.l>b.l ) return 1;
        return -1;
    });
    ;
    arLineSize.sort(function(a,b) {
        //if ((a!['type']=="circ" && !(b!['type']=="circ")) || (b!['type']=="circ" && !(a!['type']=="circ"))) { return -1;} else 
        if (a!["type"]=="circH" && !(b!["type"]=="circH")) return -1;
        return 1;
    })
    arLineSize.sort(function(a,b) {
        //if ((a!['type']=="circ" && !(b!['type']=="circ")) || (b!['type']=="circ" && !(a!['type']=="circ"))) { return -1;} else 
        if (a!["type"]=="circ" && !(b!["type"]=="circ")) return -1;
        return 1;
    });
    arLineSize.sort(function(a,b) {
        //if ((a!['type']=="circ" && !(b!['type']=="circ")) || (b!['type']=="circ" && !(a!['type']=="circ"))) { return -1;} else 
        if (a["name"] && !b["name"]) return -1;
        return 1;
    }); 
    //console.log(arLineSize);

   /*  console.log("chek",checkMnMxCord([
        [-5,50],
        [5,50]
    ],1))  */   
    function createSizeEdge(){

        var indexEdge = 0;
        function cicl() {
            var add = false;
            
        }
    };

    (function(){
        laySize = areal.children[0].child_name['lineSize'];
        var len = arLineSize.length;
       
        //while (laySize.children.length>1) laySize.children[0].remove();
        var arRemove = [];
        for (var e of laySize.children) {
            e.arLineDesignation = [];
            arRemove.push(e);
        };
        var indexArLineS = 0;
        clearTimeout(stCicl);
        
        function cicl1(){
            //console.log(arLineSize[indexArLineS]);
            if (arRemove[indexArLineS]) arRemove[indexArLineS].remove();
            if (arLineSize[indexArLineS]) new LineSize({
                cord:arLineSize[indexArLineS].cr,
                type:arLineSize[indexArLineS].type,
                nameText:arLineSize[indexArLineS].name,
                value:arLineSize[indexArLineS].value,
                color:arLineSize[indexArLineS].color,
                fnProm:function(){
                    if (arRemove[indexArLineS]) arRemove[indexArLineS].remove();
                    indexArLineS++;
                    if (indexArLineS<len) {
                        //cicl1();
                        if (new Date().getTime() - stT<8) {cicl1()} else {
                            stT = new Date().getTime();
                            clearTimeout(stCicl);
                            stCicl = setTimeout(()=>{cicl1()},5);
                        };
                    } else  {
                        for (var i=indexArLineS;i<arRemove.length;i++) arRemove[i].remove();
                        descent();
                    }
                }
            });
        };
        cicl1();
    })();


    function descent(){
        var arL = [];
        for (var k of areal.children[0].child_name['lineSize'].children) arL.push(k);
       // console.log(arL);
        var edge = areal.children[0].child_name['layerEdge'].children[0].children;
        //console.log(arL);
        for (var i=0;i<arL.length;i++) for (var ii=0;ii<2;ii++) if (!arL[i].optPos.discant[ii]) {
             var ang = Math.atan2(arL[i].crMt[1][1]-arL[i].crMt[0][1],arL[i].crMt[1][0]-arL[i].crMt[0][0]);
            var pRot = new Mt3().multiply(arL[i].generMatr).trans(-arL[i].crMt[0][0],-arL[i].crMt[0][1]).trans(arL[i].crMt[ii][0],arL[i].crMt[ii][1]).elements.slice(6,8);
            var mt = new Mt3().trans(-pRot[0],-pRot[1]).rotX(-ang);
            var arY = [];
           // console.log(2,arL[i].crMt[ii],pRot)
            for (var j=i;j<arL.length;j++)  for (var jj=0;jj<2;jj++) {
                var cr = new Mt3().multiply(arL[j].generMatr).trans(-arL[j].crMt[0][0],-arL[j].crMt[0][1]).trans(arL[j].crMt[jj][0],arL[j].crMt[jj][1]).multiply(mt).elements.slice(6,8);
                //console.log(arL[j].crMt[jj],cr);.multiply(arL[j].generMatr)
                if (Math.round(cr[0])==0) {
                    arY.push(cr[1]);
                    arL[j].optPos.discant[jj]=true
                }
            };
            for (var j=0;j<edge.length;j++)  for (var jj=0;jj<2;jj++) {
                var cr = new Mt3()
                        .trans(edge[j]
                        .edge.cord[jj][0],edge[j].edge.cord[jj][1])
                        .scl(curentScale)
                        //.multiply(matrixAreal)
                        .multiply(mt).elements.slice(6,8);
                if (Math.round(cr[0])==0) {
                    arY.push(cr[1]);
                }
            };
            arY.sort((a,b)=>{
                if (a>b) {return 1} else return -1
            });
           // console.log(arY);
            var disc = new LayGroupHTML({
                svg:true,
                tag:"path",
                parent:areal.children[0].child_name['lineSize'],
                attribute:{d:`M0,${arY[0]} L0,${arY.pop()}`,stroke:"#000","stroke-width":.1}
            });
            /*var cr = read_cord(arL[i].children[ii].html); */
           // console.log(arL[i],arL[i].crMt[0][ii]-arL[i].crMt[0][0],ang);
            write_matrix(disc.html,new Mt3()
                    
                    .trans(lenPoint(arL[i].crMt)*ii,0)
                    .multiply(arL[i].generMatr)
                    //.rotX(ang)
                    //.trans(arL[i].crMt[0][0],arL[i].crMt[0][1])
                    )
             // console.log(arL[i]);
            //matrixAreal
            //
            //console.log(arY);

        }
       // console.log(callB);
        callB();
        
       // setTimeout(()=>,100);
    }

    

    function lineDesig(ar){
        //
        new LayGroupHTML({
            svg:true,
            tag:"path",
            parent:areal.children[0].child_name['lineSize'],
            attribute:{
               d:`M ${ar[0][0]},${ar[0][1]} L${ar[1][0]},${ar[1][1]}`,
                stroke:"#f00",
                "stroke-width":"2"
            }
        })
    };
    //console.log(areal.children[0].child_name['layHole']);

    //for (var hole of areal.children[0].child_name['layHole'].children) for ( var d of hole.arLineDesignation) lineDesig(d);
    //for (var ed of areal.children[0].child_name['layerEdge'].children[0].children) lineDesig(ed.edge.arLineDesignation);
    //for (var ww of areal.children[0].child_name['lineSize'].children) if (ww!['arLineDesignation']) for (var i=0;i<ww.arLineDesignation.length;i++) lineDesig(ww.arLineDesignation[i]);
    
};
//console.log(areal);


function createSizeLine1(callback) {
};


let loopLine = new Loop();
let loopDescent = new Loop();
let optonLineSize = {
    extraSize:true,
    basicSize:true
}
function cLineSize(){

    let arLineSize = introductionAr();
    
    laySize = areal.children[0].child_name['lineSize'];
    if (!optonLineSize['basicSize']) arLineSize = [];
    
    var len = arLineSize.length;
    
    while (laySize.children.length>len) laySize.children[laySize.children.length-1].remove();
    var arRemove = [];
    for (var e of laySize.children) {
        e.arLineDesignation = [];
        arRemove.push(e);
    };
    createArealGradient();
    loopLine['setFn'](function (ind){
        if (arRemove[ind]) arRemove[ind].remove();
        if (arLineSize[ind]) new LineSize({
            cord:arLineSize[ind].cr,
            type:arLineSize[ind].type,
            nameText:arLineSize[ind].name,
            value:arLineSize[ind].value,
            color:arLineSize[ind].color,
        });
    },arLineSize.length);


    //for (let c in arLineSize)

    function setDiscent(){
        let arL = [];
        let correctness = (1-(1e-3));
        for (let i=0;i<areal.children[0].child_name['lineSize'].children.length;++i) {
            //console.log(!~areal.children[0].child_name['lineSize'].children[i].name.indexOf("descent"));
            if (~areal.children[0].child_name['lineSize'].children[i].name.indexOf("descent")) {
                areal.children[0].child_name['lineSize'].children[i].remove();
                --i;
            };
            //
            //
        };
        for (let k of areal.children[0].child_name['lineSize'].children) arL.push(k);
        let edge = areal.children[0].child_name['layerEdge'].children[0].children;
       // console.log("---------------");
        loopDescent.setFn(function(ind){
        
            
            let i = Math.floor(ind/2);
            let ii = ind%2;
            if (!arL[i].optPos.discant[ii] && arL[i].type!="circ") {
                
                var ang = Math.atan2(arL[i].crMt[1][1]-arL[i].crMt[0][1],arL[i].crMt[1][0]-arL[i].crMt[0][0]);
                var pRot = new Mt3().multiply(arL[i].generMatr).trans(-arL[i].crMt[0][0],-arL[i].crMt[0][1]).trans(arL[i].crMt[ii][0],arL[i].crMt[ii][1]).elements.slice(6,8);
                var mt = new Mt3().trans(-pRot[0],-pRot[1]).rotX(-ang);
                var arY = [[0,0]];
                //console.log(2,arL[i].crMt[ii],pRot)
                  for (var j=i;j<arL.length;j++)  if (arL[j].type!="circ")  for (var jj=0;jj<2;jj++) {
                    var cr = new Mt3()
                        .multiply(arL[j].generMatr)
                        .trans(-arL[j].crMt[0][0],-arL[j].crMt[0][1])
                        .trans(arL[j].crMt[jj][0],arL[j].crMt[jj][1])
                        .multiply(mt).elements.slice(6,8);
                    //console.log(arL[j].crMt[jj],cr);.multiply(arL[j].generMatr)
                    
                    let cs = cosVect([[0,0],[0,100]],[[0,0],cr])
                    //console.log(arL[i])
                    if (Math.abs(cs)>correctness && Math.abs(cosVect(arL[i].cord,arL[j].cord))>correctness) {
                        arY.push(cr);
                        arL[j].optPos.discant[jj]=true
                    }
                };
               // console.log(arY)
                
                for (var j=0;j<edge.length;j++)  for (var jj=0;jj<2;jj++) if (edge[j].edge.type == "CircEdge") {
                    let arArc = edge[j].edge.option.arArc;
                    let arAng = [];
                    for (let t=0;t<arArc.length-1;++t) {
                        var cr = new Mt3()
                                .transAr(arArc[t])
                                .scl(curentScale)
                                //.multiply(matrixAreal)
                                .multiply(mt).elements.slice(6,8);

                        arAng.push({
                            index:t,
                            cs:Math.abs(cosVect([[0,0],[0,100]],[[0,0],cr])),
                            cs2:Math.abs(cosVect([[0,0],[0,100]],[cr,
                                new Mt3()
                                .transAr(arArc[t+1])
                                .scl(curentScale)
                                //.multiply(matrixAreal)
                                .multiply(mt).elements.slice(6,8)
                            
                            ])),
                            cr
                        })
                    };
                    arAng.sort((a,b)=>b.cs2-a.cs2);
                    arAng.sort((a,b)=>b.cs-a.cs);
                    if (arAng[0].cs>correctness && arAng[0].cs2>.9) {
                            arY.push(arAng[0].cr);
                        };
                   // console.log(arAng);
                } else {
                    //console.log(arL[i].type);
                        var cr = new Mt3()
                                .trans(edge[j]
                                .edge.cord[jj][0],edge[j].edge.cord[jj][1])
                                .scl(curentScale)
                                //.multiply(matrixAreal)
                                .multiply(mt).elements.slice(6,8);
                        let cs = cosVect([[0,0],[0,100]],[[0,0],cr])
                        if (Math.abs(cs)>correctness) {
                            arY.push(cr);
                        };
                        
                        //console.log(cr,);
                };
               
                arY.sort((a,b)=>{
                    if (a[1]>b[1]) {return 1} else return -1
                });
            // console.log(arY);
                if (arY.length) {
                    var disc = new LayGroupHTML({
                        svg:true,
                        tag:"path",
                        name:"descent",
                        parent:areal.children[0].child_name['lineSize'],
                        attribute:{d:`M0,${arY[0][0]} L0,${arY.pop()[1]}`,stroke:"#000","stroke-width":.1}
                    });

                    write_matrix(disc.html,new Mt3()
                            
                            .trans(lenPoint(arL[i].crMt)*ii,0)
                            .multiply(arL[i].generMatr)
                            )
                }
               

            }
        },arL.length*2)
        return loopDescent.run();
    }
    
    

    //

        return new Promise((r)=>{
            loopLine.run().then(
                (d)=>{
                    
                    if (d['status']) {return setDiscent()} else loopDescent.stop();
                    return d
                }
            )
            .then(
                (d)=>{
                    //console.log(44);
                    r(d)
                }
                //(d)=>console.log("crateLine",d)
            );
        })

    


    function introductionAr(){
        var arLineSize = [
        ];
        var mn_mx = areal['getMinMax']();
        
        var edge = areal.children[0].child_name['layerEdge'].children[0].children;
    

        for (var i=0;i<edge.length;i++) {
            arLineSize.push({
                cr:[
                    [edge[i].edge.cord[0][0],mn_mx[1]],
                    [edge[i].edge.cord[1][0],mn_mx[1]]
                ]
            });
            arLineSize.push({
                cr:[
                    [mn_mx[0],edge[i].edge.cord[0][1]],
                    [mn_mx[0],edge[i].edge.cord[1][1]]
                ]
            });
        };
    
        var hole = areal.children[0].child_name['layHole'].children;
        for (var i = 0; i < hole.length; i++) {
            arLineSize.push({
                cr:[
                    [hole[i].option.cr[0],mn_mx[1]],
                    [mn_mx[0],mn_mx[1]]
                ]
            });
            arLineSize.push({
                cr:[
                    [hole[i].option.cr[0],mn_mx[1]],
                    [mn_mx[2],mn_mx[1]]
                ]
            });
            arLineSize.push({
                cr:[
                    [mn_mx[0],hole[i].option.cr[1]],
                    [mn_mx[0],mn_mx[1]]
                ]
            });
            arLineSize.push({
                cr:[
                    [mn_mx[0],hole[i].option.cr[1]],
                    [mn_mx[0],mn_mx[3]]
                ]
            });
        };



        function clearDuble(){
            for (var i=0; i < arLineSize.length;i++) if (Math.pow(arLineSize[i].cr[1][0]-arLineSize[i].cr[0][0],2)+Math.pow(arLineSize[i].cr[1][1]-arLineSize[i].cr[0][1],2)<1) {
                arLineSize.splice(i,1);
                i--;
            };
            for (var i=0; i < arLineSize.length;i++) for (var j=i+1; j < arLineSize.length;j++) for (var ii=0;ii<2;ii++) {
                if ((arLineSize[i].cr[0]+"" == arLineSize[j].cr[ii]+"") && (arLineSize[i].cr[1]+"" == arLineSize[j].cr[ii^1]+"") && !arLineSize[j].name) {
                    arLineSize.splice(j,1);
                    j--;
                    ii=2;
                }
            };
        };

        clearDuble();
        
        function lenAng(){
            for (var a of arLineSize) {
                //for (var i=0;i<2;i++) for (var j=0;j<2;j++) a.cr[i][j] = Math.round( a.cr[i][j]);
                a.l = Math.pow(a.cr[0][0]-a.cr[1][0],2)+Math.pow(a.cr[0][1]-a.cr[1][1],2);
                a.ang = Math.atan2(a.cr[1][1]-a.cr[0][1],a.cr[1][0]-a.cr[0][0]);
            };
        };
        lenAng();

        function cut(){
            
            arLineSize.sort(function(a,b) {
                if (a.l>b.l) return -1;
                return 1;
            });

            for (var p=0;p<2;p++) for (var e = 0;e<2;e++) for (var t=0;t<2;t++) for (var i=0;i<arLineSize.length;i++) for (var j = i+1;j<arLineSize.length;j++) 
                if (arLineSize[j].cr[e][p]>arLineSize[i].cr[t][p] && arLineSize[j].cr[e][p]<arLineSize[i].cr[t^1][p]) {
                
                    arLineSize.push({
                            cr:[arLineSize[i].cr[t],arLineSize[j].cr[e]],
                            type:arLineSize[i].type,
                            name:arLineSize[i].name
                        }
                    );
                    arLineSize.push({
                            cr:[arLineSize[j].cr[e],arLineSize[i].cr[t^1]],
                            type:arLineSize[i].type,
                            name:arLineSize[i].name
                        }
                    );
                    lenAng();
                    arLineSize.splice(i,1);
                    j=arLineSize.length;
                    clearDuble();
                    
                    cut();    
                    
            }
        };
        cut();

        for (var i=0;i<edge.length;i++) if (edge[i].edge!['type']=="CircEdge") {
            let twoR = "";
            if (edge[i].edge.option.aspect!=1) twoR+="/"+Math.round(edge[i].edge.option.r*edge[i].edge.option.aspect);
            arLineSize.push({
                cr:[
                    [edge[i].edge.option.pointR[0],edge[i].edge.option.pointR[1]],
                    [edge[i].edge.option.markerR[1][0],edge[i].edge.option.markerR[1][1]]
                    
                ],
                type:"circ",
                name:"R",
                value:Math.round(edge[i].edge.option.r)+twoR
            });
            var centerHord = [
                Math.round(edge[i].edge.cord[0][0]+( edge[i].edge.cord[1][0] - edge[i].edge.cord[0][0])/2),
                Math.round(edge[i].edge.cord[0][1]+( edge[i].edge.cord[1][1] - edge[i].edge.cord[0][1])/2)
            ];
            if (centerHord+""!=edge[i].edge.option.pointR+"") {
                arLineSize.push({
                cr:[
                    [centerHord[0],centerHord[1]],
                    [edge[i].edge.option.markerR[0][0],edge[i].edge.option.markerR[0][1]]
                ],
                type:"circH",
                name:"H"
            });
            }
        };
        arLineSize.push({
            cr:[
                [mn_mx[0],mn_mx[1]],
                [mn_mx[2],mn_mx[1]]
            ],
            type:"sizeMnMx"
        });
        arLineSize.push({
            cr:[
                [mn_mx[0],mn_mx[1]],
                [mn_mx[0],mn_mx[3]]
            ],
            type:"sizeMnMx"
        });
        var arLineSizeAnaliz = analysis();
        
        if (arLineSizeAnaliz.length) {
            for (var k of arLineSize) k.color = "#ccc";
            if (!optonLineSize.extraSize) arLineSize = [];
            //console.log("33",optonLineSize.extraSize);
        };
        for (var k of arLineSizeAnaliz) arLineSize.push(k);
        arLineSize = filterSizeLineLigth(arLineSize);
        
        arLineSize = addLinesizeSelectElem(arLineSize);


        lenAng();
        arLineSize.sort(function(a,b) {if (a.type) return -1});
        clearDuble();
        
        arLineSize.sort(function(a,b) {
            if (a.l>b.l ) return 1;
            return -1;
        });
        ;
        arLineSize.sort(function(a,b) {
            if (a!["type"]=="circH" && !(b!["type"]=="circH")) return -1;
            return 1;
        })
        arLineSize.sort(function(a,b) {
            if (a!["type"]=="circ" && !(b!["type"]=="circ")) return -1;
            return 1;
        });
        arLineSize.sort(function(a,b) {
            if (a["name"] && !b["name"]) return -1;
            return 1;
        }); 

        return  arLineSize

    };
    function descent(){
        var arL = [];
        for (var k of areal.children[0].child_name['lineSize'].children) arL.push(k);
       // console.log(arL);
        var edge = areal.children[0].child_name['layerEdge'].children[0].children;
        //console.log(arL);
        for (var i=0;i<arL.length;i++) for (var ii=0;ii<2;ii++) if (!arL[i].optPos.discant[ii]) {

            var ang = Math.atan2(arL[i].crMt[1][1]-arL[i].crMt[0][1],arL[i].crMt[1][0]-arL[i].crMt[0][0]);
            var pRot = new Mt3().multiply(arL[i].generMatr).trans(-arL[i].crMt[0][0],-arL[i].crMt[0][1]).trans(arL[i].crMt[ii][0],arL[i].crMt[ii][1]).elements.slice(6,8);
            var mt = new Mt3().trans(-pRot[0],-pRot[1]).rotX(-ang);
            var arY = [];
           // console.log(2,arL[i].crMt[ii],pRot)
            for (var j=i;j<arL.length;j++)  for (var jj=0;jj<2;jj++) {
                var cr = new Mt3().multiply(arL[j].generMatr).trans(-arL[j].crMt[0][0],-arL[j].crMt[0][1]).trans(arL[j].crMt[jj][0],arL[j].crMt[jj][1]).multiply(mt).elements.slice(6,8);
                //console.log(arL[j].crMt[jj],cr);.multiply(arL[j].generMatr)
                if (Math.round(cr[0])==0) {
                    arY.push(cr[1]);
                    arL[j].optPos.discant[jj]=true
                }
            };
            for (var j=0;j<edge.length;j++)  for (var jj=0;jj<2;jj++) {
                var cr = new Mt3()
                        .trans(edge[j]
                        .edge.cord[jj][0],edge[j].edge.cord[jj][1])
                        .scl(curentScale)
                        //.multiply(matrixAreal)
                        .multiply(mt).elements.slice(6,8);
                if (Math.round(cr[0])==0) {
                    arY.push(cr[1]);
                }
            };
            arY.sort((a,b)=>{
                if (a>b) {return 1} else return -1
            });
           // console.log(arY);
            var disc = new LayGroupHTML({
                svg:true,
                tag:"path",
                parent:areal.children[0].child_name['lineSize'],
                attribute:{d:`M0,${arY[0]} L0,${arY.pop()}`,stroke:"#000","stroke-width":.1}
            });

            write_matrix(disc.html,new Mt3()
                    
                    .trans(lenPoint(arL[i].crMt)*ii,0)
                    .multiply(arL[i].generMatr)
                    )

        }
    }
    
    function buildLineSize2() {
        
        var stT = new Date().getTime();

        var arLineSize = [
        ];
        var mn_mx = areal['getMinMax']();
        
        var edge = areal.children[0].child_name['layerEdge'].children[0].children;
    

        for (var i=0;i<edge.length;i++) {
            arLineSize.push({
                cr:[
                    [edge[i].edge.cord[0][0],mn_mx[1]],
                    [edge[i].edge.cord[1][0],mn_mx[1]]
                ]
            });
            arLineSize.push({
                cr:[
                    [mn_mx[0],edge[i].edge.cord[0][1]],
                    [mn_mx[0],edge[i].edge.cord[1][1]]
                ]
            });
        };
    
        var hole = areal.children[0].child_name['layHole'].children;
        for (var i = 0; i < hole.length; i++) {
            arLineSize.push({
                cr:[
                    [hole[i].option.cr[0],mn_mx[1]],
                    [mn_mx[0],mn_mx[1]]
                ]
            });
            arLineSize.push({
                cr:[
                    [hole[i].option.cr[0],mn_mx[1]],
                    [mn_mx[2],mn_mx[1]]
                ]
            });
            arLineSize.push({
                cr:[
                    [mn_mx[0],hole[i].option.cr[1]],
                    [mn_mx[0],mn_mx[1]]
                ]
            });
            arLineSize.push({
                cr:[
                    [mn_mx[0],hole[i].option.cr[1]],
                    [mn_mx[0],mn_mx[3]]
                ]
            });
        };



        function clearDuble(){
            for (var i=0; i < arLineSize.length;i++) if (Math.pow(arLineSize[i].cr[1][0]-arLineSize[i].cr[0][0],2)+Math.pow(arLineSize[i].cr[1][1]-arLineSize[i].cr[0][1],2)<1) {
                arLineSize.splice(i,1);
                i--;
            };
            for (var i=0; i < arLineSize.length;i++) for (var j=i+1; j < arLineSize.length;j++) for (var ii=0;ii<2;ii++) {
                if ((arLineSize[i].cr[0]+"" == arLineSize[j].cr[ii]+"") && (arLineSize[i].cr[1]+"" == arLineSize[j].cr[ii^1]+"") && !arLineSize[j].name) {
                    arLineSize.splice(j,1);
                    j--;
                    ii=2;
                }
            };
        };

        clearDuble();
        
        function lenAng(){
            for (var a of arLineSize) {
                for (var i=0;i<2;i++) for (var j=0;j<2;j++) a.cr[i][j] = Math.round( a.cr[i][j]);
                a.l = Math.pow(a.cr[0][0]-a.cr[1][0],2)+Math.pow(a.cr[0][1]-a.cr[1][1],2);
                a.ang = Math.round(Math.atan2(a.cr[1][1]-a.cr[0][1],a.cr[1][0]-a.cr[0][0])*100)/100;
            };
        };
        lenAng();

        function cut(){
            
            arLineSize.sort(function(a,b) {
                if (a.l>b.l) return -1;
                return 1;
            });

            for (var p=0;p<2;p++) for (var e = 0;e<2;e++) for (var t=0;t<2;t++) for (var i=0;i<arLineSize.length;i++) for (var j = i+1;j<arLineSize.length;j++) 
                if (arLineSize[j].cr[e][p]>arLineSize[i].cr[t][p] && arLineSize[j].cr[e][p]<arLineSize[i].cr[t^1][p]) {
                
                    arLineSize.push({
                            cr:[arLineSize[i].cr[t],arLineSize[j].cr[e]],
                            type:arLineSize[i].type,
                            name:arLineSize[i].name
                        }
                    );
                    arLineSize.push({
                            cr:[arLineSize[j].cr[e],arLineSize[i].cr[t^1]],
                            type:arLineSize[i].type,
                            name:arLineSize[i].name
                        }
                    );
                    lenAng();
                    arLineSize.splice(i,1);
                    j=arLineSize.length;
                    clearDuble();
                    
                    cut();    
                    
            }
        };
        cut();

        for (var i=0;i<edge.length;i++) if (edge[i].edge!['type']=="CircEdge") {
            let twoR = "";
            if (edge[i].edge.option.aspect!=1) twoR+="/"+Math.round(edge[i].edge.option.r*edge[i].edge.option.aspect);
            arLineSize.push({
                cr:[
                    [edge[i].edge.option.pointR[0],edge[i].edge.option.pointR[1]],
                    [edge[i].edge.option.markerR[1][0],edge[i].edge.option.markerR[1][1]]
                    
                ],
                type:"circ",
                name:"R",
                value:Math.round(edge[i].edge.option.r)+twoR
            });
            var centerHord = [
                Math.round(edge[i].edge.cord[0][0]+( edge[i].edge.cord[1][0] - edge[i].edge.cord[0][0])/2),
                Math.round(edge[i].edge.cord[0][1]+( edge[i].edge.cord[1][1] - edge[i].edge.cord[0][1])/2)
            ];
            if (centerHord+""!=edge[i].edge.option.pointR+"") {
                arLineSize.push({
                cr:[
                    [centerHord[0],centerHord[1]],
                    [edge[i].edge.option.markerR[0][0],edge[i].edge.option.markerR[0][1]]
                ],
                type:"circH",
                name:"H"
            });
            }
        };
        arLineSize.push({
            cr:[
                [mn_mx[0],mn_mx[1]],
                [mn_mx[2],mn_mx[1]]
            ],
            type:"sizeMnMx"
        });
        arLineSize.push({
            cr:[
                [mn_mx[0],mn_mx[1]],
                [mn_mx[0],mn_mx[3]]
            ],
            type:"sizeMnMx"
        });
        var arLineSizeAnaliz = analysis();
        
        if (arLineSizeAnaliz.length) for (var k of arLineSize) k.color = "#ccc";
        for (var k of arLineSizeAnaliz) arLineSize.push(k);
        arLineSize = filterSizeLineLigth(arLineSize);
        
        lenAng();
        arLineSize.sort(function(a,b) {if (a.type) return -1});
        clearDuble();
        
        arLineSize.sort(function(a,b) {
            if (a.l>b.l ) return 1;
            return -1;
        });
        ;
        arLineSize.sort(function(a,b) {
            if (a!["type"]=="circH" && !(b!["type"]=="circH")) return -1;
            return 1;
        })
        arLineSize.sort(function(a,b) {
            if (a!["type"]=="circ" && !(b!["type"]=="circ")) return -1;
            return 1;
        });
        arLineSize.sort(function(a,b) {
            if (a["name"] && !b["name"]) return -1;
            return 1;
        }); 


        (function(){
            laySize = areal.children[0].child_name['lineSize'];
            var len = arLineSize.length;
        
            //while (laySize.children.length>1) laySize.children[0].remove();
            var arRemove = [];
            for (var e of laySize.children) {
                e.arLineDesignation = [];
                arRemove.push(e);
            };
            var indexArLineS = 0;
            clearTimeout(stCicl);
            
            function cicl1(){
                //console.log(arLineSize[indexArLineS]);
                if (arRemove[indexArLineS]) arRemove[indexArLineS].remove();
                if (arLineSize[indexArLineS]) new LineSize({
                    cord:arLineSize[indexArLineS].cr,
                    type:arLineSize[indexArLineS].type,
                    nameText:arLineSize[indexArLineS].name,
                    value:arLineSize[indexArLineS].value,
                    color:arLineSize[indexArLineS].color,
                    fnProm:function(){
                        if (arRemove[indexArLineS]) arRemove[indexArLineS].remove();
                        indexArLineS++;
                        if (indexArLineS<len) {
                            //cicl1();
                            if (new Date().getTime() - stT<8) {cicl1()} else {
                                stT = new Date().getTime();
                                clearTimeout(stCicl);
                                stCicl = setTimeout(()=>{cicl1()},5);
                            };
                        } else  {
                            for (var i=indexArLineS;i<arRemove.length;i++) arRemove[i].remove();
                            descent();
                        }
                    }
                });
            };
            cicl1();
        })();


        function descent(){
            var arL = [];
            for (var k of areal.children[0].child_name['lineSize'].children) arL.push(k);
        // console.log(arL);
            var edge = areal.children[0].child_name['layerEdge'].children[0].children;
            //console.log(arL);
            for (var i=0;i<arL.length;i++) for (var ii=0;ii<2;ii++) if (!arL[i].optPos.discant[ii]) {
                var ang = Math.atan2(arL[i].crMt[1][1]-arL[i].crMt[0][1],arL[i].crMt[1][0]-arL[i].crMt[0][0]);
                var pRot = new Mt3().multiply(arL[i].generMatr).trans(-arL[i].crMt[0][0],-arL[i].crMt[0][1]).trans(arL[i].crMt[ii][0],arL[i].crMt[ii][1]).elements.slice(6,8);
                var mt = new Mt3().trans(-pRot[0],-pRot[1]).rotX(-ang);
                var arY = [];
            // console.log(2,arL[i].crMt[ii],pRot)
                for (var j=i;j<arL.length;j++)  for (var jj=0;jj<2;jj++) {
                    var cr = new Mt3().multiply(arL[j].generMatr).trans(-arL[j].crMt[0][0],-arL[j].crMt[0][1]).trans(arL[j].crMt[jj][0],arL[j].crMt[jj][1]).multiply(mt).elements.slice(6,8);
                    //console.log(arL[j].crMt[jj],cr);.multiply(arL[j].generMatr)
                    if (Math.round(cr[0])==0) {
                        arY.push(cr[1]);
                        arL[j].optPos.discant[jj]=true
                    }
                };
                for (var j=0;j<edge.length;j++)  for (var jj=0;jj<2;jj++) {
                    var cr = new Mt3()
                            .trans(edge[j]
                            .edge.cord[jj][0],edge[j].edge.cord[jj][1])
                            .scl(curentScale)
                            //.multiply(matrixAreal)
                            .multiply(mt).elements.slice(6,8);
                    if (Math.round(cr[0])==0) {
                        arY.push(cr[1]);
                    }
                };
                arY.sort((a,b)=>{
                    if (a>b) {return 1} else return -1
                });
            // console.log(arY);
                var disc = new LayGroupHTML({
                    svg:true,
                    tag:"path",
                    parent:areal.children[0].child_name['lineSize'],
                    attribute:{d:`M0,${arY[0]} L0,${arY.pop()}`,stroke:"#000","stroke-width":.1}
                });
                /*var cr = read_cord(arL[i].children[ii].html); */
            // console.log(arL[i],arL[i].crMt[0][ii]-arL[i].crMt[0][0],ang);
                write_matrix(disc.html,new Mt3()
                        
                        .trans(lenPoint(arL[i].crMt)*ii,0)
                        .multiply(arL[i].generMatr)
                        //.rotX(ang)
                        //.trans(arL[i].crMt[0][0],arL[i].crMt[0][1])
                        )
                // console.log(arL[i]);
                //matrixAreal
                //
                //console.log(arY);

            }
        // console.log(callB);
            callB();
            
        // setTimeout(()=>,100);
        }

        
        
    };
};
function addLinesizeSelectElem(arLineSize){
    if (!elcurentSelect || !elcurentSelect.select) return arLineSize;
    let arIndex = [];
    if (elcurentSelect.type=="point") {arIndex = [elcurentSelect.index]} else arIndex = [0,1];
    //console.log(arLineSize,elcurentSelect);
    arLineSize.push({
        cr:elcurentSelect.el['cord']
    });
    for (let k of arIndex) {
        arLineSize.push({
            cr:elcurentSelect.el['edgeLink'][k].edge['cord']
        })
        //console.log(elcurentSelect.el['edgeLink'][k].edge)
    }
    //console.log(arIndex,arLineSize);
    return arLineSize;
}
function setOptionLineSize(opt){
    for (let o in opt) optonLineSize[o] = opt[o];
};
function getOptionLineSize(){
    let y={};
    for (let o in optonLineSize) y[o] = optonLineSize[o];
    return y;
};

function createArealGradient(){
    let o = optionEdge();
    
    let layer = areal.children[0].child_name['arealGradient'];
    while (layer.children.length) layer.children[0].remove();
    let d = [];
    let dd = '';
    for (let e of o) for (let r of e.edge.arLineDesignation) for (let t of r) d.push(t);
    dd = `M${d[0]+""} L`;
    for (let i=1;i<d.length;i++) dd+=d[i]+" ";
    dd+="z";
    new LayGroupHTML({
        svg:true,
        tag:"path",
        parent:layer,
        attribute:{
            d:dd,
            fill:"url(#gradFigure)",
            //"fill-opacity":.9,
            stroke:"none"
        }
    });
    //console.log(o,layer,d,dd);
    /* clearTimeout(aralgradient);
    aralgradient = setTimeout(()=>{
        
        let d = [];
        for (let k of o) d.push(k.data);
        console.log("createArelGradient",o);
       // console.log("sendDataMaker",d);
    }) */
    
};


export { createSizeLine,cLineSize, setOptionLineSize, getOptionLineSize};