import { areal, matrixAreal, setMatrix,openProject,optionEdge } from "./areal";
import { closeBlockSelect } from "./extra_panel";
import { Mt3, write_matrix } from "./expan.js";
import { angFigure } from './analysis';
import { 
    createSizeLine, 
    cLineSize, 
    setOptionLineSize, 
    getOptionLineSize 
} from "./line_size";
import { modeMirrorLighting,getModeMirrorLighting,setModeMirrorLighting } from "./mirror_lighting";
import { LayGroupHTML } from "./class";
import { buildSvgEdge } from "./build_svg_dxf";
var makerjs = require('makerjs');
var pdf = require('html2pdf.bundle.min.js');
//var makerjs = require('browser.maker.js');
//console.log(makerjs);
var whSvg=[1000,800];
function saveProject(opt){
    
    var arEdge = areal.children[0].child_name['layerEdge'].children[0];
    closeBlockSelect();
    var curentMatrixAreal = new Mt3().multiply(matrixAreal);
    var ang = 0;
    if (opt.pdf) {
        whSvg=[785,1115];
        ang = -angFigure-Math.PI/2
    };
    areal['transformFigureMatrix'](new Mt3().rotX(ang))
    var curentPoin=[];
    for (var edg of arEdge.children) {
        //console.log(edg)
        for (var p of edg.edge.arLineDesignation) for (var i=0;i<2;i++) curentPoin.push(p[i]);
    };
    var mnMx = [curentPoin[0].slice(),curentPoin[0].slice()];
    function setScale(){
        mnMx = [curentPoin[0].slice(),curentPoin[0].slice()];
        for (var p of curentPoin) {
            mnMx[0][0] = Math.min(mnMx[0][0],p[0]);
            mnMx[0][1] = Math.min(mnMx[0][1],p[1]);
            mnMx[1][0] = Math.max(mnMx[1][0],p[0]);
            mnMx[1][1] = Math.max(mnMx[1][1],p[1]);
        }
        var sc = Math.min((whSvg[0])/(mnMx[1][0]-mnMx[0][0]),(whSvg[1])/(mnMx[1][1]-mnMx[0][1]));
        //var sc = 1;
        let matrixAreal1 = new Mt3()
            .multiply(matrixAreal)
            
            .trans(-matrixAreal.elements[6],-matrixAreal.elements[7])
            .trans(-mnMx[0][0]-(mnMx[1][0]-mnMx[0][0])/2,-mnMx[0][1]-(mnMx[1][1]-mnMx[0][1])/2)
            .scl(sc*.8);
        setMatrix(matrixAreal1);
       // console.log(mnMx,matrixAreal);
        //+(mnMx[1][1]-mnMx[0][1])/2
       // for (var e of group.child_name['gropeEdge'].children) e.edge.move();
    };
    setScale();

    createSizeLine(function(){
        curentPoin=[];
        for (var edg of arEdge.children) {
            for (var p of edg.edge.arLineDesignation) for (var i=0;i<2;i++) curentPoin.push(p[i]);
        };
        for (var l of areal.children[0].child_name['lineSize'].children) if (l.arLineDesignation) for (var arD of l.arLineDesignation) for (var i=0;i<2;i++) curentPoin.push(arD[i]);
        setScale();
        
        createSizeLine(function(){
            setScale();
           // setScale();
            createSizeLine(()=>{
                save(opt);
                areal['transformFigureMatrix'](new Mt3().rotX(-ang));
                setMatrix(curentMatrixAreal); 
            });
        });
    });
    function save(opt){
        function createSv(){
            var sv = document.createElementNS("http://www.w3.org/2000/svg","svg");
            sv.setAttribute("width",whSvg[0]+"");
            sv.setAttribute("height",whSvg[1]+"");
            sv.setAttribute("viewBox",`0 0 ${whSvg[0]} ${whSvg[1]}`);
            sv.setAttribute("enable-background",`new 0 0 ${whSvg[0]} ${whSvg[1]}`);
            sv.setAttribute("xmlns","http://www.w3.org/2000/svg");
            //viewBox="0 0 560 288" enable-background="new 0 0 560 288" xml:space="preserve"
            var el = [];
            el.push(areal.children[0].child_name['layerEdge'].html.cloneNode(true));
            if (opt.sizeLine) el.push(areal.children[0].child_name['lineSize'].html.cloneNode(true));
            
            for (var e of el) {
                write_matrix(e,new Mt3().trans(whSvg[0]/2,whSvg[1]/2));
            // write_matrix(e,new Mt3()); 
                sv.appendChild(e);
            }
        
            var saveData = {
                edge:[]
            };
            for (var e of areal.children[0].child_name['layerEdge'].children[0].children) {
                //console.log(e);
                let group = {
                    option:e.edge.group.option,
                    arIndex:[]
                }
                //for (let r of e.edge.group.ar) group.arIndex.push(r.indexAr);
                for (let i = 0; i < e.edge.group.ar.length; i++) group.arIndex.push(e.edge.group.ar[i].indexAr);
                saveData.edge.push(
                    {
                        type:e.edge.type || "LineEdge",
                        option:{
                            cord:e.edge.cord,
                            r:e.edge.option.r,
                            vec:e.edge.option.vec,
                            aspect:e.edge.option.aspect,
                            group,
                            light:e.edge.option.light
                        }
                    }
                )
            //  console.log(e.edge);
            };
        // console.log(saveData);
            var d = document.createElementNS("http://www.w3.org/2000/svg","def");
            var t = document.createElementNS("http://www.w3.org/2000/svg","text");
            t.innerHTML = JSON.stringify(saveData);
            t.id = "dataSave";
            d.appendChild(t);
            sv.appendChild(d);
            return sv
        }
        
       // console.log(saveData);
        //console.log("curentP",areal.children[0],);
        function switchStatusLight(){
            modeMirrorLighting((status)=>{if (status) switchStatusLight()});
        };
        switchStatusLight();
        function makeTextFile(text) {
            var data = new Blob([text], {type: 'text/plain'});
            var textFile = window.URL.createObjectURL(data);
            return textFile;
        };
        if (!opt.pdf) {
            
            var link = document.createElement("a");
            link.href = makeTextFile(createSv().outerHTML);
            link.setAttribute("download","project.svg");
            document.body.appendChild(link);
            var onload=link.click();
            link.remove();
        } else {
            var dv = document.createElement('div');
            /* var hd = document.createElement("div");
          //  hd.style.padding = "80px";
            hd.innerHTML = "Тестовый PDF";
            dv.appendChild(hd);
            dv.appendChild(sv);
           // dv.style.position = "absolute"; */
            let screen1 = document.createElement("div");
            let stScreen ={
                width:"785px",
                height:"1115.5px",
                border:"1px #000 solid",
                margin:"3px"
            };
            for (let k in stScreen) screen1.style[k] = stScreen[k];
            dv.appendChild(screen1);
            screen1.appendChild(createSv().cloneNode(true));

            let screen2 = document.createElement("div");
            for (let k in stScreen) screen2.style[k] = stScreen[k];
            dv.appendChild(screen2);
           
            modeMirrorLighting((status)=>{});
            createSizeLine(()=>{
                screen1.appendChild(createSv().cloneNode(true));
                pdf().from(dv.cloneNode(true)).save();
                let dvGenr = document.createElement("div");
                let st ={
                    width:"600px",
                    height:"800px",
                    background:"#fff",
                    overflow:"scroll",
                    position:"absolute",
                    left:"0px",
                    top:"0px"
                };
                for (let k in st) dvGenr.style[k] = st[k];
                dvGenr.appendChild(dv.cloneNode(true));
               // document.body.appendChild(dvGenr);
            })
             
        }
        
    }
    /* setScale();
            createSizeLine(function(){
               console.log("curentP",areal.children[0]);
            }); */

    
   // console.log("curentP",areal.children[0]);

    

};

