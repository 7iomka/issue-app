import { 
    write_matrix,
    readCord,

} from "func";
import { Mt3 } from "./expan.js";
var fnMove = {
    el:{},
    fnMove:function(cord){},
    fnUp:function(cord){},
    cordOneClick:[0,0],
    boolUp:false
};


document.addEventListener('mousemove',onPointerHover,false);
document.addEventListener( "touchmove", onPointerHover, false );
document.addEventListener('mouseup',onPointerUp, false);
document.addEventListener( "touchend", onPointerUp, false );
document.addEventListener( "touchcancel", onPointerUp, false );
document.addEventListener( "touchleave", onPointerUp, false );
document.addEventListener( 'contextmenu', function(event){event.preventDefault();return false}, false );
//
//setTimeout(()=>,20);\
var fnScroll = {
    
};
var curentAsspectScroll = 1;
function onPointerHover(e){
    var dataCord = converCord(e);
    //console.log(dataCord);
    if (dataCord.twoTouch){
        //dataCord.len_point/fnMove["beginLen"]
        
        var aspect = dataCord.len_point/fnMove["beginLen"];
        //document.getElementById("info").innerHTML=aspect+"";
        var defAspect = aspect - curentAsspectScroll;
        curentAsspectScroll = aspect;
        if (fnScroll['el']) fnScroll['fn'].call(fnScroll['el'],-defAspect);
    } else  if (fnMove.boolUp ) {
        fnMove.fnMove.call(fnMove.el,dataCord);
        
       // document.getElementById("info").innerHTML="11"
    }
};
var arFunctionUp = [];
function setUpFunction(fn){
    arFunctionUp.push(fn);
};
function onPointerUp(e){
    fnMove.fnUp.call(fnMove.el,converCord(e));
    fnMove = {
        el:{},
        fnMove:function(cord){},
        fnUp:function(cord){},
        cordOneClick:[0,0],
        boolUp:false
    };
    for (var k of arFunctionUp) k();
   // console.log(resetVirtualMenu);
}


