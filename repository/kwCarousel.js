'use strict';
/* global kwBase */
let kwCarousel=class kwCarousel extends kwBase {
  constructor(op, Bs, Save, Sec, Fdata) {
    super(op, Bs, Save, Sec, Fdata);
  }
  /**
   * 初期動作設定
   * @param  {object} op 動作オプション
   * @return {void}     none
   * @method
   */
  setConfig(op) {
    let me=this;
    console.log('carousel.js');
    me.Bs.carousel=op.Carousel||{};
    me.Bs.carousel.width=me.Bs.carousel.width||'auto';  // Pcカルーセル幅
    me.Bs.carousel.pc=me.Bs.carousel.pc||300;  // Pcカルーセル画像幅
    me.Bs.carousel.mobile=me.Bs.carousel.mobile||200; // Mobileカルーセル画像幅
    me.Bs.carousel.numpc=me.Bs.carousel.numpc||3;  // カルーセル表示個数pc
    me.Bs.carousel.nummb=me.Bs.carousel.nummb||2;  // カルーセル表示個数mobile
    me.Bs.carousel.direction=me.Bs.carousel.direction||'H';  // カルーセル移動方向
    me.Bs.carousel.animate=me.Bs.carousel.animate||me.Bs.animate;
    me.Bs.carousel.interval=me.Bs.carousel.interval||me.Bs.interval;
    me.Bs.carousel.priority=me.Bs.carousel.priority||'width'; //優先順位, width, num
  }
  onInit() {this.main('init');}
  onResize() {this.main('image');}
  main(mode, ix) {
    let me=this; let pm; ix=ix||0;
    switch(mode){
    case 'image':
      ix=0;
      $('.Carousel').each(function(){
        me.Save[ix]=me.setSize(me.Save[ix], $(this));
        ix++;
      });
      return;
    case 'loop':
      pm=me.Save[ix];
      if(pm.direction=='V'){
        $('#'+pm.id+' ul').animate({'marginTop': pm.ht}, pm.animate, 'swing', function(){
          $(this).css('margin-top', pm.hf); $('#'+pm.id+' li:first').appendTo('#'+pm.id+' ul');
        });
      }else{
        $('#'+pm.id+' ul').animate({'marginLeft': pm.wt}, pm.animate, 'swing', function(){
          $(this).css('margin-left', pm.wf); $('#'+pm.id+' li:first').appendTo('#'+pm.id+' ul');
        });
      }
      if(pm.indicator){
        pm.jx++; if(pm.jx>=pm.max){pm.jx=0;}
        me.indicator({id: pm.indicator, ix: pm.jx, onf: pm.onsign, off: pm.offsign, max: pm.max});
      }
      pm.tid=setTimeout(function(){me.main('loop', ix);}, pm.interval);
      me.Save[ix]=pm;
      return;
    default:
      $('.Carousel').each(function(){
        let k, i;
        pm={};
        pm.id=$(this).attr('id');
        if(!pm.id){
          pm.id='CA'+Math.floor(Math.random()*1000); $(this).attr('id', pm.id);
        }
        k=[
          'num', 'nummb', 'numpc', 'direction', 'interval', 'animate', 'priority', 'pc', 'mobile',
          'down', 'up', 'fore', 'back', 'play', 'stop', 'toggle', 'indicator', 'onsign', 'offsign'
        ];
        for(i in k){pm[k[i]]=$(this).attr(k[i])||me.Bs.carousel[k[i]];}
        pm.iw=$(this).width();
        pm=me.setSize(pm, $(this));
        pm.jx=0;
        if(pm.indicator){
          me.indicator({id: pm.indicator, onf: pm.onsign, off: pm.offsign, max: pm.max, pix: ix}, 'init');
        }
        pm.tid=setTimeout(function(){me.main('loop', ix);}, pm.interval);
        if(pm.down){$('#'+pm.down).click(function(){
          clearTimeout(pm.tid); $('#'+pm.id+' ul').css('margin-top', pm.ht);
          $('#'+pm.id+' li:first').appendTo('#'+pm.id+' ul');
          $('#'+pm.id+' ul').css('margin-top', pm.hf);
          pm.tid=setTimeout(function(){me.main('loop', ix);}, pm.interval);
        });}
        if(pm.up){$('#'+pm.up).click(function(){
          clearTimeout(pm.tid); $('#'+pm.id+' ul').css('margin-top', 0);
          $('#'+pm.id+' li:last').prependTo('#'+pm.id+' ul');
          $('#'+pm.id+' ul').css('margin-top', -pm.hi);
          pm.tid=setTimeout(function(){me.main('loop', ix);}, pm.interval);
        });}
        if(pm.fore){$('#'+pm.fore).click(function(){
          clearTimeout(pm.tid);
          $('#'+pm.id+' ul').css('margin-left', pm.wf);
          $('#'+pm.id+' li:first').appendTo('#'+pm.id+' ul');
          pm.tid=setTimeout(function(){me.main('loop', ix);}, pm.interval);
        });}
        if(pm.back){$('#'+pm.back).click(function(){
          clearTimeout(pm.tid);
          $('div#'+pm.id+' div').css('margin-left', 0);
          $('#'+pm.id+' li:last').prependTo('#'+pm.id+' ul');
          $('#'+pm.id+' ul').css('margin-left', -pm.wi);
          pm.tid=setTimeout(function(){me.main('loop', ix);}, pm.interval);
        });}
        if(pm.play){$('#'+pm.play).click(function(){if(!pm.tid){
          pm.tid=setTimeout(function(){me.main('loop', ix);}, pm.interval);
        }});}
        if(pm.stop){$('#'+pm.stop).click(function(){if(pm.tid){
          clearTimeout(pm.tid); pm.tid='';
        }});}
        if(pm.toggle){$('#'+pm.toggle).click(function(){
          var cnvt=function(x){
            var a=x.split('.'); var o=''; var d='';
            for(i=a.length; i>0; i--){if(i==a.length-1){o='_x.'+o; d='.';}else{o=d+o;} o=a[i-1]+o;}
            return o;
          };
          let s;
          if(pm.tid){
            clearTimeout(pm.tid); pm.tid='';
            s=$('#'+pm.toggle).attr('src'); $('#'+pm.toggle).attr('data-save', s);
            s=cnvt(s); $('#'+pm.toggle).attr('src', s);
          }else{
            pm.tid=setTimeout(function(){me.main('loop', ix);}, pm.interval);
            s=$('#'+pm.toggle).attr('data-save'); $('#'+pm.toggle).attr('src', s);
          }
        });}
        me.Save=me.Save||[]; me.Save[ix]=pm;
        //me.Save[ix]=me.setSize(me.Save[ix], $(this));
      });
      return;
    }
  }
  /**
   * サイズ設定
   * @param  {[type]} pm  [description]
   * @param  {[type]} obj [description]
   * @return {object}     編集後サイズ
   * @method
   */
  setSize(pm, obj) {
    let me=this, w, n, a;
    if(me.Bs.mode=='mobile'){w=pm.mobile;}else{w=pm.pc;}
    a=obj.parent().width();
    if(pm.priority=='width'){
      n=Math.floor(a/w); if(n<1){n=1;} w=Math.floor(a/n); pm.num=n;
    }
    else{
      if(me.Bs.mode=='mobile'){n=pm.nummb;}else{n=pm.numpc;} w=Math.floor(a/n);
    }
    pm.max=0; pm.num=n;
    obj.find('li').each(function(){$(this).find('img').css({width: w+'px'}); pm.max++;});
    pm.wi=$('#'+pm.id+' img:first').width(); pm.hi=$('#'+pm.id+' img:first').height();
    pm.wf=(pm.wi*0)+'px'; pm.wt=(pm.wi*-1)+'px'; pm.wn=pm.wi*$('#'+pm.id+' img').size();
    pm.hf=(pm.hi*0)+'px'; pm.ht=(pm.hi*-1)+'px'; pm.hn=pm.hi*$('#'+pm.id+' img').size();
    $('#'+pm.id+' li:last').prependTo('#'+pm.id+' ul');
    if(pm.direction=='V'){
      $('#'+pm.id+' ul').css({height: pm.hn}); $('#'+pm.id+' ul').css('margin-top', pm.hf);
      pm.hn=pm.hi*pm.num; $('#'+pm.id).css({width: pm.wi, height: pm.hn, overflow: 'hidden'});
    }else{
      $('#'+pm.id+' ul').css({width: pm.wn, 'list-style': 'none'});
      $('#'+pm.id+' ul').css({'margin-left': pm.wf}); $('#'+pm.id+' img').css({float: 'left'});
      pm.wn=pm.wi*pm.num; $('#'+pm.id).css({width: pm.wn, height: pm.hi, overflow: 'hidden'});
    }
    return pm;
  }
  /**
   * 表示中写真インジケータ
   * @param  {object} op   処理オプション
   * @param  {string} mode 実行モード init/cont
   * @return {[type]}      [description]
   * @method
   */
  indicator(op, mode) {
    let me=this, l=op.max, p=op.ix, mk='', i, j;
    if(mode=='init'){
      $('#'+op.id).empty();
      for(i=0; i<l; i++){
        if(i==0){mk=op.onf;}else{mk=op.off;} $('#'+op.id).append('<img src="'+mk+'" ix="'+i+'"/>');
      }
      $('#'+op.id).find('img').each(function(){
        $(this).on('click', function(){
          i=me.Save[op.pix].jx; j=$(this).attr('ix')-0;
          while(j!=i){
            $('#'+op.pid+' li:first').appendTo('#'+op.pid+' ul'); i++; if(i>=op.max){i=0; break;}
          }
          i=0;
          $('#'+op.id).find('img').each(function(){
            if(i==j){mk=op.onf;}else{mk=op.off;} $(this).attr('src', mk);
            i++;
          });
          me.Save[op.pix].jx=j;
        });
      });
    }else{
      i=0;
      $('#'+op.id).find('img').each(function(){
        if(i==p){mk=op.onf;}else{mk=op.off;} $(this).attr('src', mk);
        i++;
      });
    }
  }
};
console.log(typeof(kwCarousel));
