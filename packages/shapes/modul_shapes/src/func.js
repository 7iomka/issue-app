function substitutionPath(ob) {//функция меняет всё приличное на path и определяет крайние координаты
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
	var s="";
	for (var i=0;i<res.length;i++) {
		var e=parseFloat(res[i]);
		if (e) {s+=Math.round(e*100)/100+" "} else s+=res[i]+" ";
	};
	
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
	
	b[t].setAttribute("d",s);
	parenosAttr_v_style(b[t]);
  };
  
  /*var el=ob.getElementsByTagName("path");
  var ud=[];
  
  for (var i=0;i<el.length;i++)  if (el[i].hasAttribute("onload")) {
	   el[i].vipol=function(){eval (this.getAttribute("onload"))};
	  el[i].vipol();
	  if (el[i].sm) {
		 // alert(el[i].kor);
		  ud.push(el[i]);
		  var a=func.proiz_matr(func.read_matrix(el[i].parentNode,"transform"),[[1,0,0],[0,1,0],[-el[i].kor[0],-el[i].kor[1],1]]);
		  func.write_matrix(el[i].parentNode,"transform",a);
		  

	  };
   };
   for (var i=0;i<ud.length;i++) ud[i].parentNode.removeChild(ud[i]);*/
   
  var el=ob.getElementsByTagName("g"); for (var j=0;j<el.length;j++) el[j].kor="";
  
  var gr=[];
  
  var el=ob.getElementsByTagName("radialGradient");
  for (var i=0;i<el.length;i++) gr.push(el[i]);
  /*var el=ob.getElementsByTagName("linearGradient");
  for (var i=0;i<el.length;i++) gr.push(el[i]);*/
  for (var i=0;i<gr.length;i++) {
	  var a=[[1,0,0],[0,1,0],[0,0,1]];
	  ee=gr[i].parentNode;
	  while (ee)  {
		   a=proiz_matr(a,read_matrix(ee,"transform"));
	       ee=ee.parentNode;
	  };
	// func.write_matrix(gr[i],"transform",a);
	 // gr[i].setAttribute("cx",parseFloat(gr[i].getAttribute("cx"))+a[2][0]);
     // gr[i].setAttribute("cy",parseFloat(gr[i].getAttribute("cy"))-a[2][1]);
  };
  var el=ob.getElementsByTagName("path");

            
				
  for (var i=0;i<el.length;i++) {
	  
	  el[i].kor="";
	  var a=[[1,0,0],[0,1,0],[0,0,1]];
	  var ee=el[i];
	
	  while (ee)  {
		   var a=proiz_matr(a,read_matrix(ee,"transform"));
		    
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
	  el[i].setAttribute("d",s);
  };
  var el=ob.getElementsByTagName("g");
	for (var j=0;j<el.length;j++) {
		 write_matrix(el[j],[[1,0,0],[0,1,0],[0,0,1]]);
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
			el[i].vipol=function(){eval (this.getAttribute("onload"))};
			el[i].vipol();
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
	  el[i].setAttribute("kor",el[i].kor);
	  if (el[i].style["stroke-miterlimit"]) el[i].style["stroke-miterlimit"]="";
	  if (el[i].style["fill"]=="none" && (!el[i].parentNode.style["fill"] || el[i].parentNode.style["fill"]=="none")) {
		  el[i].style["fill"]="";
		  el[i].parentNode.style["fill"]="none";
		
	  };
	  //if (el[i].hasAttribute("onload")) {el[i].setAttribute("vipol",el[i].getAttribute("onload"));el[i].removeAttribute("onload")};
	   
  };
  
  return ob;
};
function proiz_matr(matr_a,matr_b){
    if (matr_a.length==3) {var c=[[0,0,0],[0,0,0],[0,0,0]]} else var c=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    for (var k=0;k<matr_b.length;k++)  for (var j=0;j<matr_b[0].length;j++)  for (var i=0;i<matr_a[0].length;i++) c[j][k]+=matr_a[j][i]*matr_b[i][k];
    return c;
  };
  function write_matrix(el,a) { 
    var type="transform";
    for (var i=0;i<a.length;i++) for (var j=0;j<a[i].length;j++) if (a[i][j]!=parseFloat(a[i][j])) console.log('Ошибка записи простой матрицы '+a);
    var s="matrix("+a[0][0]+","+a[0][1]+","+a[1][0]+","+a[1][1]+","+a[2][0]+","+a[2][1]+")";
    el.setAttribute(type,s);;
    
};
  function read_matrix(el){
    var type="transform";
    var mt="";
    try {
        if (el && el.hasAttribute(type))  mt=el.getAttribute(type);
        if (el.style && el.style[type]) mt=el.style[type];
    } catch (e) {};
    if (!mt) {var s=[[1,0,0],[0,1,0],[0,0,1]];el.beg_mt=s;return s};
    var r=mt.split("(")[1];
    if (~r.indexOf(",")) {r=r.split(",")} else r=r.split(" ");
    for (var i=0;i<r.length;i++) r[i]=parseFloat(r[i]);
    var s=[[r[0],r[1],0],[r[2],r[3],0],[r[4],r[5],1]];
    if (!el.beg_mt) el.beg_mt=s;
    return s;
};
function ajax(ur,fn){
    function getXmlHttp(){
      var xmlhttp;
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
          xmlhttp = false;
        }
      }
      if (!xmlhttp && typeof XMLHttpRequest!="undefined") {
        xmlhttp = new XMLHttpRequest();
      }
      return xmlhttp;
    };
    var xhr = new getXmlHttp();
    xhr.open("GET", ur, true);
    xhr.fn=fn;
    xhr.onreadystatechange = function() { 
      if (xhr.readyState != 4) return; 
      if (xhr.responseText && xhr.responseText!=undefined) {
          var tt=xhr.responseText;
          this.fn(tt);
      } ;
    };
    xhr.send();
};
function svg_scale(ob){
    var StapWheel=0.1;
    var minScale=.1;
    var maxScale=1;
    document.addEventListener('mouseup',onPointerUp, false);
    document.addEventListener( "touchend", onPointerUp, false );
    document.addEventListener( "touchcancel", onPointerUp, false );
    document.addEventListener( "touchleave", onPointerUp, false );
    document.addEventListener('mousemove',onPointerHover,false);
	document.addEventListener( "touchmove", onPointerHover, false );
	//ob.addEventListener('mouseout',onPointerUp,false);
    function onPointerHover(event){
        if (window.kr_zj && window.kr_zj.kr) {
            if (event.touches) {
                    var point_=[event.touches[0].pageX,event.touches[0].pageY];
                    if (event.touches.length>1) {
                        var len_sc=Math.sqrt(Math.pow(event.touches[1].pageX-event.touches[0].pageX,2)+Math.pow(event.touches[1].pageY-event.touches[0].pageY,2));
                        var ot=window.kr_zj.ob.len_sc/len_sc;
                        window.kr_zj.ob.len_sc=len_sc;
                        window.kr_zj.ob.tek_zn*=ot;
                        window.kr_zj.ob.scale();
                    };
                } else var point_=[event.pageX,event.pageY];
            if (!window.kr_zj.ob.shipok) {window.kr_zj.ob.sm=[point_[0]-window.kr_zj.kr[0],point_[1]-window.kr_zj.kr[1]];
            window.kr_zj.ob.scale();}
        }
    };
    function onPointerUp(event){
        if (event.touches && event.touches.length==0) window.kr_zj.ob.shipok=false;
        if (window.kr_zj && window.kr_zj.kr) window.kr_zj.kr='';
        
    };
        if (ob && ob.hasAttribute('viewBox')){
            ob.beg_view=ob.getAttribute("viewBox").split(" ");
            if (ob.addEventListener) {
                if ('onwheel' in document) {
                ob.addEventListener("wheel", onWheel);
                } else if ('onmousewheel' in document) {
                ob.addEventListener("mousewheel", onWheel);
                } else {
                ob.addEventListener("MozMousePixelScroll", onWheel);
                }
            } else { 
                ob.attachEvent("onmousewheel", onWheel);
            };
            function onWheel(e) {
                e = e || window.event;
                var delta = e.deltaY || e.detail || e.wheelDelta;
                delta=delta/Math.abs(delta);
                this.tek_zn+=delta*StapWheel;
                this.scale();
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            };
            ob.tek_zn=1;
            ob.sm=[0,0];
            ob.sm_zj=[0,0];
            ob.tek_sm=[0,0];
			ob.shipok=false;
			
            ob.scale=function(){
                 if (this.tek_zn>maxScale) {
                    this.tek_zn=maxScale;
                    this.tek_sm=[0,0];
                    this.sm_zj=[0,0];
                    this.sm=[0,0];
                }
                if (this.tek_zn<minScale) this.tek_zn=minScale;
                /*var pos=[];
                for (var i=0;i<this.beg_view.length;i++) pos[i]=this.beg_view[i];
                if (!this.shipok) this.tek_sm=[this.sm[0]+this.sm_zj[0],this.sm[1]+this.sm_zj[1]];
                var ps=[pos[2]-pos[2]*this.tek_zn,pos[3]-pos[3]*this.tek_zn];
                if (this.tek_sm[1]*this.tek_zn>ps[1]/2) this.tek_sm[1]=ps[1]/2/this.tek_zn;
                if (this.tek_sm[1]*this.tek_zn<-ps[1]/2) this.tek_sm[1]=-ps[1]/2/this.tek_zn;
                if (this.tek_sm[0]*this.tek_zn>ps[0]/2) this.tek_sm[0]=ps[0]/2/this.tek_zn;
                if (this.tek_sm[0]*this.tek_zn<-ps[0]/2) this.tek_sm[0]=-ps[0]/2/this.tek_zn;
                pos[0]=parseFloat(pos[0])+(ps[0])/2-(this.tek_sm[0])*this.tek_zn;
                pos[1]=parseFloat(pos[1])+(ps[1])/2-(this.tek_sm[1])*this.tek_zn;
                pos[2]*=this.tek_zn;
                pos[3]*=this.tek_zn;
				this.setAttribute("viewBox",pos.join(" ")); */
				this.wh=[parseFloat(this.beg_view[2]),parseFloat(this.beg_view[3])];
				this.kf=parseFloat(this.beg_view[2])/this.clientWidth;
				var ps=[this.wh[0]-this.wh[0]*this.tek_zn,this.wh[1]-this.wh[1]*this.tek_zn];
				if (!this.shipok) this.tek_sm=[(this.sm[0]+this.sm_zj[0]),this.sm[1]+this.sm_zj[1]];
				if (this.tek_sm[1]*this.tek_zn>ps[1]/2) this.tek_sm[1]=ps[1]/2/this.tek_zn;
                if (this.tek_sm[1]*this.tek_zn<-ps[1]/2) this.tek_sm[1]=-ps[1]/2/this.tek_zn;
                if (this.tek_sm[0]*this.tek_zn>ps[0]/2) this.tek_sm[0]=ps[0]/2/this.tek_zn;
                if (this.tek_sm[0]*this.tek_zn<-ps[0]/2) this.tek_sm[0]=-ps[0]/2/this.tek_zn;
				var mt=[[1,0,0],[0,1,0],[0,0,1]];
				
				mt=proiz_matr(mt,[[1,0,0],[0,1,0],[-this.wh[0]/2+this.tek_sm[0]*this.tek_zn,-this.wh[1]/2+this.tek_sm[1]*this.tek_zn,1]]);
				mt=proiz_matr(mt,[[1/this.tek_zn,0,0],[0,1/this.tek_zn,0],[0,0,1]]);
				mt=proiz_matr(mt,[[1,0,0],[0,1,0],[this.wh[0]/2,this.wh[1]/2,1]]);
				write_matrix(this.children[0],mt);
				this.mt=mt;
			};
			ob.scale();
            ob.addEventListener('mousedown',onPointerDown,false);
            ob.addEventListener( "touchstart", onPointerDown, false );
            function onPointerDown( event ) {
				//
                if (event.touches) {
                    var point_=[event.touches[0].pageX,event.touches[0].pageY];
                    if (event.touches.length>1) {
                        this.len_sc=Math.sqrt(Math.pow(event.touches[1].pageX-event.touches[0].pageX,2)+Math.pow(event.touches[1].pageY-event.touches[0].pageY,2));
                        this.shipok=true;
                    };
                } else var point_=[event.pageX,event.pageY];
                if (!this.shipok) {
					window.kr_zj={kr:[point_[0],point_[1]],ob:this};
					window.kr_zj.ob.sm=[0,0];
                    this.sm_zj=[this.tek_sm[0],this.tek_sm[1]];
                };
                event.preventDefault();event.stopPropagation();return false;
            };
        };

};
function InverseMatrix(mt) {  // Обратная матрица
	var A = [[],[],[]];
	for (var i=0;i<3;i++) for (var j=0;j<3;j++) A[i][j] = mt[i*3+j];
	function Determinant(A) {  // Определитель матрицы (используется алгоритм Барейса)

		var N = A.length, B = [], denom = 1, exchanges = 0;
		for (var i = 0; i < N; ++i)
		 { B[i] = [];
		   for (var j = 0; j < N; ++j) B[i][j] = A[i][j];
		 }
		for (var i = 0; i < N-1; ++i)
		 { var maxN = i, maxValue = Math.abs(B[i][i]);
		   for (var j = i+1; j < N; ++j)
			{ var value = Math.abs(B[j][i]);
			  if (value > maxValue){ maxN = j; maxValue = value; }
			}
		   if (maxN > i)
			{ var t = B[i]; B[i] = B[maxN]; B[maxN] = t;
			  ++exchanges;
			}
		   else { if (maxValue == 0) return maxValue; }
		   var value1 = B[i][i];
		   for (var j = i+1; j < N; ++j)
			{ var value2 = B[j][i];
			  B[j][i] = 0;
			  for (var k = i+1; k < N; ++k) B[j][k] = (B[j][k]*value1-B[i][k]*value2)/denom;
			}
		   denom = value1;
		 }                                           //@ http://mathhelpplanet.com/viewtopic.php?f=44&t=22390
		if (exchanges%2) return -B[N-1][N-1];
		else return B[N-1][N-1];
	};
	var det = Determinant(A);
	if (det == 0) return false;
	var N = A.length, invA = [];
	for (var i = 0; i < N; i++)
	 { invA[i] = [];
	   for (var j = 0; j < N; j++)
		{ var B = [], sign = ((i+j)%2==0) ? 1 : -1;
		  for (var m = 0; m < j; m++)
		   { B[m] = [];
			 for (var n = 0; n < i; n++)   B[m][n] = A[m][n];
			 for (var n = i+1; n < N; n++) B[m][n-1] = A[m][n];
		   }
		  for (var m = j+1; m < N; m++)
		   { B[m-1] = [];
			 for (var n = 0; n < i; n++)   B[m-1][n] = A[m][n];
			 for (var n = i+1; n < N; n++) B[m-1][n-1] = A[m][n];
		   }
		  invA[i][j] = sign*Determinant(B)/det;
		}
	 };
	
	return invA;
};
function readCord(el) {
	var k=el.getAttribute("kor").split(",");
	for (var i=0;i<k.length;i++) k[i]=parseFloat(k[i]);
	k.push(k[0]+(k[2]-k[0])/2);
	k.push(k[1]+(k[3]-k[1])/2);
	return k;
};
var lineSegmentsIntersect = (l1,l2)=> {
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
    return (s >= 0 && s <= 1 && t >= 0 && t <= 1) ? [x1 + t * a_dx, y1 + t * a_dy] : false;
};
function rotX(arg){
	var cs=Math.cos(arg);
	var sn=Math.sin(arg);
	return [[cs,sn,0],[-sn,cs,0],[0,0,1]];
};
export {substitutionPath,ajax,svg_scale,InverseMatrix,proiz_matr,write_matrix,read_matrix,readCord,lineSegmentsIntersect,rotX};