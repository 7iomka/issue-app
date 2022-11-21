import { areal, optionEdge } from "./areal";
import { LayGroupHTML, lineSegmentsIntersectBool, lineSegmentsIntersect } from "./class";
import { extraPanel, closeBlockSelect } from "./extra_panel";
import { createSizeLine,cLineSize } from "./line_size";
import { cosVect, Mt3 } from "./expan.js";
import { stat } from "fs/promises";

var status = false;
function modeMirrorLighting(callbackStatus){

    status = !status;
    /* if (st == undefined) {
        return starus;
    };
    starus = st; */
    var ed = areal.children[0].child_name['layerEdge'].children[0].children;
    for ( var i=0;i<ed.length;i++) ed[i].edge.setLight(status);
    areal.children[0].child_name['layerEdge'].child_name['gropeTypeLigth'].html.style.display = (status) ? "block" : "none"
    closeBlockSelect();
    if (status) {

        for (var i=2;i<extraPanel.children.length;i++) extraPanel.children[i].html.style.display = "none";
        extraPanel.child_name['MirrorLightingOption'].html.style.display = "block";
        setTimeout(()=>{if (extraPanel.parent['child_name']['panelAnalitic']) 
                extraPanel.parent['child_name']['panelAnalitic'].html.style.display = "none";

            },10);
        extraPanel.child_name['mirrorLighting'].children[0].html.innerHTML = "Построитель";

        let ed = optionEdge()
        let widthLigth =  extraPanel.child_name["MirrorLightingOption"].child_name['widthLigth'].html.getElementsByTagName("input")[0];
        widthLigth.value = ed[0].edge.option.light.width;
        if (!widthLigth.onchange) {
            widthLigth.onchange = function(){
                ed = optionEdge();
                for (let k of ed) k['edge'].option.light.width = parseInt(this.value);
                for (let k of ed) k['edge'].move();
                //createSizeLine(function(){})
                cLineSize();
            }
        };

        let paddingCenter =  extraPanel.child_name["MirrorLightingOption"].child_name['paddigLigth'].html.getElementsByTagName("input")[0];
        paddingCenter.value = ed[0].edge.option.light.paddingCenter;
        if (!paddingCenter.onchange) {
            paddingCenter.onchange = function(){
                ed = optionEdge();
                for (let k of ed) k['edge'].option.light.paddingCenter = parseInt(this.value);
                for (let k of ed) k['edge'].move();
                //createSizeLine(function(){})
                cLineSize();
            }
        };
        let sel = extraPanel.child_name["MirrorLightingOption"].child_name["selectType"].child_name['sel'];
        while (sel.children.length) sel.children[0].remove();

        let listTypeGlow = [
            {
                typeGlow:"hot",
                text:"Теплое"
            },
            {
                typeGlow:"neutral",
                text:"Нейтральное"
            },
            {
                typeGlow:"cold",
                text:"Холодное"
            }
        ];
        for (let k of listTypeGlow) {
            let opt = new LayGroupHTML({
                parent:sel,
                tag:"option",
                innerHTML:k.text,
                attribute:{
                    value:k.typeGlow
                }
            });
            if (ed[0].edge.option.light.typeGlow == k.typeGlow) opt.html['setAttribute']("selected","true");
        };
        if (!sel.html.onchange) sel.html.onchange = function(){
            for ( let k of ed) k.edge.option.light.typeGlow = this.value;
        };
        
    } else {
        for (var i=2;i<extraPanel.children.length;i++) extraPanel.children[i].html.style.display = "block";
        setTimeout(()=>{if (extraPanel.parent['child_name']['panelAnalitic']) {
            extraPanel.parent['child_name']['panelAnalitic'].html.style.display = "block"}
        },10);
        setTimeout(()=>closeBlockSelect(),10);
        extraPanel.child_name['mirrorLighting'].children[0].html.innerHTML = "Подсветка зеркал";
        extraPanel.child_name['MirrorLightingOption'].html.style.display = "none";
    };

    
   // createSizeLine(function(){})
   cLineSize();
    callbackStatus(status);
    
    //console.log();
};
function filterSizeLineLigth(arSize){
    if (!status) return arSize;
    for (let i=0;i<arSize.length;i++) if (arSize[i].type!="sizeMnMx") {
        arSize.splice(i,1);
        i--;
    };
    let ed = optionEdge();
   // console.log(arSize,ed);
    let mnMx = areal['getMinMax']();
    let crLineIntersect = [[mnMx[0]+(mnMx[2]-mnMx[0])/2,mnMx[1]],[mnMx[0]+(mnMx[2]-mnMx[0])/2,mnMx[3]]];
    let arEdgeInt = [];
    for ( let i=0;i<ed.length;i++) for (let j=0;j<ed[i].edge.option.arArc.length-1;j++) {
        let line = [ed[i].edge.option.arArc[j],ed[i].edge.option.arArc[j+1]];
        let inter = lineSegmentsIntersectBool(line,crLineIntersect);
        if (inter) arEdgeInt.push({
            pointInt:lineSegmentsIntersect(line,crLineIntersect),
            line:line,
            cos:cosVect([[0,0],[10,0]],line)
        })
        //arEdgeInt.push()
    };
    arEdgeInt.sort((a,b)=>Math.abs(b.cos)-Math.abs(a.cos));
    let p1 = new Mt3()
        .trans(0,ed[0].edge.option.light.paddingCenter)
        .rotX(Math.atan2(arEdgeInt[0].line[1][1] - arEdgeInt[0].line[0][1],arEdgeInt[0].line[1][0] - arEdgeInt[0].line[0][0]))
        .transAr(arEdgeInt[0].pointInt)
        .elements.slice(6,8)
    arSize.push({
        cr:[arEdgeInt[0].pointInt,p1],
        value:ed[0].edge.option.light.paddingCenter,
        name:"P"
    });
    let p2 = new Mt3()
        .trans(0,ed[0].edge.option.light.paddingCenter-ed[0].edge.option.light.width/2)
        .rotX(Math.atan2(arEdgeInt[0].line[1][1] - arEdgeInt[0].line[0][1],arEdgeInt[0].line[1][0] - arEdgeInt[0].line[0][0]))
        .transAr(arEdgeInt[0].pointInt)
        .elements.slice(6,8)
    let p3 = new Mt3()
        .trans(0,ed[0].edge.option.light.paddingCenter+ed[0].edge.option.light.width/2)
        .rotX(Math.atan2(arEdgeInt[0].line[1][1] - arEdgeInt[0].line[0][1],arEdgeInt[0].line[1][0] - arEdgeInt[0].line[0][0]))
        .transAr(arEdgeInt[0].pointInt)
        .elements.slice(6,8)    
    arSize.push({
        cr:[p2,p3],
        value:ed[0].edge.option.light.width,
        name:"W"
    });
    
    return arSize
};

function setModeMirrorLighting(st){
    if (status!=st) modeMirrorLighting((s)=>{})
};

function getModeMirrorLighting(){
    return status;
};

export { 
    modeMirrorLighting, 
    filterSizeLineLigth, 
    setModeMirrorLighting, 
    getModeMirrorLighting
};