import { degToRad } from "./_math_utils";

const { $, jQuery } = window;
console.log($);
console.log(jQuery);


function mylog(a: string) {
  console.log(a, degToRad(0));
}

// it makes error
// mylog(0);

mylog("hello-ts");
