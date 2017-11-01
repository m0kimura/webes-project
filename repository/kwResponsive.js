'use strict';
/* global kwBase */
let kwResponsive=class kwResponsive extends kwBase {
  /**
   * オブジェクトコンストラクション
   * @param  {object} op    実行時オプション
   * @param  {object} Bs    共通パラメータ
   * @param  {object} Save  セション越え持ち越しデータ
   * @param  {object} Sec   セクション管理データ
   * @param  {object} Fdata フリック制御データ
   * @return {void}         none
   * @constructor
   */
  constructor() {
    super(arguments);
  }
  /**
   * 共通変数設定
   * @param  {object} op 実行時オプション
   * @method setConfig
   */
  setConfig(op) {
    let me=this;
    me.Bs=me.Bs||{};
    me.Bs.minPc=op.MinPc||750;              // PC表示最小幅
    me.Bs.maxPc=op.MaxPc||1200;             // PC表示最大幅
    me.Bs.width=op.Width||1050;             // 設計基本幅(パソコン)
    me.Bs.widthMobile=op.WidthMobile||400;  // 設計基本幅(モバイル)
    me.Bs.maxMain=op.MaxMain||800;             // 設計基本メイン幅
    me.Bs.minSide=op.MinSide||200;          // 最小サイド幅
    me.Bs.animate=op.Animate||1000;         // 基本アニメートタイム
    me.Bs.interval=op.Interval||2000;       // 基本インターバルタイム
    me.Bs.parallax=me.Bs.parallax||0.5;     // 視差スピード比
    me.Bs.opacity=op.Opacity||0.7;          // 基本透過度
    me.Bs.margin=op.Margin||0;              // 左マージン
    me.Bs.menu=op.Menu||'right';            // 右メニュー
    me.Bs.domain=op.Domain||location.hostname.substr(4);
    me.Bs.image=op.Image||{};
    me.Bs.image.pc=me.Bs.image.pc||600;     // PC基本イメージ幅
    me.Bs.image.mobile=me.Bs.image.mobile||300; // mobile基本イメージ幅
    me.Bs.image.fixPc=me.Bs.image.fixPc||600;
    me.Bs.image.fixmobile=me.Bs.image.fixMobile||300;
    me.Bs.image.photoM=me.Bs.image.PhotoM||'auto';
    me.Bs.image.open=me.Bs.image.open||'/image/bg_open.png';
    me.Bs.image.close=me.Bs.image.close||'/image/bg_close.png';
    me.Bs.image.none=me.Bs.image.none||'/image/bg_none.png';
    me.Bs.footer=op.Footer||{};
    me.Bs.footer.remain=me.Bs.footer.remain||0;
    me.Bs.footer.substitue=me.Bs.footer.substtiute||false; //モバイル時フッタをメニューに代替
    me.Bs.footer.rate=me.Bs.footer.rate||80;
    me.Bs.footer.animate=me.Bs.footer.animate||me.Bs.animate;
    me.Bs.elcontents=op.Elcontents||[];
  }
  /**
   * コンテンツエリア（＃Content)の幅をダイレクトに設定
   * @return {object} {main:幅,sub:幅}
   * @method spanning
   */
  spanning() {
    let me=this, wi, wm, ws;

    switch(me.Bs.mode){
    case 'mobile':
      wi=$(window).width(); wm=wi; ws=0;
      break;
    case 'pc':
      wi=$(window).width();
      if(wi-me.Bs.minSide>me.Bs.maxMain){ws=wi-me.Bs.maxMain;}else{ws=me.Bs.minSide;}
      wi=wi-ws; wm=wi;
      break;
    case 'wide':
      if(me.Bs.section.wide=='yes'){wi=$(window).width();}else{wi=me.Bs.maxPc;}
      if(wi-me.Bs.minSide>me.Bs.maxMain){ws=wi-me.Bs.maxMain;}else{ws=me.Bs.minSide;}
      wm=wi-ws;
      if(me.Bs.section.wide=='yes'){wi=Math.floor((wm-10)/2);}else{wi=wm;}
      break;
    }
    $('#Content').find('section').each(function(){me.css($(this), {outerWidth: wi+'px'});});
    $('main').css({margin: 0});
    return {main: wm, sub: ws};
  }
  /**
   * コンテンツのゾーンを制御します。
   * @return {void} none
   * @method zone
   */
  zone() {
    let me=this, wm, ws, wi, ml, oh, num, wk, l, h, i, t, a;
    ////
    //    padding
    var padding=function(wi){
      var pb=Math.floor($(window).height()/2); var hi=0;
      if(me.Bs.mode=='wide' && me.Bs.section.wide=='yes'){wi=Math.floor((wi-10)/2);}
      $('#Content').find('section').each(function(){
        me.css($(this), {height: 'auto', margin: 0, 'padding-bottom': pb+'px'});
        if($(this).outerHeight()>hi){hi=$(this).outerHeight();}
      });
      return {wi: wi, hi: hi};
    };
    ////
    ////
    if(me.Bs.mode=='wide' && me.Bs.section.wide=='no'){wi=me.Bs.maxPc;}
    else{wi=$('body').outerWidth();}
    //
    if(me.Bs.mode=='mobile'){
      wm=$(window).width();
      //      $('#Side').css({display: 'none'});
      if(me.Bs.section.mobile=='horizontal'){
        wk=padding(wm);
        l=0; h=0; i=0; num=0;
        $('#Content').find('section').each(function(){
          me.css($(this), {position: 'absolute', top: 0, left: l+'px', outerHeight: wk.hi+'px'});
          l=l+$(window).width();
          if(h<$(this).outerHeight()){h=$(this).outerHeight();}
          num++;
        });
        wm=wm*num; me.css('#Content', {outerWidth: wm, outerHeight: wk.hi});
      }else{
        wk=padding(wm);
        t=0; $('#Content').find('section').each(function(){
          h=$(this).outerHeight();
          me.css($(this), {position: 'absolute', top: t+'px', left: 0, outerHeight: h});
          t=t+h;
        });
        me.css('#Content', {outerWidth: wm, outerHeight: t+'px'});
      }
      oh=$('#Content').outerHeight();
      if($('#Side').outerHeight()>oh){oh=$('#Side').outerHeight();}
      me.css('#Content', {position: 'absolute', top: 0, left: 0, outerWidth: wm,
        outerHeight: oh
      });
      me.css('#Side', {
        display: 'none', position: 'absolute', top: 0, left: wm+'px', outerWidth: ws,
        outerHeight: oh, 'margin-left': 0
      });
      //      $('#Side').css({height: 0});
    }else{
      if(wi-me.Bs.minSide>me.Bs.maxMain){ws=wi-me.Bs.maxMain;}else{ws=me.Bs.minSide;}
      wm=wi-ws;
      wk=padding(wm);
      if(me.Bs.mode=='wide' && me.Bs.section.wide=='yes'){
        i=0; f=true; a=[]; num=0;
        $('#Content').find('section').each(function(){
          h=$(this).outerHeight();
          if(f){a[i]=h; f=false;}else{if(h>a[i]){a[i]=h;} i++; f=true;}
          num++;
        });
        var f=true; t=0; i=0; $('#Content').find('section').each(function(){
          if(f){l=0; ml=0;}else{l=wk.wi; ml=10;}
          me.css($(this), {
            position: 'absolute', top: t+'px', left: l+'px',
            outerHeight: a[i]+'px', 'margin-left': ml+'px'
          });
          if(f){f=false;}else{f=true; t=t+a[i]; i++;}
        });
        oh=0; for(i in a){oh=oh+a[i];}
        me.css('#Content', {outerHeight: oh+'px'});
      }else{
        padding(wm);
        t=0; num=0;
        $('#Content').find('section').each(function(){
          h=$(this).outerHeight();
          me.css($(this), {position: 'absolute', top: t+'px', left: 0, outerHeight: h});
          t=t+h;
          num++;
        });
        me.css('#Content', {outerWidth: wm, outerHeight: t+'px'});
      }
      //
      $('#Side').css({height: 'auto'});
      oh=$('#Content').outerHeight();
      if($('#Side').outerHeight()>oh){oh=$('#Side').outerHeight();}
      let l1, l2; if(me.Bs.Menu=='right'){l1=0, l2=wm;}else{l1=ws, l2=0;}
      me.css('#Content', {position: 'absolute', top: 0, left: l1, outerWidth: wm,
        outerHeight: oh
      });
      me.css('#Side', {
        display: 'block', position: 'absolute', top: 0, left: l2+'px', outerWidth: ws,
        outerHeight: oh, 'margin-left': 0
      });
    }
    //
    if(!me.Save.zone){if(me.Bs.section.mobile=='horizontal'){
      me.Fdata.section={area: $('main'), max: num, modal: false};
      me.flick(me.Fdata.section, function(data){me.section('indicator.mb', data);});
      me.Save.zone=true;
    }}
    //
  }
  /**
   * ボディの位置調整(直下のタグをpos属性により絶対位置で制御)
   * @return {void} none
   * @method body
   */
  body(mode) {
    let me=this, hi, wi, lf=0, v, top, fixed, tag, main, area=true;
    if(mode=='init'){
      $('html,body').css({hight: 'auto'});
      $('body').children().each(function(){
        if($(this).attr('pane')){
          let h, w;
          $(this).find('img').each(function(){
            h=$(this).outerHeight();
            w=$(this).outerWidth();
          });
          $(this).attr('originHeight', h);
          $(this).attr('originWidth', w);
        }
      });
    }
    //
    if(me.Bs.mode=='wide' && me.Bs.section.wide!='yes'){
      lf=Math.floor(($(window).width()-me.Bs.maxPc)/2);
      wi=me.Bs.maxPc;
    }else{
      wi=$('body').outerWidth();
    }
    me.Bs.margin=lf;
    //
    let h1=$('#Content').outerHeight(); let h2=$('#Side').outerHeight();
    if(h1<h2){h1=h2;}
    me.css($('#Side'), {outerHeight: h1}); me.css($('#Content'), {outerHeight: h1});
    main=h1;
    //
    me.Bs.shrinkHeight=0; me.Save['fixedTop']=0; top=0; fixed=0;
    $('body').children().each(function(){
      let h, r, m, z=1, o='visible', s, w, ow, oh;
      tag=$(this)[0].localName;
      me.Save.pos[tag]=top;
      $(this).css({height: 'auto'});
      if($(this).css('display')=='none'){hi=0;}else{hi=$(this).outerHeight();}
      me.Save.hi[tag]=hi;
      //
      switch($(this).attr('pane')){
      case 'full':
        hi=$(window).height(); o='hidden';
        o='hidden';
        break;
      case 'smooze':
        h=$(this).attr('originHeight');
        hi=Math.floor(h*me.Bs.wwi/me.Bs.maxPc);
        o='hidden';
        break;
      case 'ratio':
        r=$(this).attr('rate'); if(r){r=r-0;}else{r=50;}
        m=$(this).attr('max'); if(m){m=m-0;}else{m=0;}
        hi=Math.floor(me.Bs.whi*r/100);
        if(m){if(hi>m){hi=m;}}
        o='hidden';
        break;
      case 'target':
        s=$(this).attr('size'); if(s){s=s-0;}else{s=me.Bs.widthMobile;}
        r=(me.Bs.wwi-me.Bs.widthMobile)/(me.Bs.maxPc-me.Bs.widthMobile);
        ow=$(this).attr('originWidth'); if(ow){ow=ow-0;}else{ow=me.Bs.maxPc;}
        oh=$(this).attr('originHeight'); if(oh){oh=oh-0;}else{oh=me.Bs.widthMobile;}
        w=s+(ow-s)*r;
        hi=Math.floor(oh*w/ow);
        o='hidden';
        break;
      }
      //
      switch($(this).attr('pos')){
      case 'Fix':
        me.css($(this), {
          'z-index': 500, position: 'fixed', top: top+'px', left: lf+'px',
          width: wi+'px', outerHeight: hi+'px'
        });
        top=top+hi; me.Save.fixedTop+=hi; fixed=fixed+hi;
        break;
      case 'Under':
        hi=0;
        h=$(this).outerHeight();
        me.css($(this), {
          'z-index': 500, position: 'fixed', top: top+'px', left: lf+'px',
          width: wi+'px', outerHeight: hi+'px', overflow: o
        });
        top=top+hi; me.Save['fixedTop']+=h; fixed=fixed+hi;
        break;
      case 'Behind':
        me.css($(this), {
          'z-index': 0, position: 'fixed', top: top+'px', left: lf+'px',
          width: wi+'px', outerHeight: hi+'px', overflow: o
        });
        top=top+hi; me.Bs.shrinkHeight+=hi;
        break;
      case 'Parallax':
        me.css($(this), {
          'z-index': 0, position: 'absolute', top: top+'px', left: lf+'px',
          width: wi+'px', outerHeight: hi+'px', overflow: o
        });
        $(this).attr('save', top); top=top+hi; me.Bs.shrinkHeight+=hi;
        v=$(this).attr('speed')||me.Bs.parallax; $(this).attr('speed', v-0);
        break;
      case 'Remain':
        me.css($(this), {
          'z-index': 500, position: 'absolute', top: top+'px', left: lf+'px',
          width: wi+'px', outerHeight: hi+'px', overflow: o
        });
        $(this).attr('save', top); top=top+hi;
        $(this).attr('fixed', fixed); fixed=fixed+hi; me.Save.fixedTop+=hi;
        break;
      default:
        if(tag=='main'){hi=main;}
        if(area && tag!='a'){
          me.css($(this), {
            'z-index': z, position: 'absolute', top: top+'px', left: lf+'px',
            width: wi+'px', outerHeight: hi+'px', overflow: o
          });
          $(this).attr('save', top); $(this).attr('hi', hi);
          top=top+hi;
        }
      }
      if(tag=='footer'){area=false;}
    });
  }
  /**
   * parallax,remain対応のスクロール
   * @return {integer} スクロールトップ位置
   * @method scroll
   */
  scroll() {
    let me=this, p=$(window).scrollTop();
    $('body').children().each(function(){
      let t, n, d, x, h;
      switch($(this).attr('pos')){
      case 'Parallax':
        t=$(this).attr('save')-0;
        n=t+($(this).attr('speed')-0)*p; $(this).css({top: n+'px'});
        break;
      case 'Under':
        x=$(this).attr('alter');
        if(x){
          h=me.Save.hi['nav'];
          if(p>me.Save.pos['main']){$(this).css({height: h+'px'});}
          else{$(this).css({height: '0'});}
        }
        break;
      case 'Remain':
        t=$(this).attr('save')-0; d=$(this).attr('fixed')-0;
        if(p>t-d){
          $(this).css({position: 'fixed', top: d+'px'});
        }else{
          $(this).css({position: 'absolute', top: t+'px'});
        }
        break;
      }
    });
    return p;
  }
  /**
   * フッターの位置調整
   * @param  {string} mode タイミングinit/cont
   * @param  {integer} pos 位置
   * @return {void}        none
   * @method footer
   */
  footer(mode, pos) {
    let me=this, h, l, d, w={};
    if(mode=='init'){
      $('footer').css({'z-index': 700});
      if(me.Bs.footer.substitue){$('#Menu').on('click', function(){
        $('footer').css({top: $('body').scrollTop()});
        $('footer').attr('saveleft', $('footer').css('margin-left'));
        me.modal('set', function(){
          var l=$('footer').attr('saveleft');
          $('footer').animate({'margin-left': l}, me.Bs.footer.animate);
        });
        $('footer').animate({'margin-left': 0}, me.Bs.footer.animate);
        $('footer').attr('ix', 1);
      });}
      if(me.Bs.footer.remain){
        $('#FTlabel').on('click', function(){
          let t=$('footer').attr('savetop')-0;
          if(t){
            $(window).trigger('footerClose');
          }else{
            $(window).trigger('footerOpen');
          }
        });
        $(window).on('footerClose', function(){
          let t=$('footer').attr('savetop')-0;
          t=me.Bs.whi-me.Bs.footer.remain;
          $('footer').stop(); $('footer').animate({top: t+'px'}, me.Bs.footer.animate);
          $('footer').attr('savetop', 0);
        });
        $(window).on('footerOpen', function(){
          let t=$('footer').position().top-0; $('footer').attr('savetop', t);
          let b=$('footer').css('padding-bottom');
          $('footer').css({height: 'auto'});
          t=me.Bs.whi-$('footer').outerHeight();
          $('footer').stop();
          $('footer').css('padding-bottom', '500px');
          $('footer').animate({top: t+'px'}, me.Bs.footer.animate, function(){
            $('footer').css('padding-bottom', b);
          });
        });
      }

    }
    //
    let substitute=function(){
      h=$(document).outerHeight();
      l=Math.floor($(window).outerWidth()*me.Bs.footer.rate/100);
      $('footer').css({
        top: 0, 'margin-left': -l+'px', width: l+'px', height: h+'px', 'z-index': 700
      });
      $('footer').attr('min', 0); $('footer').attr('max', h);
      me.modal('clear');
    };
    let standard=function(){
      w.ypos=pos+$(window).height()-me.Bs.shrinkHeight;
      w.limit=$('footer').attr('save')-0-me.Bs.shrinkHeight;
      w.usual=me.Bs.whi-me.Bs.footer.remain;
      if(me.Bs.footer.remain==0 || w.limit<=w.ypos){
        d=$('footer').attr('save')-me.Bs.footer.remain;
        $('footer').css({
          position: 'absolute', top: d+'px', width: me.Bs.wwi+'px',
          height: 'auto', 'margin-left': 0
        });
      }else{
        $('footer').css({position: 'fixed', top: w.usual+'px', 'margin-left': 0});
      }
    };
    if(me.Bs.mode=='mobile'){
      if(mode!='init'){$('footer').removeClass('pc');} $('footer').addClass('mobile');
      if(me.Bs.footer.substitute){
        substitute();
      }else{
        standard();
      }
    }else{
      if(mode!='init'){$('footer').removeClass('mobile');} $('footer').addClass('pc');
      standard();
    }
    //
  }
  /**
   * クラスに応じて画像幅を調整します。
   * @method image
   */
  image() {
    let me=this; var w, h, e, p, m, t, l, x, y;
    $('.PhotoF').each(function(){
      if(me.Bs.wwi>me.Bs.maxPc){
        m=Math.floor((me.Bs.wwi-me.Bs.maxPc)/2);
        $(this).css({width: me.Bs.maxPc+'px', margin: '0 '+m+'px'});
      }else{
        $(this).css({width: me.Bs.wwi+'px', margin: 0});
      }
    });
    $('.PhotoG').each(function(){
      if(!$(this).attr('sizeX')){
        $(this).attr('sizeX', $(this).width());
        $(this).attr('sizeY', $(this).height());
        $(this).parent().eq(0).append('<div id="PG" style="overflow: hidden"></div>');
        $(this).appendTo('#PG');
      }
      if(me.Bs.wwi>me.Bs.maxPc){
        m=Math.floor((me.Bs.wwi-me.Bs.maxPc)/2); l=0; t=0;
        $(this).css({width: me.Bs.maxPc+'px', margin: '0 '+m+'px'});
      }else if(me.Bs.wwi<me.Bs.minPc){
        x=Math.floor($(this).attr('sizeX')*$(this).attr('zoom'));
        l=Math.floor(me.Bs.wwi*$(this).attr('gravityX')-x*0.5);
        y=Math.floor($(this).attr('sizeY')*$(this).attr('zoom'));
        h=Math.floor($(this).attr('sizeY')*me.Bs.wwi/$(this).attr('sizeX'));
        t=Math.floor(h*$(this).attr('gravityY')-y*0.5);
        $(this).css({width: w+'px', 'margin-top': t+'px', 'margin-left': l+'px'});
      }else{
        l=0; t=0;
        $(this).css({width: me.Bs.wwi+'px', margin: 0});
      }
      w=me.Bs.wwi;
      h=Math.floor($(this).attr('sizeY')*w/$(this).attr('sizeX'));
      $(this).parent().eq(0).css({width: w+'px', height: h+'px'});
    });
    $('.PhotoP').each(function(){
      w=0; e=$(this);
      while(w==0){
        e=e.parent();
        if(e[0].tagName=='DIV' || e[0].tagName=='SECTION' ||
           e[0].tagName=='HEADER' || e[0].tagName=='FOOTER' || e[0].tagName=='NAV')
        {w=e.width();}
        if(w!=0){$(this).css({width: w+'px'});}
        if(e[0].tagName=='BODY'){w=-1;}
      }
    });
    $('.PhotoS').each(function(){
      if(me.Bs.mode=='mobile'){
        w=Math.floor(me.Bs.image.mobile*me.Bs.scale); $(this).css({width: w+'px'});
      }else{
        w=Math.floor(me.Bs.image.pc*me.Bs.scale); $(this).css({width: w+'px'});
      }
    });
    $('.PhotoM, .photoM').each(function(){
      if(me.Bs.mode=='mobile'){
        w=$(this).parent().css('width');
        w=Math.floor(me.cut(w)*0.99);
        me.css($(this), {outerWidth: w+'px'});
      }else{
        w=me.Bs.image.photoM;
        $(this).css({width: w});
      }
    });
    $('.PhotoU, .photoU').each(function(){
      if(me.Bs.mode=='mobile'){w='100%';}else{w=me.Bs.image.photoM;}
      $(this).css({width: w, cursor: 'w-resize'});
    });
    $('.PhotoC').each(function(){
      p=0; e=$(this); w=$(this).attr('width');
      while(p==0){
        e=e.parent();
        if(e[0].tagName=='DIV' || e[0].tagName=='SECTION' ||
           e[0].tagName=='HEADER' || e[0].tagName=='FOOTER' || e[0].tagName=='NAV')
        {p=e.width();}
        if(e[0].tagName=='BODY'){p=w;}
      }
      if(p<w*me.Bs.sRate){w=p;} $(this).css({width: w+'px'});
    });
    $('.PhotoD').each(function(){
      if(me.Bs.mode=='mobile'){
        w=$(this).attr('msize')||me.Bs.image.fixMobile;
      }else{
        w=$(this).attr('psize')||me.Bs.image.fixPc;
      }
      $(this).css({width: w+'px'});
    });
    $('.PhotoL, .photoL').each(function(){
      let w=0, e=$(this);
      while(w==0){
        e=e.parent();
        if(e[0].tagName=='DIV' || e[0].tagName=='SECTION'){w=e.width();}
        if(w!=0){me.css($(this), {outerWidth: w});}
        if(e[0].tagName=='BODY'){w=-1;}
      }
    });
  }
  /**
   * せり上がりコンテンツ処理
   * @return {void} none
   * @method elcontents
   */
  elcontents() {
    let me=this, i, h, a, c, d;
    if(me.Bs.elcontents.length<1){return;}
    if(!me.Bs.elcontents[0].click){return;}
    for(i in me.Bs.elcontents){
      c=me.Bs.elcontents[i].click; d=me.Bs.elcontents[i].html;
      a=me.Bs.elcontents[i].animate||me.Bs.animate;
      $('#'+c).on('click', function(){if(me.Bs.mode=='mobile'){
        h=$('#'+d).html(); me.elevate(h, a);
        return false;
      }});
    }
  }
  /**
   * 別ウィンドウポップアップ/せり上げ
   * @param  {string} mode タイミングinit/cont
   * @return {bool}        false
   * @method another
   */
  another(mode) {
    var me=this;

    switch(mode){
    case 'init':
      $('.Another').on('click', function(){
        if(me.Bs.mode=='mobile'){
          me.elevate('<iframe src="'+$(this).attr('href')+'"></iframe>');
        }else{
          var wi=$(this).attr('popWidth')-0||me.Bs.pop.width;
          var hi=$(this).attr('popHeight')-0||me.Bs.pop.height;
          var bar=$(this).attr('data-bar')||me.Bs.pop.bar;
          if(bar=='yes'){var x=',scrollbars=yes';}
          window.open($(this).attr('href'), '', 'width='+wi+',height='+hi+x);
          return false;
        }
      });
      return;
    case 'cont':
      if(me.Bs.mode=='mobile'){me.elevate('');}
      return;
    }
  }
  /**
   * せり上がりゾーン処理
   * @param  {string} html      せり上がりゾーン内容HTML
   * @param  {integer} animate  せり上がりアニメーション時間
   * @return {void}             none
   * @method elevate
   */
  elevate(html, animate) {
    let me=this, t, l, w; animate=animate||me.Bs.animate;
    if(!document.getElementById('Elevate')){
      $('body').append(
        '<div id="Elevate" style="display: none;">'+
        '<img id="Eclose" src="'+me.pngclose+'"/></div>'
      );
      $('#Elevate').on('click', '#Eclose', function(){
        if($('#Elevate').attr('state')=='on'){
          t=$(window).height()+$(window).scrollTop(); $('#Elevate').stop();
          $('#Elevate').animate({top: t+'px'}, animate, function(){
            $('#Elevate').attr('state', ''); $('#Elevate').html('');
            $('#Elevate').css({display: 'none'});
          });
        }
      });
    }
    if(html==''){
      if($('#Elevate').attr('state')=='on'){
        t=$(window).height(); $('#Elevate').css({top: t+'px'});
        $('#Elevate').attr('state', ''); $('#Elevate').html('');
        $('#Elevate').css({display: 'none'});
      }
    }else{
      t=$(window).height()+$(window).scrollTop(); w=$(window).width();
      me.css($('#Elevate'), {
        position: 'absolute', top: t+'px', left: 0, outerWidth: w, 'z-index': 800,
        display: 'block'
      });
      $('#Elevate').html('<img id="Eclose" src="'+me.pngclose+'"/>'+html);
      l=$(window).width()-$('#Eclose').outerWidth();
      $('#Eclose').css({position: 'absolute', top: 0, left: l+'px', 'z-index': 810});
      t=t-$('#Elevate').outerHeight();
      $('#Elevate').stop(); $('#Elevate').animate({top: t+'px'}, animate);
      $('#Elevate').attr('state', 'on');
    }
  }
};
console.log(typeof(kwResponsive));
