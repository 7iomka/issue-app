import { LayGroupHTML, lenPoint} from "./class";
import { areal, optionEdge, matrixAreal , curentScale, angHordR} from "./areal";
import { Mt3, write_matrix, cosVect} from "./expan.js";
import { createSizeLine,cLineSize } from "./line_size";
import { ajax } from "./func";
import { 
    extraPanel,
    elcurentSelect 
} from "./extra_panel";
import { setMasseg } from "./help";
var kfDefPrioretet = 0.25;
var material = {};
var curentMaterial = "";

/* ajax("cat_product_list.csv",function(d){
    var str = [];
    var s1 = "";
    for ( var s of d) {
        if (s.charCodeAt(0) == 10 ) {
            str.push(s1.split(";"));
            s1 = "";
            //console.log(33);
        } else s1+=s
    };
    str.push(s1.split(";"));
    for (var i=2;i<str.length;i++) {
        var mt= {};
        for (var j=0;j<str[i].length;j++) mt[str[1][j]] = {
            fullName : str[0][j],
            data: str[i][j]
        }
        material[str[i][0]] = mt
    };
    analitcMaterial();
}); */

var panelAnalitic = new LayGroupHTML({
    name:"panelAnalitic",
    style:{ 
        //position:"",
        //display:"none",
        border:"solid 1px #000",
        padding:"10px",
        "text-align":"center",
    },
    resize:function(){
        this.setPosition({
            left:20,
            top:20
        })
       // console.log(this)
    },
    childrenElem:[
        new LayGroupHTML({
            name:"figure",
            style:{
                position:"",
               // display:"none"
               "text-align":"center",
            },
            innerHTML:"Фигура",

            
        }),
        new LayGroupHTML({
            name:"optionFigure",
            style:{
                position:"",
                "text-align":"center",
            },
            //innerHTML:"Параметры фигуры"
        }),
        new LayGroupHTML({
            name:"applyData",
            tag:"button",
            style:{
                position:"",
                cursor:"pointer",
                background:"#aaf",
                "text-align":"center",
                "margin-top":"5px"
               
            },
            innerHTML:"применить"
        }),
    ]
});


var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];

class AutoSelectFigure extends LayGroupHTML{
    analogy = function(){
        return {
            kf:0,
            prior:100
        }
    };
    fieldSize = [];
    setSizeLine = function(input){
        return [];
    };
    setFieldInput = function(){
        var opt = panelAnalitic.child_name['optionFigure'];
        while (opt.children.length) opt.children[0].remove();
        var f = [];
        for (var fiel of this.fieldSize) {
            var inp = new LayGroupHTML({
                name:fiel,
                style:{
                    position:"",
                    width:"160px",
                    "padding-top":"5px"
                },
                parent:opt,
                childrenElem:[
                    new LayGroupHTML({
                        style:{
                            position:"",

                        },
                        tag:'span',
                        innerHTML:fiel
                    }),
                    new LayGroupHTML({
                        style:{
                            position:"",
                            width:"60px",
                            "margin-left":"5px"
                        },
                        tag:'input',
                        attribute:{
                            type:"number"
                        }
                        //innerHTML:fiel
                    })
                ]
            });
            f.push(
                {
                    name:fiel,
                    input:inp.children[1]
                }
            );
        };
        //console.log(f);
        return this.setSizeLine(f);

       // console.log("setFieldInput",this.fieldSize,opt);

    };
    constructor(opt){
        super(opt);
        this.analogy = opt.analogy || function(){
            return 0
        };
        

    };
};

function chekLine(edge){
    var rt = true; 
    for (var k of edge) if (k.type != "LineEdge") rt = false; 
    return rt
};

function generalIndexPoint(ar1,ar2){
    var pointGen = "";
    for (var i=0; i<ar1.length; i++) for (var j=0; j<ar2.length; j++){

         if (ar1[i]+"" == ar2[j]+"") pointGen = ar1[i]+"";
    }; 
    
    var r:any = [0,0];
    if (ar1[1]+""==pointGen) r[0]=1;
    if (ar2[1]+""==pointGen) r[1]=1;
    if (!pointGen) r = false;
    return r;
};

