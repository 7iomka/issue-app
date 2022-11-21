function buildD(arDecompres){
    var s="";
    for (var i=0;i<arDecompres.length;i++) {
        var e=parseFloat(arDecompres[i]);
        if (e) {s+=e+" "} else s+=arDecompres[i]+" ";
    };
    return s;
};
function zp(el,x,y) {
            
    if (!el.kor) el.kor=[x,y,x,y];
    if (x<el.kor[0]) el.kor[0]=x;
    if (y<el.kor[1]) el.kor[1]=y;
    if (x>el.kor[2]) el.kor[2]=x;
    if (y>el.kor[3]) el.kor[3]=y;
    if (el.parentNode){
        if (!el.parentNode.kor) el.parentNode.kor=[x,y,x,y];
        if (x<el.parentNode.kor[0]) el.parentNode.kor[0]=x;
        if (y<el.parentNode.kor[1]) el.parentNode.kor[1]=y;
        if (x>el.parentNode.kor[2]) el.parentNode.kor[2]=x;
        if (y>el.parentNode.kor[3]) el.parentNode.kor[3]=y;
        
    };
    el.kor[4]=el.kor[0]+(el.kor[2]-el.kor[0])/2;
    el.kor[5]=el.kor[1]+(el.kor[3]-el.kor[1])/2;
};
function buildDtoMatrix(el,mt) {
    var ar=el.getAttribute("d").split(/[ ,]/);
          var s="";
          for (var j=0;j<ar.length;j++) if (~ar[j].search(/[A-Zz]/) || !ar[j]) {s+=ar[j]+" "} else {
              var x=parseFloat(ar[j]);
              j++;
              var y=parseFloat(ar[j]);
              //var kr=proiz_matr([[1,0,0],[0,1,0],[x,y,1]],a);
              var kr=new Mt3().trans(x,y).multiply(mt);
              s+=kr.elements[6]+","+kr.elements[7]+" ";
              zp(el,kr.elements[6],kr.elements[7]);
          };
          el.setAttribute("d",s);
};

function boxMatrix(d,boxout,margin){
    margin = 0;
    var ar=d.split(/[ ,]/);
    var mt = new Mt3();
    var s="";
    var mn_mx = [];
    //console.log(d,ar)
    for (var j=0;j<ar.length;j++) if (~ar[j].search(/[A-Zz]/) || !ar[j]) {} else {
        var x=parseFloat(ar[j]);
        j++;
        var y=parseFloat(ar[j]);
        //console.log(x,y);
        if (!mn_mx.length) mn_mx=[x,y,x,y];
        mn_mx[0] = Math.min(mn_mx[0],x); mn_mx[1] = Math.min(mn_mx[1],y);
        mn_mx[2] = Math.max(mn_mx[2],x); mn_mx[3] = Math.max(mn_mx[3],y);
    };
    
    var sc = Math.min ((boxout[0]-margin*2)/(mn_mx[2]-mn_mx[0]),(boxout[1]-margin*2)/(mn_mx[3]-mn_mx[1]));
    mt.trans(-mn_mx[0]-(mn_mx[2]-mn_mx[0])/2,-mn_mx[1]-(mn_mx[3]-mn_mx[1])/2).scale(sc,sc).trans(boxout[0]/2,boxout[1]/2);
    
    for (var j=0;j<ar.length;j++) if (~ar[j].search(/[A-Zz]/) || !ar[j]) {s+=ar[j]+" "} else {
        var x=parseFloat(ar[j]);
        j++;
        var y=parseFloat(ar[j]);
        var kr=new Mt3().trans(x,y).multiply(mt);
        s+=Math.round(kr.elements[6]*1000)/1000+","+Math.round(kr.elements[7]*1000)/1000+" ";
    };

    return {d:s,mt,mn_mx};
    //el.setAttribute("d",s);
}


