import { LayGroupHTML, lenPoint, angLine, createD,lineSegmentsIntersectBool,lineSegmentsIntersect } from "./class";
import { buildSvgEdge } from "./build_svg_dxf";
import { matrixAreal,WH } from "./areal";
import { InverseMatrix } from "./func";

import { 
    rectBackground, 
    group, 
    curentScale,
    angHordR,
    optionEdge,
    areal,
    
} from './areal';

import { 
    createBlockInputSelectLine, 
    createBlockInputSelectPoint, 
    closeBlockSelect,
    elcurentSelect
} from "./extra_panel";
import { billet, readOnload } from "./billet";
import { hole } from "./hole";
import { angFigure, curentFigure } from './analysis';
import { createSizeLine,cLineSize } from "./line_size";
import { Mt3, write_matrix, read_cord,cosVect} from "./expan.js";

function createArc(opt){// строит дугу по радиусу и углу
    //console.log(opt);
    var arc = opt.arc;
    var lenArc = arc*opt.r;
    var count = Math.floor(lenArc/opt.step);
    var angStep = arc/count;
    var ar = [];
    var def = Math.sin((Math.PI-arc)/2)*opt.r*opt.aspect - Math.sin((Math.PI-arc)/2)*opt.r;
    for (var i=0;i<=count;i++) ar.push(
        new Mt3()
            
            .trans(-opt.r,0)
            
            .rotX(-arc/2)
            
            .rotX(angStep*i)
            .scale(opt.aspect,1)
            .rotX(arc/2)
            //
            
            .trans(opt.r,0)
            
            .rotX(Math.PI/2 - arc/2)
            .trans(0, def)
            .multiply(opt.mt)
            .elements.slice(6,8)
        );
    //.rotX(arc/2)
    //console.log(ar);
    return {
        ar
    };
};

function createLayHTML(option){
        let t = {
            parent:option.parent,
        };
        if (option.insert) {
            t['insert'] = option.insert;
        };
        
        var e = new LayGroupHTML({
            ... t,
            elementInsert:option.el,
            name:option.el.hasAttribute("onload") ? option.el.getAttribute("onload") : ""
        });
        var ch = e.html['childNodes'];
        var cl = [];
        for (var i=0;i<ch.length;i++) cl.push(ch[i].cloneNode(true));
        while (ch.length) ch[0].remove();
        for (var i=0;i<cl.length;i++) createLayHTML({el:cl[i],parent:e});
        return e;
        //console.log(el.)
    };

function createArcHord(opt){
    //
    var arc = opt.arc;
    if (opt.arc==undefined)  arc = angHordR(opt.hord,opt.r)
    return createArc({
        r:opt.r,
        arc:arc,
        aspect:opt.aspect,
        step:opt.step,
        mt:new Mt3().rotX(Math.atan2(opt.hord[1][1] - opt.hord[0][1],opt.hord[1][0] - opt.hord[0][0])).trans(opt.hord[0][0],opt.hord[0][1])
    }).ar
};
var modeResolutionMove = true;
class Edge extends LayGroupHTML {

    cord = [
        [0,0],
        [0,0]
    ];
    option = {
        r : 1,
        vec : 1,
        pointR:[0,0],
        ang:Math.PI,
        aspect:1,
        arArc:[],
        markerR:[
            [],
            [],
            []
        ],
        fixedAng : [
            {
                fix:false,
                ang:0
            },
            {
                fix:false,
                ang:0
            }
        ],
        light:{
            width:5,
            type:"contur" || "face" || "face+contur" ||  "none",
            paddingCenter:15,
            typeGlow: "neutral" || "cold" || "hot" 
        }
    };
    statuslLigth = false;
    setFixedAng = function (index,status){
        var ang = angLine(this.cord,this.edgeLink[index].edge.cord);
        this.option.fixedAng[index] = {
            fix : status,
            ang : ang
        };
        var indexLink = this.edgeLink[index].indexPoint;
        var edgeLink = this.edgeLink[index].edge;
        edgeLink.option.fixedAng[indexLink] = {
            fix : status,
            ang : angLine(edgeLink.cord,edgeLink.edgeLink[indexLink].edge.cord)
        };
        //console.log(this,ang);
    };
    edgeLink=[        {
            edge:{},
            indexPoint:undefined
        },
        {
            edge:{},
            indexPoint:undefined
        },
    ];
    listEvent = [];
    arLineDesignation = [
        [0,0],
        [0,0]
    ];
    
    setLight = function(status){
        this.statuslLigth = status;
        this.move();
    };
    setCord = function(cr){
        this.cord = cr.slice();
        
        this.move();
        
        for (var i=0;i<this.edgeLink.length;i++) if (this.edgeLink[i].indexPoint!=undefined) {
            this.edgeLink[i].edge.cord[this.edgeLink[i].indexPoint] = cr[i].slice();
            this.edgeLink[i].edge.move();
        };
        if (this.listEvent) for (var e of this.listEvent) e();
        rectBackground.runEvent("colorCursorHole","");
    };
    findLink = function(){
        var arEdge = [];
        for (var e of group.child_name['gropeEdge'].children) if (e.edge!==this) {
            arEdge.push({
                edge:e.edge,
                cord:e.edge.cord[0],
                indexCord:0
            });
            arEdge.push({
                edge:e.edge,
                cord:e.edge.cord[1],
                indexCord:1
            });
        };
        this.edgeLink = [
            {
                edge:{},
                indexPoint:undefined
            },
            {
                edge:{},
                indexPoint:undefined
            },
        ];
        function len(c1,c2){
            return Math.pow(c2[0]-c1[0],2)+Math.pow(c2[1]-c1[1],2);
        };

        if (arEdge.length && this.elemements.parent.name=="gropeEdge") for (var i=0;i<this.cord.length;i++) {
            var cr = this.cord[i];
            arEdge.sort(function(a,b){
                if (len(cr.slice(),a.cord)>len(cr.slice(),b.cord)) {return 1} else return -1
            });
            if (len(this.cord[i],arEdge[0].cord)<5) {
                this.edgeLink[i]={
                    edge:arEdge[0].edge,
                    indexPoint:arEdge[0].indexCord
                };
                arEdge[0].edge.edgeLink[arEdge[0].indexCord] = {
                    edge:this,
                    indexPoint:i
                };

            }; 
            //console.log(this.cord[i],arEdge);
        }; 
        
    };

