

export default class Game{
  constructor(emitter){
    this.emitter=emitter;
    this.setupSlick();
    this.setupIntro();
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
  setupEvents(){
  }
  static load(){
    let promises=[];
    return Promise.all(promises);
  }
}