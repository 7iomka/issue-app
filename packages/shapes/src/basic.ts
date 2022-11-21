import { LayGroupHTML } from "./class";

import { extraPanel } from "./extra_panel";
import { Mt3 } from "./expan.js";
import { areal, setMatrix } from "./areal";
import { createSizeLine } from "./line_size";
import { analysis, panelAnalitic } from "./analysis";
import { panelHelp } from "./help";
import { init_virtual_menu } from "./virtual_menu";
import { menuOptionSave } from "./save_load";
import { svgMaker } from "./build_svg_dxf";
import { createUnparsedSourceFile } from "node_modules/typescript/lib/typescript";

var generalDiv = new LayGroupHTML({
    el_parent:document.body,
    name:"generalDiv",
    resize:function(){
        this.setPosition({
            width:Math.max(window.innerWidth,500),
            height:window.innerHeight,
            left:0,
            top:0
        })
    },
    childrenElem:[
        areal,
        extraPanel,
        panelAnalitic,
        panelHelp,
        svgMaker
    ]
})
generalDiv.resize();
window.addEventListener("resize",()=>generalDiv.resize());
//console.log(generalDiv);
//hole.create([0,0],"");
//hole.create([20,10],"");
//createSizeLine(()=>{});

setMatrix(new Mt3());
init_virtual_menu();

//menuOptionSave();
/* document.body.addEventListener("mousemove",(e)=>{
    console.log("cord",e.clientX)
});
let count = 0;
async function a(){
    count++;
    let fn = new Promise(function(ee, reject){
        let i=0;
        let t=new Date().getTime();
        while (i<2e9) i++;
        console.log("time",new Date().getTime()-t);
        ee("55");
    });
    fn.then(function(){
        console.log(44)
    })
    fn.then(function(){
        console.log(77);
        if (count<7) a();
    });
}
a(); */
//selectBlank();
/* var dInfo = document.createElement("div");
dInfo.id = "info";
var st = {
    position:"fixed",
    zIndex : 1000,
    left:"20px",
    top: "20px"
};
for (var k in st ) dInfo.style[k] = st[k];
document.body.appendChild(dInfo);
dInfo.innerHTML  = "44"; */
//alert(22);
//saveProject();
