

function setHtml(ob){
    //ob['addEventListener']('mousedown',onPointerDown,false);
    //ob['addEventListener']( "touchstart", onPointerDown, false );
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
    document.addEventListener('mousemove',onPointerHover,false);
    document.addEventListener( "touchmove", onPointerHover, false );
    document.addEventListener('mouseup',onPointerUp, false);
    document.addEventListener( "touchend", onPointerUp, false );
    document.addEventListener( "touchcancel", onPointerUp, false );
    document.addEventListener( "touchleave", onPointerUp, false );
}



//document.addEventListener( 'contextmenu', function(event){event.preventDefault();}, false );
var scUser=1;
function onWheel(e) {
    e = e || window.event;
    var delta = e.deltaY || e.detail || e.wheelDelta;
    delta=delta/Math.abs(delta);  
    
};
function onPointerHover(event){

};
function onPointerUp(event){

}
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
    //ret['cord']=point_;
    
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    event.stopPropagation();
    return ret;

};

export { setHtml };