class LayBegin {
    clone(){};
    parent:object={};
    name:string="";
    children=[];
    child_name={};
    childLast={};
    eventList={};
    parN=function(n){
        var r=this.parent;
        for (var i=0;i<n-1;i++) r=r.parent;
        return r;
    };
    remove(){
        //for (var k in event) if (event[k].el===this)
        for (var i=0;i<this.parent['children'].length;i++) if (this.parent['children'][i]===this)  this.parent['children'].splice(i,1);
        for (var k in this.parent['child_name']) if (this.parent['child_name'][k]===this) delete this.parent['child_name'][k];
        if (this.parent['children'][0]) this.parent['children'][0].childLast={};
        for (var i=1;i<this.parent['children'].length;i++) this.parent['children'][i].childLast=this.parent['children'][i-1];
        while (this['html'].parentNode) this['html'].parentNode.removeChild(this['html']);
        for (var i=0;i<this.parent['children'].length;i++) this.parent['children'][i].curentIndex=i;
       // console.log(this['html'].parentNode);
    };
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
    childAr=function(ar){
        var el=this;
        for (var i=0;i<ar.length;i++) el=el.child_name[ar[i]];
        return el;
    };
    constructor(par:object){
        
        var txis=this;
        function add(el,parent,insert){
            
            if (parent.children.length>0) el.childLast=parent.children[parent.children.length-1];
            if (insert) {
                var nb=0;
                for (var i=0;i<parent.children.length;i++) if (insert===parent.children[i]) nb=i;
                parent.children.splice(nb,0,el);
            } else {
                parent.children.push(el);

            };
            el.parent=parent;
            if (par['children']) add_name(el,parent);
        };
        function add_name(el,parent) {

                if (par['name'] && !el.name) el.name=par['name'];
                if (!el.name) el.name=el.constructor['name'];
                if (parent) {
                    var nn=el.name;
                    var i=0;
                    while (parent.child_name[nn]) {
                        i+=1;
                        nn=el.name+"_"+(i);
                    };
                    el.name=nn;
                    //
                    el.curentIndex=parent.children.length;
                    parent.child_name[nn]=el;
                    //parent.children.push(el);
                    el.parent=parent;
                }
        };
        this['add']=function(el){
            
            if (!el.name) el.name=el.constructor['name'];
            add_name(el,this);
            add(el,txis,false);
            //console.log(par['name'],el.name);
            el.html['setAttribute']("data-name",el.name);
            this.html.appendChild(el.html);
        };
        var install_par={
            
            'name':function (name) {
               // txis.name=name;
               // add_name(txis,par['parent']);
                /* txis.name=name;
                if (par['parent']) {
                    var nn=name;
                    var i=0;
                    while (par['parent'].child_name[nn]) {
                        i+=1;
                        nn=name+"_"+(i);
                    };
                    par['parent'].child_name[nn]=txis;
                } */
            },
            'parent':function(parent){
                //txis.name=par['name'];
                add_name(txis,par['parent']);
                add(txis,parent,par['insert']);
                //txis['html']['setAttribute']("data-name",txis.name);
                /* if (parent.children.length>0) txis.childLast=parent.children[parent.children.length-1];
                if (par['insert']) {
                    var nb=0;
                    for (var i=0;i<parent.children.length;i++) if (par['insert']===parent.children[i]) nb=i;
                    parent.children.splice(nb,0,txis);
                } else parent.children.push(txis);
                txis.parent=parent; */
            },
            children:function(ch){
                for (var i=0;i<ch.length;i++) add(par['layer'][ch[i]],txis,false);
            },
            
            /* childrenElem:function(ch){
                for (var i=0;i<ch.length;i++) {
                    console.log({... ch[i]},txis) 
                    add(ch[i],txis,false);
                };
            } ,*/
        };
        if (!par['name']) {par['name']=this.constructor['name']} else this.name=par['name'];

        for (var k in par) if (install_par[k]) install_par[k](par[k]);
        
    };
};
class LayGroup extends LayBegin{

    constructor(par:object){
        super(par);
       
       
    }

};

class LayGroupHTML extends LayGroup{
    setPosition=function(par){
        for (var k in par) this.current_position[k]=par[k];
        var sst=['left','top','width','height'];
        for (var k in sst) if (this.current_position[sst[k]]!=undefined) {
            this.html.style[sst[k]]=this.current_position[sst[k]]+"px";
            //console.log(this.current_position[sst[k]]);
        }
        this.current_position['heightTop']=0;this.current_position['widthLeft']=0;
        if (this.current_position['top']!=undefined && this.current_position['height']!=undefined) this.current_position['heightTop']=this.current_position['top']+this.current_position['height'];
        if (this.current_position['left']!=undefined && this.current_position['width']!=undefined) this.current_position['widthLeft']=this.current_position['left']+this.current_position['width'];
    };
    html:object=document.createElement("div");
    resize=function(){
        var dv=this.html['children'];
        for (var i=0;i<dv.length;i++) if (dv[i]['ob_strukt'] && dv[i]['ob_strukt'].resize) dv[i]['ob_strukt'].resize();
    };
   /*  svgLoad=function(){
        console.log(33);
    }; */
    current_position={width:undefined,height:undefined,left:undefined,top:undefined};
    wh_parent=[];
    
