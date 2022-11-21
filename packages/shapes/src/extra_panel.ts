import { layers, LayGroupHTML,angLine } from "./class";
import { Mt3 } from "./expan.js";
import { hole, startPoint } from "./hole";
import { createSizeLine,cLineSize } from "./line_size";
import { lenPoint } from "./class";
import { LineEdge, CircEdge, setModeResolutionMove,getModeResolutionMove, deleteEdge } from "./edge";
import { selectBlank } from "./select_blank";
import { openProject, angHordR, areal, optionEdge } from "./areal";
import { saveProject, menuOptionSave } from "./save_load";
import { setCenterCursor } from "./grid";
import { arEventJoistik,rsetArEventJoistik } from "./virtual_menu";
import { modeMirrorLighting } from "./mirror_lighting";

var elSelectGroup:any = "";
class InputCord extends LayGroupHTML{
    
    constructor (option){
        option.name = "inputCord";
        
        super(option);
        var _this = this;
        this['setValue'] = function(cr){
            
            for (var i=0;i<2;i++) this.html.getElementsByTagName("input")[i].value = Math.round(cr[i]);
        };
        new LayGroupHTML({
                parent:this,
                style:{position:"","font-size":"12px","text-align":"center"},
                innerHTML:"координаты XY"
        });
        var dInp =new LayGroupHTML({
            parent:this,
            style:{position:"","font-size":"12px","text-align":"center"},
        });
        for (var i=0;i<2;i++) {
            var inp = new LayGroupHTML({
                parent:dInp,
                tag:"input",
                style:{position:"",width:"80px"},
                attribute:{type:"number"}
            });
            if (i==0) new LayGroupHTML({
                parent:dInp,
                style:{position:"",display:"inline-block",margin:"10px"},
                innerHTML:"X"
            });
            inp.html['addEventListener']("input",function(){
                var inp = this.ob_strukt.parent.html.getElementsByTagName("input");
                var arRes = [];
                for (var e of inp) arRes.push(parseFloat(e.value));
                if (_this['getValue']) _this['getValue'](arRes);
                //createSizeLine(()=>{});
                cLineSize();
                //console.log(arRes);
            })
        };

       // console.log(this);
    }
};