var listFigure = {
    "O1" : (function(){
            var ret = new AutoSelectFigure({});
            ret.analogy = function(){
                var edge = optionEdge();
                var kf = 0;
                
                if (edge.length == 4) 
                    if (chekLine(edge)) {
                        var ang = [];
                        for (var e of edge) if (e.edgeLink[0]) {
                            //var ang = Math.atan2()
                            /* console.log("e",
                                [e.cord[1],e.cord[0]],
                                [e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint],e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint^1]]); */
                            ang.push( Math.abs(Math.acos( 
                                cosVect(
                                [e.cord[1],e.cord[0]],
                                [e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint],e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint^1]
                            ] )
                             )-Math.PI/2) );
                        };  
                        ang.sort((a,b)=>{
                                if (a>b) return -1
                                return 1
                            }
                        );
                        kf = 1 - ang[0]/(Math.PI/2)
                        //console.log(kf);

                    }
                return {
                    kf,
                    prior:1
                };
            };

            ret.fieldSize = ["L","H"];

            ret.setSizeLine = function(input) {
                var edge = optionEdge();
                var arLine = [];
                edge.sort((a,b)=>{
                    if ( Math.abs( cosVect( edge[0].cord, a.cord )) < Math.abs( cosVect( edge[0].cord, b.cord ))) return 1;
                    return -1;
                });
                var dublEdge = [
                    [edge[0],edge[1]],
                    [edge[2],edge[3]]
                ];
                for (var i=0;i<2;i++) dublEdge[i].sort((a,b)=>{
                    if (lenPoint(a.cord)<lenPoint(b.cord)) return 1;
                    return -1;
                });

                //console.log("setSizeLine",input,edge);
                for (var i=0;i<ret.fieldSize.length;i++) ((i)=>{
                    var cr = dublEdge[i][0].cord.slice();
                    var l = lenPoint(cr);
                    input[i].input.html.value = Math.round(l);
                   // console.log(input[i].input.html);
                    input[i].input.html.onchange = function(){
                        var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                        var an = Math.atan2(cr[1][1] - cr[0][1],cr[1][0] - cr[0][0]);
                        var pointRot = [cr[0][0] + (cr[1][0]- cr[0][0])/2, cr[0][1] + (cr[1][1]- cr[0][1])/2];
                        
                        var sc = (this.value/l);
                        //console.log(this.value,l,sc)
                        var mt = new Mt3()
                            .trans(-pointRot[0],-pointRot[1])
                            .rotX(-an)
                            .scale(sc,1)
                            .rotX(an)
                            .trans(pointRot[0],pointRot[1])

                        for (var e of arEdge) {
                            var c = e.edge.cord.slice();
                            //console.log(c);
                            var ee = [];
                            for (var j=0;j<2;j++) {
                                ee[j] = new Mt3()
                                    .trans(c[j][0],c[j][1])
                                    .multiply(mt)
                                    .elements.slice(6,8)
                            };
                           // console.log(c,ee);
                            e.edge.cord = ee;
                           // console.log(c);
                        };
                        
                        
                        //for (var e of arEdge) e.edge.findLink();
                       // for (var e of arEdge) e.edge.move();
                        for (var e of arEdge) e.edge.setCord(e.edge.cord.slice());
                        //createSizeLine(()=>{});
                        cLineSize();
                        //console.log(this.value,i,l,arEdge);
                    };
                    //
                    arLine.push({
                        cr:cr,
                        value:Math.round(l),
                        name:ret.fieldSize[i],
                        type:"figure"
                    });
                })(i);
               
               
                return arLine;
                
            };
            
            return ret;
        })(),
    "L26" :(function(){
            var ret = new AutoSelectFigure({});
            let typeEdge = {
                                "LineEdge":[],
                                "CircEdge":[]
                            };
            ret.analogy = function(){
                var edge = optionEdge();
                var kf = 0;
                //console.log(edge);
                typeEdge = {
                                "LineEdge":[],
                                "CircEdge":[]
                            };
                if (edge.length == 8) {
                    var checkAlternation = true;
                    for (var i=0;i<edge.length-1;i++) if (edge[i].type==edge[i+1].type) checkAlternation = false;
                    if ( checkAlternation ) {
                        
                        for (var i=0;i<edge.length;i++) typeEdge[edge[i].type].push(edge[i]);
                        var ang = [];
                        for (var e of typeEdge['LineEdge']) for (var k of typeEdge['LineEdge']) ang.push( Math.abs(Math.acos( 
                                cosVect(
                                    [e.cord[1],e.cord[0]],
                                    [k.cord[1],k.cord[0]]
                                )
                             )-Math.PI/2) );
                        ang.sort((a,b)=>{
                                if (a<b) return -1
                                return 1
                            } 
                        );
                        typeEdge["CircEdge"].sort((a,b)=>{
                                if (a.option.r<b.option.r) return -1
                                return 1
                            } 
                        );
                        var kfR = typeEdge["CircEdge"][0].option.r/typeEdge["CircEdge"][3].option.r;
                        typeEdge["CircEdge"].sort((a,b)=>{
                                if (a.option.aspect<b.option.aspect) return -1
                                return 1
                            } 
                        );
                        var kfAs = 1/typeEdge["CircEdge"][3].option.aspect;
                        kf = (1- Math.abs(ang[0]-ang[4])) * kfR * kfAs;
                    };
                };
                /* if (edge.length == 4) 
                    if (chekLine(edge)) {
                        var ang = [];
                        for (var e of edge) if (e.edgeLink[0]) {
                            //var ang = Math.atan2()
                            
                            ang.push( Math.abs(Math.acos( 
                                cosVect(
                                [e.cord[1],e.cord[0]],
                                [e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint],e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint^1]
                            ] )
                             )-Math.PI/2) );
                        };  
                        ang.sort((a,b)=>{
                                if (a>b) return -1
                                return 1
                            }
                        );
                        kf = 1 - ang[0]/(Math.PI/2)
                        //console.log(kf);

                    } */

                return {
                    kf,
                    prior:.8
                };
            };

            ret.fieldSize = ["L","H","R"];

            ret.setSizeLine = function(input) {
                var edge = optionEdge();
                var arLine = [];
                //console.log(typeEdge);
                let len = [];
                for (var i=0;i<typeEdge['LineEdge'].length;i++) len.push({
                    len:lenPoint(typeEdge['LineEdge'][i].cord),
                    index:i
                });
                len.sort((a,b)=>{
                    return a.len-b.len
                })
                typeEdge['CircEdge'].sort((a,b)=>{
                    return b.option.r-a.option.r
                });

                let arEdgAng = [];
                for (let i=0;i<edge.length-1;i++) if (edge[i].type=="LineEdge") for (var j=i+1;j<edge.length;j++) if (edge[j].type=="LineEdge") arEdgAng.push({
                    ang:cosVect(edge[i].cord,edge[j].cord),
                    indexPartner:[i,j]
                });
                arEdgAng.sort((a,b)=>{
                    return b.ang - a.ang;
                });

                input[0].input.html.value = Math.round(len.pop().len+typeEdge['CircEdge'][0].option.r*2);
                input[1].input.html.value = Math.round(len[0].len+typeEdge['CircEdge'][0].option.r*2);
                input[2].input.html.value = typeEdge['CircEdge'][0].option.r;
                input[0].input.html.onchange = function(){

                    setValueInput();
                    //createSizeLine(()=>{});
                    cLineSize();
                    /* let ed = edge[len.pop().index].edge;
                    console.log(ed);
                    let pointRot = [
                        ed.cord[0][0]+(ed.cord[1][0] - ed.cord[0][0])/2,
                        ed.cord[0][1]+(ed.cord[1][1] - ed.cord[0][1])/2
                    ];
                    let an = Math.atan2(ed.cord[1][1] - ed.cord[0][1],ed.cord[1][0] - ed.cord[0][0]); */


                };
                input[1].input.html.onchange = function(){

                    setValueInput();
                   // createSizeLine(()=>{});
                   cLineSize();
                };
                input[2].input.html.onchange = function(){

                    setValueInput();
                    //createSizeLine(()=>{});
                    cLineSize();
                };
                function setValueInput(){
                    var valInp = [
                        parseFloat(input[0].input.html.value) - parseFloat(input[2].input.html.value) * 2,
                        parseFloat(input[1].input.html.value) - parseFloat(input[2].input.html.value) * 2,
                        parseFloat(input[2].input.html.value)
                    ];
                    var ang = 0;
                    var arEd = [];
                    var arCr = [];
                    for (let i=0;i<edge.length;i++) if (edge[i].type=="LineEdge") {arEd.push(edge[i])} else arCr.push(edge[i]);
                    for (var i=0;i<4;i++) {
                        var ed = i%2
                        var a = [
                            [-valInp[ed]/2, -valInp[ed^1]/2 - valInp[2]],
                            [ valInp[ed]/2, -valInp[ed^1]/2 - valInp[2] ]
                        ];
                        for (var j=0;j<2;j++) {
                            let b = new Mt3().transAr(a[j]).rotX(ang).elements.slice(6,8);

                            a[j] = [
                                Math.round(b[0]),
                                Math.round(b[1])
                            ]
                        };

                        ang+=Math.PI/2;
                        
                        arEd[i].edge.cord = a;
                        //edge[arEdgAng[i].indexPartner[j]].edge.setCord(a);
                       // 
                    };
                    for (var i=0;i<3;i++) arCr[i].edge.cord = [
                        arEd[i].edge.cord[1],
                        arEd[i+1].edge.cord[0]
                    ];
                    arCr[3].edge.cord = [
                        arEd[3].edge.cord[1],
                        arEd[0].edge.cord[0]
                    ];
                    for (var i=0;i<4;i++) arCr[i].edge.option.r = valInp[2];
                    for (let i=0;i<edge.length;i++) edge[i].edge.findLink();
                    for (let i=0;i<edge.length;i++) edge[i].edge.move();
                    //for (var i=0;i<4;i++) arEd[i].edge.move();
                   
                    //console.log();
                    /* for (var j=0;j<arEdgAng[i].indexPartner.length;j++) for ( let i=0;i<2;i++)  {
                       
                        
                        edge[arEdgAng[i].indexPartner[j]].edge.setCord(a);
                    } */
                    //console.log(arEdgAng);
                };
                setValueInput();
                //console.log(len,typeEdge['CircEdge']);
                /* typeEdge['LineEdge'].sort((a,b)=>{
                    if ( Math.abs( cosVect( edge[0].cord, a.cord )) < Math.abs( cosVect( edge[0].cord, b.cord ))) return 1;
                    return -1;
                }); */
                /*var dublEdge = [
                    [edge[0],edge[1]],
                    [edge[2],edge[3]]
                ];
                for (var i=0;i<2;i++) dublEdge[i].sort((a,b)=>{
                    if (lenPoint(a.cord)<lenPoint(b.cord)) return 1;
                    return -1;
                });

                //console.log("setSizeLine",input,edge);
                for (var i=0;i<ret.fieldSize.length;i++) ((i)=>{
                    var cr = dublEdge[i][0].cord.slice();
                    var l = lenPoint(cr);
                    input[i].input.html.value = Math.round(l);
                   // console.log(input[i].input.html);
                    input[i].input.html.onchange = function(){
                        var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                        var an = Math.atan2(cr[1][1] - cr[0][1],cr[1][0] - cr[0][0]);
                        var pointRot = [cr[0][0] + (cr[1][0]- cr[0][0])/2, cr[0][1] + (cr[1][1]- cr[0][1])/2];
                        
                        var sc = (this.value/l);
                        //console.log(this.value,l,sc)
                        var mt = new Mt3()
                            .trans(-pointRot[0],-pointRot[1])
                            .rotX(-an)
                            .scale(sc,1)
                            .rotX(an)
                            .trans(pointRot[0],pointRot[1])

                        for (var e of arEdge) {
                            var c = e.edge.cord.slice();
                            //console.log(c);
                            var ee = [];
                            for (var j=0;j<2;j++) {
                                ee[j] = new Mt3()
                                    .trans(c[j][0],c[j][1])
                                    .multiply(mt)
                                    .elements.slice(6,8)
                            };
                           // console.log(c,ee);
                            e.edge.cord = ee;
                           // console.log(c);
                        };
                        
                        
                        //for (var e of arEdge) e.edge.findLink();
                       // for (var e of arEdge) e.edge.move();
                        for (var e of arEdge) e.edge.setCord(e.edge.cord.slice());
                        createSizeLine(()=>{});
                        //console.log(this.value,i,l,arEdge);
                    };
                    //
                    arLine.push({
                        cr:cr,
                        value:Math.round(l),
                        name:ret.fieldSize[i],
                        type:"figure"
                    });
                })(i); */
               
               
                return arLine;
                
            };
            return ret;
        })(),
    "S4RH" : (function(){
            var ret = new AutoSelectFigure({});
            var ang = [];
            ret.analogy = function(){
                var edge = optionEdge();
                var kf = 0;
                
                if (edge.length == 4) 
                    if (chekLine(edge)) {
                        ang = [];
                        var len = [];
                        for (var e of edge) {
                            len.push( lenPoint(e.cord) );
                        };  
                        
                        len.sort((a,b)=>{
                                if (a>b) return 1
                                return -1
                            }
                        );
                        var kfLen = len[0]/len[3];
                        
                        
                        for (var e of edge) if (e.edgeLink[0]) {
                            ang.push( {
                                ang:Math.abs(Math.acos( 
                                    cosVect(
                                        [e.cord[1],e.cord[0]],
                                        [e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint],e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint^1]
                                    ] 
                                    )
                                )),
                                edge:[e,e.edgeLink[0].edge]
                             });
                        };  
                        ang.sort((a,b)=>{
                                if (a.ang>b.ang) return 1
                                return -1
                            }
                        );
                        var kfAng = 1-(ang[0].ang/(Math.PI/2)-.95)/.05;
                        if (kfAng>1) kfAng=1;
                        kf = (kfLen)*(kfAng)
                       // console.log(kfAng);

                    }
                return {
                    kf,
                    prior:.9
                };
            };
            ret.fieldSize = ["L","H"];

            ret.setSizeLine = function(input) {

                //var edge = optionEdge();
                var arLine = [];
               // console.log(ang);
                for (var i=0;i<ret.fieldSize.length;i++) ((i)=>{
                    var cr = [ang[i*2].edge[0].cord[0],ang[i*2+1].edge[0].cord[0]];
                    var l = lenPoint(cr);
                    input[i].input.html.value = Math.round(l);
                   // console.log(input[i].input.html);
                    input[i].input.html.onchange = function(){
                        var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                        var an = Math.atan2(cr[1][1] - cr[0][1],cr[1][0] - cr[0][0]);
                        var pointRot = [cr[0][0] + (cr[1][0]- cr[0][0])/2, cr[0][1] + (cr[1][1]- cr[0][1])/2];
                        
                        var sc = (this.value/l);
                        //console.log(this.value,l,sc)
                        var mt = new Mt3()
                            .trans(-pointRot[0],-pointRot[1])
                            .rotX(-an)
                            .scale(sc,1)
                            .rotX(an)
                            .trans(pointRot[0],pointRot[1])

                        for (var e of arEdge) {
                            var c = e.edge.cord.slice();
                            //console.log(c);
                            var ee = [];
                            for (var j=0;j<2;j++) {
                                ee[j] = new Mt3()
                                    .trans(c[j][0],c[j][1])
                                    .multiply(mt)
                                    .elements.slice(6,8)
                            };
                           // console.log(c,ee);
                            e.edge.cord = ee;
                           // console.log(c);
                        };
                        
                        
                        //for (var e of arEdge) e.edge.findLink();
                       // for (var e of arEdge) e.edge.move();
                        for (var e of arEdge) e.edge.setCord(e.edge.cord.slice());
                        //createSizeLine(()=>{});
                        cLineSize();
                        //console.log(this.value,i,l,arEdge);
                    };
                    //
                    arLine.push({
                        cr:cr,
                        value:Math.round(l),
                        name:ret.fieldSize[i],
                        type:"figure"
                    });
                })(i);
                /*edge.sort((a,b)=>{
                    if ( Math.abs( cosVect( edge[0].cord, a.cord )) < Math.abs( cosVect( edge[0].cord, b.cord ))) return 1;
                    return -1;
                });
                var dublEdge = [
                    [edge[0],edge[1]],
                    [edge[2],edge[3]]
                ];
                for (var i=0;i<2;i++) dublEdge[i].sort((a,b)=>{
                    if (lenPoint(a.cord)<lenPoint(b.cord)) return 1;
                    return -1;
                });

                //console.log("setSizeLine",input,edge);
                
                */
               
                return arLine;
                
            };
            return ret;
    })(),
    "LO1" : (function(){
            var ret = new AutoSelectFigure({});
            var ang = [];
            ret.analogy = function(){
                var edge = optionEdge();
                var kf = 0;
                ang = [];
                if (edge.length == 4) 
                    if (chekLine(edge)) {
                        
                        for (var e of edge) if (e.edgeLink[0]) {
                            //var ang = Math.atan2()
                            /* console.log("e",
                                [e.cord[1],e.cord[0]],
                                [e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint],e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint^1]]); */
                            ang.push( {
                                ang:Math.abs(Math.acos( 
                                        cosVect(
                                        [e.cord[1],e.cord[0]],
                                        [e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint],e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint^1]
                                    ] )
                                    )-Math.PI/2),
                                edge:[e.cord,e.edgeLink[0].edge.cord]
                            } );
                        };  
                        ang.sort((a,b)=>{
                                if (a.ang>b.ang) return -1
                                return 1
                            }
                        );
                        kf = 1 - ang[2].ang/(Math.PI/2)
                        //console.log(kf,ang);

                    }
                return {
                    kf:kf,
                    prior:.9
                }; 
            };
            ret.fieldSize = ["L","H","H1"];

            ret.setSizeLine = function(input) {
                var edge = optionEdge();
                var arLine = [];
               /*  edge.sort((a,b)=>{
                    if ( Math.abs( cosVect( edge[0].cord, a.cord )) < Math.abs( cosVect( edge[0].cord, b.cord ))) return 1;
                    return -1;
                }); */
                /*var dublEdge = [
                     edge[0],
                    edge[2],
                    edge[3] 
                ];*/
                ang.sort((a,b)=>{
                    if (a.ang<b.ang) return -1;
                    return 1
                });
                var dublEdge = [];
                for (var i=0;i<2;i++) {
                    dublEdge.push(ang[i].edge[0]);
                    dublEdge.push(ang[i].edge[1]);
                };
                var edgeLHH1=[];
                for (var i=0;i<dublEdge.length;i++) {
                    var count = 0;
                    for (var j=0;j<dublEdge.length;j++) if (dublEdge[i]+""==dublEdge[j]+"") count++;
                    edgeLHH1.push({
                        cr:dublEdge[i],
                        count
                    })
                };
                edgeLHH1.sort((a,b)=>{
                    if (a.count<b.count) return 1;
                    return -1;
                });


               // console.log(22,dublEdge,ee);

                for (var i=0;i<ret.fieldSize.length;i++) ((i)=>{
                    var cr = edgeLHH1[i+1].cr;
                    var l = lenPoint(cr);
                    input[i].input.html.value = Math.round(l);
                   // console.log(input[i].input.html);
                    if (i==0) {input[i].input.html.onchange = function(){
                        var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                        var an = Math.atan2(cr[1][1] - cr[0][1],cr[1][0] - cr[0][0]);
                        var pointRot = [cr[0][0] + (cr[1][0]- cr[0][0])/2, cr[0][1] + (cr[1][1]- cr[0][1])/2];
                        
                        var sc = (this.value/l);
                        //console.log(this.value,l,sc)
                        var mt = new Mt3()
                            .trans(-pointRot[0],-pointRot[1])
                            .rotX(-an)
                            .scale(sc,1)
                            .rotX(an)
                            .trans(pointRot[0],pointRot[1])

                        for (var e of arEdge) {
                            var c = e.edge.cord.slice();
                            //console.log(c);
                            var ee = [];
                            for (var j=0;j<2;j++) {
                                ee[j] = new Mt3()
                                    .trans(c[j][0],c[j][1])
                                    .multiply(mt)
                                    .elements.slice(6,8)
                            };
                           // console.log(c,ee);
                            e.edge.cord = ee;
                           // console.log(c);
                        };
                        
                        
                        //for (var e of arEdge) e.edge.findLink();
                       // for (var e of arEdge) e.edge.move();
                        for (var e of arEdge) e.edge.setCord(e.edge.cord.slice());
                        //createSizeLine(()=>{});
                        cLineSize();
                        //console.log(this.value,i,l,arEdge);
                    }} else input[i].input.html.onchange = function(){
                        var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                        var cr = edgeLHH1[i+1].cr;
                        var edge = arEdge[0].edge;
                        for (var e of arEdge) if (e.edge.cord+"" == cr+"") edge=e.edge;
                        var pointRot = [0,0];
                        for (var k=0;k<2;k++) for (var j=0;j<2;j++) if (edge.cord[k]+""==edgeLHH1[1].cr[j]+"") pointRot = edge.cord[k].slice();
                        var crEdge = edge.cord.slice();
                        var an = Math.atan2(crEdge[1][1] - crEdge[0][1],crEdge[1][0] - crEdge[0][0]);
                        var sc = (this.value/l);
                        //console.log(this.value,l,sc)
                        var mt = new Mt3()
                            .trans(-pointRot[0],-pointRot[1])
                            .rotX(-an)
                            .scale(sc,1)
                            .rotX(an)
                            .trans(pointRot[0],pointRot[1]);
                        ;
                        var neCr = [];
                        for (var e of crEdge) {
                                neCr.push(new Mt3()
                                    .trans(e[0],e[1])
                                    .multiply(mt)
                                    .elements.slice(6,8)
                                );
                        };
                        edge.setCord(neCr);
                        //createSizeLine(()=>{});
                        cLineSize();
                        //console.log(edge,crEdge,neCr);
                    }
                    //
                    arLine.push({
                        cr:cr,
                        value:Math.round(l),
                        name:ret.fieldSize[i],
                        type:"figure"
                    });
                })(i);
               
               
                return arLine;
                
            };
            return ret;
        })(),    
    "L12" : (function(){
            var ret = new AutoSelectFigure({});
            var ang = [];
            ret.analogy = function(){
                var edge = optionEdge();
                var kf = 0;
                ang = [];
                if (edge.length == 4) 
                    if (chekLine(edge)) {
                        var ind = 0;
                        for (var e of edge) if (e.edgeLink[0]) {
                            //var ang = Math.atan2()
                            /* console.log("e",
                                [e.cord[1],e.cord[0]],
                                [e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint],e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint^1]]); */
                            ang.push( {
                                ang:Math.abs(Math.acos( 
                                        cosVect(
                                        [e.cord[1],e.cord[0]],
                                        [e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint],e.edgeLink[0].edge.cord[e.edgeLink[0].indexPoint^1]
                                    ] )
                                    )-Math.PI/2),
                                cr:[e.cord,e.edgeLink[0].edge.cord],
                                ind,
                                edge:e
                            });
                            ind++;
                        };  
                        ang.sort((a,b)=>{
                                if (a.ang>b.ang) return -1
                                return 1
                            }
                        );
                        kf = 1 - ang[3].ang/(Math.PI/2)
                        //console.log(kf,ang);

                    }
                return {
                    kf:kf,
                    prior:.8
                }; 
            };
            ret.fieldSize = ["L","H","L1","H1"];

            ret.setSizeLine = function(input) {
                var edge = optionEdge();
                var arLine = [];
                
                
                ang.sort((a,b)=>{
                    if (a.ang<b.ang) return -1;
                    return 1
                });
                var indexPoint = generalIndexPoint(ang[0].cr[0],ang[0].cr[1]);
                for (var p =0;p<2;p++) ((p)=>{
                    var l = lenPoint(ang[0].cr[p]);
                    var cr = ang[0].cr[p];
                    arLine.push({
                        cr:ang[0].cr[p],
                        value:Math.round(l),
                        name:ret.fieldSize[p],
                        type:"figure"
                    });         
                    input[p].input.html.value = Math.round(l);
                    input[p].input.html.onchange = function(){
                        var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                        var an = Math.atan2(cr[1][1] - cr[0][1],cr[1][0] - cr[0][0]);
                        var pointRot = cr[indexPoint[p]];
                        
                        var sc = (this.value/l);
                        //console.log(this.value,l,sc)
                        var mt = new Mt3()
                            .trans(-pointRot[0],-pointRot[1])
                            .rotX(-an)
                            .scale(sc,1)
                            .rotX(an)
                            .trans(pointRot[0],pointRot[1])

                        for (var e of arEdge) {
                            var c = e.edge.cord.slice();
                            //console.log(c);
                            var ee = [];
                            for (var j=0;j<2;j++) {
                                ee[j] = new Mt3()
                                    .trans(c[j][0],c[j][1])
                                    .multiply(mt)
                                    .elements.slice(6,8)
                            };
                            e.edge.cord = ee;
                        };
                        
                        for (var e of arEdge) e.edge.setCord(e.edge.cord.slice());
                        //createSizeLine(()=>{});
                        cLineSize();
                    };
                    var count = [];
                    for (var i=0;i<edge.length;i++) {
                        var r = {
                            cr:edge[i].cord,
                            count:0,
                            indexEdge:i
                        };
                        for (var k=0;k<2;k++) for (var j=0;j<2;j++) if (r.cr[k]+"" == ang[0].cr[p][j]+"") r.count++;
                        count.push(r);
                    };
                    count.sort((a,b)=>{return a.count - b.count});
                    var pointLine = count[0].cr;
                    var pointRt = ang[0].cr[0][indexPoint[p]].slice();
                    var ang1 = Math.acos(cosVect(ang[0].cr[p],pointLine));
                    var lGp = lenPoint(pointLine);
                    var lKt = lGp*Math.cos(ang1);
                    //
                    var a = Math.atan2(ang[0].cr[p][1][1]-ang[0].cr[p][0][1],ang[0].cr[p][1][0]-ang[0].cr[p][0][0])+Math.PI*indexPoint[p]
                    var mt = new Mt3()
                            .trans(lKt,0)
                            .rotX(a)
                            .trans(pointRt[0],pointRt[1])
                            
                    var cr1 = [pointRt,mt.elements.slice(6,8)];
                    var l1 = lenPoint(cr1);
                    arLine.push({
                        cr:cr1,
                        value:Math.round(l1),
                        name:ret.fieldSize[p+2],
                        type:"figure"
                    });
                    input[p+2].input.html.value = Math.round(l1);
                    input[p+2].input.html.onchange = function(){
                        var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                        var an = Math.atan2(cr1[1][1] - cr1[0][1],cr1[1][0] - cr1[0][0]);
                        var pointRot = pointRt;
                        
                        var sc = (this.value/l1);
                        //console.log(this.value,l,sc)
                        var mt = new Mt3()
                            .trans(-pointRot[0],-pointRot[1])
                            .rotX(-a)
                            .scale(sc,1)
                            .rotX(a)
                            .trans(pointRot[0],pointRot[1])
                        
                        var e = arEdge[count[0].indexEdge];
                        
                        var c = e.edge.cord.slice();
                            //console.log(c);
                            var ee = [];
                            for (var j=0;j<2;j++) {
                                ee[j] = new Mt3()
                                    .trans(c[j][0],c[j][1])
                                    .multiply(mt)
                                    .elements.slice(6,8)
                            };
                        e.edge.setCord(ee);   
                        
                        
                        for (var e of arEdge) e.edge.setCord(e.edge.cord.slice());
                        
                        //createSizeLine(()=>{});
                        cLineSize();
                    };
                })(p);
                
                
                
               
               
                return arLine;
                
            };
            return ret;
        })(), 
    "RS16A" : (function(){
            var ret = new AutoSelectFigure({});
            ret.analogy = function(){
                var edge = optionEdge();
                var kf = 0;
                if (edge.length == 4) 
                    if (chekLine(edge)) {
                        
                        var ang = [
                           
                            Math.acos(cosVect(
                                edge[0].cord,
                                edge[2].cord
                            )),
                             
                            Math.acos(cosVect(
                                edge[1].cord,
                                edge[3].cord
                            ))
                        ];
                        
                        ang.sort((a,b)=>{
                                if (a>b) return -1
                                return 1
                            }
                        );
                        kf = 1 - ang[0]/(Math.PI/2) 
                        //console.log(kf);

                    }
                return {
                    kf:kf,
                    prior:.8
                }; 
            };
            ret.fieldSize = ["H","L","L1"];

            ret.setSizeLine = function(input) {
                var arLine = [];
                var edge = optionEdge();
                var ang = [];
                
                for (var i = 0;i<edge.length;i++) for (var j = i+1; j<edge.length; j++) ang.push({
                    ang:Math.abs(Math.acos(
                        cosVect(
                            edge[i].cord,
                            edge[j].cord
                        )
                    )),
                    edge:[edge[i],edge[j]]
                });
                
                ang.sort((a,b)=>{
                    if (a.ang<b.ang) return -1;
                    return 1
                });
                /* ang.sort((a,b)=>{
                    if (lenPoint(a.edge[0].cord) < lenPoint(b.edge[0].cord) &&  a.ang<=b.ang) return -1;
                    return 1
                }); */
                var t = [
                    ang[0],
                    ang[1]
                ];
                t.sort((a,b)=>{
                    if (lenPoint(a.edge[0].cord) < lenPoint(b.edge[0].cord)) return -1;
                    return 1
                });
                for (var i=0;i<2;i++) ((k)=>{
                    var cr = t[k].edge[0].cord;
                    var l = lenPoint(cr);
                    input[i].input.html.value = Math.round(l);
                   // console.log(input[i].input.html);
                    input[i].input.html.onchange = function(){
                        var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                        var an = Math.atan2(cr[1][1] - cr[0][1],cr[1][0] - cr[0][0]);
                        var sc = (this.value/l);
                        for (var e of t[k].edge) {
                            var ed = arEdge[e.option.indexAr];
                            //console.log(ed.edge)
                            var c = ed.edge.cord.slice();
                            var pointRot = [c[0][0] + (c[1][0]- c[0][0])/2, c[0][1] + (c[1][1]- c[0][1])/2];
                            var mt = new Mt3()
                            .trans(-pointRot[0],-pointRot[1])
                            .rotX(-an)
                            .scale(sc,1)
                            .rotX(an)
                            .trans(pointRot[0],pointRot[1])
                            var ee = [];
                            for (var j=0;j<2;j++) {
                                ee[j] = new Mt3()
                                    .trans(c[j][0],c[j][1])
                                    .multiply(mt)
                                    .elements.slice(6,8)
                            };
                            ed.edge.setCord(ee);
                        };
                        //createSizeLine(()=>{});
                        cLineSize();
                    };
                    arLine.push({
                        cr:t[k].edge[1].cord,
                        value:Math.round(l),
                        name:ret.fieldSize[k],
                        type:"figure"
                    });
                })(i);

                var cr = t[1].edge[0].cord;
                
                var Ang = Math.acos(cosVect(
                    t[0].edge[0].cord,
                    t[1].edge[0].cord
                ));
                var l = lenPoint(cr)*(Math.sin(Ang));
                var mt = new Mt3()
                        .trans(l,0)
                        .rotX(Math.atan2(cr[1][1] - cr[0][1],cr[1][0] - cr[0][0])-Ang+Math.PI/2)
                        .trans(cr[0][0],cr[0][1])
                var cord = [
                    cr[0],
                    mt.elements.slice(6,8)
                ];
                arLine.push({
                        cr:cord,
                        value:Math.round(l),
                        name:ret.fieldSize[2],
                        type:"figure"
                    });
                input[2].input.html.value = Math.round(l);
                input[2].input.html.onchange = function(){
                    var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                    var an = Math.atan2(cord[1][1] - cord[0][1],cord[1][0] - cord[0][0]);
                    var sc = (this.value/l);
                    for (var e of t[1].edge) {
                        var ed = arEdge[e.option.indexAr];
                        //console.log(ed.edge)
                        var c = ed.edge.cord.slice();
                        var pointRot = [c[0][0] + (c[1][0]- c[0][0])/2, c[0][1] + (c[1][1]- c[0][1])/2];
                        var mt = new Mt3()
                        .trans(-pointRot[0],-pointRot[1])
                       // .rotX(-an)
                        .scale(sc,1)
                        .rotX(an)
                        .trans(pointRot[0],pointRot[1])
                        .rotX(-an)
                        var ee = [];
                        for (var j=0;j<2;j++) {
                            ee[j] = new Mt3()
                                .trans(c[j][0],c[j][1])
                                .multiply(mt)
                                .elements.slice(6,8)
                        };
                        ed.edge.setCord(ee);
                    };
                    //createSizeLine(()=>{});
                    cLineSize();
                };
                //console.log(ang);
                /*
                
                ang.sort((a,b)=>{
                    if (a.ang<b.ang) return -1;
                    return 1
                });
                var indexPoint = generalIndexPoint(ang[0].cr[0],ang[0].cr[1]);
                for (var p =0;p<2;p++) ((p)=>{
                    var l = lenPoint(ang[0].cr[p]);
                    var cr = ang[0].cr[p];
                    arLine.push({
                        cr:ang[0].cr[p],
                        value:Math.round(l),
                        name:ret.fieldSize[p],
                        type:"figure"
                    });         
                    input[p].input.html.value = Math.round(l);
                    input[p].input.html.onchange = function(){
                        var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                        var an = Math.atan2(cr[1][1] - cr[0][1],cr[1][0] - cr[0][0]);
                        var pointRot = cr[indexPoint[p]];
                        
                        var sc = (this.value/l);
                        //console.log(this.value,l,sc)
                        var mt = new Mt3()
                            .trans(-pointRot[0],-pointRot[1])
                            .rotX(-an)
                            .scale(sc,1)
                            .rotX(an)
                            .trans(pointRot[0],pointRot[1])

                        for (var e of arEdge) {
                            var c = e.edge.cord.slice();
                            //console.log(c);
                            var ee = [];
                            for (var j=0;j<2;j++) {
                                ee[j] = new Mt3()
                                    .trans(c[j][0],c[j][1])
                                    .multiply(mt)
                                    .elements.slice(6,8)
                            };
                            e.edge.cord = ee;
                        };
                        
                        for (var e of arEdge) e.edge.setCord(e.edge.cord.slice());
                        createSizeLine(()=>{});
                    };
                    var count = [];
                    for (var i=0;i<edge.length;i++) {
                        var r = {
                            cr:edge[i].cord,
                            count:0,
                            indexEdge:i
                        };
                        for (var k=0;k<2;k++) for (var j=0;j<2;j++) if (r.cr[k]+"" == ang[0].cr[p][j]+"") r.count++;
                        count.push(r);
                    };
                    count.sort((a,b)=>{return a.count - b.count});
                    var pointLine = count[0].cr;
                    var pointRt = ang[0].cr[0][indexPoint[p]].slice();
                    var ang1 = Math.acos(cosVect(ang[0].cr[p],pointLine));
                    var lGp = lenPoint(pointLine);
                    var lKt = lGp*Math.cos(ang1);
                    //
                    var a = Math.atan2(ang[0].cr[p][1][1]-ang[0].cr[p][0][1],ang[0].cr[p][1][0]-ang[0].cr[p][0][0])+Math.PI*indexPoint[p]
                    var mt = new Mt3()
                            .trans(lKt,0)
                            .rotX(a)
                            .trans(pointRt[0],pointRt[1])
                            
                    var cr1 = [pointRt,mt.elements.slice(6,8)];
                    var l1 = lenPoint(cr1);
                    arLine.push({
                        cr:cr1,
                        value:Math.round(l1),
                        name:ret.fieldSize[p+2],
                        type:"figure"
                    });
                    input[p+2].input.html.value = Math.round(l1);
                    input[p+2].input.html.onchange = function(){
                        var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                        var an = Math.atan2(cr1[1][1] - cr1[0][1],cr1[1][0] - cr1[0][0]);
                        var pointRot = pointRt;
                        
                        var sc = (this.value/l1);
                        //console.log(this.value,l,sc)
                        var mt = new Mt3()
                            .trans(-pointRot[0],-pointRot[1])
                            .rotX(-a)
                            .scale(sc,1)
                            .rotX(a)
                            .trans(pointRot[0],pointRot[1])
                        
                        var e = arEdge[count[0].indexEdge];
                        
                        var c = e.edge.cord.slice();
                            //console.log(c);
                            var ee = [];
                            for (var j=0;j<2;j++) {
                                ee[j] = new Mt3()
                                    .trans(c[j][0],c[j][1])
                                    .multiply(mt)
                                    .elements.slice(6,8)
                            };
                        e.edge.setCord(ee);   
                        
                        
                        for (var e of arEdge) e.edge.setCord(e.edge.cord.slice());
                        
                        createSizeLine(()=>{});
                    };
                })(p); */
                
                
                
               
               
                return arLine;
                
            };
            return ret;
        })(),
    "L05" : (function(){
            var ret = new AutoSelectFigure({});
            var ang = [];
            ret.analogy = function(){
                var edge = optionEdge();
                var kf = 0;
                
                if (edge.length == 4) 
                    if (chekLine(edge)) {
                        
                        ang = [
                           
                            Math.acos(cosVect(
                                edge[0].cord,
                                edge[2].cord
                            )),
                             
                            Math.acos(cosVect(
                                edge[1].cord,
                                edge[3].cord
                            ))
                        ];
                        
                        ang.sort((a,b)=>{
                                if (a>b) return -1
                                return 1
                            }
                        );
                        kf = 1 - ang[1]/(Math.PI/2) 
                        //console.log(kf);

                    }
                return {
                    kf:kf,
                    prior:.7
                }; 
            };
            ret.fieldSize = ["L","H","L1","L2"];

            ret.setSizeLine = function(input) {
                var edge = optionEdge();
                var arLine = [];
                var arArg = [];
                for (var i=0;i<edge.length;i++) for (var j=i+1;j<edge.length;j++) arArg.push({
                    arg:Math.abs(
                        Math.acos(cosVect(
                            edge[i].cord,
                            edge[j].cord
                        ))
                    ),
                    index:[i,j]
                });
                arArg.sort((a,b)=>{return a.arg-b.arg});

                var parall = [
                    edge[arArg[0].index[0]],
                    edge[arArg[0].index[1]]
                ].sort((a,b)=>{
                    return lenPoint(b.cord)-lenPoint(a.cord)
                });


                //console.log( parall);
                var l = lenPoint(parall[0].cord);

                input[0].input.html.value = Math.round(l);
                arLine.push({
                    cr:parall[0].cord,
                    value:Math.round(l),
                    name:ret.fieldSize[0],
                    type:"figure"
                });
                var ang = Math.atan2(parall[0].cord[1][1] - parall[0].cord[0][1],parall[0].cord[1][0] - parall[0].cord[0][0]);
                var pointCent1 = [parall[0].cord[0][0] + ( parall[0].cord[1][0] - parall[0].cord[0][0] )/2,parall[0].cord[0][1] + ( parall[0].cord[1][1] - parall[0].cord[0][1] )/2];
                var pointCent2 = [parall[1].cord[0][0] + ( parall[1].cord[1][0] - parall[1].cord[0][0] )/2,parall[1].cord[0][1] + ( parall[1].cord[1][1] - parall[1].cord[0][1] )/2];
                input[0].input.html.onchange = function(){
                    var edge = areal?.children[0].child_name['layerEdge'].children[0].children[parall[0].option.indexAr] ;
                    var mt = new Mt3()
                        .trans(-pointCent1[0],-pointCent1[1])
                        .rotX(-ang)
                        .scale(this.value/l,1)
                        .rotX(ang)
                        .trans(pointCent1[0],pointCent1[1])
                    var cr = [
                        new Mt3()
                            .trans(parall[0].cord[0][0],parall[0].cord[0][1])
                            .multiply(mt)
                            .elements.slice(6,8)
                        ,
                        new Mt3()
                            .trans(parall[0].cord[1][0],parall[0].cord[1][1])
                            .multiply(mt)
                            .elements.slice(6,8)
                    ]
                    edge.edge.setCord(cr);
                    //createSizeLine(()=>{});
                    cLineSize();
                };
                
               

                
                var mt = new Mt3()
                        .trans(-pointCent1[0],-pointCent1[1])
                        .rotX(-ang)
                        .trans(pointCent1[0],pointCent1[1])
                var npointCent2 = new Mt3()
                        .trans(pointCent2[0],pointCent2[1])
                        .multiply(mt)
                        .elements.slice(6,8)
                var def = (npointCent2[0] - pointCent1[0])/2;
                var h = npointCent2[1]-pointCent1[1];
                input[1].input.html.value = Math.round(h);
                input[1].input.html.onchange = function(){
                    var edge = [
                        areal?.children[0].child_name['layerEdge'].children[0].children[parall[0].option.indexAr],
                        areal?.children[0].child_name['layerEdge'].children[0].children[parall[1].option.indexAr] 
                    ];
                    var mt = new Mt3()
                        .trans(-pointCent1[0],-(pointCent1[1]+h/2))
                        .rotX(-ang)
                        .scale(1,this.value/h)
                        .rotX(ang)
                        .trans(pointCent1[0],(pointCent1[1]+h/2))
                    for (var e of edge) {
                        var cr = []
                        for (var i=0;i<2;i++) cr.push(
                            new Mt3()
                            .trans(e.edge.cord[i][0],e.edge.cord[i][1])
                            .multiply(mt)
                            .elements.slice(6,8)
                        )
                        e.edge.setCord(cr)
                    }
                   
                    //createSizeLine(()=>{});

                    cLineSize();
                };

                var cr = [];
                var mt1 = new Mt3()
                        .trans(-pointCent1[0],-pointCent1[1])
                        .rotX(ang)
                        .trans(pointCent1[0],pointCent1[1])
                cr.push(
                    new Mt3()
                        .trans(pointCent1[0],pointCent1[1])
                        .trans(def,0)
                        .multiply(mt1)
                        
                        .elements.slice(6,8)
                );
                cr.push(
                    new Mt3()
                        .trans(pointCent1[0],pointCent1[1])
                        .trans(def,h)
                        .multiply(mt1)
                        .elements.slice(6,8)
                );
                arLine.push({
                    cr,
                    value:Math.round(h),
                    name:ret.fieldSize[1],
                    type:"figure"
                });

                var mt2 = new Mt3()
                        .trans(-parall[0].cord[0][0],-parall[0].cord[0][1])
                        .rotX(-ang)
                        .trans(parall[0].cord[0][0],parall[0].cord[0][1])
                
                var point = [
                    {
                        cr:new Mt3()
                            .trans(parall[1].cord[0][0],parall[1].cord[0][1])
                            .multiply(mt2)
                            .elements.slice(6,8),
                        index:0
                    },
                    {
                        cr:new Mt3()
                            .trans(parall[1].cord[1][0],parall[1].cord[1][1])
                            .multiply(mt2)
                            .elements.slice(6,8),
                        index:1
                    }
                ].sort((a,b)=>{return (a.cr[0]-b.cr[0])});

                var l1 = parall[0].cord[0][0] - point[0].cr[0];
                input[2].input.html.value = - Math.round(l1);
                input[2].input.html.onchange = function(){
                    var edge = areal?.children[0].child_name['layerEdge'].children[0].children;
                    var sc = (-this.value)/Math.round(l1);
                    var pointRt = edge[parall[1].option.indexAr].edge.cord[point[0].index];
                    var crMove = edge[parall[0].option.indexAr].edge.cord
                    var mt = new Mt3()
                            .trans(-pointRt[0],-pointRt[1])
                            .rotX(-ang)
                            .scale(sc,1)
                            .rotX(ang)
                            .trans(pointRt[0],pointRt[1])
                    var cr = new Mt3()
                            .trans(crMove[0][0],crMove[0][1])
                            .multiply(mt)
                            .elements.slice(6,8);
                    edge[parall[0].option.indexAr].edge.setCord([cr,crMove[1]])
                    //createSizeLine(()=>{});
                    cLineSize();
                    //console.log(sc,pointRt,crMove);
                };
                var cr = [
                    parall[0].cord[0],
                    new Mt3()

                        .trans(l1,0)
                        .rotX(ang+Math.PI)
                        .trans(parall[0].cord[0][0],parall[0].cord[0][1])
                        .elements.slice(6,8)
                ];
                arLine.push({
                    cr,
                    value:Math.round(Math.abs(l1)),
                    name:ret.fieldSize[2],
                    type:"figure"
                });

               // console.log(parall[0].cord[1],);
                var mt3 = new Mt3()
                        .trans(-parall[0].cord[1][0],-parall[0].cord[1][1])
                        .rotX(-ang)
                        .trans(parall[0].cord[1][0],parall[0].cord[1][1])
                var point1 = [
                    new Mt3()
                        .trans(parall[1].cord[0][0],parall[1].cord[0][1])
                        .multiply(mt3)
                        .elements.slice(6,8)
                    ,
                    new Mt3()
                        .trans(parall[1].cord[1][0],parall[1].cord[1][1])
                        .multiply(mt3)
                        .elements.slice(6,8)
                ].sort((a,b)=>{return -(a[0]-b[0])});
                var l2 = parall[0].cord[1][0] - point1[0][0];
                input[3].input.html.value = Math.round(l2);
                input[3].input.html.onchange = function(){
                    var edge = areal?.children[0].child_name['layerEdge'].children[0].children;
                    var sc = (this.value)/l2;
                    var pointRt = edge[parall[1].option.indexAr].edge.cord[point[1].index];
                    var crMove = edge[parall[0].option.indexAr].edge.cord
                    var mt = new Mt3()
                            .trans(-pointRt[0],-pointRt[1])
                            .rotX(-ang)
                            .scale(sc,1)
                            .rotX(ang)
                            .trans(pointRt[0],pointRt[1])
                    var cr = new Mt3()
                            .trans(crMove[1][0],crMove[1][1])
                            .multiply(mt)
                            .elements.slice(6,8);
                    edge[parall[0].option.indexAr].edge.setCord([crMove[0],cr])
                    //createSizeLine(()=>{});

                    cLineSize();
                    //console.log(sc,pointRt,crMove);
                };
                var cr = [
                    parall[0].cord[1],
                    new Mt3()

                        .trans(l2,0)
                        .rotX(ang+Math.PI)
                        .trans(parall[0].cord[1][0],parall[0].cord[1][1])
                        .elements.slice(6,8)
                ];
                arLine.push({
                    cr,
                    value:Math.round(Math.abs(l2)),
                    name:ret.fieldSize[3],
                    type:"figure"
                });


                //console.log(point,l1);

               // console.log(def);
                //console.log(arArg,edge);
                /* var dublEdge = [];
                for (var i=0;i<2;i++) {
                    dublEdge.push(ang[i].edge[0]);
                    dublEdge.push(ang[i].edge[1]);
                };
                var edgeLHH1=[];
                for (var i=0;i<dublEdge.length;i++) {
                    var count = 0;
                    for (var j=0;j<dublEdge.length;j++) if (dublEdge[i]+""==dublEdge[j]+"") count++;
                    edgeLHH1.push({
                        cr:dublEdge[i],
                        count
                    })
                };
                edgeLHH1.sort((a,b)=>{
                    if (a.count<b.count) return 1;
                    return -1;
                });


               // console.log(22,dublEdge,ee);

                for (var i=0;i<ret.fieldSize.length;i++) ((i)=>{
                    var cr = edgeLHH1[i+1].cr;
                    var l = lenPoint(cr);
                    input[i].input.html.value = Math.round(l);
                   // console.log(input[i].input.html);
                    if (i==0) {input[i].input.html.onchange = function(){
                        var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                        var an = Math.atan2(cr[1][1] - cr[0][1],cr[1][0] - cr[0][0]);
                        var pointRot = [cr[0][0] + (cr[1][0]- cr[0][0])/2, cr[0][1] + (cr[1][1]- cr[0][1])/2];
                        
                        var sc = (this.value/l);
                        //console.log(this.value,l,sc)
                        var mt = new Mt3()
                            .trans(-pointRot[0],-pointRot[1])
                            .rotX(-an)
                            .scale(sc,1)
                            .rotX(an)
                            .trans(pointRot[0],pointRot[1])

                        for (var e of arEdge) {
                            var c = e.edge.cord.slice();
                            //console.log(c);
                            var ee = [];
                            for (var j=0;j<2;j++) {
                                ee[j] = new Mt3()
                                    .trans(c[j][0],c[j][1])
                                    .multiply(mt)
                                    .elements.slice(6,8)
                            };
                           // console.log(c,ee);
                            e.edge.cord = ee;
                           // console.log(c);
                        };
                        
                        
                        //for (var e of arEdge) e.edge.findLink();
                       // for (var e of arEdge) e.edge.move();
                        for (var e of arEdge) e.edge.setCord(e.edge.cord.slice());
                        createSizeLine(()=>{});
                        //console.log(this.value,i,l,arEdge);
                    }} else input[i].input.html.onchange = function(){
                        var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
                        var cr = edgeLHH1[i+1].cr;
                        var edge = arEdge[0].edge;
                        for (var e of arEdge) if (e.edge.cord+"" == cr+"") edge=e.edge;
                        var pointRot = [0,0];
                        for (var k=0;k<2;k++) for (var j=0;j<2;j++) if (edge.cord[k]+""==edgeLHH1[1].cr[j]+"") pointRot = edge.cord[k].slice();
                        var crEdge = edge.cord.slice();
                        var an = Math.atan2(crEdge[1][1] - crEdge[0][1],crEdge[1][0] - crEdge[0][0]);
                        var sc = (this.value/l);
                        //console.log(this.value,l,sc)
                        var mt = new Mt3()
                            .trans(-pointRot[0],-pointRot[1])
                            .rotX(-an)
                            .scale(sc,1)
                            .rotX(an)
                            .trans(pointRot[0],pointRot[1]);
                        ;
                        var neCr = [];
                        for (var e of crEdge) {
                                neCr.push(new Mt3()
                                    .trans(e[0],e[1])
                                    .multiply(mt)
                                    .elements.slice(6,8)
                                );
                        };
                        edge.setCord(neCr);
                        createSizeLine(()=>{});
                        //console.log(edge,crEdge,neCr);
                    }
                    //
                    arLine.push({
                        cr:cr,
                        value:Math.round(l),
                        name:ret.fieldSize[i],
                        type:"figure"
                    });
                })(i);
                */
               
                return arLine;
                
            };

            return ret;
        })(),
    "L43" : (function(){
            var ret = new AutoSelectFigure({});
            ret.analogy = function(){
                var edge = optionEdge();
                var kf = 0;
                if (edge.length == 3) 
                    if (chekLine(edge)) {
                        
                        kf = 1; 
                        //console.log(kf);

                    }
                return {
                    kf:kf,
                    prior:.5
                }; 
            };
            return ret;
        })(),
    
    "RC06" : (function(){
            var ret = new AutoSelectFigure({});
            ret.analogy = function(){
                var kf = 0;
                var rs = oneRtwoDirect();
                if (rs) {
                    var aspectEdge = rs.paralel.adges[0].len/rs.paralel.adges[1].len;
                    var kfR = lenPoint(rs.circEdge.cord)/(rs.circEdge.option.r*2);
                    //console.log(rs,kfR);
                    kf = rs.kfDirect * aspectEdge * kfR;
                   
                }
                return {
                    kf:kf,
                    prior:1
                }; 
            };
            return ret;    
        })(),
    "RC01" : (function(){
            var ret = new AutoSelectFigure({});
            ret.analogy = function(){
                var kf = 0;
                var rs = oneRtwoDirect();
                if (rs) {
                    var aspectEdge = rs.paralel.adges[0].len/rs.paralel.adges[1].len;
                    var kfR = lenPoint(rs.circEdge.cord)/(rs.circEdge.option.r*2);
                    //console.log(rs,kfR);
                    kf = rs.kfDirect ;
                   
                }
                return {
                    kf:kf,
                    prior:.8
                }; 
            };
            return ret;    
        })(),
    "L27" : (function(){
            var ret = new AutoSelectFigure({});
            ret.analogy = function(){
                var kf = 0;
                var rs = oneRtwoDirect();
                if (rs) {
                    var aspectEdge = rs.paralel.adges[0].len/rs.paralel.adges[1].len;
                    var kfR = lenPoint(rs.circEdge.cord)/(rs.circEdge.option.r*2);
                    //console.log(rs,kfR);
                    kf = rs.kfDirect * aspectEdge;
                   
                }
                return {
                    kf:kf,
                    prior:.9
                }; 
            };
            return ret;    
        })(),
    "GR01D" : (function(){
        var ret = new AutoSelectFigure({});
       // console.log(ret);
        var inputMenu;
        ret.analogy = function(){
            var kf = 0;
            var edge = optionEdge();
            //console.log(edge);
             let arAn = [
                angHordR(edge[0].cord,edge[0].option.r),
                angHordR(edge[1].cord,edge[0].option.r)
            ].sort();
            if (edge.length == 2 && edge[0].type == "CircEdge" && edge[1].type == "CircEdge") {
                kf = Math.min(edge[0].option.r,edge[1].option.r)/Math.max(edge[0].option.r,edge[1].option.r) 
                    * (1-Math.abs(1- Math.min(edge[0].option.aspect,edge[1].option.aspect)) )
                    * Math.min(edge[0].option.r,edge[1].option.r)/(lenPoint(edge[0].cord)/2)
                    * arAn[0]/Math.PI;
            };
            function alignFigure(){
                    //console.log("alignFigure",edge);
                    for (var i =0;i<2;i++) edge[i].edge.option.aspect = 1;
                    for (var i =0;i<2;i++) edge[i].edge.option.r = lenPoint(edge[0].cord)/2;
                    for (var i =0;i<2;i++) edge[i].edge.move();
                    if (inputMenu) inputMenu[0].input.html.value = Math.round(lenPoint(edge[0].cord)/2);

            };
            function movePoint(){
                if (edge[0].group.ar.length>1) alignFigure();
            };
            

           // console.log(kf);
            return {
                kf,
                prior:.9,
                alignFigure:alignFigure,
                movePoint
            }; 
        };
        ret.fieldSize = ["R"];
       
        ret.setSizeLine = function(input) {
            inputMenu = input;
            var edge = optionEdge();
            var arLine = [];
           // console.log(edge);
            input[0].input.html.value = Math.round(lenPoint(edge[0].cord)/2);
            input[0].input.html.onchange = function(){
                
                let ang = Math.atan2(edge[0].cord[1][1]-edge[0].cord[0][1],edge[0].cord[1][1]-edge[0].cord[0][0]);
                let centerPoint = [
                    edge[0].cord[0][0]+(edge[0].cord[1][0]-edge[0].cord[0][0])/2,
                    edge[0].cord[0][1]+(edge[0].cord[1][1]-edge[0].cord[0][1])/2
                ];


                let mt = new Mt3()
                    .trans(-centerPoint[0],-centerPoint[1])
                    .rotX(-ang)
                    .scale((this.value*2)/lenPoint(edge[0].cord),1)
                    .rotX(ang)
                    .trans(centerPoint[0],centerPoint[1])
                let nCr = [];
                nCr.push(new Mt3().transAr(edge[0].cord[0]).multiply(mt).elements.slice(6,8));
                nCr.push(new Mt3().transAr(edge[0].cord[1]).multiply(mt).elements.slice(6,8));
                edge[0].edge.setCord(nCr);
               // console.log(ret);
                ret.analogy()['movePoint']();
                //createSizeLine(()=>{});
                cLineSize();
                
            };
            return arLine;
            
        };
        return ret;  
       
    })(),
    "GR04#1" : (function(){
        var ret = new AutoSelectFigure({});
       // console.log(ret);
        var inputMenu;
        ret.analogy = function(){
            var kf = 0;
            var edge = optionEdge();
            var kf = 0;
            let arAn = [
                angHordR(edge[0].cord,edge[0].option.r),
                angHordR(edge[1].cord,edge[0].option.r)
            ].sort();
           // console.log(edge);
            if (edge.length == 2 && edge[0].group.ar.length>1 && edge[0].type == "CircEdge" && edge[1].type == "CircEdge") {
                kf = Math.min(edge[0].option.r,edge[1].option.r)/Math.max(edge[0].option.r,edge[1].option.r) 
                    * Math.min(edge[0].option.aspect,edge[1].option.aspect)/Math.max(edge[0].option.aspect,edge[1].option.aspect)
                    * Math.min(edge[0].option.r,edge[1].option.r)/(lenPoint(edge[0].cord)/2)
                    * arAn[0]/Math.PI;;
            };
            function alignFigure(){
                //console.log("alignFigure",edge);
               // for (var i =0;i<2;i++) edge[i].edge.option.aspect = 1;
                edge[0].edge.option.aspect = edge[1].edge.option.aspect;
                for (var i =0;i<2;i++) edge[i].edge.option.r = lenPoint(edge[0].cord)/2;
                for (var i =0;i<2;i++) edge[i].edge.move();
                if (inputMenu) {
                    inputMenu[0].input.html.value = Math.round(lenPoint(edge[0].cord)/2);
                    inputMenu[1].input.html.value = Math.round(inputMenu[0].input.html.value*edge[0].edge.option.aspect);
                };

            };
            function movePoint(){
                //console.log("movePoint");
                if (edge[0].group.ar.length>1) alignFigure();
            };
            return {
                kf,
                prior:.7,
                alignFigure:alignFigure,
                movePoint
            }; 
        };
        ret.fieldSize = ["R1","R2"];
       
        ret.setSizeLine = function(input) {
            inputMenu = input;
            var edge = optionEdge();
            var arLine = [];
           // console.log(edge);
            input[0].input.html.value = Math.round(lenPoint(edge[0].cord)/2);
            input[1].input.html.value = Math.round(input[0].input.html.value*edge[0].edge.option.aspect);
           // console.log(edge[0].edge.option.aspect);
            input[0].input.html.onchange = function(){
                
                let ang = Math.atan2(edge[0].cord[1][1]-edge[0].cord[0][1],edge[0].cord[1][1]-edge[0].cord[0][0]);
                let centerPoint = [
                    edge[0].cord[0][0]+(edge[0].cord[1][0]-edge[0].cord[0][0])/2,
                    edge[0].cord[0][1]+(edge[0].cord[1][1]-edge[0].cord[0][1])/2
                ];


                let mt = new Mt3()
                    .trans(-centerPoint[0],-centerPoint[1])
                    .rotX(-ang)
                    .scale((this.value*2)/lenPoint(edge[0].cord),1)
                    .rotX(ang)
                    .trans(centerPoint[0],centerPoint[1])
                let nCr = [];
                nCr.push(new Mt3().transAr(edge[0].cord[0]).multiply(mt).elements.slice(6,8));
                nCr.push(new Mt3().transAr(edge[0].cord[1]).multiply(mt).elements.slice(6,8));
                edge[0].edge.setCord(nCr);
               // console.log(ret);
                ret.analogy()['movePoint']();
                //createSizeLine(()=>{});
                cLineSize();
                
            };
            input[1].input.html.onchange = function(){
                let aspect = 1;
                if (inputMenu) {
                    aspect = inputMenu[1].input.html.value/inputMenu[0].input.html.value
                };
                //edge[0].edge.option.aspect;
                for (var i=0;i<2;i++) {
                    edge[i].edge.option.aspect = aspect;
                    edge[i].edge.move();
                };
                //console.log(44,aspect,edge[0].edge.option.aspect);
            };
            return arLine;
            
        };
        return ret;  
       
    })(),
    
};