    constructor(par:object){
        super(par);
        if (par['elementInsert']) {this.html=par['elementInsert'].cloneNode(true)} else
                    if (par['svg'] && par['tag']) {
                        this.html=document.createElementNS("http://www.w3.org/2000/svg",par['tag']);
                    } else if (par['tag']) {
                                this.html=document.createElement(par['tag']);
                                if (par['tag']=="svg") this.html=document.createElementNS("http://www.w3.org/2000/svg",par['tag']);
                            } else if (par['svg'] && !par['tag']) {
                                        this.html=document.createElementNS("http://www.w3.org/2000/svg",par['svg']);
                                    }
        this.html["ob_strukt"]=this;
        if ((!par['style'] || par['style']['position']!="") && !par['svg']) this.html['style'].position="absolute";
        var txis=this;
        var install_par={
            /* 'name':function(name){
                txis.html['setAttribute']("data-name",name);
            }, */
            'el_parent':function(el_parent){
                el_parent.appendChild(txis.html);
            },
            'parent':function(parent){
                if (parent['html'] && !par['el_parent']) if (par['insert']) {
                    parent['html'].insertBefore(txis.html,par['insert'].html);
                } else parent['html'].appendChild(txis.html);
            },
            'style':function(atr){
                for (var k in atr) txis.html["style"][k]=atr[k];
            },
            'attribute':function(atr){
                for (var k in atr) txis.html["setAttribute"]([k],atr[k]);
            },
            'valueResize':function(par){
                txis['valueResize']=par;
            },
            'resize':function(fn_res){
                txis['resize']=function(){
                    if (txis.parent['html']) txis['wh_parent']=[txis.parent['html'].offsetWidth,txis.parent['html'].offsetHeight];
                    fn_res.call(txis);
                    var dv=txis.html['children'];
                    for (var i=0;i<dv.length;i++) if (dv[i]['ob_strukt'] && dv[i]['ob_strukt'].resize) dv[i]['ob_strukt'].resize();

                    
                };
            },
            'children':function(ch){
                for (var i=0;i<ch.length;i++) txis.html['appendChild'](par['layer'][ch[i]].html);
            },
            "innerHTML":function(a){
                txis.html['innerHTML']=a;
            },
            appendChild:function(el){
                txis.html['appendChild'](el);
            },
            childrenElem:function(ch){

                //console.log({... this})
                //;
                for (var i=0;i<ch.length;i++) {
                    //console.log({... ch[i]},txis) 
                    this.add(ch[i],txis);
                };
            },
            down:function(objFn){
                this.html.addEventListener("mousedown",dw);
                this.html.addEventListener( "touchstart", dw );
                function dw(event){
                    var cordObj = converCord(event);
                    if (!cordObj.twoTouch) {
                        fnMove.cordOneClick = cordObj.cord.slice();
                    } else {
                        curentAsspectScroll = 1;
                        fnMove['beginLen'] =  cordObj.len_point;
                    }
                    if (objFn.fnDown) objFn.fnDown.call(txis,cordObj);
                    if (objFn.fnMove) {
                        fnMove.fnMove = objFn.fnMove;
                        fnMove.boolUp = true;
                        fnMove.el = txis;
                    };  
                    if (objFn.fnUp) {
                        fnMove.fnUp = objFn.fnUp;
                        fnMove.el = txis;
                    };
                    //event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                   // event.preventDefault();event.stopPropagation();return false;
                }
            },
            input:function(fn){
                this.html.addEventListener("input",fn);
            },
            click:function(fn){
                this.html.addEventListener("click",fn);
            },
            scroll:function(fn){
                var ob = txis.html;
                if (ob['addEventListener']) {
                    if ('onwheel' in document) {
                        // IE9+, FF17+, Ch31+
                        ob['addEventListener']("wheel", onWheel);
                    } else if ('onmousewheel' in document) {
                        // устаревший вариант события
                        ob['addEventListener']("mousewheel", onWheel);
                    } else {
                        // Firefox < 17
                        ob['addEventListener']("MozMousePixelScroll", onWheel);
                    }
                    } else { // IE8-
                        ob['attachEvent']("onmousewheel", onWheel);
                    };
                function onWheel(e){
                    e = e || window.event;
                    var delta = e.deltaY || e.detail || e.wheelDelta;
                    delta=delta/Math.abs(delta);  
                    fn.call(txis,delta*.1);

                    //console.log(e);
                };
                fnScroll = {
                    el:this,
                    fn
                }
            },
            move:function(fn){
                this.html.addEventListener("mousemove",mv);
                this.html.addEventListener("touchmove",mv);
                function mv(event){
                    fn.call(txis,event);
                    //event.preventDefault();event.stopPropagation();return false;
                }
            },
            over:function(fn){
                this.html.addEventListener("mouseover",dw);
                function dw(event){
                    fn.call(txis,event)
                    //event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                   // event.preventDefault();event.stopPropagation();return false;
                }
            },
            out:function(fn){
                this.html.addEventListener("mouseout",dw);
                function dw(event){
                    fn.call(txis,event)
                    //event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                    //event.preventDefault();event.stopPropagation();return false;
                }
            },
            up:function(fn){
                this.html.addEventListener('mouseup',up, false);
                this.html.addEventListener( "touchend", up, false );
                this.html.addEventListener( "touchcancel", up, false );
                this.html.addEventListener( "touchleave", up, false );
               // this.html.addEventListener( "mouseout", up, false );
                this.html.addEventListener( 'contextmenu', function(e){e.preventDefault ? e.preventDefault() : (e.returnValue = false);}, false );
                function up(event){
                    fn.call(txis,event);
                    event.preventDefault();event.stopPropagation();return false;
                }
            },
            scale:function(fn){
                if (this.html['addEventListener']) {
                    if ('onwheel' in document) {
                      // IE9+, FF17+, Ch31+
                      this.html['addEventListener']("wheel", onWheel);
                    } else if ('onmousewheel' in document) {
                      // устаревший вариант события
                      this.html['addEventListener']("mousewheel", onWheel);
                    } else {
                      // Firefox < 17
                      this.html['addEventListener']("MozMousePixelScroll", onWheel);
                    }
                } else { // IE8-
                    this.html['attachEvent']("onmousewheel", onWheel);
                  };
                function onWheel(e) {
                    e = e || window.event;
                    var delta = e.deltaY || e.detail || e.wheelDelta;
                    delta=delta/Math.abs(delta);
                    scl(delta);
                   // e.preventDefault();e.stopPropagation();return false;
                };
                function scl(delta){
                    fn.call(txis,delta);
                }
            },
            addEvent:function(par){
               // if (this.name=="door") console.log("addEvent",this);
                addEvent({... par,el:this});
            }
        };
        
        for (var k in par) if (install_par[k]) install_par[k].call(this,par[k]);
        //console.log(composit);
        if (par['layer']) {
            if (par['name'] && !par['layer'][par['name']]) {par['layer'][par['name']]=this} 
        };
        txis.html['setAttribute']("data-name",txis.name);
        txis['setOption'] = function(op){
            for (var k in op) if (install_par[k]) install_par[k].call(this,op[k]);
        }
        
    }
};
var layers=new LayBegin({name:"begin"});