function substitutionPath(ob) {
    var atrib=["style","transform","fill-rule","clip-rule","fill","stroke","stroke-width","stroke-miterlimit","clip-path","fill-opacity","stroke-dasharray","stroke-linecap","dashoffset","stroke-linecap","sroke-linejoin","onload","display","opacity"];
    
    function  perenos_atrib(a,b){
        
        for (var i=0;i<atrib.length;i++) {
            if (b.hasAttribute(atrib[i])) a.setAttribute(atrib[i],b.getAttribute(atrib[i]));
        };
    };
    function parenosAttr_v_style(ob) {
        var atrib=["fill-rule","clip-rule","fill","stroke","stroke-width","stroke-miterlimit","clip-path","fill-opacity","stroke-dasharray","stroke-linecap","dashoffset","stroke-linecap","sroke-linejoin","display","opacity",""];
        for (var i=0;i<atrib.length;i++) {
            if (ob.hasAttribute(atrib[i])) {ob.style[atrib[i]]=ob.getAttribute(atrib[i]);ob.removeAttribute(atrib[i]);};
        };
    };
       
       var b=ob.getElementsByTagName("glyph");
         for (var t=0;t<b.length;t++){ 
           b[t].setAttribute("unicode",b[t].getAttribute("unicode").charCodeAt(0));
           var c=document.createElementNS('http:/'+'/www.w3.org/2000/svg',"path");
            if (b[t].hasAttribute("d")) {c.setAttribute("d",b[t].getAttribute("d"));} else c.setAttribute("d","M0,0 L0,0");
            c.setAttribute("unicode",b[t].getAttribute("unicode"));
            c.setAttribute("horiz-adv-x",b[t].getAttribute("horiz-adv-x"));
            b[t].parentNode.insertBefore(c,b[t]);
         };
     while (b.length>0) {b[0].parentNode.removeChild(b[0]);b=ob.getElementsByTagName("glyph");}
     
        var b=ob.getElementsByTagName("defs");
         for (var t=0;t<b.length;t++){ 
          
            var c=document.createElementNS('http:/'+'/www.w3.org/2000/svg',"g");
            c.innerHTML=b[t].innerHTML;
           // c.setAttribute("display","none");
            b[t].parentNode.insertBefore(c,b[t]);
         };
     while (b.length>0) {b[0].parentNode.removeChild(b[0]);b=ob.getElementsByTagName("defs");}
     
      var b=ob.getElementsByTagName("line");
         for (var t=0;t<b.length;t++){ 
             var c=document.createElementNS('http:/'+'/www.w3.org/2000/svg',"path"); 
             var x1=parseFloat(b[t].getAttribute("x1"));
             var y1=parseFloat(b[t].getAttribute("y1"));
             var x2=parseFloat(b[t].getAttribute("x2"));
             var y2=parseFloat(b[t].getAttribute("y2")); 
             var t1="M"+" "+x1+","+y1+" "+"L"+" "+x2+","+y2;
             c.setAttribute("d",t1);
             perenos_atrib(c,b[t]);
             b[t].parentNode.insertBefore(c,b[t]);	 
         };
      while (b.length>0) {b[0].parentNode.removeChild(b[0]);b=ob.getElementsByTagName("line");}
      
      var b=ob.getElementsByTagName("rect");
         for (var t=0;t<b.length;t++){ 
             var c=document.createElementNS('http:/'+'/www.w3.org/2000/svg',"path"); 
             var x1=0;
             var y1=0;
             if (b[t].hasAttribute("x")) var x1=parseFloat(b[t].getAttribute("x"));
             if (b[t].hasAttribute("y")) var y1=parseFloat(b[t].getAttribute("y"));
             var x2=x1+parseFloat(b[t].getAttribute("width"));
             var y2=y1+parseFloat(b[t].getAttribute("height")); 
             var t1="M"+" "+x1+","+y1+" "+"L"+" "+x2+","+y1+" "+"L"+" "+x2+","+y2+" "+"L"+" "+x1+","+y2+" "+"z";
             if (b[t].hasAttribute("rx")) {
                   var rx=parseFloat(b[t].getAttribute("rx"));
                   var ry=rx;
                   if (b[t].hasAttribute("ry")) ry=parseFloat(b[t].getAttribute("ry"));
                   t1="M"+" "+x1+","+(y1+ry)+" "+"S"+" "+(x1)+","+(y1)+" "+(x1+rx)+","+(y1)+"L"+" "+(x2-rx)+","+y1+"S"+" "+(x2)+","+(y1)+" "+(x2)+","+(y1+ry)+"L"+" "+(x2)+","+(y2-ry)+"S"+" "+(x2)+","+(y2)+" "+(x2-rx)+","+(y2)+"L"+" "+(x1+rx)+","+y2+" "+"S"+" "+(x1)+","+(y2)+" "+(x1)+","+(y2-ry)+" "+"z";
                 };
             c.setAttribute("d",t1);
             perenos_atrib(c,b[t]);
             b[t].parentNode.insertBefore(c,b[t]);	 
         };
       while (b.length>0) {b[0].parentNode.removeChild(b[0]);b=ob.getElementsByTagName("rect");}
       
       var b=ob.getElementsByTagName("circle");
         for (var t=0;t<b.length;t++){ 
             var c=document.createElementNS('http:/'+'/www.w3.org/2000/svg',"path"); 
             perenos_atrib(c,b[t]);
             var x=parseFloat(b[t].getAttribute("cx"));
             var y=parseFloat(b[t].getAttribute("cy"));
             var rr=parseFloat(b[t].getAttribute("r"));
             var t1="M"+" "+(x-rr)+","+y+"S"+" "+(x-rr)+","+(y-rr)+" "+(x)+","+(y-rr)+"L"+" "+(x)+","+(y-rr)+"S"+" "+(x+rr)+","+(y-rr)+" "+(x+rr)+","+(y)+"L"+" "+(x+rr)+","+(y)+"S"+" "+(x+rr)+","+(y+rr)+" "+(x)+","+(y+rr)+"L"+" "+(x)+","+(y+rr)+"S"+" "+(x-rr)+","+(y+rr)+" "+(x-rr)+","+(y)+"z";
             c.setAttribute("d",t1);
             b[t].parentNode.insertBefore(c,b[t]);
            };
       while (b.length>0) {b[0].parentNode.removeChild(b[0]);b=ob.getElementsByTagName("circle");}
    
       var b=ob.getElementsByTagName("ellipse");
         for (var t=0;t<b.length;t++){ 
             var c=document.createElementNS('http:/'+'/www.w3.org/2000/svg',"path"); 
             perenos_atrib(c,b[t]);
             var x=parseFloat(b[t].getAttribute("cx"));
             var y=parseFloat(b[t].getAttribute("cy"));
             var rx=parseFloat(b[t].getAttribute("rx"));
             var ry=parseFloat(b[t].getAttribute("ry"));
             var t1="M"+" "+(x-rx).toFixed(3)+","+y.toFixed(3)+" "+"S"+" "+(x-rx).toFixed(3)+","+(y-ry).toFixed(3)+" "+(x).toFixed(3)+","+(y-ry).toFixed(3)+" "+"L"+" "+(x).toFixed(3)+","+(y-ry).toFixed(3)+" "+"S"+" "+(x+rx).toFixed(3)+","+(y-ry).toFixed(3)+" "+(x+rx).toFixed(3)+","+(y).toFixed(3)+" "+"L"+" "+(x+rx).toFixed(3)+","+(y).toFixed(3)+" "+"S"+" "+(x+rx).toFixed(3)+","+(y+ry).toFixed(3)+" "+(x).toFixed(3)+","+(y+ry).toFixed(3)+" "+"L"+" "+(x).toFixed(3)+","+(y+ry).toFixed(3)+" "+"S"+" "+(x-rx).toFixed(3)+","+(y+ry).toFixed(3)+" "+(x-rx).toFixed(3)+","+(y).toFixed(3)+" z";
             //alert(t1);
             c.setAttribute("d",t1);
             b[t].parentNode.insertBefore(c,b[t]);
            };	 
         while (b.length>0) {b[0].parentNode.removeChild(b[0]);b=ob.getElementsByTagName("ellipse");}
         
          var b=ob.getElementsByTagName("polygon");
         for (var t=0;t<b.length;t++){ 
             var c=document.createElementNS('http:/'+'/www.w3.org/2000/svg',"path"); 
             if (b[t].id) {
                 c.id=b[t].id;
             };
             perenos_atrib(c,b[t]);
             var point=b[t].getAttribute("points").split(" ");
             for (var i=0;i<point.length;i++) if (!point[i]) point.splice(i,1);
             for (var i=0;i<point.length;i++) {
                 zp(c,parseFloat(point[i].split(",")[0]),parseFloat(point[i].split(",")[1]));
             };
            
             point[0]="M "+point[0];
             point[1]="L "+point[1];
             
             point.push("z");
             c.setAttribute("d",point.join(" "));
              b[t].parentNode.insertBefore(c,b[t]);
         };
          while (b.length>0) {b[0].parentNode.removeChild(b[0]);b=ob.getElementsByTagName("polygon");}
          
          var b=ob.getElementsByTagName("polyline");
         for (var t=0;t<b.length;t++){ 
             var c=document.createElementNS('http:/'+'/www.w3.org/2000/svg',"path"); 
             perenos_atrib(c,b[t]);
             var point=b[t].getAttribute("points").split(" ");
             for (var i=0;i<point.length;i++) if (!point[i]) point.splice(i,1);
             for (var i=0;i<point.length;i++) zp(c,parseFloat(point[i].split(",")[0]),parseFloat(point[i].split(",")[1]));
             point[0]="M "+point[0];
             point[1]="L "+point[1];
             
             c.setAttribute("d",point.join(" "));
              b[t].parentNode.insertBefore(c,b[t]);
         };
          while (b.length>0) {b[0].parentNode.removeChild(b[0]);b=ob.getElementsByTagName("polyline");}
         
         function new_kor(kor,matr) {
             var k=proiz_matr([[1,0,0],[0,1,0],[kor[0],kor[1],1]],matr);
             return [k[2][0],k[2][1]];
             
         };
        
         var b=ob.getElementsByTagName("path");
         for (var t=0;t<b.length;t++){
             
        //  if (b[t].hasAttribute("onload") && ~b[t].getAttribute("onload").indexOf("this.napravl=true")) b[t].napravl=true;
          var c=b[t].getAttribute("d");
          var res=[];
          var j=0;
          res[j]="";
          for (var i=0;i<c.length;i++) {
             var r=c[i];
              if (r=="-") {j++;res[j]=""};
              if (!parseInt(r) && (r!="0") && (r!=".")  && (r!="-") ) {j++; res[j]=r; j++;res[j]=""} else{
                 res[j]+=r; 
              };
          };
          for (i=0;i<res.length;i++) if ((res[i]==",") || (res[i]=="") || (res[i]==" ") || (res[i].charCodeAt(0)==9) || (res[i].charCodeAt(0)==10)) {
               for (j=i;j<res.length-1;j++) res[j]=res[j+1];
               res.length--;
               i--;
              };
          
          var tek_x=0;
          var tek_y=0;	
          if (b[t].napravl) b[t].tohki=[];
          for (i=0;i<res.length;i++) {
              if (res[i]=="M") {tek_x=parseFloat(res[i+1]);tek_y=parseFloat(res[i+2]);zp(b[t],tek_x,tek_y);};
              if (res[i]=="m") {tek_x+=parseFloat(res[i+1]);res[i+1]=tek_x;tek_y+=parseFloat(res[i+2]);res[i+2]=tek_y;res[i]="M";zp(b[t],tek_x,tek_y);};
              if (res[i]=="C") {tek_x=parseFloat(res[i+5]);tek_y=parseFloat(res[i+6]);i=i+6;zp(b[t],tek_x,tek_y);;};
              if (res[i]=="c") {
                   res[i+1]=Math.round((parseFloat(res[i+1])+tek_x)*100)/100;
                   res[i+2]=Math.round((parseFloat(res[i+2])+tek_y)*100)/100;
                   res[i+3]=Math.round((parseFloat(res[i+3])+tek_x)*100)/100;
                   res[i+4]=Math.round((parseFloat(res[i+4])+tek_y)*100)/100;
                   res[i+5]=Math.round((parseFloat(res[i+5])+tek_x)*100)/100;
                   res[i+6]=Math.round((parseFloat(res[i+6])+tek_y)*100)/100;
                   tek_x=res[i+5];
                   tek_y=res[i+6];
                   for (var j=0;j<3;j++) zp(b[t],res[i+j*2+1],res[i+j*2+2]);
                   res[i]="C";
                   i=i+6;
                  };
             if (res[i]=="S") {tek_x=parseFloat(res[i+3]);tek_y=parseFloat(res[i+4]);i=i+4;zp(b[t],tek_x,tek_y);;};
             if (res[i]=="Q") {tek_x=parseFloat(res[i+3]);tek_y=parseFloat(res[i+4]);i=i+4;zp(b[t],tek_x,tek_y);;};	
             if (res[i]=="s") {
                   res[i+1]=Math.round((parseFloat(res[i+1])+tek_x)*100)/100;
                   res[i+2]=Math.round((parseFloat(res[i+2])+tek_y)*100)/100;
                   res[i+3]=Math.round((parseFloat(res[i+3])+tek_x)*100)/100;
                   res[i+4]=Math.round((parseFloat(res[i+4])+tek_y)*100)/100;
                   tek_x=res[i+3];
                   tek_y=res[i+4];
                   for (var j=0;j<2;j++) zp(b[t],res[i+j*2+1],res[i+j*2+2]);
                   res[i]="S";
                   i=i+4;
                  };  
              if (res[i]=="q") {
                   res[i+1]=Math.round((parseFloat(res[i+1])+tek_x)*100)/100;
                   res[i+2]=Math.round((parseFloat(res[i+2])+tek_y)*100)/100;
                   res[i+3]=Math.round((parseFloat(res[i+3])+tek_x)*100)/100;
                   res[i+4]=Math.round((parseFloat(res[i+4])+tek_y)*100)/100;
                   for (var j=0;j<2;j++) zp(b[t],res[i+j*2+1],res[i+j*2+2]);
                   tek_x=res[i+3];
                   tek_y=res[i+4];
                   res[i]="Q";
                   i=i+4;
                  }; 	  
                  
             if (res[i]=="L") {tek_x=Math.round(parseFloat(res[i+1])*100)/100;tek_y=Math.round(parseFloat(res[i+2])*100)/100;i=i+2;zp(b[t],tek_x,tek_y);;};
    
             if (res[i]=="l") {
                   res[i+1]=Math.round((parseFloat(res[i+1])+tek_x)*100)/100;
                   res[i+2]=Math.round((parseFloat(res[i+2])+tek_y)*100)/100;
                   tek_x=res[i+1];
                   tek_y=res[i+2];
                   zp(b[t],tek_x,tek_y);
                   res[i]="L";
                   i=i+2;
                  };
              if (res[i]=="H") {tek_x=parseFloat(res[i+1]);res[i]="L"; for (var j=res.length;j>i+2;j--) res[j]=res[j-1];res[i+2]=tek_y;};  
              if (res[i]=="V") {tek_y=parseFloat(res[i+1]);res[i]="L"; for (var j=res.length;j>i+1;j--) res[j]=res[j-1];res[i+1]=tek_x;}; 
              if (res[i]=="h") {tek_x+=parseFloat(res[i+1]);res[i+1]=tek_x;res[i]="L"; for (var j=res.length;j>i+2;j--) res[j]=res[j-1];res[i+2]=tek_y;};
              if (res[i]=="v") {tek_y+=parseFloat(res[i+1]);res[i+1]=tek_y;res[i]="L"; for (var j=res.length;j>i+1;j--) res[j]=res[j-1];res[i+1]=tek_x;};
              zp(b[t],tek_x,tek_y);   
            };	
            var x=0;
            var y=0;
            var step=0;
            if (b[t].napravl) for (i=0;i<res.length;i++) {
                if (res[i]=="M") {i++;x=0;y=1;step=1};
                if (res[i]=="L") {i++;x=0;y=1;step=1};
                if (res[i]=="C") {i++;x=4;y=5;step=5};
                if (res[i]=="S" || res[i]=="Q") {i++;x=2;y=3;step=3};
                b[t].tohki.push([res[i+x],res[i+y]]);i+=step;
            }
        //b[t].setAttribute("decomposedD",res.slice()+"");
        /* var s="";
        for (var i=0;i<res.length;i++) {
            var e=parseFloat(res[i]);
            if (e) {s+=e+" "} else s+=res[i]+" ";
        }; */
        //console.log(b[t]);
        if (b[t].napravl) {
            for (var j=0;j<atrib.length;j++) if (b[t].style[atrib[j]]) b[t].style[atrib[j]]="";
            for (var j=0;j<b[t].tohki.length-1;j++) {
                if (j==0) {i=0;} else {i=b[t].tohki[j-1][2]};
                var tt=true;
                while (i<b[t].getTotalLength() && tt) {
                      if (Math.round(b[t].getPointAtLength(i).x)==Math.round(b[t].tohki[j][0])) {b[t].tohki[j][2]=i;tt=false;}
                      i++;
                };
            };
            b[t].tohki[b[t].tohki.length-1][2]=b[t].getTotalLength();
            for (var j=1;j<b[t].tohki.length;j++) {
                b[t].tohki[j-1][3]=(b[t].tohki[j][2]-b[t].tohki[j-1][2])/(b[t].tohki[j][0]-b[t].tohki[j-1][0]);
                //alert(b[t].tohki[j-1][3]+"  "+(b[t].tohki[j][2]));
                b[t].tohki[j-1][0]=(b[t].tohki[j-1][0]-b[t].kor[0])/(b[t].kor[2]-b[t].kor[0]);
                
            };
            var ss="";
            for (var j=0;j<b[t].tohki.length-1;j++) {
                
                ss+=Math.round(b[t].tohki[j][0]*1000)/1000+","+Math.round(b[t].tohki[j][3]*1000)/1000+","+Math.round(b[t].tohki[j][2])+" ";
            };
            if (ss) b[t].setAttribute("date-kof",ss);
        };
        
        b[t].setAttribute("d",buildD(res));
        

        parenosAttr_v_style(b[t]);
        buildDtoMatrix(b[t],new Mt3());

        //console.log(b[t]);
      };
      
       
      //var el=ob.getElementsByTagName("g"); for (var j=0;j<el.length;j++) el[j].kor="";
      
      var gr=[];
      
      var el=ob.getElementsByTagName("radialGradient");
      for (var i=0;i<el.length;i++) gr.push(el[i]);
      /*var el=ob.getElementsByTagName("linearGradient");
      for (var i=0;i<el.length;i++) gr.push(el[i]);*/
      for (var i=0;i<gr.length;i++) {
          //var a=[[1,0,0],[0,1,0],[0,0,1]];
          ee=gr[i].parentNode;
          while (ee)  {
               //a=proiz_matr(a,read_matrix(ee,"transform"));
               ee=ee.parentNode;
          };
      };
      var el=ob.getElementsByTagName("path");
    
                
                    
      for (var i=0;i<el.length;i++) {
          
          //el[i].kor="";
          //var a=[[1,0,0],[0,1,0],[0,0,1]];
          var ee=el[i];
        
          /* while (ee)  {
               //var a=proiz_matr(a,read_matrix(ee,"transform"));
                
               ee=ee.parentNode;
                    
          }; 
    
          
          var ar=el[i].getAttribute("d").split(/[ ,]/);
          var s="";
          for (var j=0;j<ar.length;j++) if (~ar[j].search(/[A-Zz]/) || !ar[j]) {s+=ar[j]+" "} else {
              var x=parseFloat(ar[j]);
              j++;
              var y=parseFloat(ar[j]);
              var kr=proiz_matr([[1,0,0],[0,1,0],[x,y,1]],a);
              s+=kr[2][0]+","+kr[2][1]+" ";
              zp(el[i],kr[2][0],kr[2][1]);
          };
          el[i].setAttribute("d",s);*/
      };
      var el=ob.getElementsByTagName("g");
        for (var j=0;j<el.length;j++) {
             for (var i=0;i<el.length;i++) if (el[i].kor) { 
                zp(el[i].parentNode,el[i].kor[0],el[i].kor[1]);
                zp(el[i].parentNode,el[i].kor[2],el[i].kor[3]);
             };
            
        };
      var el=ob.getElementsByTagName("g");
      for (var i=0;i<el.length;i++) {
          if (el[i].hasAttribute("transform")) el[i].removeAttribute("transform")
          el[i].setAttribute("kor",el[i].kor);
          /* if (el[i].hasAttribute("onload")) {
                //el[i].vipol=function(){eval (this.getAttribute("onload"))};
                eval("el[i].intrface="+el[i].getAttribute("onload"));
                //el[i].vipol();
              //el[i].setAttribute("vipol",el[i].getAttribute("onload"));
              el[i].removeAttribute("onload")
              
            }; */
          if (el[i].id) el[i].removeAttribute("id");
      };
      var el=ob.getElementsByTagName("g");
      var ud=[];
      
      
       for (var i=0;i<ud.length;i++) ud[i].parentNode.removeChild(ud[i]);
       
      var el=ob.getElementsByTagName("path");
       for (var i=0;i<el.length;i++) {
          //  console.log(el[i]);
          //el[i].setAttribute("kor",el[i].kor);
          if (el[i].style["stroke-miterlimit"]) el[i].style["stroke-miterlimit"]="";
          if (el[i].style["fill"]=="none" && (!el[i].parentNode.style["fill"] || el[i].parentNode.style["fill"]=="none")) {
              el[i].style["fill"]="";
              el[i].parentNode.style["fill"]="none";
            
          };
          //if (el[i].hasAttribute("onload")) {el[i].setAttribute("vipol",el[i].getAttribute("onload"));el[i].removeAttribute("onload")};
           
      };
      
      return ob;
    };

