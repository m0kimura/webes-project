'use strict';
/* global kwBase */
let kwDrawer=class kwDrawer extends kwBase {
  /**
   * コンストラクター
   * @param  {object} op    実行時オプション
   * @param  {object} Bs    共通変数
   * @param  {object} Save  セション超え保存データ
   * @param  {object} Sec   セクション管理情報
   * @param  {object} Fdata フリック制御変数
   * @return {void}         none
   * @constructor kwDrawer
   */
  constructor(op, Bs, Save, Sec, Fdata) {
    super(op, Bs, Save, Sec, Fdata);
  }
  /**
   * 共通変数の設定
   * @param  {object} op オプション
   * @method setConfig
   */
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
  /**
   * イメージ設定、フレーム枠組み前の処理
   * @return {void} none
   * @method onInit
   */
  onInit() {
    let me=this;
    me.layout('mold'); this.floating('init');
  }
  /**
   * セッション最終処理
   * @return {void} none
   * @method onLast
   */
  onLast() {
    let me=this;
    this.floating('last'); me.layout('sizing');
  }
  /**
   * ウィンドリサイズ時の処理
   * @return {void} none
   * @method onResize
   */
  onResize() {
    let me=this;
    me.layout('sizing'); this.floating('cont');
  }
  /**
   * 画面スクロール時の処理
   * @return {void} none
   * @method onScroll
   */
  onScroll() {
    this.floating('cont');
  }
  /**
   * フルページ写真のタグ生成
   * @return {Void} none
   * @method layout
   */
  layout(mode) {
    let me=this;
    switch(mode){
    case 'mold':
      $('.Layout').each(function(){
        let ow=$(this).outerWidth(); $(this).attr('originWidth', ow);
        let oh=$(this).outerHeight(); $(this).attr('originHeight', oh);
      });
      break;
    case 'sizing':
      $('.Layout').each(function(){
        let wk={};
        wk.ow=$(this).attr('originWidth');
        wk.oh=$(this).attr('originHeight');
        wk.pw=$(this).parent().outerWidth();
        wk.ph=$(this).parent().outerHeight();
        wk.mode=$(this).attr('mode');
        switch(wk.mode){
        case 'slow':
          wk.r=$(this).attr('rate'); if(wk.r){wk.r=(wk.r-0)/100;}else{wk.r=0.5;}
          wk.w=Math.floor(me.Bs.wwi+(wk.ow-me.Bs.wwi)*wk.r);
          wk.h=Math.floor(wk.oh*wk.w/wk.ow);
          wk.l=Math.floor(wk.pw/2-wk.w/2);
          wk.t=Math.floor(wk.ph/2-wk.h/2);
          break;
        case 'none':
          wk.w=wk.ow;
          wk.h=wk.oh;
          wk.l=Math.floor(wk.pw/2-wk.w/2);
          wk.t=Math.floor(wk.ph/2-wk.h/2);
          break;
        case 'move':
          wk.x=$(this).attr('x'); if(wk.x){wk.x=wk.x-0;}else{wk.x=0;}
          wk.y=$(this).attr('y'); if(wk.y){wk.y=wk.y-0;}else{wk.y=0;}
          wk.w=wk.ow;
          wk.h=wk.oh;
          wk.r=(me.Bs.maxPc-me.Bs.wwi)/(me.Bs.maxPc-me.Bs.widthMobile);
          wk.l=Math.floor(wk.pw/2-wk.w/2+wk.x*wk.r);
          wk.t=Math.floor(wk.ph/2-wk.h/2+wk.y*wk.r);
          break;
        case 'target':
          wk.s=$(this).attr('size'); if(wk.s){wk.s=wk.s-0;}else{wk.s=me.Bs.widthMobile;}
          wk.x=$(this).attr('x'); if(wk.x){wk.x=wk.x-0;}else{wk.x=0;}
          wk.y=$(this).attr('y'); if(wk.y){wk.y=wk.y-0;}else{wk.y=0;}
          wk.r=(me.Bs.wwi-me.Bs.widthMobile)/(me.Bs.maxPc-me.Bs.widthMobile);
          wk.w=wk.s+(wk.ow-wk.s)*wk.r;
          wk.h=Math.floor(wk.oh*wk.w/wk.ow);
          wk.l=Math.floor(wk.pw/2-wk.w/2+wk.x*(1-wk.r));
          wk.t=Math.floor(wk.ph/2-wk.h/2+wk.y*(1-wk.r));
          break;
        default:
          wk.min=$(this).attr('min');
          wk.r=me.Bs.wwi/me.Bs.maxPc;
          wk.w=Math.floor(wk.ow*wk.r);
          if(wk.min){if(wk.w<wk.min){
            wk.w=wk.min-0;
            wk.r=wk.min/wk.ow;
          }}
          wk.h=Math.floor(wk.oh*wk.r);
          wk.dx=$(this).attr('diffX'); if(wk.dx){wk.dx=wk.dx-0;}else{wk.dx=0;}
          wk.dy=$(this).attr('diffy'); if(wk.dy){wk.dy=wk.dy-0;}else{wk.dy=0;}
          wk.ex=Math.floor((me.Bs.maxPc-me.Bs.wwi)*wk.dx/(me.Bs.maxPc-me.Bs.widthMobile));
          wk.ey=Math.floor((me.Bs.maxPc-me.Bs.wwi)*wk.dy/(me.Bs.maxPc-me.Bs.widthMobile));
          wk.l=Math.floor(wk.pw/2-wk.w/2)-wk.ex;
          wk.t=Math.floor(wk.ph/2-wk.h/2)-wk.ey;
        }
        $(this).css({
          width: wk.w+'px', top: wk.t+'px', left: wk.l+'px',
          position: 'absolute', 'z-index': -1
        });
      });
      break;
    default:
      me.infoLog('layout do nothing mode='+mode);
    }
  }
  /**
   * Floatingクラス全画面フォトでのキャプションをフローティング
   * @param  {String} mode 処理タイミング init/cont
   * @return {Void}        none
   * @method floating
   */
  floating(mode) {
    let me=this, a, x, max, min, adjust, border;
    switch(mode){
    case 'init':
      me.Bs.floating.el=[];
      $('.Floating').each(function(){
        $(this).css({position: 'absolute', top: 0, left: 0, height: 'auto'});
        x=$(this).attr('range'); if(x){a=x.split(':');}else{a=[];}
        max=a[1]-0; min=a[0]-0;
        x=$(this).attr('positioning'); if(x){a=x.split(':')-0;}else{a=[];}
        adjust=a[0]||me.Bs.floating.adjust;
        border=a[1]||me.Bs.floating.border;
        $(this).attr('min', min);  $(this).attr('max', max);
        $(this).attr('adjust', adjust);  $(this).attr('border', border);
      });
      break;
    case 'last':
      $('.Cloning').each(function(){
        let x=$(this).attr('area');
        a=$('#'+x).html();
        $(this).html(a);
      });
      break;
    }

    $('.Floating').each(function(){
      let r, w, h, l, t, min, max, adjust, border, m,n;
      r=(me.Bs.maxPc-me.Bs.wwi)/(me.Bs.maxPc-me.Bs.widthMobile);
      h=$(this).height();
      min=$(this).attr('min')-0;
      max=$(this).attr('max')-0;
      adjust=$(this).attr('adjust')||'right';
      border=$(this).attr('border')-0;
      w=Math.floor(min+((max-min)*(1-r)));
      m=me.cut($(this).css('margin-top'))+me.cut($(this).css('margin-bottom'));
      m+=me.cut($(this).css('padding-top'))+me.cut($(this).css('padding-bottom'));
      switch(adjust){
      case 'right':
        n=me.cut($(this).css('margin-left'))+me.cut($(this).css('margin-right'));
        n+=me.cut($(this).css('padding-left'))+me.cut($(this).css('padding-right'));
        if(me.Bs.wwi>border){
          l=me.Bs.wwi-w-n; t=me.Bs.whi-h-m;
        }else{
          l=Math.floor((me.Bs.wwi-w-n)/2); t=me.Bs.whi-h-m;
        }
        break;
      case 'left':
        n=me.cut($(this).css('margin-left'))+me.cut($(this).css('padding-left'));
        if(me.Bs.wwi>border){
          l=me.Bs.wwi-w-n; t=me.Bs.whi-h-m;
        }else{
          l=Math.floor((me.Bs.wwi-w-n)/2); t=me.Bs.whi-h-m;
        }
        break;
      default:
        n=me.cut($(this).css('margin-left'))+me.cut($(this).css('margin-right'));
        n+=me.cut($(this).css('padding-left'))+me.cut($(this).css('padding-right'));
        l=Math.floor(($(window).width()-w-n)/2); t=me.Bs.whi-h-m;
      }
      $(this).css({width: w+'px', top: t+'px', left: l+'px', 'z-index': 10});
    });
  }
};
console.log(typeof(kwDrawer));
