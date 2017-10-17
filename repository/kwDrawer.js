'use strict';
/* global kwBase */
let kwDrawer=class kwDrawer extends kwBase {
  constructor(op, Bs, Save, Sec, Fdata) {
    super(op, Bs, Save, Sec, Fdata);
  }
  setConfig(op) {
    let me=this;
    me.Bs.drawer=op.Drawer||{};
    me.Bs.drawer.animate=me.Bs.drawer.animate||me.Bs.animate;
    me.Bs.floating=op.Floating||{};
    me.Bs.floating.min=me.Bs.floating.min||80;
    me.Bs.floating.limit=me.Bs.floating.limit||700;
    me.Bs.floating.max=me.Bs.floating.max||50;
    me.Bs.floating.adust=me.Bs.floating.adjust||'right';
    me.Bs.floating.border=me.Bs.floating.border||me.Bs.floating.limit;
  }
  onFirst() {
    let me=this;
    me.fpMolding(); me.fpSizing(); this.floating('init');
  }
  onResize() {
    let me=this;
    me.fpSizing(); this.floating('cont');
  }
  onScroll() {
    this.floating('cont');
  }
  /**
   * フルページ写真のタグ生成
   * @return {Void} none
   * @method
   */
  fpMolding() {
    let me=this, minW, minX, hi;
    $('.FullPhoto').each(function(){
      minW=$(this).attr('minwidth')||me.Bs.drawer.FullPhotoMinSize||800; minW=minW-0;
      minX=$(this).attr('minpos')||400; minX=minX-0;
      hi=window.innerHeight||$(window).height();
      $(this).css({
        display: 'block', overflow: 'hidden',
        width: $(window).width()+'px', height: hi+'px'
      });
      $(this).attr('minwidth', minW);
      $(this).attr('minpos', minX);
    });
  }
  /**
   * フルページ写真のサイジング
   * @return {Void none
   * @method
   */
  fpSizing() {
    let me=this, max, min, minW, minX, nowX, top, left, wi, hi;
    nowX=me.Bs.wwi; max=me.Bs.maxPc; min= me.Bs.minMb||300;
    $('.FullPhoto').each(function(){
      minW=$(this).attr('minwidth')-0;
      minX=$(this).attr('minpos')-0;
      hi=$(window).height();
      //$(this).css({display: 'block', overflow: 'hidden', width: wi+'px', height: hi+'px'});
      wi=Math.floor((minW)+(max-minW)*(nowX-min)/(max-min));
      left=Math.floor((min/2-minX)+(minX-min/2)*(nowX-min)/(max-min));
      top=Math.floor(hi/2-wi/2);
      $(this).find('img').each(function(){
        $(this).css({
          position: 'absolute', top: top+'px', left: left+'px', width: wi+'px',
          'z-index': 0
        });
      });
    });
  }
  /**
   * Floatingクラス全画面フォトでのキャプションをフローティング
   * @param  {String} mode 処理タイミング init/cont
   * @return {Void}        none
   * @method
   */
  floating(mode) {
    let me=this, a, x, i;
    if(mode=='init'){
      i=0;
      me.Bs.floating.el=[];
      $('.Floating').each(function(){
        $(this).css({position: 'absolute', top: 0, left: 0, height: 'auto'});
        x=$(this).attr('rate'); a=x.split(':');
        me.Bs.floating.el[i]={};
        me.Bs.floating.el[i].min=me.Bs.floating.min||(a[0]-0);
        me.Bs.floating.el[i].limit=me.Bs.floating.limit||(a[1]-0);
        me.Bs.floating.el[i].max=me.Bs.floating.max||(a[2]-0);
        x=$(this).attr('positioning'); a=x.split(':');
        me.Bs.floating.el[i].adust=me.Bs.floating.adjust||a[0];
        me.Bs.floating.el[i].border=me.Bs.floating.border||(a[1]-0);
        $(this).attr('ix', i);
        i++;
      });
    }

    $('.Floating').each(function(){
      let i, r, w, h, lp=50, tp=70, l, t;
      i=$(this).attr('ix')-0;
      if(me.Bs.wwi>me.Bs.floating.el[i].limit){
        r=me.Bs.floating.el[i].max*me.Bs.wwi/(me.Bs.maxPc*100);
      }else{
        r=me.Bs.floating.el[i].min/100;
      }
      h=$(this).outerHeight();
      w=Math.floor(me.Bs.wwi*r);
      if(me.Bs.wwi>me.Bs.floating.el[i].border){
        l=me.Bs.wwi-w-lp; t=me.Bs.whi-h-tp;
      }else{
        w=Math.floor(me.Bs.wwi*r);
        l=Math.floor((me.Bs.wwi-w)/2); t=me.Bs.whi-h-tp;
      }
      $(this).css({width: w+'px', top: t+'px', left: l+'px'});
      console.log('#1851', me.Bs.wwi, w, l, me.Bs.whi, t);
    });
  }
};
console.log(typeof(kwDrawer));
