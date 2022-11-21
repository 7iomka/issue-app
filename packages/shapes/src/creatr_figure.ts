import { LineEdge, CircEdge } from "./edge";
import { LayGroupHTML } from "./class";
import { Mt3, write_matrix, read_cord} from "./expan.js";




function createSvgG (com) {
    var listCom = {
        "LineEdge":LineEdge,
        "CircEdge":CircEdge
    };
    var parent = new LayGroupHTML({
        svg:true,
        tag:"g"
    });
    for (var c of com) {
        if (c.nameEdge) new listCom[c.nameEdge]({
            ... c.option,
            parent:parent
        });
    };
    return parent;
};


var createFigure = {
    "O1":function(opt){
        //console.log(44,opt);
        var  com = [
            {
                nameEdge:"LineEdge",
                option:{
                    cord:[
                            [-70,-50],
                            [70,-50]
                        ]
                }
            },
            {
                nameEdge:"LineEdge",
                option:{
                    cord:[
                            [70,-50],
                            [70,50]
                        ]
                }
            },
            {
                nameEdge:"LineEdge",
                option:{
                    cord:[
                            [70,50],
                            [-70,50]
                        ]
                }
            },
            {
                nameEdge:"LineEdge",
                option:{
                    cord:[
                            [-70,50],
                            [-70,-50]
                        ]
                }
            },
               
        ];
        var g = createSvgG(com);
        write_matrix(g.html,new Mt3().trans(opt.width/2,opt.height/2))
        return {
            comand : com,
            svg : g
        }
    },
    "L26":function(opt){
        //console.log(44,opt);
        var  com = [
            {
                nameEdge:"LineEdge",
                option:{
                    cord:[
                            [-50,-50],
                            [50,-50]
                        ]
                }
            },
            {
                nameEdge:"CircEdge",
                option:{
                    cord:[
                            [50,-50],
                            [70,-30]
                        ],
                        r:20,
                }
            },
            {
                nameEdge:"LineEdge",
                option:{
                    cord:[
                            [70,-30],
                            [70,30]
                        ]
                }
            },
            {
                nameEdge:"CircEdge",
                option:{
                    cord:[
                            [70,30],
                            [50,50]
                        ],
                        r:20,
                }
            },
            {
                nameEdge:"LineEdge",
                option:{
                    cord:[
                            [50,50],
                            [-50,50]
                        ]
                }
            },
            {
                nameEdge:"CircEdge",
                option:{
                    cord:[
                            [-50,50],
                            [-70,30]
                        ],
                        r:20,
                }
            },
            {
                nameEdge:"LineEdge",
                option:{
                    cord:[
                            [-70,30],
                            [-70,-30]
                        ]
                }
            },
            {
                nameEdge:"CircEdge",
                option:{
                    cord:[
                            [-70,-30],
                            [-50,-50]
                        ],
                        r:20,
                }
            },
               
        ];
        var g = createSvgG(com);
        write_matrix(g.html,new Mt3().trans(opt.width/2,opt.height/2))
        return {
            comand : com,
            svg : g
        }
    },
    "GR01D":function(opt){
        //console.log(44,opt);
        var  com = [
            {
                nameEdge:"CircEdge",
                option:{
                    cord:[
                        [-40,0],
                        [40,0]
                    ],
                    r:40,
                    vec:0
                }
            },
            {
               nameEdge:"CircEdge",
                option:{
                    cord:[
                        [40,0],
                        [-40,-0]
                    ],
                    r:40,
                    vec:0,
                    
                }
            },   
            {
                group:{
                    0:[1]
                }
            }
        ];
        var g = createSvgG(com);
        write_matrix(g.html,new Mt3().trans(opt.width/2,opt.height/2))
        return {
            comand : com,
            svg : g
        }
    },
    "GR04#1":function(opt){
        //console.log(44,opt);
        var  com = [
            {
                nameEdge:"CircEdge",
                option:{
                    cord:[
                        [-40,0],
                        [40,0]
                    ],
                    r:40,
                    vec:0,
                    aspect:1.3
                }
            },
            {
               nameEdge:"CircEdge",
                option:{
                    cord:[
                        [40,0],
                        [-40,-0]
                    ],
                    r:40,
                    vec:0,
                    aspect:1.3
                }
            },   
            {
                group:{
                    0:[1]
                }
            }
        ];
        var g = createSvgG(com);
        write_matrix(g.html,new Mt3().trans(opt.width/2,opt.height/2))
        return {
            comand : com,
            svg : g
        }
    },
    "RC14#2":function(opt){
        //console.log(44,opt);
        var  com = [
            {
                nameEdge:"CircEdge",
                option:{
                    cord:[
                        [-40,20],
                        [40,20]
                    ],
                    r:40,
                    vec:0
                }
            },
            {
               nameEdge:"LineEdge",
                option:{
                    cord:[
                        [40,20],
                        [-40,20]
                    ]
                }
            }
        ];
        var g = createSvgG(com);
        write_matrix(g.html,new Mt3().trans(opt.width/2,opt.height/2))
        return {
            comand : com,
            svg : g
        }
    },
    "RC20":function(opt){
        //console.log(44,opt);
        var  com = [
            {
               nameEdge:"LineEdge",
                option:{
                    cord:[
                        
                        [-40,40],
                        [-40,-40]
                    ]
                }
            },
            {
                nameEdge:"CircEdge",
                option:{
                    cord:[
                        
                        [-40,-40],
                        [40,40]
                    ],
                    r:80,
                    vec:0
                }
            },
            {
               nameEdge:"LineEdge",
                option:{
                    cord:[
                        [40,40],
                        [-40,40]
                        
                    ]
                }
            },
            
                
        ];
        var g = createSvgG(com);
        write_matrix(g.html,new Mt3().trans(opt.width/2,opt.height/2))
        return {
            comand : com,
            svg : g
        }
    },
    "L62":function(opt){
        //console.log(44,opt);
        var  com = [
            {
               nameEdge:"LineEdge",
                option:{
                    cord:[
                        [-40,-40],
                        [-40,20]
                    ]
                }
            },
            {
               nameEdge:"LineEdge",
                option:{
                    cord:[
                        [-20,40],
                        [40,40]
                    ]
                }
            },
            {
                nameEdge:"CircEdge",
                option:{
                    cord:[
                        [-40,20],
                        [-20,40]
                    ],
                    r:20,
                    vec:0
                }
            },
            {
                nameEdge:"CircEdge",
                option:{
                    cord:[
                        [-40,-40],
                        [40,40]
                    ],
                    r:80,
                    vec:0
                }
            }
                
        ];
        var g = createSvgG(com);
        write_matrix(g.html,new Mt3().trans(opt.width/2,opt.height/2))
        return {
            comand : com,
            svg : g
        }
    },
};

export { createFigure };