    selectLine = function(){
        this.listEvent = [];
        if (createBlockInputSelectLine(this)) {
           // console.log("selectLine",this.group.ar);
            for (var k of this.group.ar) {
                k.elemements.child_name['lineDown'].html.setAttribute("opacity",0.3);
                k.elemements.child_name['lineDown'].html.getElementsByTagName('path')[0].style["stroke"]="#0f0";
            };
            this.elemements.child_name['lineDown'].html.getElementsByTagName('path')[0].style["stroke"]="#00f";
            this.elemements.child_name['lineDown'].html.setAttribute("opacity",.3);
        } else {
            this.elemements.child_name['lineDown'].html.getElementsByTagName('path')[0].style["stroke"]="#0f0";
            this.elemements.child_name['lineDown'].html.setAttribute("opacity",.3);
        }

        
    };
    addGroup = function(group) {
        this.group = group;
        this.group.ar.push(this);
        //console.log("group",group);
    };
    addElemGroup = function(el){
        var ee = true;
        for (var ii=0;ii<this.group.ar.length;ii++) if (this.group.ar[ii] === el) ee = false;
        if (ee) {
            this.group.ar.push(el);
            el.group.option = this.group.option;
            el.group = this.group;
        };
    };
    deleteElGroup = function() {
        closeBlockSelect();
        for (var i=0;i<this.group.ar.length;i++) if (this.group.ar[i].indexAr == this.indexAr) this.group.ar.splice(i,1);
        let opt = [];
        for (var i=0;i<this.group.option.length;i++) opt.push({... this.group.option[i]});
        this.group = {
            ar:[this],
            option:opt
        };
        createBlockInputSelectLine(this);
    };
    group = {
        ar:[this],
        option:[
            {
                name:"Аспект",
                type:["CircEdge"],
                value:true,
                nameOption:"aspect"

            },
            {
                name:"Радиус",
                type:["CircEdge"],
                value:true,
                nameOption:"r"

            }
        ]
    };
    selectPoint = function (index){
        createBlockInputSelectPoint(this,index);
        this.elemements.child_name['circleDown'+index].html.setAttribute("opacity",.3);
    };

    closeSelect = function(){
        for (var k of this.group.ar) k.elemements.child_name['lineDown'].html.setAttribute("opacity",0);
        for (var c = 0; c<2; c++) this.elemements.child_name['circleDown'+c].html.setAttribute("opacity",0);
    };
    
