
import { LayGroupHTML, lenPoint} from "./class";

var arMassg = [];
var stTime;
var panelHelp = new LayGroupHTML({
    name:"panelHelp",
    style:{ 
        //position:"",
        //display:"none",
        //border:"solid 1px #000",
        padding:"10px",
        /* right:"20px",
        bottom:"30px" */
    },
    resize:function(){
        var st = {
            left:this.parent.children[0].current_position.width - this.html.offsetWidth - 40,
            top:this.parent.children[0].current_position.height - this.html.offsetHeight - 60,
        }
        this.setPosition(st)
    }
});

function showMassg(){
    stTime = setTimeout(()=>{
        panelHelp.html['innerHTML'] = "";
        showMassg();
    },1500);
    if (arMassg.length == 0) return;
    panelHelp.html['innerHTML'] =  arMassg[arMassg.length-1].text;
    
    arMassg.splice(arMassg.length-1,1);
    if (panelHelp.parent['html']) panelHelp.resize();
    

};
function setMasseg(ms){
    var e =true;
    for (var k of arMassg) if (k.text == ms.text) e = false;
    if (e) arMassg.push(ms);
    //if (arMassg.length < 1) setTimeout(()=>{showMassg();},500);
};
showMassg();
export { panelHelp, setMasseg };

