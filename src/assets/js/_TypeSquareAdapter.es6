
export default class TypeSquareAdapter{
  static load(){
    return new Promise((resolve,reject)=>{
      Ts.onComplete((res)=>{
        resolve();
      });
      Ts.reload();
    });
  }
}