let dataSelect = [
    {
        name:"format",
        text:"Формат сохранения",
        arValue:[
            "pdf",
            "svg",
            "dxf"
        ],
        value:"svg"
    },
    {
        name:"arowBasic",
        text:"Размерные стрелки ",
        value:false
    },
    {
        name:"arowExtract",
        text:"Размерные стрелки дополнительные",
        value:false
    },
    {
        name:"autoRotate",
        text:"Поворачивать фигуру автоматически по динной стороне",
        value:true
    },
    {
        name:"mirrorLighting",
        text:"Включить подсветку зеркал",
        value:true
    },
];
let vDat = 3;
let d = localStorage.getItem('dataSave'+vDat);
for (let i=0;i<vDat;++i) localStorage.removeItem('dataSave'+i);
if (d!=null) dataSelect = JSON.parse(d);

//console.log();
function menuOptionSave() {
    let wind = new LayGroupHTML({
        parent:areal.parent,
        resize:function(){
                    this.setPosition({
                        left:0,
                        top:0,
                        width:this.parent.current_position.width,
                        height:this.parent.current_position.height
                    })
                },
        childrenElem:[
            new LayGroupHTML({
                name:"background",
                style:{
                    background:"hsla(120,100%,0%,0.8)",
                    opacity:1
                },
                resize:function(){
                    this.setPosition({
                        left:0,
                        top:0,
                        width:this.parent.current_position.width,
                        height:this.parent.current_position.height
                    })
                },
                click:function(){
                    this.ob_strukt.parent.remove();
                }
            }),
            new LayGroupHTML({
                style:{
                    background:"#fff",
                   
                },
                name:"work_wind",
                resize:function(){
                    let wh = this.parent.current_position;
                    this.setPosition({
                        left:wh.width*.1,
                        top:wh.height*.1,
                        width:wh.width*.8,
                        height:wh.height*.8

                    })
                },
                childrenElem:[
                    new LayGroupHTML({
                        name:"arealButton",
                        style:{
                           // border:"1px #000 solid",
                            "text-align":"center",
                            //padding:"20px"
                        },
                        resize:function(){
                            this.setPosition({
                                left:30,
                                top:this.parent.current_position.height-110,
                                width:this.parent.current_position.width-80,
                                height:70
                            })
                        },
                        childrenElem:[
                            new LayGroupHTML({
                                tag:"button",
                                style:{
                                    position:"",
                                    width:"200px",
                                    cursor:"pointer",
                                    margin:"20px"
                                },
                                innerHTML:"Открыть",
                                click:()=>{closeWind(),openFile()}
                            }),
                            new LayGroupHTML({
                                tag:"button",
                                style:{
                                    position:"",
                                    width:"200px",
                                    cursor:"pointer",
                                    margin:"20px"
                                },
                                innerHTML:"Сохранить",
                                click:()=>{closeWind();saveFile(dataSelect)}
                            })
                        ]
                    }),
                    new LayGroupHTML({
                        name:"arealSelect",
                        style:{
                            border:"1px solid #000"
                        },
                        resize:function(){
                            
                            this.setPosition({
                                left:30,
                                top:20,
                                width:this.parent.current_position.width-80,
                                height:this.childLast.current_position.top-50
                            })
                        }
                    })
                ]
            }),
           
        ]
    });

    let arealSelect = wind.child_name['work_wind'].child_name['arealSelect'];
    for (var sel of dataSelect) {((sel)=>{
        let punkt = new LayGroupHTML({
            style:{
                position:"",
                padding:"5px"
            },
            name:sel.name,
            parent:wind.child_name['work_wind'].child_name['arealSelect'],
            childrenElem:[
                new LayGroupHTML({
                    style:{
                        position:"",
                        display:"inline-block",
                        width:"100px"
                    },
                    name:"box_input",
                    
                }),
                new LayGroupHTML({
                    style:{
                        position:"",
                        display:"inline-block"
                    },
                    innerHTML:sel.text
                })
            ]
        });
        if (!sel.arValue) {
            let e = new LayGroupHTML({
                            tag:"input",
                            style:{
                                position:"",
                            },
                            attribute:{type:"checkbox"},
                            parent:punkt.child_name['box_input'],
                            input:function(){
                                sel.value = this.checked;
                                saveCookie();
                               // console.log(dataSelect)
                            }
                        });
                        //checked
            e.html['checked'] = sel.value;
            e.html['sel'] = sel;
        } else {
            for (let k of sel.arValue) {
                let e = new LayGroupHTML({
                        style:{
                            position:""
                        },
                        parent:punkt.child_name['box_input'],
                        childrenElem:[
                            new LayGroupHTML({
                                    tag:"input",
                                    style:{
                                        position:"",
                                    },
                                    attribute:{type:"radio"},
                                    name:"input",
                                }),
                            new LayGroupHTML({
                                tag:"span",
                                style:{
                                        position:"",
                                },
                                innerHTML:k
                            })
                        ]
                    });
                let inp = e.child_name['input'];
                inp.html['checked'] = sel.value == k;
                inp.html.sel = sel;
                inp.html.addEventListener("input",function(){
                    //this.checked = false

                    this.sel.value = this.ob_strukt.parent.children[1].html.innerHTML;
                    for (var t of this.ob_strukt.parN(2).children) {
                        //console.log(t.children[1].html.innerHTML);
                        t.child_name['input'].html['checked'] = this.sel.value == t.children[1].html.innerHTML;
                    };
                    saveCookie();
                    //console.log("checked",this.ob_strukt.parN(2),this.sel)
                })
                //console.log(sel.value == k);
            }
           

        }})(sel)
        //console.log(punkt.child_name['box_input']);
    }
    
    wind.resize();
    function closeWind(){
        wind.remove()
    };
    //console.log("",areal);
};