    eventList={};
    addEvent=function(event,ob,fn){
        if (!this.eventList[event]) this.eventList[event]=[];
        this.eventList[event].push({ob:ob,funct:fn});
    };
    runEvent=function(event,arg){
        if (this.eventList[event]) for (var i=0;i<this.eventList[event].length;i++) this.eventList[event][i].funct.call(this.eventList[event][i].ob,arg);
    };
    removeEvent=function(event,ob){
        if (this.eventList[event]) for (var i=0;i<this.eventList[event].length;i++) if ( this.eventList[event][i].ob===ob){
            this.eventList[event].splice(i,1);
        }
    };
    remove = function(){
        this.elemements.remove();
        //console.log("remove",this);
    };
    arLineLigth = [];
    createTypeLight = function(){
        //.html.style.display = 'none';
        let layerTypeLigth = areal.children[0].child_name['layerEdge'].child_name['gropeTypeLigth'];
        if (this.indexAr == 0) while (layerTypeLigth.html.children.length) layerTypeLigth.html.children[0].remove();
        if (this.indexAr == 0 || true) {
            
           
           // console.log(layerTypeLigth);
            let path = document.createElementNS("http://www.w3.org/2000/svg","path");
            path.setAttribute("d",createD(this.arLineLigth));
            path.setAttribute("stroke","#000");
            let lenPath = path.getTotalLength();
            var childElType = this.elemements.child_name['light'].child_name['type'];
            for ( let e of childElType.children) e.html.style.display = "none";

            var elType = childElType.child_name[this.option.light.type];
            //elType.html.style.display = "block";
            let crElType = read_cord(elType.html);
            let scaleElem = this.option.light.width/ crElType.height;
            let width = crElType.width*scaleElem*curentScale;
            let countEl = lenPath/width;
            let def = (lenPath - Math.floor(countEl) * width)/2;
            //console.log(countEl,this.arLineLigth);
            //layerTypeLigth.html.appendChild(path);
            //console.log(path)
            for (let i=0;i<countEl;++i) {
                let el = elType.html.cloneNode(true);
                el.style.display = 'block';
                layerTypeLigth.html.appendChild(el);
                let cr = path.getPointAtLength(lenPath*((i+.5)/Math.floor(countEl+1))-1)
                let cr2 = path.getPointAtLength(lenPath*((i+.5)/Math.floor(countEl+1))-2)
                let mt = new Mt3()
                    .trans(-crElType.x-crElType.width/2,-crElType.y-crElType.height/2)
                    .rotX(Math.atan2(cr2.y-cr.y,cr2.x-cr.x)+Math.PI)
                    .scl(scaleElem*curentScale)
                    .trans(cr.x,cr.y)
                    //.trans(lenPath*(i/countEl)+def,0)
                    //.trans(this.arLineLigth[0][0],this.arLineLigth[0][1]);
                write_matrix (el,mt);
                
            }
            
            
          
           
        };
        
    };
    setTypeLigth = function (nameType){
        this.option.light.type = nameType;
        var ed = optionEdge();
        for ( let e of ed) e.edge.createTypeLight();
    };
    setfixedAng=function(ang) {
        if (ang == undefined) return;   
        this.option['fixedAng'] = ang;
    };
    constructor(option){  
       // console.log(option);
        super(option);
        if (option.light) this.option.light = { ... option.light};
        for (var k of ['fixedAng']) this['set'+k](option[k]);
        let _this=this;
        this['elemements'] = createLayHTML({
            el:billet['chil']['edge'],
            parent:option['parent'] || group.child_name['gropeEdge'],
            insert:option.insert
        });
        //
        createLayHTML({
            el:billet['chil']['light'],
            parent:this['elemements']
        });
        
        if (!option['parent']) {
            this['elemements'].child_name['lineDown'].setOption({
                down:{
                    fnDown:function(e){
                        //  console.log(this);
                        if (this.cordDown && this.cordDown.timeDown && new Date().getTime()-this.cordDown.timeDown<500) {

                            let eCr = [(e.cord[0]-WH[0]/2)/curentScale,(e.cord[1]-WH[1]/2)/curentScale];
                            var cr =InverseMatrix(matrixAreal.elements)[2].slice(0,2);
                            eCr[0]+=cr[0];eCr[1]+=cr[1];

                           // new .(m);
                            
                            let index = _this['indexAr']
                           // 
                            
                            let ee1=new LineEdge({
                                cord:[
                                    _this.cord[0],
                                    eCr
                                ],
                                insert:_this['elemements']
                            }); 
                            let ee = new LineEdge({
                                cord:[
                                    eCr,
                                    _this.cord[1]
                                    
                                ],
                                insert:_this['elemements']
                            }); 
                            _this.remove();
                            ee.findLink();
                            ee1.findLink();
                            setTimeout(()=>ee.selectPoint(0));
                            //console.log();
                            //
                        }
                        this.cordDown = {
                            cursor : e.cord,
                            curentCord : _this.cord.slice(),
                            timeDown:new Date().getTime()
                        };
                        hole.cursorOff();
                        if (modeResolutionMove) _this.selectLine();
                        setCurentAngLine();
                    },
                    fnMove:function(e){
                        var def = [e.cord[0] - this.cordDown.cursor[0],e.cord[1] - this.cordDown.cursor[1]];
                        var ar = [];
                        for (var i=0;i<2;i++) {
                            ar[i] = [Math.round(this.cordDown.curentCord[i][0]+def[0]/curentScale),Math.round(this.cordDown.curentCord[i][1]+def[1]/curentScale)]
                        };
                        if (modeResolutionMove) _this.setCord(ar);
                        if ( curentFigure['res'] && curentFigure['res']['movePoint'] ) curentFigure['res']['movePoint']();
                        //createSizeLine(()=>{});
                        checkedFixAng();
                        checkedСrossing([_this['indexAr']]);
                       // console.log(this.cordDown);
                    }/* ,
                    fnUp:function(e){
                       // console.log(_this);
                        
                       checkAng();
                    } */
                },
                style:{
                    cursor:"move"
                }
            }
            );
            for (var c = 0; c<2; c++) {
                (function(index){
                    _this['elemements'].child_name['circleDown'+index].setOption({
                            down:{
                                fnDown:function(e){
                                    this.cordDown = {
                                        cursor : e.cord,
                                        curentCord : _this.cord.slice()
                                    };
                                    hole.cursorOff();

                                    if (modeResolutionMove) _this.selectPoint(index);
                                    setCurentAngLine();
                                // areal.runEvent("cursorHoleOff","");
                                },
                                fnMove:function(e){
                                    var def = [e.cord[0] - this.cordDown.cursor[0],e.cord[1] - this.cordDown.cursor[1]];
                                    var ar = [];
                                    ar[index] = [Math.round(this.cordDown.curentCord[index][0]+def[0]/curentScale),Math.round(this.cordDown.curentCord[index][1]+def[1]/curentScale)];
                                    ar[index^1] = this.cordDown.curentCord[index^1].slice();
                                    //console.log(index,index^1);
                                    //_this.setCord(ar);
                                    if (modeResolutionMove) _this.setCord(ar);
                                    if ( curentFigure['res'] && curentFigure['res']['movePoint'] ) curentFigure['res']['movePoint']();
                                    //createSizeLine(()=>{});
                                    checkedFixAng();
                                    checkedСrossing([_this['indexAr'],_this.edgeLink[index].edge['indexAr']])
                                // console.log(this.cordDown);
                                }/* ,
                                fnUp:function(e){
                                   // console.log(_this);
                                    
                                   checkAng();
                                } */
                            },
                            style:{
                                cursor:"move"
                            },
                           /*  up:function(){
                               // console.log(_this);
                            } */
                        }
                    );
                })(c);
            }
        }
        
        this['elemements']['edge'] = this;
        
        this['elemements'].child_name['light'].setOption({"click":function(){
            //console.log(this.ob_strukt,_this);
            let indexCurentType = 0;;

            let listType = _this['elemements'].child_name['light'].child_name['type'].children;
            for (let i=0;i<listType.length;++i) if (listType[i].name == _this.option.light.type) indexCurentType = i+1;
            if (indexCurentType>listType.length-1) indexCurentType = 0;

            
            
            _this.setTypeLigth(listType[indexCurentType].name);
        }})
       // console.log(this['elemements'].child_name['light']);
        
    };
};