var ob_anm=[];
function stop_anim(el){
    for (var key in ob_anm) if (ob_anm[key]===el) delete ob_anm[key];
};
var dataTik=0;
function anim(dat) {
    //el,tm
    
    var kl_el=false;
    if (dat.el) {
        for (var key in ob_anm) if (ob_anm[key]===dat.el) delete ob_anm[key];
        dat.el.st_time=dataTik;
        if (dat.time<1) dat.time=1;
        dat.el.en_time=dat.time;
        if (!dat.el.end_vp) dat.el.end_vp=function(){};
        if (!dat.el.poz_sm) dat.el.poz_sm=0; 
        ob_anm.push(dat.el);var kl=-1;
        for (var key in ob_anm) kl++;
        if (kl>0) return
    };
    
    //this.info_str(ee);
    //sv.a_cam_rend[1].a_rend();
    //if (kl_el) {requestAnimationFrame(function(){anim({})});} ;
};
var arMoveSubject=[];
function ticAnim(d){
    dataTik=d;
    for (var key in ob_anm) {
        var tm=(d-ob_anm[key].st_time)/ob_anm[key].en_time+ob_anm[key].poz_sm;
        //console.log(ob_anm[key].en_time);
        if (tm>1) {
            ob_anm[key].anim(1);var e=ob_anm[key]; delete ob_anm[key];
            e.poz_sm=0;
            e.end_vp();
            } else ob_anm[key].anim(tm);
    };
    for (var i=0;i<arMoveSubject.length;i++) arMoveSubject[i].moveTik(d);
}
function len_to_line(pr){
    var ax=pr.point[0]-pr.line[0][0];
    var ay=pr.point[1]-pr.line[0][1];
    var bx=pr.line[1][0]-pr.line[0][0];
    var by=pr.line[1][1]-pr.line[0][1];
    var ab=ax*bx+ay*by;
    var l=Math.sqrt(Math.pow(bx,2)+Math.pow(by,2));
    var kf=ab/l/l;
    //if (kf<0 || kf>1) return false;
    var cr=[pr.line[0][0]+(pr.line[1][0]-pr.line[0][0])*kf,pr.line[0][1]+(pr.line[1][1]-pr.line[0][1])*kf];
    return {cord:cr,len:Math.sqrt(Math.pow(pr.point[0]-cr[0],2)+Math.pow(pr.point[1]-cr[1],2)),lies:(kf<0 || kf>1),kf:kf,lenLine:l};
};
class LayInput extends LayGroupHTML{
    constructor (par){
        super(par);
        var txis=this;
        new LayGroupHTML({style:{position:"",display:"inline-block"},innerHTML:par.nameInput,parent:this});
        var st={position:""};
        if (par.styleInput) for (var k in par.styleInput) st[k]=par.styleInput[k];
        var inp=new LayGroupHTML({tag:"input",style:st,parent:this});
        if (par.type) {
            
            inp.html['setAttribute']("type",par.type);
        };
        if (par.sizeWidth) inp.html['style'].width=par.sizeWidth
        inp.html['onkeypress']=function(value){if (value.keyCode==13) this.blur();};
        inp.html['onblur']=function(){
            change.call(this);
        };
        inp.html['onchange']=function(){
            change.call(this);
        };
        function change(){
            par.linkValue[par.nameValue]=this.value;
            if (par.change) par.change();
        }
        inp.html['value']=par.linkValue[par.nameValue]; 
    }
};
function ajax(ur,fn){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", ur, true);
    xhr['fn']=fn;
    xhr.onreadystatechange = function() { 
      if (xhr.readyState != 4) return; 
      if (xhr.responseText && xhr.responseText!=undefined) {
          var tt=xhr.responseText;
          this['fn'](tt);
      };
    };
    xhr.send();
};
function insertStructSVG(el){
    var ar=[];
    for (var i=0;i<el.html.childNodes.length;++i) if (el.html.childNodes[i].hasAttribute && el.html.childNodes[i].hasAttribute("onload")){
        ar.push(el.html.childNodes[i]);
    };
    for (var i=0;i<ar.length;i++){
        var g=new LayGroupHTML({
            svg:true,
            parent:el,
            name:ar[i].getAttribute("onload"),
            elementInsert:ar[i]
        });
        insertStructSVG(g);
        ar[i].remove();
        
    };
};
var event={};
function addEvent(par){
    for (var k in event) if (event[k].el) {
        var el=event[k].el.html;
        while (el.parentNode) el=el.parentNode;
        if (el!==document) delete event[k];
    };
    if (!par.name) par.name="";
    if (event[par.name]) {
        var e=0;
        while (event[par.name+e+""]) e++;
    // console.log({... par},e,event[par.name+e+""]);
        par.name=par.name+e+"";
    };
    event[par.name]={};
    /* var ee=['']
    for (var k in par) if (k!=name) {
        event[par.name][k]=par[k];
    }; */
    event[par.name]=par;
    return event[par.name];
};
class ButtonSvg extends LayGroupHTML{
    