function oneRtwoDirect(){
    var edgeS = optionEdge();
            if (edgeS.length == 4) {
                edgeS.sort((a,b)=>{
                    if (a.type>b.type) return 1;
                    return -1;
                });
                if (edgeS[0].type == "CircEdge" && edgeS[1].type == "LineEdge") {
                   // var edge = optionEdge();
                    var angdirect = [];
                    for (var i = 1; i<edgeS.length; i++) for (var j=0; j<2; j++) if (edgeS[i].edgeLink[j].edge?.type!= "CircEdge") {
                        var ind = edgeS[i].edgeLink[j].indexPoint;
                        angdirect.push( Math.abs(Math.acos( 
                            cosVect(
                                [edgeS[i].cord[j],edgeS[i].cord[j^1]],  
                                [edgeS[i].edgeLink[j].edge.cord[ind],edgeS[i].edgeLink[j].edge.cord[ind^1]]
                            )
                        )-Math.PI/2) );
                    };
                    angdirect.sort((a,b)=>{
                            if (a>b) return -1
                            return 1
                        }
                    );
                    var angParallel = [];
                    for (var i = 1;i<edgeS.length; i++) for (var j = i+1;j<edgeS.length; j++) angParallel.push({
                         ang:Math.acos( 
                                cosVect(
                                    edgeS[i].cord,  
                                    edgeS[j].cord
                                )
                            ),
                        adges:[
                            {
                                edge:edgeS[i],
                                len:lenPoint(edgeS[i].cord)
                            },
                            {
                                edge:edgeS[j],
                                len:lenPoint(edgeS[j].cord)
                            }
                        ] 
                    });
                    angParallel.sort((a,b)=>{
                        if (a.ang<b.ang) return -1;
                        return 1;
                    })
                   // console.log(angParallel);
                    var kfDirect = (1 - angdirect[0]/(Math.PI/2));
                    angParallel[0].adges.sort(
                        (a,b)=>{
                            return a.len - b.len
                        }
                    );
                    return {
                        kfDirect,
                        paralel:angParallel[0],
                        circEdge:edgeS[0]
                    }
                }
                
            };
            
};