class LineEdge extends Edge{
    move = function () {
        //console.log();
        var matrixCorect = new Mt3().scl(curentScale);
        if (this.elemements.parent.name!="gropeEdge") matrixCorect = new Mt3();
        var mtCord = [];
        for (var i=0;i<2;i++) {
            mtCord[i] = new Mt3()
                .trans(this.cord[i][0],this.cord[i][1])
                .multiply(matrixCorect)
                //.scl(curentScale)
                .elements.slice(6,8);
            //this.line.setAttribute("x"+(i+1),mtCord[i][0]);this.line.setAttribute("y"+(i+1),mtCord[i][1]);
        };
        var d = `M${mtCord[0]+""} L${mtCord[1]+""}`;
        this.arLineDesignation = [mtCord.slice()];
        this.elemements.child_name['lineGeneral'].html.getElementsByTagName("path")[0].setAttribute("d",d);
        this.elemements.child_name['lineDown'].html.getElementsByTagName("path")[0].setAttribute("d",d);

        var k = read_cord(this.elemements.child_name['circleDown0'].html);
        write_matrix(this.elemements.child_name['circleDown0'].html,new Mt3()
            .trans(-(k.x+k.width/2),-(k.y+k.height/2))
            .trans(mtCord[0][0],mtCord[0][1])
        );

        var k = read_cord(this.elemements.child_name['circleDown1'].html);
        write_matrix(this.elemements.child_name['circleDown1'].html,new Mt3()
            .trans(-(k.x+k.width/2),-(k.y+k.height/2))
            .trans(mtCord[1][0],mtCord[1][1])
        );
        this.option.arArc = this.cord.slice();
        if ( this.statuslLigth) {
            this.elemements.child_name["light"].html.style.display = "block";
            let arAng = [Math.PI/2,Math.PI/2];
            for ( let i=0;i<this.edgeLink.length;++i) if (this.edgeLink[i].edge.cord) {
                //console.log(i,this.edgeLink[i]);
                arAng[i] = angLine(
                    [this.cord[0],this.cord[1]],
                    [this.edgeLink[i].edge.cord[this.edgeLink[i].indexPoint],this.edgeLink[i].edge.cord[this.edgeLink[i].indexPoint^1]]
                );
                if (this.edgeLink[i].edge.type == "CircEdge") {
                    arAng[i]+=(i^1)*Math.PI/2;
                    //arAng[i]+=(2*i-1)*Math.PI/2;
                    //
                    //console.log(i,this.edgeLink[i].edge.option);
                } else arAng[i]/=2;
                
            }
            let pathFill = this.elemements.child_name["light"].child_name['fill'].children[0];
            let l = lenPoint(this.cord);
            let height1 = this.option.light.paddingCenter-this.option.light.width/2;
            let height2 = this.option.light.paddingCenter+this.option.light.width/2;
           // console.log(Math.tan(arAng[0]),arAng[0]);
            let arCordPath = [
                [-l/2+height1*Math.tan(arAng[0]),-this.option.light.width/2],
                [l/2-height1*Math.tan(Math.PI/2-arAng[1]),-this.option.light.width/2],
                [l/2-height2*Math.tan(Math.PI/2-arAng[1]),this.option.light.width/2],
                [-l/2+height2*Math.tan(arAng[0]),this.option.light.width/2]
            ];

            if (this.edgeLink[0].edge.type == "CircEdge") {
                arCordPath[0] = [-l/2,-this.option.light.width/2];
                arCordPath[3] = [-l/2,this.option.light.width/2]
            };
            if (this.edgeLink[1].edge.type == "CircEdge") {
                arCordPath[1] = [l/2,-this.option.light.width/2];
                arCordPath[2] = [l/2,this.option.light.width/2]
            };
            let mt = new Mt3()
                    .trans(0,this.option.light.paddingCenter)
                    .rotX(Math.atan2(this.cord[1][1] - this.cord[0][1],this.cord[1][0] - this.cord[0][0]))
                    .trans(this.cord[0][0] + (this.cord[1][0] - this.cord[0][0])/2,this.cord[0][1] + (this.cord[1][1] - this.cord[0][1])/2)
                    ;
            for ( let i=0; i<arCordPath.length;++i) arCordPath[i] = new Mt3()
                                                                    .transAr(arCordPath[i])
                                                                    .multiply(mt)
                                                                    .multiply(matrixCorect)
                                                                    .elements.slice(6,8);
            for ( let i=0; i<arCordPath.length;++i) arCordPath[i] = [
                Math.round(arCordPath[i][0]),
                Math.round(arCordPath[i][1])
            ];
            let d = `M${arCordPath[0]+""} L`;
            for (let i=1;i<arCordPath.length;++i) d+=`${arCordPath[i][0]+""},${arCordPath[i][1]+""} `;
            d+="z";
            pathFill.html.setAttribute("d",d);
            pathFill.html.setAttribute("opacity",1);
            this.arLineLigth = [
                [arCordPath[0][0] + (arCordPath[3][0]-arCordPath[0][0])/2,arCordPath[0][1] + (arCordPath[3][1]-arCordPath[0][1])/2],
                [arCordPath[1][0] + (arCordPath[2][0]-arCordPath[1][0])/2,arCordPath[1][1] + (arCordPath[2][1]-arCordPath[1][1])/2]
            ];
            this.createTypeLight();
           
        } else this.elemements.child_name["light"].html.style.display = "none";
        
        //sendDataMaker();
        //createArelGradient();
    };
    constructor(opt){
        super(opt);
        this.setCord(opt.cord);
        
        this.findLink();
    }
};
class CircEdge extends Edge{
    setr = function(r){
       // console.log(r,this);
        
        this.option['r'] = r;
        for (var i=0;i<this.group.ar.length;i++) if (this.group.ar[i]!==this) {
            this.group.ar[i].option['r'] = r;
            this.group.ar[i].move();
        };
        //console.log(this.option);
    };
    setaspect = function(aspect){
        //console.log(aspect,this);
        
        this.option['aspect'] = aspect;
        for (var i=0;i<this.group.ar.length;i++) if (this.group.ar[i]!==this) {
            this.group.ar[i].option['aspect'] = aspect;
            this.group.ar[i].move();
        };
        //console.log(this.option);
    };
    setvec = function(vec){
        this.option['vec'] = vec;
    };
    setang = function(ang) {
        if (ang == undefined) return;   
        this.option['ang'] = ang;
    };
    