    constructor (par){
        
        par.style={position:"",display:"inline-block",cursor:"pointer"};
        par.resize=function () {
            //console.log(this);  
        };
        par.down=function(){
            this.funControl.activ();
            if (par.fnClick) par.fnClick();
        };
        super(par);
        var txis=this;
        this['funControl']={
            activ:function(){
                for (var i=0;i<txis.parent['children'].length;i++) {
                    txis.parent['children'][i].children[0].child_name['activ'].html.style.display="none";
                    //console.log(txis.parent['children'][i]);
                };
                txis.children[0].child_name['activ'].html.style.display="block";
                //console.log(txis);
            }
        };
        var ww=[par.elSvg.kor[2]-par.elSvg.kor[0],par.elSvg.kor[3]-par.elSvg.kor[1]];
        var s=new LayGroupHTML({
            tag:"svg",
            svg:true,
            attribute:{width:ww[0],height:ww[1]},
            parent:this,
            childrenElem:[
                new LayGroupHTML({
                    svg:true,
                    tag:"g",
                    elementInsert:par.elSvg,
                    resize:function () {
                        var k=readCord(this.html);
                        write_matrix(this.html,[[1,0,0],[0,1,0],[-k[0],-k[1],1]]);
                    }
                }),
                new LayGroupHTML({
                    svg:true,
                    tag:"rect",
                    name:"activ",
                    attribute:{"x":5,y:5,width:ww[0]-10,height:ww[1]-10,stroke:"#EFE135","stroke-width":"3",fill:"none","rx":12,"ry":12,opacity:.6}
                })
            ]
        });
        //this['funControl'].activ();
    };
};

