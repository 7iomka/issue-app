import { LayGroupHTML, lenPoint, angLine, createD } from "./class";

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
} from "./extra_panel";
import { billet, readOnload } from "./billet";
import { hole } from "./hole";
import { angFigure, curentFigure } from './analysis';
import { createSizeLine } from "./line_size";
import { Mt3, write_matrix, read_cord} from "./expan.js";
import { AssertsThisTypePredicate } from "node_modules/typescript/lib/typescript";

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

function createLayHTML(el,parent){
    
        var e = new LayGroupHTML({
            elementInsert:el,
            parent:parent,
            name:el.hasAttribute("onload") ? el.getAttribute("onload") : ""
        });
        var ch = e.html['childNodes'];
        var cl = [];
        for (var i=0;i<ch.length;i++) cl.push(ch[i].cloneNode(true));
        while (ch.length) ch[0].remove();
        for (var i=0;i<cl.length;i++) createLayHTML(cl[i],e);
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
        // console.log(this.statuslLigth);
    };
    setCord = function(cr){
        /* let pointModification = [];
        for ( let i = 0; i<cr.length; i++ ) if (cr[i]+""!=this.cord[i]+"") pointModification.push({
            index:i,
            value : cr[i].slice(),
            old : this.cord[i].slice(),
           // defLen : Math.abs(lenPoint(this.cord[i])-lenPoint(this.cord[i]))
        });
        //pointModification.sort((a,b)=>{return b.defLen-a.defLen});
        if (pointModification.length>0) if (pointModification.length>1) {

        } else {
            let pointPartner = [
                {
                    cr:this.cord[pointModification[0].index^1],
                },
                {
                    cr:this.edgeLink[pointModification[0].index].edge.cord[this.edgeLink[pointModification[0].index].indexPoint^1],
                } 
            ];    
            for ( let i=0;i<pointPartner.length && i<1;i++) {
                
                var angDef = angLine([pointModification[0].value,pointPartner[i].cr],[pointPartner[i].cr,pointModification[0].old]);
                var l = lenPoint([pointModification[0].value,pointPartner[i].cr])*Math.cos(angDef);
                let mt = 
                console.log(l,l,pointPartner[i].cr);
            };
           
            //console.log(pointPartner);

        } */
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
        //this.group = {};
        console.log(this.group,optionEdge());
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
            
            
            
            
           // console.log(crElType)
            // .
           /*  let l=0;
            for (let i=0;i<this.arLineLigth.length-1;++i) {
                l+=lenPoint([this.arLineLigth[i],this.arLineLigth[i+1]]);
            };
            console.log(this.arLineLigth.length,l,curentScale); */
           
        };
        
        /* let edge = optionEdge();
        if (this.indexAr == edge.length-1) {
            let arLineLight = [];
            let arTemp = [];
            for (let i=0;i<edge.length;++i) {
                if (arTemp.length && edge)
            };
            console.log("createType",this,edge);
        } */
    };
    setTypeLigth = function (nameType){
        this.option.light.type = nameType;
        var ed = optionEdge();
        for ( let e of ed) e.edge.createTypeLight();
    };
    constructor(option){    
        super(option);
        if (option.light) this.option.light = { ... option.light};
        let _this=this;
        this['elemements'] = createLayHTML(billet['chil']['edge'],option['parent'] || group.child_name['gropeEdge']);
        createLayHTML(billet['chil']['light'],this['elemements']);
        
        if (!option['parent']) {this['elemements'].child_name['lineDown'].setOption({
                down:{
                    fnDown:function(e){
                        //  console.log(this);
                        this.cordDown = {
                            cursor : e.cord,
                            curentCord : _this.cord.slice()
                        };
                        hole.cursorOff();
                        if (modeResolutionMove) _this.selectLine();
                    },
                    fnMove:function(e){
                        var def = [e.cord[0] - this.cordDown.cursor[0],e.cord[1] - this.cordDown.cursor[1]];
                        var ar = [];
                        for (var i=0;i<2;i++) {
                            ar[i] = [Math.round(this.cordDown.curentCord[i][0]+def[0]/curentScale),Math.round(this.cordDown.curentCord[i][1]+def[1]/curentScale)]
                        };
                        if (modeResolutionMove) _this.setCord(ar);
                        if ( curentFigure['res'] && curentFigure['res']['movePoint'] ) curentFigure['res']['movePoint']();
                        createSizeLine(()=>{});
                       // console.log(this.cordDown);
                    }
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
                                createSizeLine(()=>{});
                            // console.log(this.cordDown);
                            }
                        },
                        style:{
                            cursor:"move"
                        }
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
           /*  let height1 = this.option.light.paddingCenter-this.option.light.width/2;
            let height2 = this.option.light.paddingCenter+this.option.light.width/2;
            let arCordPath = [
                [-l/2+height1,0],
                [l/2-height1,0],
                [l/2-height2,0],
                [-l/2+height2,0]
            ]; */
            /* if (this.edgeLink[0].edge.type == "CircEdge") {
                arCordPath[0] = [-l/2,-this.option.light.width/2];
                arCordPath[3] = [-l/2,this.option.light.width/2]
            };
            if (this.edgeLink[1].edge.type == "CircEdge") {
                arCordPath[1] = [l/2,-this.option.light.width/2];
                arCordPath[2] = [l/2,this.option.light.width/2]
            }; */
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
            //pathFill.html.setAttribute("opacity",.3);
            this.arLineLigth = [
                [arCordPath[0][0] + (arCordPath[3][0]-arCordPath[0][0])/2,arCordPath[0][1] + (arCordPath[3][1]-arCordPath[0][1])/2],
                [arCordPath[1][0] + (arCordPath[2][0]-arCordPath[1][0])/2,arCordPath[1][1] + (arCordPath[2][1]-arCordPath[1][1])/2]
            ];
            this.createTypeLight();
           
        } else this.elemements.child_name["light"].html.style.display = "none";
        
        
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
           ()=>{ /* let height1 = this.option.light.paddingCenter-this.option.light.width/2;
            let height2 = this.option.light.paddingCenter+this.option.light.width/2;
           // console.log(Math.tan(arAng[0]),arAng[0]);
            let arCordPath = [
                [-l/2+height1*Math.tan(arAng[0]/2),-this.option.light.width/2],
                [l/2-height1*Math.tan(Math.PI/2-arAng[1]/2),-this.option.light.width/2],
                [l/2-height2*Math.tan(Math.PI/2-arAng[1]/2),this.option.light.width/2],
                [-l/2+height2*Math.tan(arAng[0]/2),this.option.light.width/2]
            ]; */
            /* let y1 = this.option.light.paddingCenter-this.option.light.width/2;
            let y2 = this.option.light.paddingCenter+this.option.light.width/2
            let arCordPath = [
                [-l/2+height1,y1*Math.tan((arAng[0]-this.option.calculAng/2)/2)],
                [l/2-height1,y1*Math.tan((arAng[1]-this.option.calculAng/2)/2)],
                [l/2-height2,y2*Math.tan((arAng[1]-this.option.calculAng/2)/2)],
                [-l/2+height2,y2*Math.tan((arAng[0]-this.option.calculAng/2)/2)]
            ]; */
            /* let height1 = this.option.light.paddingCenter-this.option.light.width/2;
            let height2 = this.option.light.paddingCenter+this.option.light.width/2;
           // console.log(Math.tan(arAng[0]),arAng[0]);
            let arCordPath = [
                [-l/2+height1*Math.tan(arAng[0]/2),-this.option.light.width/2],
                [l/2-height1*Math.tan(Math.PI/2-arAng[1]/2),-this.option.light.width/2],
                [l/2-height2*Math.tan(Math.PI/2-arAng[1]/2),this.option.light.width/2],
                [-l/2+height2*Math.tan(arAng[0]/2),this.option.light.width/2]
            ]; */}

            let arAng = [Math.PI/2,Math.PI/2];
            for ( let i=0;i<this.edgeLink.length;++i) if (this.edgeLink[i].edge.cord) {
                //console.log(i,this.edgeLink[i]);
                arAng[i] = angLine(
                    [this.cord[0],this.cord[1]],
                    [this.edgeLink[i].edge.cord[this.edgeLink[i].indexPoint],this.edgeLink[i].edge.cord[this.edgeLink[i].indexPoint^1]]
                );
               // arAng[i]-=this.option.calculAng
                //(i^1)*
                /* if (this.edgeLink[i].edge.type == "CircEdge") {
                    arAng[i]+=(i^1)*Math.PI/2;
                    //arAng[i]+=(2*i-1)*Math.PI/2;
                    //
                    //console.log(i,this.edgeLink[i].edge.option);
                } else arAng[i]/=2; */
                
            };

            console.log(arAng[0]+Math.PI/2,Math.tan(Math.PI/4*3));

            let height1 = this.option.light.paddingCenter-this.option.light.width/2;
            let height2 = this.option.light.paddingCenter+this.option.light.width/2;
            let arCordPath = [
                [(-l/2+height1/Math.cos(arAng[0])),0],
                [(l/2-height1/Math.cos(arAng[1]-Math.PI)),0],
                [l/2-height2/Math.cos(arAng[1]-Math.PI),0],
                [-l/2+height2/Math.cos(arAng[0]),0]
            ];
          //  console.log(arCordPath);
           // return;

            let mt = new Mt3()
                    //.trans(0,this.option.light.paddingCenter)
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

            let arCordPath2 = [];
            let l2 = lenPoint(arCordPath.slice(0,2))
            //+(this.option.light.paddingCenter-this.option.light.width/2)
            var arc = createArcHord({
                hord:arCordPath.slice(0,2),
            // arc:Math.PI,
                r:new Mt3().trans(this.option.r-(this.option.light.paddingCenter-this.option.light.width/2),0).multiply(matrixCorect).elements[6] - new Mt3().multiply(matrixCorect).elements[6],
                step:Math.sqrt(l2)/10,
                aspect:this.option.aspect || 1
                //
            });
            arCordPath2 = arc;
           // arCordPath2 = arCordPath.slice(0,2);
            let l3 = lenPoint(arCordPath.slice(2,4));
            //-(this.option.light.paddingCenter+this.option.light.width/2)
            var arc = createArcHord({
                hord:[arCordPath[3],arCordPath[2]],
            // arc:Math.PI,
                r:new Mt3().trans(this.option.r-(this.option.light.width/2+this.option.light.paddingCenter),0).multiply(matrixCorect).elements[6] - new Mt3().multiply(matrixCorect).elements[6],
                step:Math.sqrt(l2)/10,
                aspect:this.option.aspect || 1
                //
            });
            for (let i=arc.length-1;i>=0;--i) arCordPath2.push(arc[i]);
            //console.log(arc)
            let d = `M${arCordPath2[0]+""} L`;
            for (let i=1;i<arCordPath2.length;++i) d+=`${arCordPath2[i][0]+""},${arCordPath2[i][1]+""} `;
            d+="z";
            //console.log(d)    
            pathFill.html.setAttribute("d",d);
            pathFill.html.setAttribute("opacity",1);

            this.arLineLigth = createArcHord({
                hord:[
                    [arCordPath[0][0] + (arCordPath[3][0]-arCordPath[0][0])/2,arCordPath[0][1] + (arCordPath[3][1]-arCordPath[0][1])/2],
                    [arCordPath[1][0] + (arCordPath[2][0]-arCordPath[1][0])/2,arCordPath[1][1] + (arCordPath[2][1]-arCordPath[1][1])/2]
                ],
            // arc:Math.PI,
                r:new Mt3().trans(this.option.r-(this.option.light.paddingCenter),0).multiply(matrixCorect).elements[6] - new Mt3().multiply(matrixCorect).elements[6],
                step:Math.sqrt(l2)/10,
                aspect:this.option.aspect || 1
                //
            });
            this.createTypeLight();
           
        } else this.elemements.child_name["light"].html.style.display = "none";

        

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

function setModeResolutionMove(value) {
    modeResolutionMove = value;
};

export { 
    Edge,
    LineEdge, 
    CircEdge, 
    setModeResolutionMove
}