var extraPanel = new LayGroupHTML({
    name:"extraPanel",
    resize:function(){
        this.setPosition({
            width:this.parent.current_position.width - this.childLast.current_position.width,
            height:this.parent.current_position.height,
            left:this.childLast.current_position.width,
            top:0
        })
    },
    childrenElem:[
        new LayGroupHTML({
            name:"saveLoad",
            style:{
                position:"",
                width:"250px",
                "text-align":"center",
                padding:"5px"
            },
            
            childrenElem:[
                new LayGroupHTML({
                    style:{
                        border:"1px #000 solid",
                        padding:"5px",
                       // margin:"40px",
                        position:"",
                        //background:"#ac9",
                        
                        cursor:"pointer"
                    },
                    tag:"button",
                    innerHTML:"файл",
                    click: menuOptionSave
                })
            ]
            
        }),
        new LayGroupHTML({
            name:"mirrorLighting",
            style:{
                position:"",
                "text-align":"center",
            },
            childrenElem:[
                new LayGroupHTML({
                    name:"mirrorLighting",
                    tag:"button",
                    style:{
                        //border:"2px #00f solid",
                        cursor:"pointer",
                        padding:"5px",
                        "margin-left":"20px",
                        margin:"10px",
                        position:"",
                        display:"inline-block",
                        "text-align":"center",
                    },
                    innerHTML:"Подсветка зеркал",
                    click:function(){
                       // modeMirrorLighting(undefined);
                        //modeMirrorLighting(setPanelMirrorLighting);
                        modeMirrorLighting((s)=>{});
                        
                    }
                })
            ]
        }),
        new LayGroupHTML({
            name:"blockSelectElem",
            style:{
                border:"2px #00f solid",
                padding:"5px",
                margin:"10px",
                display:"none",
                position:""
            }
        }),
        new LayGroupHTML({
            name:"hole",
            style:{
                border:"2px #0cc solid",
                padding:"5px",
                margin:"10px",
                display:"inline-block",
                position:"",
                "text-align":"center",
            },
            childrenElem:[
                new LayGroupHTML({
                    tag:"span",
                    style:{
                        "position":"",
                        background:"#aaf",
                        padding:"6px",
                        cursor:"pointer"
                    },
                    name:"addHole",
                    innerHTML:"Добавить отверстие"
                }),
                new InputCord({
                    style:{
                        "position":"",
                        "margin-top":"10px",
                        display:"none"
                    },
                })
            ]
            //
        }),
        
        new LayGroupHTML({
            name:"addBlank",
            style:{
                /* border:"2px #0cc solid",
                padding:"5px",
                
                display:"inline-block",*/
                
                position:"", 
                "text-align":"center",
            }, 
            childrenElem:[
                new LayGroupHTML({
                    style:{
                        position:"",
                        display:"inline-block",
                        background:"#fcf",
                        padding:"5px",
                        cursor:"pointer"
                    },
                    innerHTML:"Выбрать готовую фигуру",
                    click:()=>{
                        //alert();
                        selectBlank();
                        
                    }
                })
            ]
        }),
        new LayGroupHTML({
            name:"startPoint",
            style:{
                border:"2px #0cc solid",
                padding:"5px",
                margin:"10px",
                display:"inline-block",
                position:"",
                "text-align":"center",
            },
            childrenElem:[
                new LayGroupHTML({
                    tag:"span",
                    style:{
                        "position":"",
                        background:"#aaf",
                        padding:"6px",
                        cursor:"pointer"
                    },
                    name:"addHole",
                    innerHTML:"установить точку отсчета"
                }),
                new InputCord({
                    style:{
                        "position":"",
                        "margin-top":"10px",
                        display:"none"
                    },
                })
            ]
            //
        }),
        new LayGroupHTML({
            name:"selectMaterial",
            style:{
                position:"", 
                "text-align":"center",
                padding:"5px"
            },
        }),
        new LayGroupHTML({
            name:"MirrorLightingOption",
            style:{
                position:"", 
                "text-align":"center",
                padding:"5px",
                display:"none"
            },
            childrenElem:[
                new LayGroupHTML({
                    style:{
                        position:"", 
                        display:"inline-block"
                    },
                    name:"widthLigth",
                    childrenElem:[
                        new LayGroupHTML({
                            style:{
                                position:"", 
                                display:"inline-block"
                            },
                            tag:"span",
                            innerHTML:"Ширина подсветки"
                        }),
                        new LayGroupHTML({
                            style:{
                                position:"", 
                                display:"inline-block",
                                "margin-left":"10px",
                                width:"60px"

                            },
                            attribute:{
                                type:"number"
                            },
                            tag:"input",
                           
                        })
                    ]
                }),
                new LayGroupHTML({
                    style:{
                        position:"", 
                        display:"inline-block",
                        "margin-top":"10px"
                    },
                    name:"paddigLigth",
                    childrenElem:[
                        new LayGroupHTML({
                            style:{
                                position:"", 
                                display:"inline-block"
                            },
                            tag:"span",
                            innerHTML:"Отсуп"
                        }),
                        new LayGroupHTML({
                            style:{
                                position:"", 
                                display:"inline-block",
                                "margin-left":"10px",
                                width:"60px"

                            },
                            attribute:{
                                type:"number"
                            },
                            tag:"input",
                           
                        })
                    ]
                }),
                new LayGroupHTML({
                    style:{
                        position:"", 
                        "margin-top":"10px"
                    },
                    name:"selectType",
                    childrenElem:[
                        new LayGroupHTML({
                            style:{
                                position:"", 
                                display:"inline-block"
                            },
                            tag:"span",
                            innerHTML:"Тип свечения"
                        }),
                        new LayGroupHTML({
                            style:{
                                position:"", 
                                display:"inline-block",
                                "margin-left":"10px",
                               

                            },
                            name:"sel",
                            tag:"select",
                           
                        })
                    ]
                })
            ]
        }),
        new LayGroupHTML({
            name:"fixedFigure",
            style:{
                position:"", 
                "text-align":"center",
                padding:"5px",
                //wihile:"200px"
               // display:"none"
            },
            childrenElem:[
                new LayGroupHTML({
                    tag:"span",
                    style:{
                        position:"",
                    },
                    innerHTML:"зафиксировать фигуру"
                }),
                new LayGroupHTML({
                    tag:"input",
                    style:{
                        position:"",
                    },
                    attribute:{"type":"checkbox"},
                    resize:function(){
                        this.html.checked = !getModeResolutionMove();
                       // console.log("input",this,)
                    },
                    input:function(){
                       // console.log(this.checked);
                        setModeResolutionMove(!this.checked);
                    }
                })
            ]
        })
    ],
    style:{
        "-webkit-touch-callout": "none", /* iOS Safari */
        "-webkit-user-select": "none",   /* Chrome/Safari/Opera */
        "-khtml-user-select": "none",    /* Konqueror */
        "-moz-user-select": "none",     /* Firefox */
        "-ms-user-select": "none",       /* Internet Explorer/Edge */
        "user-select": "none"  
    }
});

