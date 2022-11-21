
import { LayGroupHTML } from "./class";
var makerjs = require('makerjs');

let whSvgMaker = [400,300]
let svgMaker = new LayGroupHTML({
    svg:true,
    tag:"svg",
    name:"svgMaker",
    style:{
        top:"250px",
        left:"50px",
        position:"absolute",
        zIndex:100,
        "pointer-events":"none",
        display:"none"
    },
    attribute:{
        width:whSvgMaker[0],
        height:whSvgMaker[1]
    },
    childrenElem:[
        new LayGroupHTML({
            svg:"true",
            tag:"rect",
            attribute:{
                x:0,
                y:0,
                width:whSvgMaker[0],
                height:whSvgMaker[1],
                stroke:"#0f0",
                fill:"none"
            }
        }),
        new LayGroupHTML({
            svg:true,
            tag:"g",
            name:"layData"
        })
    ]
})

function buildSvgEdge(data){
    //console.log("maker",data);
    var model = {

        paths: [
           /* new makerjs.paths.Line([0, 0], [0, 100]),
           new makerjs.paths.Line([0, 0], [100, 0]),
           new makerjs.paths.Arc([0, 0], 100, 0, 90) */
        ],
        models:[]

      
      };
        function p (i){
            this.paths={
                t:new makerjs.paths.Line([data[i].cr[0][0],-data[i].cr[0][1]], [data[i].cr[1][0],-data[i].cr[1][1]])
            }
        };
      for (let i=0;i<data.length;i++) {
        if (data[i].type == 'LineEdge') {
            
            model.models.push(
                new p(i)
            )

        };
        if (data[i].type == 'CircEdge') { 
            let arc = angHordR(data[i].cr,data[i].option.r);
            let defAng=(180 - arc/(Math.PI)*180)/2;
            let  defTrans = Math.sin((Math.PI-arc)/2)*data[i].option.r*data[i].option.aspect 
            //- Math.sin((Math.PI-arc)/2)*data[i].option.r;
            let m=new makerjs.models.EllipticArc(defAng,180-defAng,data[i].option.r,data[i].option.r*data[i].option.aspect);
            let rot = -Math.atan2(data[i].cr[1][1]-data[i].cr[0][1],data[i].cr[1][0]-data[i].cr[0][0])/(Math.PI);
            //console.log(data[i],rot*180)
            makerjs.model.rotate(m,  rot*180, [0, defTrans]);
            m.origin = [data[i].cr[0][0]+(data[i].cr[1][0]-data[i].cr[0][0])/2,-(data[i].cr[0][1]+(data[i].cr[1][1]-data[i].cr[0][1])/2+defTrans)];
            
            //console.log(defTrans,defTrans);
            model.models.push(
                m
              //new makerjs.models.Ellipse(data[i].option.r,data[i].option.r*1.5)
            )
            /* model.paths.push(
                new makerjs.paths.Arc(
                    [data[i].cr[0][0],-data[i].cr[0][1]],
                    [data[i].cr[1][0],-data[i].cr[1][1]],
                    true
                )
            ) */
        };

    };
    var svg = makerjs.exporter.toSVG(model);
    let d = document.createElement("div");
    d.insertAdjacentHTML(`afterbegin`,svg);
    let g=d.getElementsByTagName("svg")[0].getElementsByTagName("g")[0];
    while (svgMaker.child_name['layData'].children.length) svgMaker.child_name['layData'].children[0].remove();
    let l = new LayGroupHTML({
        tag:"g",
        svg:true,
        elementInsert:g,
        parent:svgMaker.child_name['layData']
    });

    return makerjs.exporter.toDXF(model);
   // console.log(g,l);
};
function buildSvgEdge1(data){
    //console.log("maker",data);
    console.log(makerjs.models);
    let pathArray = [];
    for (let i=0;i<data.length;i++) {
        if (data[i].type == 'LineEdge') {
            pathArray.push({
                type: 'line', 
                origin: [data[i].cr[0][0],-data[i].cr[0][1]], 
                end: [data[i].cr[1][0],-data[i].cr[1][1]]
            })
        };
        if (data[i].type == 'CircEdge') {

               
           /* pathArray.push(
                  makerjs.models.Ellipse(data[i].option.r,data[i].option.r*1.5)

                );
             pathArray.push(
                new makerjs.models.EllipticArc(0,180,data[i].option.r,data[i].option.r*1.5,1)
                ); */

           // new makerjs.models.Arc([data[i].cr[1][0],-data[i].cr[1][1]],data[i].option.r,0,180)
            /* pathArray.push({
                type: 'arc', 
                origin:[data[i].cr[1][0],-data[i].cr[1][1]],
                radius:data[i].option.r,
               // radiusY:data[i].option.r*1.5,
                startAngle:0,
                endAngle:180
                
            }) */
            
        }


    };
    //console.log(data);
    var svg = makerjs.exporter.toSVG(pathArray);
    let d = document.createElement("div");
    d.insertAdjacentHTML(`afterbegin`,svg);
    let g=d.getElementsByTagName("svg")[0].getElementsByTagName("g")[0];
    while (svgMaker.child_name['layData'].children.length) svgMaker.child_name['layData'].children[0].remove();
    let l = new LayGroupHTML({
        tag:"g",
        svg:true,
        elementInsert:g,
        parent:svgMaker.child_name['layData']
    });
   // console.log(g,l);
};
function lenPoint(ar){
    return Math.sqrt(Math.pow(ar[1][0]-ar[0][0],2)+Math.pow(ar[1][1]-ar[0][1],2));
};
function angHordR(h,r){
    
    return Math.asin(lenPoint(h)/2/r)*2 || Math.PI;
};
export {
    buildSvgEdge,
    svgMaker
}