function analitcMaterial(){
    while (extraPanel.child_name['selectMaterial'].children.length) extraPanel.child_name['selectMaterial'].children[0].remove();
    var sel = new LayGroupHTML({
        parent:extraPanel.child_name['selectMaterial'],
        style:{
            padding:"10px",
            position:""
        },
        childrenElem:[
            new LayGroupHTML({
                style:{
                    position:""
                },
                innerHTML:"Материал"
            }),
            new LayGroupHTML({
                tag:"select",
                style:{
                    position:""
                },
                name:"select"
            })
        ],
        
    });
    var alt = new LayGroupHTML({
        parent:extraPanel.child_name['selectMaterial'],
        style:{
            position:""
        }
    });
    for (var k in material) {
        if (!curentMaterial) curentMaterial = k;
        new LayGroupHTML({
            parent:sel.child_name['select'],
            tag:"option",
            innerHTML:k
        })
    };
    sel.child_name['select'].html.onchange = function(){
        curentMaterial = this.value;
        selMaterial();
    };
    selMaterial();
};

var curentFigure = {};

function analysis(){
    
   // console.log("analiz");
    selMaterial();
   // panelAnalitic.html['style'].display = "block";  
    panelAnalitic.resize();
    var arLine = [];
    var arAnalogfigure = [];
    for (var k in listFigure) {
        arAnalogfigure.push({
            name:k,
            res:listFigure[k].analogy()
        });
        listFigure[k].name = k;
    }
    arAnalogfigure.sort((a,b)=>{
        function sumKf(el){
            return el.res.kf + (el.res.prior*kfDefPrioretet)
        }
        if (sumKf(a) > sumKf(b)) return -1
        return 1
    });
    var kfSimilarity = arAnalogfigure[0].res.kf;
    if (arAnalogfigure[0].res.kf>.90) {
        arLine = listFigure[arAnalogfigure[0].name].setFieldInput();
       // console.log(arLine);
        curentFigure = arAnalogfigure[0];
        panelAnalitic.child_name['figure'].html.innerHTML = "Фигура " + curentFigure['name'] + " на "+ Math.round(arAnalogfigure[0].res.kf*100)+"%";
        panelAnalitic.child_name['applyData'].html.style.display="inline-block";

    } else {
        //console.log(panelAnalitic);
        while (panelAnalitic.child_name['optionFigure'].children.length)  panelAnalitic.child_name['optionFigure'].children[0].remove();
        panelAnalitic.child_name['applyData'].html.style.display="none";
        panelAnalitic.child_name['figure'].html.innerHTML = "Фигура не найдена";
        curentFigure = {};
    };
    
     
    return arLine;
    //listFigure["RS16A"].analogy() 


   // console.log(arAnalogfigure[0].name,arAnalogfigure[0].res.kf,panelAnalitic);
};