var elcurentSelect = {
    el:{},
    select:false,
    type:"line",
    index:0
};
function closeBlockSelect(){
    //console.log(elcurentSelect);
    if (elcurentSelect.select && elcurentSelect.el['closeSelect']) elcurentSelect.el['closeSelect']();
    elcurentSelect.select = false;
    extraPanel.child_name['blockSelectElem'].html.style['display'] = "none";
    while (extraPanel.child_name['blockSelectElem'].children.length) extraPanel.child_name['blockSelectElem'].children[0].remove();
    setCenterCursor({
        display:false
    });
    rsetArEventJoistik();
    elSelectGroup = "";
    cLineSize();
};


function createBlockInputSelectLine(el){
    var butSelGroup = new LayGroupHTML({
        style:{position:"",width:"100%","margin-top":"10px","text-align":"center"},
        name:"menuGroup",
        childrenElem:[
            new LayGroupHTML({
                tag:"button",
                style:{position:"",cursor:"pointer"},
                innerHTML:"добавить в группу",
                click:function(){
                    if (elSelectGroup) {
                        elSelectGroup = "";
                        closeBlockSelect();
                        return;
                    }
                    /* elSelectGroup = "";
                    createBlockInputSelectLine(el); */
                    elSelectGroup = el;
                    clickSelectEdge();

                  //console.dir(); 
                }
            }),
            new LayGroupHTML({
                name:"menuOption",
                style:{position:""},
            })
        ]
        //
    });
    if (elSelectGroup) {
        el.addGroup(elSelectGroup.group);
        createMenuGroup();
        return false;
    };
    
    elSelectGroup = "";
    closeBlockSelect();
    elcurentSelect.el = el;
    elcurentSelect.select = true;
    elcurentSelect.type = "line";
    var blParent = extraPanel.child_name['blockSelectElem']
    blParent.html.style['display'] = "block";
    blParent.html.style['border'] = "2px #00f solid"
    var len = Math.round(curentLength());
   /*  if (el!['type'] == "circleEdge") len =  */
    var blInp = new LayGroupHTML({
        name:"blockInput",
        parent:blParent,
        style:{"position":""},
        childrenElem:[
            new LayGroupHTML({
                name:"span",
                tag:"span",
                innerHTML:"Длинна ребра",
                style:{"position":""}
            }),
            new LayGroupHTML({
                tag:"input",
                name:"inputLeng",
                style:{"position":"",width:"90px","margin-left":"20px"},
                attribute:{"type":"number",value:len}
            })
        ]
    });
    function curentLength(){
        return Math.sqrt(Math.pow(el.cord[1][0]-el.cord[0][0],2)+Math.pow(el.cord[1][1]-el.cord[0][1],2));
    };
    if (el!['type'] != "CircEdge") blInp.child_name["inputLeng"].html.addEventListener("input",function(){
        
        el.setCord(scaleEdge( (this.value )/curentLength() || 1));
        //createSizeLine(()=>{});

        cLineSize();
        //console.log(this.value);
    });
    function lenCirc (){
        return Math.round((Math.asin(curentLength()/2/el.option.r)/Math.PI)*2*Math.PI*el.option.r);
    }
    if (el!['type'] == "CircEdge") {
        var blCirc = new LayGroupHTML({
            parent:blParent,
            name:"blCirc",
            style:{"position":"","margin-top":"10px"},
            childrenElem:[
                    new LayGroupHTML({
                        name:"R",
                        style:{"position":""},
                        childrenElem:[
                        new LayGroupHTML({
                            name:"span",
                            tag:"span",
                            innerHTML:"Радиус",
                            style:{"position":""}
                        }),
                        new LayGroupHTML({
                            tag:"input",
                            name:"inputLeng",
                            style:{"position":"",width:"90px","margin-left":"66px"},
                            attribute:{"type":"number",value:Math.round(el.option.r)}
                        })
                    ]
                })
            ]
        });
        blInp.html['style'].display = 'none';
        blCirc.html['getElementsByTagName']("input")[0].addEventListener("change",function(){
            el.setr(parseInt(this.value) || 0);
            el.move();
            //createSizeLine(()=>{});
            cLineSize();
            blInp.child_name["inputLeng"].html.value = lenCirc ();
        });

        var blArc = new LayGroupHTML({
            parent:blParent,
            name:"blCirc",
            style:{"position":"","margin-top":"10px"},
            childrenElem:[
                new LayGroupHTML({
                        name:"ang",
                        style:{"position":""},
                        childrenElem:[
                        new LayGroupHTML({
                            name:"span",
                            tag:"span",
                            innerHTML:"Угол",
                            style:{"position":""}
                        }),
                        new LayGroupHTML({
                            tag:"input",
                            name:"inputAngCirc",
                            style:{"position":"",width:"90px","margin-left":"82px"},
                            attribute:{"type":"number",value:Math.round(angHordR(el.cord,el.option.r)/Math.PI*180)
                            //Math.round(el.option.ang/Math.PI*180)
                            }
                        }),
                        /* new LayGroupHTML({
                            name:"span",
                            tag:"span",
                            innerHTML:"фиксирован",
                            style:{"position":"","margin-left":"10px"}
                        }),
                        new LayGroupHTML({
                            tag:"input",
                            name:"inputFixs",
                            style:{"position":"","margin-left":"3px"},
                            attribute:{"type":"checkbox",value:Math.round(el.option.ang/Math.PI*180)}
                        }) */
                    ]
                }),
                new LayGroupHTML({
                    name:"aspect",
                    style:{"position":"","margin-top":"10px"},
                    childrenElem:[
                    new LayGroupHTML({
                        name:"span",
                        tag:"span",
                        innerHTML:"Аспект",
                        style:{"position":""}
                    }),
                    new LayGroupHTML({
                        tag:"input",
                        name:"inputAspectCirc",
                        style:{"position":"",width:"90px","margin-left":"66px"},
                        attribute:{"type":"number",step:0.01,value:el.option.aspect}
                    }),
                    /* new LayGroupHTML({
                        name:"span",
                        tag:"span",
                        innerHTML:"фиксирован",
                        style:{"position":"","margin-left":"10px"}
                    }),
                    new LayGroupHTML({
                        tag:"input",
                        name:"inputFixs",
                        style:{"position":"","margin-left":"3px"},
                        attribute:{"type":"checkbox",value:Math.round(el.option.ang/Math.PI*180)}
                    }) */
                ]
            })
            ]
        });
        //
        blArc.child_name['ang'].child_name['inputAngCirc'].html.addEventListener("change",function(){
            
            if (this.value>180) this.value = 180;
            if (this.value<0) this.value = 0;
            el.setr(lenPoint(el.cord)/2/Math.sin(this.value/180*Math.PI/2))
            el.move();
            //createSizeLine(()=>{});
            cLineSize();
           
        });
        blArc.child_name['aspect'].child_name['inputAspectCirc'].html.addEventListener("change",function(){
            
            //el.option.aspect = parseFloat(this.value);
            el.setaspect(parseFloat(this.value));
            el.move();
           // createSizeLine(()=>{});
           cLineSize();
            
           
           
        });
        //console.log(blArc.child_name['aspect'].child_name['inputAspectCirc']);
        blInp.child_name["inputLeng"].html.addEventListener("change",function(){
            var ang = this.value/(2*Math.PI*el.option.r)*(2*Math.PI);
            var p1 = [el.option.r,0];
            var p2 = new Mt3().trans(p1[0],p1[1]).rotX(ang).elements.slice(6,8);
            
           // console.log(lenPoint([p1,p2])/curentLength() || 1);
            el.setCord(scaleEdge(lenPoint([p1,p2])/curentLength() || 1));
            cLineSize();
            //createSizeLine(()=>{});
            blInp.child_name["inputLeng"].html.value = lenCirc ();
            //console.log(this.value);
        });
        blInp.child_name["inputLeng"].html.value = lenCirc ();
        el.addEvent('moveR',el,function(option){
                blCirc.html['getElementsByTagName']("input")[0].value = Math.round(option);
                blInp.child_name["inputLeng"].html.value = lenCirc ();
               // console.log(22)
            }
        );
        el.addEvent('moveArc',el,function(option){
            blArc.child_name['ang'].child_name['inputAngCirc'].html.value = Math.round(option/Math.PI*180);
            //console.log("arc");
                //blCirc.html['getElementsByTagName']("input")[0].value = Math.round(option);
                //blInp.child_name["inputLeng"].html.value = lenCirc ();
               // console.log(22)
            }
        );

        
    };
    function scaleEdge(sc){
        var mt = new Mt3();
        var ang = Math.atan2(el.cord[1][1]-el.cord[0][1],el.cord[1][0]-el.cord[0][0]);
        var pointRot = [el.cord[0][0]+(el.cord[1][0]-el.cord[0][0])/2,el.cord[0][1]+(el.cord[1][1]-el.cord[0][1])/2];
        //if (this.value<1) this.value = 1;
       
        mt.trans(-pointRot[0],-pointRot[1])
            .rotX(-ang)
            .scale(sc,1)
            .rotX(ang)
            .trans(pointRot[0],pointRot[1])
            ;

        //console.log(new Mt3().trans(el.cord[0][0],el.cord[0][1]).multiply(mt));
        var newCord=[];
        newCord.push(new Mt3().trans(el.cord[0][0],el.cord[0][1]).multiply(mt).elements.slice(6,8));
        newCord.push(new Mt3().trans(el.cord[1][0],el.cord[1][1]).multiply(mt).elements.slice(6,8));
        return newCord;
    };
    new LayGroupHTML({
        parent:blParent,
        name:"blockButton",
        style:{position:"",width:"100%","margin-top":"10px","text-align":"center"},
        childrenElem:[
            new LayGroupHTML({
                tag:"button",
                style:{
                    position:"",
                    cursor:"pointer",
                    display:(checkVariationEdge({
                        edge:elcurentSelect.el,
                        action:"switch"
                    })) ? "inline-block" : "none"
                },
                innerHTML:el!['type'] == "CircEdge" ?  "Переключить на прямую" : "Переключить на дугу",
                click:function(){
                    elSelectGroup = "";
                    var cr = el.cord.slice();
                    el.remove();
                    setTimeout(()=>{if (el!['type'] == "CircEdge") {
                            new LineEdge({
                                cord:cr
                            }).selectLine();
                        } else {
                            new CircEdge({
                                cord:cr,
                                r:1,
                                vec:0
                            }).selectLine();
                        }
                        cLineSize();
                   // createSizeLine(()=>{});
                    },5);
                    //console.log(44,el);
                }
            }),
            new LayGroupHTML({
                style:{
                    position:"",
                    padding:"10px"
                },
                childrenElem:[
                    new LayGroupHTML({
                        style:{
                            position:""
                        },  
                        innerHTML:"выровнить по оси" 
                    }),
                    new LayGroupHTML({
                        style:{
                            position:""
                        },
                        childrenElem:[
                            new LayGroupHTML({
                                style:{
                                    position:""
                                },
                                tag:"button",
                                innerHTML:"X",
                                click:()=>rotateEdge(0)
                            }),
                            new LayGroupHTML({
                                style:{
                                    position:"",
                                    "margin-left":"5px"
                                },
                                tag:"button",
                                innerHTML:"Y",
                                click:()=>rotateEdge(1)
                            })
                        ]
                    })
                ]
            }),
            new LayGroupHTML({
                tag:"button",
                style:{position:"",cursor:"pointer",display:(checkVariationEdge({
                   edge:elcurentSelect.el,
                   action:"delete"
                })) ? "inline-block" : "none"},
                innerHTML:"удалить",
                click:function(){
                    deleteEdge(elcurentSelect.el);
                    closeBlockSelect();
                    
                }
            }),
            butSelGroup
        ]
        //
    })
    function checkVariationEdge(opt){
        let ed = optionEdge();
        let arEd = [];
        for (let e of ed) {
            let ee = {
                edge:e.edge,
                type:e.type
            };
            if (opt.action=="switch" && opt.edge===e.edge && ee.type == "LineEdge") ee.type="CircEdge";
            if (opt.action=="switch" && opt.edge===e.edge && ee.type == "CircEdge") ee.type="LineEdge";
            if (!(opt.edge===e.edge && opt.action=="delete")) arEd.push(ee);

        };
        let countType = {
            LineEdge:0,
            CircEdge:0
        };
        for (let e of arEd) countType[e.type]++;
        let ret = false;
        if (countType.LineEdge>2) ret = true;
        if (countType.CircEdge && arEd.length>1) ret = true;
        if (countType.LineEdge<1 && opt.action=="switch") ret = false;
        return ret;
    };
    function clickSelectEdge(){
        let bt = butSelGroup.children[0].html;
        //console.log()
        bt.innerHTML = 'Укажите ребро для группировки'
        bt.style['border'] = "1px solid #f00";
       // elSelectGroup = el;

    };
    function createMenuGroup(){
        var parentMenu = extraPanel.child_name['blockSelectElem'].child_name['blockButton'].child_name['menuGroup'].child_name['menuOption'];
        var arOpt = el.group.option;
        while (parentMenu.children.length) parentMenu.children[0].remove();
       // console.log(el);
        if (el.group.ar.length>1) {
            var g = new LayGroupHTML({
                parent:parentMenu,
                style:{position:"","padding-top":"20px"},
                childrenElem:[
                    new LayGroupHTML({
                        style:{position:""},
                        innerHTML:"Связанные параметры группы"
                    })
                ]
            });
            for (var i = 0; i<arOpt.length;i++) (function(i){
            
                var e = new LayGroupHTML({
                    parent:g,
                    style:{position:""},
                    childrenElem:[
                        new LayGroupHTML({
                            style:{position:"",display:"inline-block",width:"70px"},
                            innerHTML:arOpt[i].name
                        }),
                        new LayGroupHTML({
                            tag:"input",
                            attribute:{"type":"checkbox",},

                        })
                    ]
                });
                e.html['getElementsByTagName']("input")[0].checked = arOpt[i].value;
                e.html['getElementsByTagName']("input")[0].onchange = function(){
                    arOpt[i].value = this.checked;
                }
            })(i); 
            if (!elSelectGroup) new LayGroupHTML({
                tag:"button",
                style:{position:"",cursor:"pointer"},
                innerHTML:"Удалить из группы",
                parent:parentMenu,
                click:function(){
                    el.deleteElGroup();
                }
            });
           
        }
        
        
        //console.log("createMenuGroup",el.group.ar)
    };
    createMenuGroup();
    cLineSize();
    //console.log("option",el)
    return true;
};
function createBlockInputSelectPoint(el,index){
    closeBlockSelect();
    elcurentSelect.el = el;
    elcurentSelect.select = true;
    elcurentSelect.index = index;
    elcurentSelect.type = "point";
    var blParent = extraPanel.child_name['blockSelectElem']
    blParent.html.style['display'] = "block";
    blParent.html.style['border'] = "2px #0f0 solid";
    var angInp = new LayGroupHTML({
        name:"angInp",
        parent:blParent,
        style:{"position":"","margin-top":"10px"},
        childrenElem:[
            new LayGroupHTML({
                name:"span",
                tag:"span",
                innerHTML:"угол",
                style:{"position":""}
            }),
            new LayGroupHTML({
                tag:"input",
                name:"inputAng",
                style:{"position":"",width:"50px","margin-left":"20px"},
                attribute:{"type":"number",value:Math.round(curentAng().ang/Math.PI*180)}
            }),
            new LayGroupHTML({
                name:"span",
                tag:"span",
                innerHTML:"Фикс",
                style:{"position":"","margin-left":"8px"}
            }),
            new LayGroupHTML({
                tag:"input",
                name:"fixAng",
                style:{"position":""},
                attribute:{"type":"checkbox"}
            })
        ]
    });
    angInp.child_name['fixAng'].html.checked = el.option.fixedAng[index].fix;
    angInp.child_name['fixAng'].html.oninput = function(){
        el.setFixedAng(index,this.checked);
        //console.log(this.checked);
    };
    function curentAng(){
        var ang = 0;
        //Math.atan2(el.cord[1][1]-el.cord[0][1],el.cord[1][0]-el.cord[0][0])/Math.PI*180;
        var sign = 1;
        if (el.edgeLink[index].indexPoint!=undefined) {
            var crLine1 = [el.cord[index^1].slice(),el.cord[index].slice()];
            var crLine2 = [el.edgeLink[index].edge.cord[el.edgeLink[index].indexPoint].slice(),el.edgeLink[index].edge.cord[el.edgeLink[index].indexPoint^1].slice()];
            var a1 =  Math.atan2(crLine1[1][1]-crLine1[0][1],crLine1[1][0]-crLine1[0][0]);
            var mt = new Mt3().trans(-crLine2[0][0],-crLine2[0][1]).rotX(-a1);
            var cr = new Mt3().trans(crLine2[1][0],crLine2[1][1]).multiply(mt).elements.slice(6,8);
            //console.log(crLine1,crLine2);
            ang = (Math.PI - Math.atan2(cr[1],cr[0]));
            if (ang>Math.PI) {
                sign = -1;
                ang = Math.PI*2 - ang;
            };
           
        }
        
        return {
            ang,
            sign,
        };
    };

    angInp.child_name['inputAng'].html.addEventListener("change",function(){
        if (el.edgeLink[index].indexPoint!=undefined){
            var cur = curentAng();
            if (Math.abs(this.value)>180) {
                this.value = 180;
            }
            var ang = (Math.abs(this.value)/180*Math.PI + cur.ang*cur.sign)/2;
            var crLine1 = [el.cord[index^1].slice(),el.cord[index].slice()];
            var crLine2 = [el.edgeLink[index].edge.cord[el.edgeLink[index].indexPoint].slice(),el.edgeLink[index].edge.cord[el.edgeLink[index].indexPoint^1].slice()];
            var mt = new Mt3()
                        .trans(-crLine1[1][0],-crLine1[1][1])
                        .rotX(-ang)
                        .trans(crLine1[1][0],crLine1[1][1])
                        ;
            var cr = new Mt3().trans(crLine1[0][0],crLine1[0][1]).multiply(mt).elements.slice(6,8);
            var setAr = [];
            setAr[index] = el.cord[index]
            setAr[index^1] = cr;
            el.setCord(setAr);

             var mt = new Mt3()
                        .trans(-crLine1[1][0],-crLine1[1][1])
                        .rotX(ang)
                        .trans(crLine1[1][0],crLine1[1][1])
                        ;
            var cr = new Mt3().trans(crLine2[1][0],crLine2[1][1]).multiply(mt).elements.slice(6,8);
           var setAr = [];
            setAr[el.edgeLink[index].indexPoint] = el.edgeLink[index].edge.cord[el.edgeLink[index].indexPoint]
            setAr[el.edgeLink[index].indexPoint^1] = cr;

            el.edgeLink[index].edge.setCord(setAr);
            angInp.child_name['inputAng'].html.value = Math.round(curentAng().ang/Math.PI*180);
            //console.log(cr)
        }
        //createSizeLine(()=>{});
        cLineSize();
    });
    var cr = [
        {
            name:'X'
        },
        {
            name:'Y'
        }
    ];
    for (var i=0;i<2;i++) cr[i]['layinp'] = new LayGroupHTML({
        name:"ayinp"+cr[i].name,
        parent:blParent,
        style:{"position":"","margin-top":"5px"},
        childrenElem:[
            new LayGroupHTML({
                name:"span",
                tag:"span",
                innerHTML:"позиция "+cr[i].name,
                style:{"position":""}
            }),
            new LayGroupHTML({
                tag:"input",
                name:"inputVal",
                style:{"position":"",width:"80px","margin-left":"20px"},
                attribute:{"type":"number"}
            })
        ]

    });
    for (var i=0;i<2;i++) (function(ind) {
        cr[ind]['layinp'].child_name['inputVal'].html.addEventListener('input',function(){
            var arSet=[];
            arSet[index^1] = el.cord[index^1].slice();
            arSet[index] = [Math.round(cr[0]['layinp'].child_name['inputVal'].html.value),Math.round(cr[1]['layinp'].child_name['inputVal'].html.value)];
            el.setCord(arSet);
            //createSizeLine(()=>{});
            cLineSize();
        })
    })(i); 
    el.listEvent = [
        function(){
            angInp.child_name['inputAng'].html.value = Math.round(curentAng().ang/Math.PI*180);
            for (var i=0;i<2;i++) cr[i]['layinp'].child_name['inputVal'].html.value = Math.round(el.cord[index][i])
            setCenterCursor({
                display:true,
                cr:el.cord[index]
            })
            //console.log(el.cord[index])
        }
    ];
    for (var e of el.listEvent) e();
    arEventJoistik.push(
        {
            data:{x:0,y:0},
            callback:function(d){
               // console.log(d);
                this.data = {x:0,y:0};
                var arSet=[];
                arSet[index^1] = el.cord[index^1].slice();
                arSet[index] = [el.cord[index].slice()[0]+d.x,el.cord[index].slice()[1]+d.y];
                el.setCord(arSet);
                //createSizeLine(()=>{});
                cLineSize();
                /* if (elcurentSelect.select) return;
                
                
                var mt = new Mt3().trans(d.x,d.y).multiply(matrixAreal);
                setMatrix(mt); */
            }
        }
    )
    
    cLineSize();
   // console.log(el,index);
   // console.log(blParent);
};