function openFile(){
    openProject();
};

function saveDXF(){
   // console.log(44,areal.children[0].child_name['layerEdge'].child_name['gropeEdge']);
    /* let points = [
      ];
    for (let e of areal.children[0].child_name['layerEdge'].child_name['gropeEdge'].children) {
        let ar = e.edge.option.arArc;
       // console.log(ar);
        points = points.concat(ar);
    };
    //for (let p of points) p= [p[0],-p[1]];
    for (let i=0;i<points.length;i++) points[i] = [points[i][0],points[i][1]*-1];
    var house = new makerjs.models.ConnectTheDots(true, points);
    let model = {models:{1:house}}

    let s = makerjs.exporter.toDXF(model); */

    let o = optionEdge();
        let d = [];
        for (let k of o)d.push(k.data);
    
    let s = buildSvgEdge(d);

    function makeTextFile(text) {
        var data = new Blob([text], {type: 'text/plain'});
        var textFile = window.URL.createObjectURL(data);
        return textFile;
    };
    var link = document.createElement("a");
    link.href = makeTextFile(s);
    link.setAttribute("download","project.dxf");
    document.body.appendChild(link);
    var onload=link.click();
    link.remove();
};
//setTimeout(()=>{saveDXF()},1000);
function saveFile(dataSave){
    
    let statusMirrorLighting = getModeMirrorLighting();
    
    var arEdge = areal.children[0].child_name['layerEdge'].children[0];
    closeBlockSelect();
    var curentMatrixAreal = new Mt3().multiply(matrixAreal);
    var ang = 0;
    let beginOptionSize = getOptionLineSize();
    let opt = {};
    for (let k of dataSave) opt[k.name] = k;
    if (opt['format'].value=="dxf") {
        saveDXF();
        return;
    }
    setModeMirrorLighting(opt['mirrorLighting'].value);
    let whSvg=[1000,700];
    if (opt['format'].value == "pdf") {
        whSvg=[785,1115];
        
    };
    if (opt!['autoRotate'].value) {
        ang = -angFigure-Math.PI/2;
        areal['transformFigureMatrix'](new Mt3().rotX(ang))
    }
    //console.log(opt);
    if (opt!['arowExtract']) setOptionLineSize({"extraSize":opt!['arowExtract'].value});
    if (opt!['arowBasic']) setOptionLineSize({"basicSize":opt!['arowBasic'].value});
    var curentPoin=[];
    for (var edg of arEdge.children) {
        for (var p of edg.edge.arLineDesignation) for (var i=0;i<2;i++) curentPoin.push(p[i]);
    };
   // var mnMx = [curentPoin[0].slice(),curentPoin[0].slice()];
    function mn_mx(ar){
        let mnMx = [ar[0].slice(),ar[0].slice()];
        for (var p of ar) {
            mnMx[0][0] = Math.min(mnMx[0][0],p[0]);
            mnMx[0][1] = Math.min(mnMx[0][1],p[1]);
            mnMx[1][0] = Math.max(mnMx[1][0],p[0]);
            mnMx[1][1] = Math.max(mnMx[1][1],p[1]);
        };
        return mnMx;
    }
    function setScale(){
        let mnMx = mn_mx(curentPoin);
        var sc = Math.min((whSvg[0])/(mnMx[1][0]-mnMx[0][0]),(whSvg[1])/(mnMx[1][1]-mnMx[0][1]));
        //var sc = 1;
        let matrixAreal1 = new Mt3()
            .multiply(matrixAreal)
            
            .trans(-matrixAreal.elements[6],-matrixAreal.elements[7])
            .trans(-mnMx[0][0]-(mnMx[1][0]-mnMx[0][0])/2,-mnMx[0][1]-(mnMx[1][1]-mnMx[0][1])/2)
            .scl(sc);
        setMatrix(matrixAreal1);
       
    };
    setScale();

    cLineSize().then((r)=>{
        //console.log(r);
        if (r['status']) {
            if (opt['format'].value == "pdf") {
                savePdf().then((r)=>{
                    if (r['status']) setOptionBegin();
                // console.log("r",r)
                })
            } 
            else saveSvg().then((r)=>{
                if (r['status']) setOptionBegin();
               // console.log("r",r)
            })
        };
    });

    function setOptionBegin(){
        setOptionLineSize(beginOptionSize);
        areal['transformFigureMatrix'](new Mt3().rotX(-ang));
        setMatrix(curentMatrixAreal);
        setModeMirrorLighting(statusMirrorLighting);
        cLineSize();
    }

    function createSv(){
            curentPoin=[];
            for (var edg of arEdge.children) {
                for (var p of edg.edge.arLineDesignation) for (var i=0;i<2;i++) curentPoin.push(p[i]);
            };
            for (var l of areal.children[0].child_name['lineSize'].children) if (l.arLineDesignation) for (var arD of l.arLineDesignation) for (var i=0;i<2;i++) curentPoin.push(arD[i]);
            /* for (var l = 0;l<areal.children[0].child_name['lineSize'].children.length;l++) 
                        if (areal.children[0].child_name['lineSize'].children[l].arLineDesignation) {
                            let arD = areal.children[0].child_name['lineSize'].children[l].arLineDesignation
                            console.log(arD);
                        };
            console.log(areal.children[0].child_name['lineSize']); */
            let mx = mn_mx(curentPoin);
            let sc = Math.min((whSvg[0]-2)/(mx[1][0]-mx[0][0]),(whSvg[1]-2)/(mx[1][1]-mx[0][1]));
            /*let def = [0,0];
             if ((mx[1][1]-mx[0][1])>whSvg[1]) def[1] = -(whSvg[1]-(mx[1][1]-mx[0][1]));
            if ((mx[1][0]-mx[0][0])>whSvg[0]) def[0] = -(whSvg[0]-(mx[1][0]-mx[0][0])); */
            let def = [
                -mx[0][0]-(mx[1][0]-mx[0][0])/2,
                -mx[0][1]-(mx[1][1]-mx[0][1])/2
                
            ];

            let corectMatrix = new Mt3()
                .trans(def[0],def[1])
                .scl(sc)
                

            var sv = document.createElementNS("http://www.w3.org/2000/svg","svg");
            sv.setAttribute("width",whSvg[0]+"");
            sv.setAttribute("height",whSvg[1]+"");
            sv.setAttribute("viewBox",`0 0 ${whSvg[0]} ${whSvg[1]}`);
            sv.setAttribute("enable-background",`new 0 0 ${whSvg[0]} ${whSvg[1]}`);
            sv.setAttribute("xmlns","http://www.w3.org/2000/svg");
            //viewBox="0 0 560 288" enable-background="new 0 0 560 288" xml:space="preserve"
            var el = [];
            el.push(areal.children[0].child_name['layerEdge'].html.cloneNode(true));
            //if (opt.sizeLine) 
            el.push(areal.children[0].child_name['lineSize'].html.cloneNode(true));
            //
            for (var e of el) {
                write_matrix(e,new Mt3().multiply(corectMatrix).trans(whSvg[0]/2,whSvg[1]/2));
            // write_matrix(e,new Mt3()); 
                sv.appendChild(e);
            }
        
            var saveData = {
                edge:[]
            };
            for (var e of areal.children[0].child_name['layerEdge'].children[0].children) {
                //console.log(e);
                let group = {
                    option:e.edge.group.option,
                    arIndex:[]
                }
                //for (let r of e.edge.group.ar) group.arIndex.push(r.indexAr);
                for (let i = 0; i < e.edge.group.ar.length; i++) group.arIndex.push(e.edge.group.ar[i].indexAr);
                saveData.edge.push(
                    {
                        type:e.edge.type || "LineEdge",
                        option:{
                            cord:e.edge.cord,
                            r:e.edge.option.r,
                            vec:e.edge.option.vec,
                            aspect:e.edge.option.aspect,
                            group,
                            light:e.edge.option.light,
                            fixedAng:e.edge.option.fixedAng
                        }
                    }
                )
              //console.log(e.edge);
            };
        // console.log(saveData);
            var d = document.createElementNS("http://www.w3.org/2000/svg","def");
            var t = document.createElementNS("http://www.w3.org/2000/svg","text");
            t.innerHTML = JSON.stringify(saveData);
            t.id = "dataSave";
            d.appendChild(t);
            sv.appendChild(d);
            return sv
        }


    function saveSvg(){
        function makeTextFile(text) {
            var data = new Blob([text], {type: 'text/plain'});
            var textFile = window.URL.createObjectURL(data);
            return textFile;
        };
        var link = document.createElement("a");
        link.href = makeTextFile(createSv().outerHTML);
        link.setAttribute("download","project.svg");
        document.body.appendChild(link);
        var onload=link.click();
        link.remove();
        return new Promise((f)=>{
            f({status:true});
        })
    };
    function savePdf(){
        var dv = document.createElement('div');
        /* var hd = document.createElement("div");
        //  hd.style.padding = "80px";
        hd.innerHTML = "Тестовый PDF";
        dv.appendChild(hd);
        dv.appendChild(sv);
        // dv.style.position = "absolute"; */
        let screen1 = document.createElement("div");
        let stScreen ={
            width:"785px",
            height:"1113.5px",
            border:"1px #000 solid",
            margin:"3px"
        };
        for (let k in stScreen) screen1.style[k] = stScreen[k];
        dv.appendChild(screen1);
       // screen1.appendChild(createSv().cloneNode(true));

        let screen2 = document.createElement("div");
        for (let k in stScreen) screen2.style[k] = stScreen[k];
        if (opt['mirrorLighting'].value) dv.appendChild(screen2);
        
        setModeMirrorLighting(false);
        return cLineSize()
            .then((r)=>{
                screen1.appendChild(createSv().cloneNode(true));
                setModeMirrorLighting(true);
                return cLineSize()
            })
            .then((r)=>{
                screen2.appendChild(createSv().cloneNode(true));
                pdf().from(dv.cloneNode(true)).save();
                return new Promise((f)=>{
                    f({status:true});
                })
                //console.log("33",r['status'])
            })
        
        //modeMirrorLighting((status)=>{});
        /* createSizeLine(()=>{
            screen1.appendChild(createSv().cloneNode(true));
            pdf().from(dv.cloneNode(true)).save();
            let dvGenr = document.createElement("div");
            let st ={
                width:"600px",
                height:"800px",
                background:"#fff",
                overflow:"scroll",
                position:"absolute",
                left:"0px",
                top:"0px"
            };
            for (let k in st) dvGenr.style[k] = st[k];
            dvGenr.appendChild(dv.cloneNode(true));
            // document.body.appendChild(dvGenr);
        }) */
         
        
    };



    /* function save(opt){
        
        
       // console.log(saveData);
        //console.log("curentP",areal.children[0],);
        function switchStatusLight(){
            modeMirrorLighting((status)=>{if (status) switchStatusLight()});
        };
        switchStatusLight();
        function makeTextFile(text) {
            var data = new Blob([text], {type: 'text/plain'});
            var textFile = window.URL.createObjectURL(data);
            return textFile;
        };
        if (!opt.pdf) {
            
            var link = document.createElement("a");
            link.href = makeTextFile(createSv().outerHTML);
            link.setAttribute("download","project.svg");
            document.body.appendChild(link);
            var onload=link.click();
            link.remove();
        } else {
            var dv = document.createElement('div');
            
            let screen1 = document.createElement("div");
            let stScreen ={
                width:"785px",
                height:"1115.5px",
                border:"1px #000 solid",
                margin:"3px"
            };
            for (let k in stScreen) screen1.style[k] = stScreen[k];
            dv.appendChild(screen1);
            screen1.appendChild(createSv().cloneNode(true));

            let screen2 = document.createElement("div");
            for (let k in stScreen) screen2.style[k] = stScreen[k];
            dv.appendChild(screen2);
           
            modeMirrorLighting((status)=>{});
            createSizeLine(()=>{
                screen1.appendChild(createSv().cloneNode(true));
                pdf().from(dv.cloneNode(true)).save();
                let dvGenr = document.createElement("div");
                let st ={
                    width:"600px",
                    height:"800px",
                    background:"#fff",
                    overflow:"scroll",
                    position:"absolute",
                    left:"0px",
                    top:"0px"
                };
                for (let k in st) dvGenr.style[k] = st[k];
                dvGenr.appendChild(dv.cloneNode(true));
               // document.body.appendChild(dvGenr);
            })
             
        }
        
    } */



   // console.log("save",opt);
};

function saveCookie(){
    localStorage.setItem('dataSave'+vDat, JSON.stringify(dataSelect));
};
//setTimeout(()=>saveFile(dataSelect),1000);
export { 
    saveProject,
    menuOptionSave
}