var angFigure =0;

function selMaterial(){
    if (!curentMaterial) return;
    //return;
    var chekMateril = false;
    var arEdge = areal?.children[0].child_name['layerEdge'].children[0].children || [];
    var edge = [];
    for (var i=0;i<arEdge.length;i++) edge.push({
        ed:arEdge[i].edge,
        len:lenPoint(arEdge[i].edge.cord),
        index:i
    });
    edge.sort((a,b)=>{
        return b.len-a.len
    });
    var anfD = 0;
    (function checkRectSheet(){
        
        var crFig= edge[0].ed.cord;
    
    
        var cr = [];
        for (var k of arEdge)  for (var j=0;j<2;j++) for (var kk of arEdge)  for (var jj=0;jj<2;jj++) cr.push({
            cord:[k.edge.cord[j],kk.edge.cord[jj]],
            len:lenPoint([k.edge.cord[j],kk.edge.cord[jj]])
        });
        cr.sort((a,b)=>b.len-a.len)
       // console.log(cr);
        var diogF = cr[0].cord;
        
        while (areal.children[0].child_name['material'].children.length) areal.children[0].child_name['material'].children[0].remove();
       // console.log(areal.children[0].child_name['material']);
        var whSheet = [
           /* parseFloat(material[curentMaterial]['sw'].data),
           parseFloat(material[curentMaterial]['sl'].data) */
           2000,
           3000
        ];


        var whRect = new Mt3()
                .trans(whSheet[0],whSheet[1])
                .multiply(matrixAreal)
                //.scl(curentScale)
                .elements.slice(6,8)
        var rcSheetWH = [whRect[0]-matrixAreal['elements'][6],whRect[1]-matrixAreal['elements'][7]]
        var rc = new LayGroupHTML({
            name:"rect",
            tag:"rect",
            svg:true,
            parent:areal.children[0].child_name['material'],
            attribute:{
                x:0,
                y:0,
                width:rcSheetWH[0],
                height:rcSheetWH[1],
                stroke:"#f00",
                fill:"none"
            }
        });
    
        angFigure = Math.atan2(crFig[1][1]-crFig[0][1],crFig[1][0]-crFig[0][0]) ;
        anfD =  Math.atan2(diogF[1][1]-diogF[0][1],diogF[1][0]-diogF[0][0]) ;
        var angDoigSheet = Math.atan2(whSheet[1],whSheet[0]);
    
        function findingFit(angFigure) {
            var mt = new Mt3()
                .rotX(-angFigure)
            var mtInver = new Mt3()
                .rotX(angFigure)
            var arCr = [];
            for (var k of edge) for (var j=0;j<2;j++){
                // console.log(k);
                arCr.push(new Mt3()
                        .transAr(k['ed'].cord[j])
                        .multiply(mt)
                        .elements.slice(6,8)
                );
            };
            var mn_mx = []; 
            arCr.sort((a,b)=>{
                return a[0]-b[0]
            });
            mn_mx[0] = arCr[0][0];
            mn_mx[2] = arCr.pop()[0];
            arCr.sort((a,b)=>{
                return a[1]-b[1]
            });
            mn_mx[1]= arCr[0][1];
            mn_mx[3] = arCr.pop()[1];
            var indexPointExit = {
                bool:false,
                lenExit:0,
                indexEdge:0,
                indexPoint:0,
                ang:0
            };
            for(var i=0;i<edge.length;i++) for (var j=0;j<2;j++) {
                var c = new Mt3()
                        .trans(edge[i].ed.cord[j][0],edge[i].ed.cord[j][1])
                        .multiply(mt)
                        .elements.slice(6,8)
                ;
                c= [c[0]-mn_mx[0],c[1]-mn_mx[1]]
                if (c[0]-whSheet[0]>0 && c[0]-whSheet[0]>indexPointExit.lenExit) {
                    indexPointExit = {
                        bool:true,
                        lenExit:c[0]-whSheet[0],
                        indexEdge:i,
                        indexPoint:j,
                        ang:0
                    }
                };
                if (c[1]-whSheet[1]>0 && c[1]-whSheet[1]>indexPointExit.lenExit) {
                    indexPointExit = {
                        bool:true,
                        lenExit:c[1]-whSheet[1],
                        indexEdge:i,
                        indexPoint:j,
                        ang:Math.PI/2
                    }
                };
               // if (i==0 && j==0) console.log(c);
            }
           // console.log("edge",edge,indexPointExit)
    
            for (var i = 0; i<2; ++i) {
                var c = new Mt3()
                            .trans(mn_mx[i*2],mn_mx[i*2+1])
                            .multiply(mtInver)
                            //.multiply(matrixAreal)
                            .elements.slice(6,8);
                mn_mx[i*2] = c[0];
                mn_mx[i*2+1] = c[1];
            };
    
            return {
                rectAngFigure:mn_mx,
                indexPointExit
            }
        }
    
        var resFit = [
            {
                ang:angFigure,
                rs:findingFit(angFigure)
            },
            {
                ang:anfD-angDoigSheet,
                rs:findingFit(anfD-angDoigSheet)
            },
            {
                ang:anfD-angDoigSheet+Math.PI,
                rs:findingFit(anfD-angDoigSheet+Math.PI)
            },
        ];
    
        resFit.sort((a,b)=>a.rs.indexPointExit.lenExit - b.rs.indexPointExit.lenExit)
        ;
        if (resFit[0].rs.indexPointExit.lenExit>0) setMasseg({
            text:"Фигура выходит за пределы листа"
        })
        //console.log(resFit[0].rs.indexPointExit.lenExit);
        var mtRc = new Mt3()
                .rotX(resFit[0].ang)
                .transAr(
                    new Mt3()
                    .trans(resFit[0].rs.rectAngFigure[0],resFit[0].rs.rectAngFigure[1])
                    //.multiply(matrixAreal)
                    .scl(curentScale)
                    .elements.slice(6,8)
                );
        write_matrix(rc.html,mtRc);
    })();
    
    (function checkLengthEdge(){
        var edgMinLen = edge.pop();
        var dataMinLen = material[curentMaterial].mtr.data;
        if (Math.ceil(edgMinLen.len)<dataMinLen) {
            setMasseg({
                text:"Сторона меньше минимально допустимой"
            });
            var pointRot = [
                edgMinLen.ed.cord[0][0]+(edgMinLen.ed.cord[1][0] - edgMinLen.ed.cord[0][0])/2,
                edgMinLen.ed.cord[0][1]+(edgMinLen.ed.cord[1][1] - edgMinLen.ed.cord[0][1])/2
            ];
            var ang = Math.atan2(edgMinLen.ed.cord[1][1] - edgMinLen.ed.cord[0][1],edgMinLen.ed.cord[1][0] - edgMinLen.ed.cord[0][0]);
            /* for (var i=0;i<2;i++) for (var j=0;j<2;j++) if (edgMinLen.ed.cord[i]+"" == elcurentSelect.el['cord'][j]+"") {
                pointRot = edgMinLen.ed.cord[i^1];
                ang+=Math.PI*i
            }; */

           // console.log(elcurentSelect);
            var sc = dataMinLen*1.00000000001/(edgMinLen.len);
            var mt = new Mt3()
                    .trans(-pointRot[0],-pointRot[1])
                    .rotX(-ang)
                    .scale(sc,1)
                    .rotX(ang)
                    .trans(pointRot[0],pointRot[1])
            var cr = [];
            for (var i=0;i<2;i++) cr.push(
                new Mt3()
                    .transAr(edgMinLen.ed.cord[i])
                    .multiply(mt)
                    .elements.slice(6,8)
            );
            edgMinLen.ed.setCord(cr);
            /* console.log(
                edgMinLen,
                dataMinLen, 
                elcurentSelect,
                pointRot 
            ); */
           chekMateril = true;
        }
        
    });

    (function checkAngMin(){
        var arAng = [];
        for (var e of arEdge) for (var i=0;i<e.edge.edgeLink.length;i++) {
            var edCord = [
                        [e.edge.cord[i^1],e.edge.cord[i]],
                        [e.edge.edgeLink[i].edge.cord[e.edge.edgeLink[i].indexPoint],e.edge.edgeLink[i].edge.cord[e.edge.edgeLink[i].indexPoint^1]]
                    ]
            arAng.push(
                {
                    edCord,
                    cos:cosVect(edCord[0],edCord[1]),
                    indexEdge: e.edge.indexAr,
                    indexLink:i
                    //index:
                }
            )
        };
        arAng.sort((a,b)=>b.cos-a.cos);
       // console.log(arEdge,arAng,Math.acos (arAng[0].cos),material[curentMaterial]);
    });

    function mn_mxAng(ang) {
        var mt = new Mt3()
            .rotX(-ang)
       /*  var mtInver = new Mt3()
            .rotX(anfD) */
        var arCr = [];
        for (var k of edge) for (var j=0;j<2;j++){
            // console.log(k);
            arCr.push(new Mt3()
                    .transAr(k['ed'].cord[j])
                    .multiply(mt)
                    .elements.slice(6,8)
            );
        };
        var mn_mx = []; 
        arCr.sort((a,b)=>{
            return a[0]-b[0]
        });
        mn_mx[0] = arCr[0][0];
        mn_mx[2] = arCr.pop()[0];
        arCr.sort((a,b)=>{
            return a[1]-b[1]
        });
        mn_mx[1]= arCr[0][1];
        mn_mx[3] = arCr.pop()[1];
        return mn_mx;
    }
    (function checkAspect(){
        
        var aspect = parseFloat(material[curentMaterial]['mirsl'].data)+.5;
        var ang = anfD;
        var mn_mx = mn_mxAng(ang);
        if (mn_mx[2]-mn_mx[0]<mn_mx[3]-mn_mx[1]) {
            ang+=Math.PI/2;
            mn_mx = mn_mxAng(ang);
        }
        var width = mn_mx[2]-mn_mx[0];
        var height = mn_mx[3]-mn_mx[1];
        if (height/width<aspect) {
            setMasseg({
                text:"Соотношение высоты к ширине меньше допустимого"
            });
            var pointRot = new Mt3()
                    .trans(mn_mx[0]+(width/2),mn_mx[1]+(height/2))
                    //.rotX(ang)
                    .elements.slice(6,8);
            //pointRot = [0,0]
            var sc = aspect / (height/width);
            var mt = new Mt3()
                    .trans(pointRot[0],pointRot[1])
                    //.trans(1,0)
                    .rotX(.01)
                    //.rotX(-ang)
                    //.scale(1/sc,sc)
                    //.rotX(ang)
                    .trans(-pointRot[0],-pointRot[1])
            for (var e  of arEdge) for (var i=0;i<2;i++) {
                e.edge.cord[i]=new Mt3()
                        .transAr(e.edge.cord[i])
                        .multiply(mt)
                        .elements.slice(6,8)

            };
            for (var e  of arEdge) {
                e.edge.setCord(e.edge.cord.slice());
            };
            /* 
            for (var e of arEdge) e.edge.setCord(e.edge.cord.slice());
                        createSizeLine(()=>{}); */
           // console.log(55,arEdge);
            //chekMateril
        }

        
        

    });
    
    if (chekMateril) setTimeout(()=>{selMaterial()},100);
    //console.log(elcurentSelect);
    
    //console.log(arCr,mn_mx);
};


export{ analysis, panelAnalitic, angFigure, curentFigure };