    move = function () {
        var mtCord = [];
        var matrixCorect = new Mt3().scl(curentScale);
        if (this.elemements.parent.name!="gropeEdge") matrixCorect = new Mt3();
        if (lenPoint(this.cord)/2>this.option.r) {
            this.option.r = lenPoint(this.cord)/2;
            
        };
        this.runEvent("moveR",this.option.r);

        var angArc = angHordR(this.cord,this.option.r);
        this.option.calculAng = angArc;
        this.runEvent("moveArc",angArc);
        var angGeneral = Math.atan2(this.cord[1][1] - this.cord[0][1],this.cord[1][0] - this.cord[0][0]);
        var def = Math.sin((Math.PI-angArc)/2)*this.option.r*this.option.aspect - Math.sin((Math.PI-angArc)/2)*this.option.r;
        this.option.pointR = new Mt3()
                .trans(this.option.r,0)
                .rotX(Math.PI - (angArc+Math.PI)/2)
                .rotX(angGeneral)
                .trans(this.cord[0][0],this.cord[0][1])
                .elements.slice(6,8);
        this.option.pointR = [
            Math.round(this.option.pointR[0]),
            Math.round(this.option.pointR[1])
        ];
        //console.log("horda",this.option.pointR);
        this.option.markerR[0] = new Mt3()
                .trans(0,-this.option.r)
               // .rotX(Math.PI - (angArc+Math.PI)/2)
                .scale(1,this.option.aspect)
                .rotX(angGeneral)
                //.scale(1,this.option.aspect)
                .trans(this.option.pointR[0],this.option.pointR[1])
                .elements.slice(6,8);
        this.option.markerR[1] = new Mt3()
                .trans(0,-this.option.r)
                .rotX(angArc/4)
                .scale(1,this.option.aspect)
                .rotX(angGeneral)
                
                .trans(this.option.pointR[0],this.option.pointR[1])
                .elements.slice(6,8);   
         this.option.markerR[2] = new Mt3()
                .trans(0,-this.option.r)
                .rotX(-angArc/4)
                .scale(1,this.option.aspect)
                .rotX(angGeneral)
               // .scale(this.option.aspect,1)
                .trans(this.option.pointR[0],this.option.pointR[1])
                .elements.slice(6,8);         
             
        for (var i=0;i<2;i++) {
            mtCord[i] = new Mt3()
                .trans(this.cord[i][0],this.cord[i][1])
                .multiply(matrixCorect)
                .elements.slice(6,8);
            //this.line.setAttribute("x"+(i+1),mtCord[i][0]);this.line.setAttribute("y"+(i+1),mtCord[i][1]);
        };
        var l = lenPoint(mtCord)
        var arc = createArcHord({
            hord:mtCord,
           // arc:Math.PI,
            r:new Mt3().trans(this.option.r,0).multiply(matrixCorect).elements[6] - new Mt3().multiply(matrixCorect).elements[6],
            step:Math.sqrt(l)/10,
            aspect:this.option.aspect || 1
            //
        });
        this.option.arArc = createArcHord({
            hord:this.cord,
            r:this.option.r,
            step:Math.sqrt(lenPoint(this.cord))/10,
            aspect:this.option.aspect || 1
        });
        //console.log(this.option.arArc);
        var dArc = `M${arc[0]+""} L`;
        for (var i=1;i<arc.length;i++) dArc+=`${arc[i]+""} `;
        var d = `M${mtCord[0]+""} L${mtCord[1]+""}`;
        this.arLineDesignation = [];
        for (var i=0;i<arc.length-1;i++) this.arLineDesignation.push([arc[i],arc[i+1]]);
        //console.log(this.arLineDesignation);
        this.elemements.child_name['lineGeneral'].html.getElementsByTagName("path")[0].setAttribute("d",dArc);
        this.elemements.child_name['lineDown'].html.getElementsByTagName("path")[0].setAttribute("d",dArc);

        var k = read_cord(this.elemements.child_name['circleDown0'].html);
        write_matrix(this.elemements.child_name['circleDown0'].html,new Mt3()
            .trans(-(k.x+k.width/2),-(k.y+k.height/2))
            .trans(mtCord[0][0],mtCord[0][1])
        );

        var k = read_cord(this.elemements.child_name['circleDown1'].html);
        write_matrix(this.elemements.child_name['circleDown1'].html,new Mt3()
            .trans(-(k.x+k.width/2),-(k.y+k.height/2))
            .trans(mtCord[1][0],mtCord[1][1])
        );
        
        if ( this.statuslLigth) {
            this.elemements.child_name["light"].html.style.display = "block";
            
            let pathFill = this.elemements.child_name["light"].child_name['fill'].children[0];
            let l = lenPoint(this.cord);
           

            /* let arAng = [Math.PI/2,Math.PI/2];
            for ( let i=0;i<this.edgeLink.length;++i) if (this.edgeLink[i].edge.cord) {
                //console.log(i,this.edgeLink[i]);
                arAng[i] = angLine(
                    [this.cord[0],this.cord[1]],
                    [this.edgeLink[i].edge.cord[this.edgeLink[i].indexPoint],this.edgeLink[i].edge.cord[this.edgeLink[i].indexPoint^1]]
                );
               // arAng[i]-=this.option.calculAng
                //(i^1)*
                
                
            };

            

            let height1 = this.option.light.paddingCenter-this.option.light.width/2;
            let height2 = this.option.light.paddingCenter+this.option.light.width/2;
            let arCordPath = [
                [(-l/2+height1),0],
                [(l/2-height1),0],
                [l/2-height2,0],
                [-l/2+height2,0]
            ]; */
          //  console.log(arCordPath);
           // return;
            let height1 = this.option.light.paddingCenter-this.option.light.width/2;
            let height2 = this.option.light.paddingCenter+this.option.light.width/2;
            let arCordPath = [];
            //this.option.calculAng
            let arR = [
                this.option.r-(this.option.light.paddingCenter-this.option.light.width/2),
                this.option.r-(this.option.light.paddingCenter+this.option.light.width/2),
                this.option.r-(this.option.light.paddingCenter),
            ]
            for (let i=0;i<3;i++) for (let j=0;j<2;j++) arCordPath.push(
                new Mt3()
                .trans(0,-arR[i])
                .rotX(this.option.calculAng/2*(-1+j*2))
                //.trans(0,this.option.r)
                .elements.slice(6,8)
            );


            let arCordPath2 = [];
            let l2 = lenPoint(arCordPath.slice(0,2))
            //+(this.option.light.paddingCenter-this.option.light.width/2)
           // console.log((-this.option.light.paddingCenter-this.option.light.width/2*(-1+0*2))-this.option.r);
            var arc = createArcHord({
                hord:arCordPath.slice(0,2),
                r:arR[0],
                step:Math.sqrt(l2)/10,
                aspect:this.option.aspect || 1
            });
          
            arCordPath2 = arc;

            var arc = createArcHord({
                hord:[arCordPath[2],arCordPath[3]],
                r:arR[1],
                step:Math.sqrt(l2)/10,
                aspect:this.option.aspect || 1
                //
            });
            for (let i=arc.length-1;i>=0;--i) arCordPath2.push(arc[i]);

            let mt = new Mt3()
                    //.trans(0,this.option.light.paddingCenter)
                    .rotX(Math.atan2(this.cord[1][1] - this.cord[0][1],this.cord[1][0] - this.cord[0][0]))
                    .transAr(this.option.pointR)
                   // .trans(this.cord[0][0] + (this.cord[1][0] - this.cord[0][0])/2,this.cord[0][1] + (this.cord[1][1] - this.cord[0][1])/2)
                    ;

            for ( let i=0; i<arCordPath2.length;++i) arCordPath2[i] = new Mt3()
                                                                    .transAr(arCordPath2[i])
                                                                    .multiply(mt)
                                                                    .multiply(matrixCorect)
                                                                    .elements.slice(6,8);


            let d = `M${arCordPath2[0]+""} L`;
            for (let i=1;i<arCordPath2.length;++i) d+=`${arCordPath2[i][0]+""},${arCordPath2[i][1]+""} `;
            d+="z";
          //  console.log(d)    ;
            pathFill.html.setAttribute("d",d);
            pathFill.html.setAttribute("opacity",1);
          //  pathFill.html.setAttribute("stroke","#000");
           // pathFill.html.setAttribute("stroke-width","5");
           let arL = createArcHord({
                hord:[
                    [arCordPath[0][0] + (arCordPath[2][0]-arCordPath[0][0])/2,arCordPath[0][1] + (arCordPath[2][1]-arCordPath[0][1])/2],
                    [arCordPath[1][0] + (arCordPath[3][0]-arCordPath[1][0])/2,arCordPath[1][1] + (arCordPath[3][1]-arCordPath[1][1])/2]
                ],
                r:arR[2],
                step:Math.sqrt(l2)/10,
                aspect:this.option.aspect || 1
                //
            });
            for ( let i=0; i<arL.length;++i) arL[i] = new Mt3()
                                                                    .transAr(arL[i])
                                                                    .multiply(mt)
                                                                    .multiply(matrixCorect)
                                                                    .elements.slice(6,8);

            this.arLineLigth = arL;
            this.createTypeLight();
           
        } else this.elemements.child_name["light"].html.style.display = "none";
        //sendDataMaker();
        //createArelGradient();

    };
    type = "CircEdge"
    constructor(opt){
        super(opt);
        opt.aspect = opt.aspect || 1
        for (var k of ['vec','r','ang','aspect']) this['set'+k](opt[k]);
        this.setCord(opt.cord);
        this.findLink();
        
        //console.log(this);
    }
};
let resMar;
let stopCrossing
function checkedСrossing(arIndexEdge){
       // console.log(arIndexEdge);
    let opt = optionEdge();

    function checkedEdge(index){
        let edge = opt[index].edge;
        let boolCross = {
            value:false,
            edgeCross:0,
            index:[]
        };
        for (let i = 0;i<opt.length;i++) if (i!=index) for (let l=0;l<opt[i].edge.option.arArc.length-1;l++) for (let e=0;e<edge.option.arArc.length-1;e++) {
            let l1=[opt[i].edge.option.arArc[l],opt[i].edge.option.arArc[l+1]];
            let l2 = [edge.option.arArc[e],edge.option.arArc[e+1]];
           // console.log(l1,l2)
            if (lineSegmentsIntersectBool(l1,l2) && !boolCross.value) {
                boolCross = {
                    value:true,
                    edgeCross:i,
                    index:[e,l]
                    //point:
                };
                boolCross['point'] = lineSegmentsIntersect(l1,l2);
            }
        }
 //console.log(index,boolCross);
        if (boolCross.value) {
           
            let lenGener = 0;
            for (let i=0;i<edge.option.arArc.length-1;i++) lenGener+=lenPoint([edge.option.arArc[i],edge.option.arArc[i+1]]);
            let lenCross = 0;
            for (let i=0;i<boolCross.index[0];i++) lenCross+=lenPoint([edge.option.arArc[i],edge.option.arArc[i+1]]);
            lenCross+=lenPoint([edge.option.arArc[boolCross.index[0]],boolCross['point']]);
            let indexP = 0;
            if (lenGener/2<lenCross) indexP=1;
            edge.cord[indexP] = boolCross['point'];
            edge.move();
            edge.edgeLink[indexP].edge.cord[edge.edgeLink[indexP].indexPoint] = boolCross['point'];
            edge.edgeLink[indexP].edge.move();
            checkedFixAng();
            //console.log(edge);
        };

    };
    for (let k of arIndexEdge) checkedEdge(k);
    clearTimeout(stopCrossing);
    let arInd = [];
    //console.log(arIndexEdge,opt);
    for (let e of opt) arInd.push(e.option.indexAr);
    for (let e=0;e<arInd.length;e++) for (let i of arIndexEdge) if (arInd[e]==i) {arInd.splice(e,1);e--};
    function cicl(ii){
        
        stopCrossing = setTimeout(()=>{
            
            if (ii<arInd.length){
                checkedEdge(arInd[ii]);
                
                cicl(ii+1);
                
            }
        },5)
    };
    cicl(0);
    

};
function setCurentAngLine(){
    let ed = optionEdge();
    for (let e of ed) {
        let cr = e.edge.cord;
        e.edge.option['curentAngLine'] = {
            ang:[],
            cr:cr.slice()
        };
        
        for (let i=0;i<2;i++) e.edge.option['curentAngLine'].ang[i] = Math.atan2(cr[i^1][1]-cr[i][1],cr[i^1][0]-cr[i][0]);
    };
   // console.log(ed);
}
function checkedFixAng(){
    /* cLineSize();
    return; */
    let ed = optionEdge();
    /* for (let e of ed) if (!e.edge.option['curentAngLine']) {
        e.edge.option['curentAngLine'] = [];
        let cr = e.edge.cord;
        for (let i=0;i<2;i++) e.edge.option['curentAngLine'][i] = Math.atan2(cr[i^1][1]-cr[i][1],cr[i^1][0]-cr[i][0]);
    }; */
    let point = {};
    for (let e of ed) for (let i=0;i<2;i++) point[e.edge.cord[i]+""] = {
        cr:e.edge.cord[i],
        indexPointEdge:i,
        edge:e.edge,
        fixed:e.edge.option.fixedAng[i]
    };
    let pointAr = [];
    for (let e in point) pointAr.push(point[e]);
    
    let crCurentEl =[];
    if (elcurentSelect) {
        if (elcurentSelect.type == "point") {crCurentEl.push(elcurentSelect.el['cord'][elcurentSelect.index])} else crCurentEl = elcurentSelect.el['cord'];
    }
    for (let i=0;i<crCurentEl.length;i++) pointAr.sort((a,b)=>{
        if (a.cr+""==crCurentEl[i]+"") return -1
    })
    pointAr.sort((a,b)=> {if (a.fixed.fix && !b.fixed.fix) return -1});
    let stopSetCurentAng;
    function lineS (l1,l2) {
        //console.log('22',l1,l2);
        //x1, y1, x2, y2, x3, y3, x4, y4
        var x1= l1[0][0];var x2= l1[1][0];var y1= l1[0][1];var y2= l1[1][1];
        var x3= l2[0][0];var x4= l2[1][0];var y3= l2[0][1];var y4= l2[1][1];    
        var a_dx = x2 - x1;
        var a_dy = y2 - y1;
        var b_dx = x4 - x3;
        var b_dy = y4 - y3;
         var s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
        var t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
        /* if (!s) s=0;
        if (!t) t=0; */
        return ( s && t) ? [x1 + t * a_dx, y1 + t * a_dy] : false;
    };
    function alignAng(e){
       // let indexRot = e.indexPointEdge;
        //for (let i=0;i<crCurentEl.length;i++) if ()
      //  console.log(e,)
        for (let ed of [
            e,
            {
                edge:e.edge.edgeLink[e.indexPointEdge].edge,
                cr:e.edge.edgeLink[e.indexPointEdge].edge.cord,
                indexPointEdge:e.edge.edgeLink[e.indexPointEdge].indexPoint

            }

        ]) {
            
            
            let mt = new Mt3()
                    .trans(1,0)
                    .rotX(ed.edge.option.curentAngLine.ang[ed.indexPointEdge])
                    .transAr(ed.edge.cord[ed.indexPointEdge].slice())

            let cr = new Mt3()
                   // .trans(ed.edge.cord[ed.indexPointEdge^1][0],ed.edge.cord[ed.indexPointEdge^1][1])
                    .multiply(mt)
                    .elements.slice(6,8)

            let rr = lineS([ed.edge.cord[ed.indexPointEdge],cr],ed.edge.edgeLink[ed.indexPointEdge^1].edge.cord);
            if (rr) {
                ed.edge.cord[ed.indexPointEdge^1] = rr;
                ed.edge.move();
                ed.edge.edgeLink[ed.indexPointEdge^1].edge.cord[ed.edge.edgeLink[ed.indexPointEdge^1].indexPoint] = rr;
                ed.edge.edgeLink[ed.indexPointEdge^1].edge.move();
            }
        };
        
    };
    function alignAngCurent(e){
        // let indexRot = e.indexPointEdge;
         //for (let i=0;i<crCurentEl.length;i++) if ()
       //  console.log(e,)

       /*  [
             e,
             {
                 edge:e.edge.edgeLink[e.indexPointEdge].edge,
                 cr:e.edge.edgeLink[e.indexPointEdge].edge.cord,
                 indexPointEdge:e.edge.edgeLink[e.indexPointEdge].indexPoint
 
             }
 
         ]
        */
         let rr = [];
         if (e.edge.option.fixedAng[e.indexPointEdge^1].fix) rr.push(e);
         if (e.edge.edgeLink[e.indexPointEdge].edge.option.fixedAng[e.edge.edgeLink[e.indexPointEdge].indexPoint^1].fix) rr.push(
            {
                 edge:e.edge.edgeLink[e.indexPointEdge].edge,
                 cr:e.edge.edgeLink[e.indexPointEdge].edge.cord,
                 indexPointEdge:e.edge.edgeLink[e.indexPointEdge].indexPoint
 
             }
         )
       // console.log(44,e)
         for (let ed of rr) {
             
             
             let mt = new Mt3()
                     .trans(1,0)
                     .rotX(ed.edge.option.curentAngLine.ang[ed.indexPointEdge])
                     .transAr(ed.edge.cord[ed.indexPointEdge].slice())
 
             let cr = new Mt3()
                    // .trans(ed.edge.cord[ed.indexPointEdge^1][0],ed.edge.cord[ed.indexPointEdge^1][1])
                     .multiply(mt)
                     .elements.slice(6,8)
 
             let rr = lineS([ed.edge.cord[ed.indexPointEdge],cr],ed.edge.edgeLink[ed.indexPointEdge^1].edge.cord);
             if (rr) {
                 ed.edge.cord[ed.indexPointEdge^1] = rr;
                 ed.edge.move();
                 ed.edge.edgeLink[ed.indexPointEdge^1].edge.cord[ed.edge.edgeLink[ed.indexPointEdge^1].indexPoint] = rr;
                 ed.edge.edgeLink[ed.indexPointEdge^1].edge.move();
             }
         };
         
     };
    for (let j=0;j<crCurentEl.length;j++) for (let i=0;i<pointAr.length;i++) if (pointAr[i].cr+""==crCurentEl[j]+"" && !pointAr[i].fixed.fix) 
    alignAngCurent(pointAr[i])
    for (let i=0;i<pointAr.length;i++) if (pointAr[i].fixed.fix) alignAng(pointAr[i]);
    //


    clearTimeout(stopSetCurentAng);



    /*  */
    
    //console.log(33,pointAr);
    cLineSize();
}

