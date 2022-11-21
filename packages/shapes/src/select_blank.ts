import { areal, optionEdge } from "./areal";
import { LayGroupHTML } from "./class";
import { createFigure } from "./creatr_figure";
import { billet } from "./billet";
import { Mt3, write_matrix, read_cord} from "./expan.js";
import { LineEdge, CircEdge } from "./edge";
import { createSizeLine,cLineSize } from "./line_size";
//console.log(billet['chil']['close'])
var arListFigure = [
    {
        name:"O1"
    },
    {
        name:"L26"
    },
    {
        name:"GR01D"
    },
    {
        name:"GR04#1"
    },
    {
        name:"RC14#2"
    },
    {
        name:"RC20"
    },
    {
        name:"L62"
    },
    /* {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    },
    {
        name:"O1"
    } */

];
//console.log("create",createFigure['O1']({}));
class WindSelect extends LayGroupHTML {

    constructor (opt){
        var o = {
            display:"inline-block",
            position:"",
            margin:"10px",
            //border:"1px #000 solid",\
            background:"#ddf",
            "text-align":"center",
            cursor:"pointer",
            
        };
        if (!opt.style) opt.style = {};
        for (var k in o) opt.style[k]=o[k];
        opt.down={
            fnDown:function(){
                var listCom = {
                    "LineEdge":LineEdge,
                    "CircEdge":CircEdge
                };
                closePopUp();
                var comannand = createFigure[opt.name]({
                    width:160,
                    height:120,
                    //parent:
                }).comand;
                areal['clear']();
                //console.log(comannand);
                for (var c of comannand) {
                    if (c.nameEdge) new listCom[c.nameEdge]({
                        ... c.option
                    });
                    
                    if (c.group) {
                        //for (var i=0;i<c.group.length;i++) 
                        var ed = optionEdge();
                        for (var k in c.group) for (var i=0;i<c.group[k].length;i++) ed[k].edge.addElemGroup(ed[c.group[k][i]].edge);
                       // console.log(c.group,)
                    }
                    
                };
                //createSizeLine(()=>{});
                cLineSize();
            }
        };
        super(opt);
        this.setPosition({
            width:200,
            height:150
        });
        var sv = new LayGroupHTML({
            tag:"svg",
            svg:true,
            parent:this,
            attribute:{
                width:160,
                height:120
            },
            style:{
                position:"",
                display:"inline-block",
                margin:"5px"
            }
        });
        sv['add'](
            createFigure[opt.name]({
                width:160,
                height:120
            }).svg
        );
        new LayGroupHTML({
            parent:this,
            style:{
                position:"",
                //display:"inline-block",
                //margin:"5px"
                    "-webkit-touch-callout": "none", /* iOS Safari */
                    "-webkit-user-select": "none",   /* Chrome/Safari/Opera */
                    "-khtml-user-select": "none",    /* Konqueror */
                    "-moz-user-select": "none",     /* Firefox */
                    "-ms-user-select": "none",       /* Internet Explorer/Edge */
                    "user-select": "none"  
            },
            innerHTML:opt.name
        })
        //console.log(createFigure[opt.name]({}).svg);
    }
};
var popUp;
function selectBlank(){
    
    popUp = new LayGroupHTML({
        parent:areal.parent,
        childrenElem:[
            new LayGroupHTML({
                name:"background",
                style:{
                    background:"#000",
                    opacity:.6
                },
                resize:function(){
                    this.setPosition({
                        left:0,
                        top:0,
                        width:window.innerWidth,
                        height:window.innerHeight
                    })
                    //console.log("popUp", "resize");
                },
                down:{
                    fnDown:function(){
                        //console.log(33);
                        closePopUp();
                    }
                }
            }),
            new LayGroupHTML({
                name:"basicList",
                style:{
                    background:"#fff",
                    padding:"20px",
                    "text-align":"center",
                    "overflow-y":"auto"
                },
                resize:function(){
                    var wh = [window.innerWidth, window.innerHeight];
                    this.setPosition({
                        left:100,
                        top:100,
                        width:wh[0]-200,
                        height:wh[1]-200
                    })
                    //console.log("popUp", "resize");
                }
            }),
            new LayGroupHTML({
                svg:true,
                tag:"svg",
                style:{
                    position:"absolute",
                    cursor:"pointer"
                },
                name:"close",
                down:{
                    fnDown:function(){
                        //console.log(33);
                        closePopUp();
                    }
                },
                childrenElem:[
                    new LayGroupHTML({
                        svg:true,
                        tag:"g",
                        resize:function(){
                           // console.log(22,);
                           var psBasicList = this.parN(2).child_name['basicList'].current_position;
                        
                            var cr = read_cord(this.html);
                            write_matrix(this.html,new Mt3().trans(-cr.x+2,-cr.y+2));
                           // console.log(psBasicList, this.parent)
                            this.parent.setPosition({
                                left:psBasicList.width+psBasicList.left-6,
                                top:psBasicList.top+3
                            })
                        },

                        elementInsert:billet["chil"]['close']
                    })
                ]
                //
            })
        ]
        /*  */
    });
    
    popUp.resize();
    for (var list of arListFigure) {
        new WindSelect({
            name:list.name,
            parent:popUp.child_name['basicList']
        })
    };
   // console.log(popUp)
   //console.log("popUp",popUp);
};
function closePopUp(){
    popUp.remove();
};
export {selectBlank};