function read_matrix(el){
    var type="transform";
    var mt="";
    try {
        if (el && el.hasAttribute(type) && ~el.getAttribute(type).indexOf("matrix"))  mt=el.getAttribute(type);
        if (el.style && el.style[type]) mt=el.style[type];
    } catch (e) {};
    
    if (!mt) {return new Mt3()};
    var r=mt.split("(")[1];
    if (~r.indexOf(",")) {r=r.split(",")} else r=r.split(" ");
    for (var i=0;i<r.length;i++) r[i]=parseFloat(r[i]);
    //var s=[[r[0],r[1],0],[r[2],r[3],0],[r[4],r[5],1]];
    var m=new Mt3();
    m.elements[0]=r[0];
    m.elements[1]=r[1];
    m.elements[3]=r[2];
    m.elements[4]=r[3];
    m.elements[6]=r[4];
    m.elements[7]=r[5];
    return m;
    };
    
function write_matrix(el,a) { 
var type="transform";
var s="matrix("+a.elements[0]+","+a.elements[1]+","+a.elements[3]+","+a.elements[4]+","+a.elements[6]+","+a.elements[7]+")";
el.setAttribute(type,s);;

};

function multiplyMatrices( a, b ) {

var ae = a.elements;
var be = b.elements;
var te = [];

var a11 = ae[ 0 ], a12 = ae[ 3 ], a13 = ae[ 6 ];
var a21 = ae[ 1 ], a22 = ae[ 4 ], a23 = ae[ 7 ];
var a31 = ae[ 2 ], a32 = ae[ 5 ], a33 = ae[ 8 ];

var b11 = be[ 0 ], b12 = be[ 3 ], b13 = be[ 6 ];
var b21 = be[ 1 ], b22 = be[ 4 ], b23 = be[ 7 ];
var b31 = be[ 2 ], b32 = be[ 5 ], b33 = be[ 8 ];

te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
te[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
te[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;

te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
te[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
te[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;

te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
te[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
te[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;

return te;

}

class Mt3 {
    elements=[
        1,0,0,
        0,1,0,
        0,0,1
        ];
    multiply=function (mt) {
        this.elements=multiplyMatrices(mt,this);
        return this;
    };
    rotX=function(ang){
        var s=Math.sin(ang);
        var c=Math.cos(ang);
        var m=new Mt3();
        m.elements[0]=c;
        m.elements[1]=s;
        m.elements[3]=-s;
        m.elements[4]=c;
        this.multiply(m);
        return this;
    };
    trans=function (a,b) {
        this.elements[6]+=a;
        this.elements[7]+=b;
        return this;
    };
    transAr = function (ar){
        this.elements[6]+=ar[0];
        this.elements[7]+=ar[1];
        return this;
    };
    scale=function (a,b){
        var m=new Mt3();
        m.elements[0]=a;
        m.elements[4]=b;
        this.elements=multiplyMatrices(m,this);
        return this;
    };
    scl=function(sc){
        return this.scale(sc,sc);

    }
    clone=function () {
        var m=new Mt3();
        m.elements=this.elements.slice();
        return this;
    };
    constructor() { 
    }
};

function createProgram(gl, vertSh, fragSh) {
function createShader(gl, type, source) {
    var shader = gl.createShader(type);   // создание шейдера
    gl.shaderSource(shader, source);      // устанавливаем шейдеру его программный код
    gl.compileShader(shader);             // компилируем шейдер
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {                        // если компиляция прошла успешно - возвращаем шейдер
    return shader;
    }
    
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
};
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertSh);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragSh);
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
var success = gl.getProgramParameter(program, gl.LINK_STATUS);
if (success) {
    return program;
}

console.log(gl.getProgramInfoLog(program));
gl.deleteProgram(program);
};


function expanMatrix(m) {
m.multiply=function (b) {
    var a=this;
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    var m=[
        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
    expanMatrix(m);
    return m;
    
};
m.clone=function () {
    var a=[];
    for (var i=0;i<16;i++) a[i]=this[i];
    expanMatrix(a);
    return a;
};
m.read=function () {
    var a=[];
    for (var i=0;i<16;i++) a[i]=this[i];
    return a;
};
m.trans=function(tx, ty, tz) {
    var a= [
        1,  0,  0,  0,
        0,  1,  0,  0,
        0,  0,  1,  0,
        tx, ty, tz, 1,
    ];
    return this.multiply(a);
};
m.scale=function(s1,s2, s3) {
    var a= [
        s1,  0,  0,  0,
        0,  s2,  0,  0,
        0,  0,  s3,  0,
        0, 0, 0, 1,
    ];
    return this.multiply(a);
};
m.scl=function (sc) {
    return this.scale(sc,sc,sc);
    
};
m.rotX=function (ang) {
    var c = Math.cos(ang);
    var s = Math.sin(ang);

    var a=[
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1,
    ];
    return this.multiply(a);
    
};
m.rotY=function (ang) {
    var c = Math.cos(ang);
    var s = Math.sin(ang);

    var a=[
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1,
    ];
    return this.multiply(a);
    
};
m.rotZ=function (ang) {
    var c = Math.cos(ang);
    var s = Math.sin(ang);

    var a=[
        c, s, 0, 0,
        -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
    return this.multiply(a);
    
};  
}
var mt4=function () {
var mt=[
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
];
expanMatrix(mt)
return mt; 
};

function triangleS(a,b,c){
	return ((b[0]-a[0])*(c[1]-a[1]) - (b[1]-a[1])*(c[0]-a[0])) * .5;
}
var lineSegmentsIntersect = (l1,l2,zero)=> {
    //console.log('22',l1,l2);
    //x1, y1, x2, y2, x3, y3, x4, y4
    var x1=l1[0][0];var x2=l1[1][0];var y1=l1[0][1];var y2=l1[1][1];
    var x3=l2[0][0];var x4=l2[1][0];var y3=l2[0][1];var y4=l2[1][1];

    var a_dx = x2 - x1;
    var a_dy = y2 - y1;
    var b_dx = x4 - x3;
    var b_dy = y4 - y3;
     var s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
    var t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
    if (zero ) {
        return (s >= 0 && s <= 1 && t >= 0 && t <= 1) ? [x1 + t * a_dx, y1 + t * a_dy] : false;
    } else return (s > 0 && s < 1 && t > 0 && t < 1) ? [x1 + t * a_dx, y1 + t * a_dy] : false;
};

function read_cord(e){
    var k = e.getAttribute("kor").split(",");
    for (var i=0;i<k.length;i++) k[i] = parseFloat(k[i]);
    return {
        x:k[0],
        y:k[1],
        width:k[2]-k[0],
        height:k[3]-k[1]
    };
};
function cosVect(line1,line2){
    //console.log(line1,line2)
    var d = [line2[0][0] - line1[1][0],line2[0][1] - line1[1][1]];
    
    var point = [
        line1[0].slice(),
        line1[1].slice(),
        [line2[1][0]-d[0],line2[1][1]-d[1]]
    ];
    
    var p = (point[0][0] - point[1][0]) * (point[2][0] - point[1][0]) +  (point[0][1] - point[1][1]) * (point[2][1] - point[1][1]);
    var l = Math.sqrt(Math.pow(point[0][0] - point[1][0],2)+Math.pow(point[0][1] - point[1][1],2)) * Math.sqrt(Math.pow(point[2][0] - point[1][0],2)+Math.pow(point[2][1] - point[1][1],2));
    //console.log(p)
    var r = p/l;
   // console.log(r);
    if (r<-1) r = -1;
    if (r>1) r = 1;
   // console.log(r);
    return r;
}; 
export {
    substitutionPath, 
    buildDtoMatrix, 
    Mt3, 
    write_matrix, 
    read_matrix,  
    boxMatrix, 
    triangleS, 
    lineSegmentsIntersect, 
    read_cord,
    cosVect
};