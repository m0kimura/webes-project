'use strict';
let kwBase=class kwBase{
  /**
   * コンストラクター
   * @param  {object} obj オプション
   * @return {void}       none
   * @constructor kwBase
   */
  constructor(obj) {
    let op;
    if(arguments.length==1){
      // メイン responsive.js
      op=obj[0]; op=op||{};
      op=this.loadConfig(op);
      this.Objs=[];
      this.Bs={}; this.Bs.start=true;
      this.Save={}; this.Save.fixedTop=0; this.Save.pos={}; this.Save.hi={};
      this.Sec=[]; this.Fdata={};
      this.setConfig(op);
      this.defineImage();
      this.begin(obj);
    }else{
      // サブモジュール用
      op=arguments[0]; op=op||{};
      this.Bs=arguments[1]; this.Save=arguments[2];
      this.Sec=arguments[3]; this.Fdata=arguments[4];
      op=this.loadConfig(op);
      this.setConfig(op);
    }
  }
  setConfig() {/* this must be overided */}
  onFirst() {/* this must be overided */}
  onInit() {/* this must be overided */}
  onResize() {/* this must be overided */}
  onScroll() {/* this must be overided */}
  onLast() {/* this must be overided */}
  /**
   * オープン時実行処理
   * @param  {object} obj 実行時オプション、サブオブジェクト群
   * @return {void}       none
   * @method begin
   */
  begin (obj){
    let me=this, i;
    for(i in obj){if(i>0){
      me.Objs[i-1]=new obj[i](obj[0], me.Bs, me.Save, me.Sec, me.Fdata);
    }}
    $(window).on('load', function(){
      me.config();
      for(i in me.Objs){me.Objs[i].onFirst();}
      me.spanning(); me.image('init'); me.zone();
      for(i in me.Objs){me.Objs[i].onInit();}
      me.body('init'); me.footer('init', 0);
      $('body').css('opacity', 1.0);

      $(window).on('resize', function(){
        me.config();
        me.spanning(); me.image(); me.zone();
        me.body(); me.scroll();
        me.footer('resize', $(window).scrollTop());
        for(i in me.Objs){me.Objs[i].onResize(me.Bs.change);}
        //e.footer('resize', $(window).scrollTop());
        me.Save.mode=me.Bs.mode;
      });
      $(window).on('scroll', function(){
        var pos=me.scroll(); me.footer('cont', pos);
        for(i in me.Objs){me.Objs[i].onScroll(pos);}
        me.modal('reset'); me.elevate('');
      });
      me.modal('init');
      for(i in me.Objs){me.Objs[i].onLast();}
      me.Save.mode=me.Bs.mode;
    });
  }
  /**
   * configをサーバーから取得する
   * @param  {object} op configオプション
   * @return {object}    サーバーからのデータ追加後オプション
   * @method loadConfig
   */
  loadConfig (op){
    let m, i, out; op=op||{}; if(!op.loadConfig){return;}

    m='/config/'+location.pathname;
    $.ajax({async: false, url: m, success: function(data){
      out=JSON.parse(data); for(i in op){out[i]=op[i];}
    }});
    return out;
  }
  /**
   * 毎回実行される共通的な変数設定
   * @return {void} none
   * @method config
   */
  config() {
    let me=this;
    //
    me.Bs.old=me.Bs.mode;
    me.Bs.wwi=$(window).width();
    me.Bs.whi=window.innerHeight ? window.innerHeight: $(window).height();
    me.Bs.mode='pc';                          // 現状モード
    if(me.Bs.wwi<me.Bs.minPc){me.Bs.mode='mobile';} if(me.Bs.wwi>me.Bs.maxPc){me.Bs.mode='wide';}
    if(me.Bs.mode=='wide' && me.Bs.section.wide=='no'){me.Bs.wwi=me.Bs.maxPc;}
    else{me.Bs.wwi=$('body').outerWidth();}
    if(me.Bs.mode=='mobile'){
      //      me.Bs.scale=me.Bs.wwi/me.Bs.widthMobile;
      me.Bs.scale=me.Bs.wwi/me.Bs.maxPc;
    }else{
      //      me.Bs.scale=me.Bs.wwi/me.Bs.width;      // 現状スケール
      me.Bs.scale=me.Bs.wwi/me.Bs.maxPc;
    }
    if(me.Bs.old!=me.Bs.mode){me.Bs.change=me.Bs.mode;}else{me.Bs.change=false;}
  }
  /**
   * モーダルスクリーン
   * @param  {string}   mode 処理モード init/set/paste/clear/reset
   * @param  {Function} fn   終了時処理を設定
   * @return {void}          none
   * @method modal
   */
  modal(mode, fn) {
    let me=this, t, l;
    switch(mode){
    case 'init':
      $('body').append('<div id="Modal"></div>');
      $('body').append('<img id="Mclose" src="" />');
      $('#Mclose').attr('src', me.pngclose);
      t=$(window).scrollTop(); l=$(window).width()-$('#Mclose').width();
      $('#Modal').css({
        position: 'absolute', top: 0, left: 0,
        'background-color': '#000', opacity: me.Bs.opacity, display: 'none', 'z-index': 600
      });

      $('#Mclose').css({
        position: 'absolute', top: 0, left: 0, display: 'none', 'z-index': 1020
      });
      me.Save.proc=function(){};
      $('#Modal, #Mclose').on('click', function(){
        me.Save.proc(); $('#Modal').css({display: 'none'}); $('#Mclose').css({display: 'none'});
        me.Save.proc=function(){};
      });
      break;
    case 'set':
      fn=fn||function(){};
      $('#Modal').css({
        display: 'block', width: $(document).width()+'px', height: $(document).height()+'px',
      });
      t=$(window).scrollTop(); l=$(window).width()-$('#Mclose').width();
      $('#Mclose').css({display: 'block', top: t+'px', left: l+'px'});
      me.Save.proc=fn;
      break;
    case 'paste':
      fn=fn||function(){};
      $('#Modal').css({
        display: 'block', width: $(document).width()+'px', height: $(document).height()+'px',
      });
      me.Save.proc=fn;
      break;
    case 'clear':
      me.Save.proc();
      $('#Modal').css({display: 'none'}); $('#Mclose').css({display: 'none'});
      me.Save.proc=function(){};
      break;
    case 'reset':
      me.Save.proc();
      $('#Modal').css({display: 'none'}); $('#Mclose').css({display: 'none'});
      me.Save.proc=function(){};
      break;
    }
  }
  /**
   * コンテンツエリア（＃Content)の幅をダイレクトに設定
   * @return {object} {main:幅,sub:幅}
   * @method flick
   */
  flick(data, indicator, direct) {
    let me=this;
    //                                          // 構造データ
    data.mode=data.mode||'page';                // 操作モード(page, hide, move)
    data.area=data.area;                        // area: 移動オブジェクト
    data.wi=data.wi||data.area.outerWidth();    // wi: 移動体幅(px)
    data.hi=data.hi||data.area.outerHeight();   // hi: 窓高(px)
    data.ix=data.ix||1;                         // ix: 表示開始頁(1~)
    data.max=data.max||0;                       // max:最大個数
    data.threshold=data.threshold||100;         // threshold: 動くかどうかの閾値(px)
    data.animate=data.animate||400;             // animate: アニメーション時間(ms)
    data.move=data.move||0;                     // move: 指定されたixに移動
    data.menu=data.menu||false;                // menu: メニュー動作(true/false)
    data.modal=data.modal||false;              // modal 消去
    data.object=data.object||data.area;
    indicator=indicator||function(){};         // インディケーター表示アクション

    if(data.mode=='hide'){data.max=2; data.ix=1;}
    if(data.mode=='hider'){data.max=2; data.ix=2;}
    $(data.area).attr('ix', data.ix);
    if(data.move>0){
      if(data.ix>data.max){return;}
      var l=(1-data.move)*data.wi;
      if(direct){data.object.css({'margin-left': l+'px'});}
      else{data.object.animate({'margin-left': l+'px'}, data.animate);}
      data.ix=data.move; data.move=0;
      indicator(data);
      return;
    }

    let isTouch=('ontouchstart' in window);

    data.area.on({

      'touchstart mousedown': function(e){
        if(me.Bs.mode!='mobile'){return;}
        data.flg=true;
        data.wi=data.object.outerWidth();
        data.hi=data.object.outerHeight();
        //if(isTouch){if(!event.changedTouches){isTouch=false;}}
        data.stx=(isTouch ? event.changedTouches[0].pageX : e.pageX);
        data.sty=(isTouch ? event.changedTouches[0].pageY : e.pageY);
        data.inx=parseInt($(data.object).css('margin-left'));
        data.iny=parseInt($(data.object).css('margin-top'));
        if(data.direct){
          if(data.direct=='V'){
            data.maxtop=me.Bs.whi-data.hi; data.minbot=0;
            data.maxright=0; data.minleft=0;
          }else{
            data.maxtop=0; data.minbot=0;
            data.maxright=me.Bs.wwi-data.wi; data.minleft=0;
          }
        }else{
          var a=$(data.object).attr('min'); if(a){data.maxtop=(a-0)*-1;}else{data.maxtop=0;}
          var b=$(data.object).attr('max'); if(b){data.minbot=(b-0)*-1;}else{data.minbot=0;}
        }
      },

      'touchmove mousemove': function(e){if(data.flg){
        if(me.Bs.mode!='mobile'){return;}
        e.preventDefault();
        let nx=(isTouch ? event.changedTouches[0].pageX : e.pageX);
        let ny=(isTouch ? event.changedTouches[0].pageY : e.pageY);
        let dx, dy, tx, ty;
        if(data.mode=='move'){dx=nx-data.stx;}else{dx=data.wi*(data.ix-1)*-1+nx-data.stx;}
        dy=ny-data.sty;
        if(Math.abs(nx-data.stx)>Math.abs(dy)){
          if(data.mode=='move'){
            if(data.direct!='V'){
              tx=data.inx+dx;
              if(tx<data.maxright){tx=data.maxright;} if(tx>data.minleft){tx=data.minleft;}
              data.object.css({'margin-left': tx+'px'});
            }
          }else{
            if(dx<0){data.object.css({'margin-left': dx+'px'});}
          }
        }else{
          ty=data.iny+dy;
          if(ty<data.maxtop){ty=data.maxtop;} if(ty>data.minbot){ty=data.minbot;}
          $(data.object).css({'margin-top': ty+'px'});
        }
      }},

      'touchend mouseup': function(e){
        if(me.Bs.mode!='mobile'){return;}

        data.flg=false;
        if(data.mode!='move'){
          data.ix=data.area.attr('ix')-0;
          let n=(isTouch ? event.changedTouches[0].pageX : e.pageX);
          let df=n-data.stx;
          if(df<0-data.threshold){
            data.ix++; if(data.ix>data.max){data.ix=data.max;}
            if(data.modal){me.modal('clear');}
          }
          if(df>data.threshold){
            data.ix--; if(data.ix<1){data.ix=1;}
            if(data.modal){me.modal('clear');}
          }
          let d=data.wi*(data.ix-1)*-1; if(data.mode=='hide'){d=0;}
          data.object.stop();
          data.object.animate({'margin-left': d}, data.animate, function(){
            indicator(data);
          });
          data.area.attr('ix', data.ix);
        }
      }
    });

  }
  /**
   * 幅設定などの拡張css設定機能を提供
   * @param  {Jquery} selector ｊQueryセレクター
   * @param  {object} para     拡張cssパラメタと値
   * @return {void}            none
   * @method css
   */
  css(selector, para) {
    if(!selector){return false;}
    let e; if(typeof(selector)=='object'){e=selector;}else{e=$(selector);} if(!e){return false;}
    let me=this, v; para=para||{};

    if(para.outerHeight){
      v=parseInt(para.outerHeight)-parseInt(e.css('padding-top'))-parseInt(e.css('padding-bottom'));
      para.height=v+'px'; delete para['outerHeight'];
    }

    if(para.outerWidth){
      v=parseInt(para.outerWidth)-parseInt(e.css('padding-left'))-parseInt(e.css('padding-right'));
      para.width=v+'px'; delete para['outerWidth'];
    }

    if(para.fullHeight){
      v=parseInt(para.fullHeight)-parseInt(e.css('padding-top'))-parseInt(e.css('padding-bottom'))
      -parseInt(e.css('margin-top'))-parseInt(e.css('margin-bottom'));
      para.height=v+'px'; delete para['gullHeight'];
    }

    if(para.fullWidth){
      v=parseInt(para.fullwidth)-parseInt(e.css('padding-left'))-parseInt(e.css('padding-right'))
       -parseInt(e.css('margin-left'))-parseInt(e.css('margin-right'));
      para.height=v+'px'; delete para['fullWidth'];
    }
    if(para.saveHeight){
      v=me.Save[selector].height; para.height=v; delete para['saveHeight'];
    }

    if(para.saveWidth){
      v=me.Save[selector].width; para.width=v; delete para['saveWeight'];
    }

    if(para.saveColor){
      v=me.Save[selector].color; para.color=v; delete para['saveColor'];
    }

    if(para.saveOuterHeight){
      v=me.Save[selector].outerHeight
       -parseInt(e.css('padding-top'))-parseInt(e.css('padding-bottom'));
      para.height=v+'px'; delete para['saveOuterHeight'];
    }

    if(para.saveOuterWidth){
      v=me.Save[selector].outerWidth
       -parseInt(e.css('padding-top'))-parseInt(e.css('padding-bottom'));
      para.width=v+'px'; delete para['saveOuterWidth'];
    }

    if(para){$(selector).css(para);}
  }
  /**
   * 拡張css値（fullHeight,fullwidth）獲得機能
   * @param  {string} cmd コマンド fullHeight, fullWidth
   * @param  {object} obj jQueryオブジェクト
   * @return {integer}    計算値
   * @method get
   */
  get(cmd, obj) {
    switch(cmd){
    case 'fullHeight':
      return parseInt(obj.css('margin-top'))+parseInt(obj.css('margin-bottom'))+obj.outerHeight();
    case 'fullWidth':
      return parseInt(obj.css('margin-left'))+parseInt(obj.css('margin-right'))+obj.outerWidth();
    }
  }
  /**
   * cssのピクセル値から文字を省き数値化する
   * @param  {string} x ピクセル文字列
   * @return {integer}  計算値
   * @method cut
   */
  cut(x) {
    var p=x.search(/px/); if(p>-1){return x.substring(0, p)-0;}else{return x-0;}
  }
  /**
   * 拡張子の前に文字を挿入する
   * @param  {string} txt  対象文字列
   * @param  {string} over 挿入文字列
   * @return {string}      編集結果
   * @method insert
   */
  insert(txt, over) {
    var sw, out, x, i; sw=0; out=''; if(!txt){return '';}
    for(i=txt.length; i>0; i--){
      x=txt.substr(i-1, 1);
      if(sw==0){if(x=='.'){out=over+'.'+out; sw=1;}else{out=x+out;}}else{out=x+out;}
    }
    return out;
  }
  /**
   * 使用する画像を定義
   * @return {void} none
   * @method defineImage
   */
  defineImage() {
    this.pngclose='data:image/png;base64,'+ // close
       'iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAByElEQVR42t2W2YrCQBBF/RoN6JNxR'+
       'eMC7t/r9iouT4r6RTWchpI2dmcZxxmYgpAYk5zcqludKsgvRuFPYIPBQOr1uoRhaPa1Ws0cs9ffaZ'+
       'vrOp77AqtUKh9RUy6XX2G8xSfCfq4TViqVpNPpyOFwyP3wzWYj1WrVpJSgFC8w+yQggL1eT/b7fWb'+
       'Qer02L8298/ncr0zfhDidTqawCtztdqmg5XL5AI3HY7ndbtnSSJBCBfb7/UQgoEajYa5dLBZyvV6z'+
       '10wDAKAgCGQ4HDprCKjVaj1Sp4pcGUt1I8AoigwQpcfj8ckM7XbbgGazmVwul/xujAeKABaLRWMeT'+
       'LPdbo0izgGyU/cWTIHdbteo0NVBQfHUvQ0jUEQNALJRR5+it2HUSO2NKlJr19AVuQzialgcqo0PMK'+
       'nxcyvD3pq+yWQi9/vdKNK2AOjrQ+dy5YMlNawC+Y+2cAGdyuw38DWsywwAdKVhH2/8TGmkRnbDns9'+
       'nb5oBsoZiGhxqmybVIKvVSprN5gOUZm+78fXzpKZJVcb3iJum02liw8YDRepSapkJxrFrUc0SKCSV'+
       'o9HI70Z7VvjJsGebp+nKnpJ0svruplOac7r6d0PqF4sKdR93ekf9AAAAAElFTkSuQmCC';
  }
};
console.log(typeof(kwBase));