function sendDataMaker(){
    return;
    clearTimeout(resMar);
    resMar = setTimeout(()=>{
        let o = optionEdge();
        let d = [];
        for (let k of o)d.push(k.data);
        buildSvgEdge(d);
       // console.log("sendDataMaker",d);
    })
    
}
function setModeResolutionMove(value) {
    modeResolutionMove = value;
    closeBlockSelect();
    let status = value ? "block" : "none";
    let listElem = ["circleDown0","circleDown1","lineDown"];
    let edge=optionEdge();
    for (let k of edge) for (let l of listElem) k.edge.elemements.child_name[l].html.style.display = status;
};
function deleteEdge(ed){
    
    let nPoint = [
        ed.cord[0][0]+(ed.cord[1][0]-ed.cord[0][0])/2,
        ed.cord[0][1]+(ed.cord[1][1]-ed.cord[0][1])/2
    ];
    let p = [];
    for (let i=0;i<2;i++) {
        ed.edgeLink[i].edge.cord[ed.edgeLink[i].indexPoint] = nPoint.slice();
        p.push(ed.edgeLink[i].edge);
    };
    ed.remove();

    for (let r of p) r.move();
    for (let r of p) r.findLink();
    checkedFixAng();

};




function getModeResolutionMove(){
    return modeResolutionMove;
};
export { 
    Edge,
    LineEdge, 
    CircEdge, 
    setModeResolutionMove,
    getModeResolutionMove,
    deleteEdge,
    checkedFixAng,
    setCurentAngLine
}