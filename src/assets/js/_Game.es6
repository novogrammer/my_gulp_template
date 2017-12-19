import {
  FPS,
  IS_DEBUG,
} from "./_constants.es6";


export default class Game{
  constructor(emitter){
    this.emitter=emitter;
    this.setupSlick();
    this.setupIntro();
    this.setupStats();
    this.setupEvents();
  }
  setupSlick(){
    $("#Main .images").slick({
      centerMode:true,
      variableWidth:true,
    });
  }
  setupIntro(){
    this.emitter.emit("begin intro");
    setTimeout(()=>{
      this.emitter.emit("end intro");
    },2*1000);
  }
  setupStats(){
    this.stats=new Stats();
    let $dom=$(this.stats.dom);
    $dom.attr("id","Stats");
    $("body").append($dom);
    $("#Stats").css({left:"auto",right:0});
    $("#Stats").toggle(IS_DEBUG);
  }
  setupEvents(){
    $(window).on("resize",()=>{
      this.onResize();
    });
    this.onResize();
    this.animation=animate(()=>{
      this.stats.begin();
      this.onTick();
      this.stats.end();
    },FPS);
  }
  onResize(){
    
  }
  onTick(){
    
  }
  static load(){
    let promises=[];
    return Promise.all(promises);
  }
}