function createBlockInputSelectHole(el){
    //console.log(22);
    closeBlockSelect();
   // elcurentSelect = el;
    elcurentSelect.el = el;
    elcurentSelect.select = true;
    elcurentSelect.type = "hole";
    var blParent = extraPanel.child_name['blockSelectElem']
    blParent.html.style['display'] = "block";
    blParent.html.style['border'] = "2px #0aa solid";
    var d = new LayGroupHTML({
        style:{'position':""},
        parent:blParent,
        childrenElem:[
            new LayGroupHTML({
                style:{"color":"#f00",right:"16px",cursor:"pointer"},
                innerHTML:"X",
                down:{
                    fnDown:function(){
                        closeBlockSelect();
                        el.remove();
                        //createSizeLine(()=>{});
                        cLineSize();
                    }
                }
            }),
            new LayGroupHTML({
                tag:"span",
                style:{'position':"","margin-left":"20px"},
                innerHTML:"Диаметр"
            }),
            new LayGroupHTML({
                tag:"input",
                name:"inputD",
                attribute:{"type":"number"},
                style:{'position':"",width:"50px","margin-left":"20px"},
            })
        ]
    })
    var elInpCord = new InputCord({
        parent:blParent,
        style:{
            "position":"",
            "margin-top":"10px",
            display:"block"
        },
    });
    //console.log(el)
    el.addEvent('move',el,function(option){
            elInpCord['setValue'](option.cr);
           // console.log("eventMove");
        }
    );
    elInpCord['setValue'](el.option.cr);
    d.child_name["inputD"].html['value'] = el.option.d;
    d.child_name["inputD"].html.addEventListener('input',function(){
        el.option['d']=this.value;
        el.move();
    })
    elInpCord['getValue'] = function(cr){
        el.option['cr']=cr;
        el.move();
        //console.log(cr,el);
    };

}
function rotateEdge(course){
   // console.log("rotateEdge",course,elcurentSelect.el);
    let cr = [
        [
            [0,0],
            [100,0]
        ],
        [
            [0,0],
            [0,100]
        ]
    ]
    let ang = angLine(elcurentSelect.el['cord'],cr[course]);
    let mn_mx = areal['getMinMax']();
    let pointRot = [
        mn_mx[0]+(mn_mx[2]-mn_mx[0])/2,
        mn_mx[1]+(mn_mx[3]-mn_mx[1])/2
    ];
    let mt = new Mt3()
        .trans(-pointRot[0],-pointRot[1])
        .rotX(-ang)
        .trans(pointRot[0],pointRot[1])

    let ed= optionEdge();
    for (let e of ed) for (let i=0;i<2;i++) e.edge.cord[i] = new Mt3()
                                                .trans(e.edge.cord[i][0],e.edge.cord[i][1])
                                                .multiply(mt)
                                                .elements.slice(6,8);

    for (let e of ed) e.edge.setCord(e.edge.cord);     
    cLineSize();                                   
    //console.log()
}
var valData = {
    cr:[0,0],
    pointInBlock:false,
    cursor:false
}
function setValueCordCurentCursor(data){
    if (!extraPanel) return;
    var el = extraPanel.child_name['hole'].child_name['inputCord'];
    for (var k in data) valData[k] = data[k];
    if (valData.cursor) {el.html.style.display = 'block'} else el.html.style.display = 'none';
    el.setValue(valData.cr);
};
function setValueStratPointCursor(data){
    if (!extraPanel) return;
    var el = extraPanel.child_name['startPoint'].child_name['inputCord'];

    for (var k in data) valData[k] = data[k];
    if (valData.cursor) {el.html.style.display = 'block'} else el.html.style.display = 'none';
    el.setValue(valData.cr);
};