function converCord(event){

    var point_=[0,0];
    var ret={
        cord:[0,0],
        button:event.button,
        len_point:0,
        twoTouch:false,
        angle:0
    };
    if (event.touches && event.touches.length > 0) {
        point_=[event.touches[0].pageX,event.touches[0].pageY];
         if (event.touches.length>1) {
            ret.len_point=Math.pow(event.touches[1].pageX-event.touches[0].pageX,2)+Math.pow(event.touches[1].pageY-event.touches[0].pageY,2);
            ret.twoTouch=true;
            ret.angle= Math.atan2(event.touches[1].pageY-event.touches[0].pageY, event.touches[1].pageX-event.touches[0].pageX);
            
         };

    } else point_=[event.pageX,event.pageY];
    
    //point_=[point_[0]-canvPar.left,point_[1]-canvPar.top];
    //ret['cord']=new THREE.Vector3(((point_[0])/ controlScene.canvasSize.width ) * 2 - 1,- ( (point_[1]) /controlScene.canvasSize.height ) * 2 + 1,0);
    ret['cord']=point_;
    
    /* event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    event.stopPropagation(); */
    return ret;

};

var lineSegmentsIntersect = (l1,l2)=> {
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
    if (!s) s=0;
    if (!t) t=0;
    return ( s >= 0 && s <= 1 && t >= 0 && t <= 1) ? [x1 + t * a_dx, y1 + t * a_dy] : false;
};

