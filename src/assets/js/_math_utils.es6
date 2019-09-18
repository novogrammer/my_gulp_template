export function degToRad(deg){
  return deg/360*Math.PI*2;
}
export function random(min=null,max=null){
  if(min==null&&max&&null){
    return random(0,1);
  }
  if(max==null){
    return random(0,min);
  }
  return Math.random()*(max-min)+min;
}
export function clamp(value,min,max){
  return Math.min(Math.max(value,min),max);
}
export function map(inputValue,inputMin,inputMax,outputMin,outputMax,clamp=false){
  let outputValue=((inputValue-inputMin)/(inputMax-inputMin)*(outputMax-outputMin)+outputMin);
  if(clamp){
    if(outputMin<outputMax){
      outputValue=Math.min(outputValue,outputMax);
      outputValue=Math.max(outputValue,outputMin);
    }else{
      outputValue=Math.max(outputValue,outputMax);
      outputValue=Math.min(outputValue,outputMin);
    }
  }
  return outputValue;
}

export function scaledRect(rectOriginal,rectTarget,targetRatio){
  let width=rectOriginal.width*targetRatio;
  let height=rectOriginal.height*targetRatio;
  let cx=rectTarget.x+rectTarget.width*0.5;
  let cy=rectTarget.y+rectTarget.height*0.5;
  let rect={
    x:cx-width*0.5,
    y:cy-height*0.5,
    width:width,
    height:height,
  };
  return rect;
}

export function coverRectRatio(rectOriginal,rectTarget){
  let aspectOriginal=rectOriginal.height/rectOriginal.width;
  let aspectTarget=rectTarget.height/rectTarget.width;
  let targetRatio=(aspectTarget<aspectOriginal)?(rectTarget.width/rectOriginal.width):(rectTarget.height/rectOriginal.height);
  return targetRatio;
}
export function coverRect(rectOriginal,rectTarget){
  let targetRatio=coverRectRatio(rectOriginal,rectTarget);
  return scaledRect(rectOriginal,rectTarget,targetRatio);
}
export function containRectRatio(rectOriginal,rectTarget){
  let aspectOriginal=rectOriginal.height/rectOriginal.width;
  let aspectTarget=rectTarget.height/rectTarget.width;
  let targetRatio=(aspectOriginal<aspectTarget)?(rectTarget.width/rectOriginal.width):(rectTarget.height/rectOriginal.height);
  return targetRatio;
}
export function containRect(rectOriginal,rectTarget){
  let targetRatio=containRectRatio(rectOriginal,rectTarget);
  return scaledRect(rectOriginal,rectTarget,targetRatio);
}
