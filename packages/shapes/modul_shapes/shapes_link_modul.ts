import { Shapes } from "./shapes_modul";


let div1 = document.createElement("div");
let st = {
    width:'500px',
    height:"300px",
    border:"1px solid #000",
    margin: "30px"
};
for (let k in st) div1.style[k] = st[k]
document.body.appendChild(div1);

setTimeout(()=>{
    new Shapes({
        parent:div1
    });
},2000)


let div2 = document.createElement("div");
let st2 = {
    width:'800px',
    height:"200px",
    border:"1px solid #000"
};
for (let k in st2) div2.style[k] = st2[k]
document.body.appendChild(div2);

setTimeout(()=>{
    new Shapes({
        parent:div2
    });
},4000)



