
class Shapes{
    option = {};//храним параметры вызова
    resize = function(){//вызываем для обновления при изменинии размера родительского блока
        if (this['el']) this['el'].resize();
    };
    constructor (option){
        this.option = option;
        let _this= this;
        import("./src/areal_modul").then((d)=>{
            if (d) {
                _this['el'] = d.createAreal();
                if (option['parent']) option['parent'].appendChild(_this['el'].html);
                _this['el'].resize();
            } else {
                if (option['parent']) option['parent'].innerHTML="нет загрузки(:"
            }
        })
    };
}
export {Shapes}