/* function setPanelMirrorLighting(status){
    
    
    
    if (status) {
        for (var i=2;i<extraPanel.children.length;i++) extraPanel.children[i].html.style.display = "none";
        extraPanel.child_name['MirrorLightingOption'].html.style.display = "block";
        setTimeout(()=>{if (extraPanel.parent['child_name']['panelAnalitic']) 
                extraPanel.parent['child_name']['panelAnalitic'].html.style.display = "none";

            },10);
            extraPanel.child_name['mirrorLighting'].children[0].html.innerHTML = "Построитель";
    } else {
        for (var i=2;i<extraPanel.children.length;i++) extraPanel.children[i].html.style.display = "block";
        setTimeout(()=>{if (extraPanel.parent['child_name']['panelAnalitic']) {
            extraPanel.parent['child_name']['panelAnalitic'].html.style.display = "block"}
        },10);
        setTimeout(()=>closeBlockSelect(),10);
        extraPanel.child_name['mirrorLighting'].children[0].html.innerHTML = "Подсветка зеркал";
        extraPanel.child_name['MirrorLightingOption'].html.style.display = "none";
    };
    setModeResolutionMove(!status);
};
setPanelMirrorLighting(false); */


hole.setLayHTML(extraPanel.child_name['hole']);
startPoint.setLayHTML(extraPanel.child_name['startPoint']);

//setTimeout(()=>modeMirrorLighting(()=>{}),250) ;

export { 
    extraPanel, 
    createBlockInputSelectLine, 
    createBlockInputSelectPoint, 
    closeBlockSelect, 
    setValueCordCurentCursor, 
    setValueStratPointCursor,
    createBlockInputSelectHole, 
    elcurentSelect,
    
};