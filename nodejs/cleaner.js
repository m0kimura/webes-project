const keCms=require('ke-cms');
let Cs=new keCms();
Cs.MAIN(function(me){
  var op={}; op=me.setting(op);
  me.cleanup(op);
});