var lineSegmentsIntersectBool = (l1,l2)=> {
    //console.log('22',l1,l2);
    //x1, y1, x2, y2, x3, y3, x4, y4
    var x1= l1[0][0];var x2= l1[1][0];var y1= l1[0][1];var y2= l1[1][1];
    var x3= l2[0][0];var x4= l2[1][0];var y3= l2[0][1];var y4= l2[1][1];    
    var a_dx = x2 - x1;
    var a_dy = y2 - y1;
    var b_dx = x4 - x3;
    var b_dy = y4 - y3;
    var a = (-b_dx * a_dy + a_dx * b_dy);
    var b = (-b_dx * a_dy + a_dx * b_dy);
    var s=0;
    var t=0;
    var ret = false;
    if (a!=0 && b!=0) {
        s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / a;
        t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / b;
        if (!s) s=0;
        if (!t) t=0;
        if (s > 0 && s < 1 && t > 0 && t < 1) ret = true;
    };
    return ret;

};
function lenPoint(ar){
    return Math.sqrt(Math.pow(ar[1][0]-ar[0][0],2)+Math.pow(ar[1][1]-ar[0][1],2));
};
function angLine(crLine1,crLine2){
   // var crLine1 = [el.cord[index^1].slice(),el.cord[index].slice()];
    //var crLine2 = [el.edgeLink[index].edge.cord[el.edgeLink[index].indexPoint].slice(),el.edgeLink[index].edge.cord[el.edgeLink[index].indexPoint^1].slice()];
    var a1 =  Math.atan2(crLine1[1][1]-crLine1[0][1],crLine1[1][0]-crLine1[0][0]);
    var mt = new Mt3().trans(-crLine2[0][0],-crLine2[0][1]).rotX(-a1);
    var cr = new Mt3().trans(crLine2[1][0],crLine2[1][1]).multiply(mt).elements.slice(6,8);
    //console.log(crLine1,crLine2);
    return Math.PI - Math.atan2(cr[1],cr[0]);
};
function createD(ar){
    let d = `M${ar[0]+""} L`;
    for (let i=1;i<ar.length;++i) d+=`${ar[i]+""} `;
    return d;
};



class Loop {

    run = function(){
            return  new Promise((f,e)=>{
                    });
        };
    setFn = function(f,count){

    };
    stop = function(){};
    delay = 7;
    constructor(){
        let fn = function(i){};
        let clTime;
        let count = 0;
        let index = 0;
        let oldError = function(i){};
        let _this = this;
        this.run = function(){
            if (index) oldError({
                status:false,
                lastIndex:index-1
            });
            
            return  new Promise((f)=>{
                        //
                        oldError = f;
                        index = 0;
                        function cicl(){
                            clearTimeout(clTime);
                            clTime = setTimeout(()=>cicl(),5);
                            let stT = new Date().getTime();
                            function c(){
                                fn(index);
                                ++index;
                                if (index==count) {
                                    f({
                                        status:true
                                    }); 
                                    index = 0;
                                    clearTimeout(clTime);
                                } else 
                                if ((new Date().getTime() - stT)<_this.delay) {c()} //else console.log(_this.delay);
                            };
                            c();
                            
                        };
                        if (!count) {f({status:true});} else  cicl();

                    });
        };
        this.stop = function(){
            clearTimeout(clTime);
            oldError({
                status:false,
                lastIndex:index-1
            });
        }
        this.setFn = function(f,cn){
            fn = f;
            count = cn;

        };
        

    }
};

/* let lp = new Loop();// пример использования
function ff(index){
        let i=0;
        while (i<1e7) i++;
        console.log("------",index);
    }
lp.setFn(
    ff,
    10
);
lp.run().then(
    ()=>console.log("run","313"),
    ()=>console.log("erorr","55")
);
setTimeout(()=>{
    console.log(77);
    lp.setFn(
        ff,
        2
    );
    lp.run().then(
    ()=>console.log("run","D313"),
    ()=>console.log("erorr","D55")
);
},205); */

//console.log(l);
export {layers,LayBegin,LayGroup,LayGroupHTML,
    anim,ticAnim,stop_anim,
    len_to_line,LayInput,ajax,
    insertStructSVG,addEvent,
    event,
    ButtonSvg,
    lineSegmentsIntersect,
    lineSegmentsIntersectBool,
    lenPoint,
    setUpFunction,
    angLine,
    createD,
    Loop
};