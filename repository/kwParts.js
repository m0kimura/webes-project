'use strict';
/* global kwBase _gaq */
let kwParts=class kwParts extends kwBase {
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
  constructor(op, Bs, Sec, Save, Fdata) {
    super(op, Bs, Sec, Save, Fdata);
  }
  /**
   * 共通変数設定
   * @param  {object} op 実行時オプション
   * @method setConfig
   */
  setConfig(op) {
    let me=this;
    me.Bs.cell=op.Cell||{};
    me.Bs.cell.priority=me.Bs.cell.priority||'width'; //優先モード
    me.Bs.cell.pc=me.Bs.cell.pc||200;       // Pcセル幅
    me.Bs.cell.mobile=me.Bs.cell.mobile||120; // Mobileセル幅
    me.Bs.cell.base=me.Bs.cell.base||120; // セル幅基準
    me.Bs.cell.max=me.Bs.cell.max||5; // 横並び最大個数
    me.Bs.cell.min=me.Bs.cell.min||2; // 横並び最小個数
    me.Bs.sns=op.Sns||{};
    me.Bs.sns.width=me.Bs.sns.width||500;
    me.Bs.sns.height=me.Bs.sns.height||500;
    me.Bs.sns.option=me.Bs.sns.option||'personalbar=0,toolbar=0,scrollbars=1,resizable=1';
    me.Bs.tipup=op.Tipup||{};
    me.Bs.tipup.xdiff=me.Bs.tipup.xdiff||30;
    me.Bs.tipup.ydiff=me.Bs.tipup.ydiff||60;
    me.Bs.analytics=op.Analytics||{};
    me.Bs.analytics.index=me.Bs.analytics.index||1;
    me.Bs.analytics.name=me.Bs.analytics.name||'key';
    me.Bs.analytics.value=me.Bs.analytics.value||'';
    me.Bs.analytics.scope=me.Bs.analytics.scope||3;
    me.Bs.logo=op.Logo||{};
    me.Bs.logo.right=me.Bs.logo.right||20;
    me.Bs.logo.top=me.Bs.logo.top||300;
    me.Bs.logo.next=me.Bs.logo.next||me.Bs.logo.top;
    me.Bs.logo.max=me.Bs.logo.max||120;
    me.Bs.logo.min=me.Bs.logo.min||me.Bs.logo.max;
  }
  /**
   * イメージ設定、フレーム枠組み前の処理
   * @return {void} none
   * @method onFirst
   */
  onFirst() {
    this.ajaxSource(); this.listing();
  }
  /**
   * イメージ、枠、設定後初期処理
   * @return {void} none
   * @method onInit
   */
  onInit() {
    this.sns(); this.depend(); this.hide(); this.cell();
    this.logo('init'); this.swing('init');
  }
  /**
   * 表示設定終了後最終段階処理
   * @method onLast
   */
  onLast() {
    this.photoUp(); this.tipup(); this.rollover();
  }
  /**
   * ウィンドウリサイズ時処理
   * @return {void} none
   * @method onResize
   */
  onResize() {
    this.depend(); this.hide(); this.cell(); this.listing();
    this.logo('cont', $(window).scrollTop());
    this.swing('cont');
  }
  /**
   * 画面スクロール時処理
   * @return {void} none
   * @method onScroll
   */
  onScroll(pos) {
    this.logo('cont', pos);
  }
  /**
   * class=Depend対応（src属性をパソコンとモバイルで切り分ける）
   * @method depend
   */
  depend() {
    var me=this; if(me.Bs.mode==me.Save.mode){return;}

    $('.Depend').each(function(){
      var f; if(me.Bs.mode=='mobile'){f=$(this).attr('mobile');}else{f=$(this).attr('pc');}
      if(f){$(this).attr('src', f);}
    });
  }
  /**
   * class=Pc/Mobile対応（Pc/Mobileの時だけ表示）
   * @method hide
   */
  hide() {
    let me=this; if(me.Bs.mode==me.Save.mode){return;}
    if(me.Bs.mode=='mobile'){
      $('.Pc').each(function(){$(this).css({display: 'none'});});
      $('.Mobile').each(function(){$(this).css({display: 'block'});});
      $('.Pci').each(function(){$(this).css({display: 'none'});});
      $('.Mobilei').each(function(){$(this).css({display: 'inline'});});
    }else{
      $('.Pc').each(function(){$(this).css({display: 'block'});});
      $('.Mobile').each(function(){$(this).css({display: 'none'});});
      $('.Pci').each(function(){$(this).css({display: 'inline'});});
      $('.Mobilei').each(function(){$(this).css({display: 'none'});});
    }
  }
  /**
   * ロゴ表示オペレーション
   * @param  {string} mode 処理タイミング init/cont
   * @method logo
   */
  logo(mode, pos) {
    var me=this; var tp, lf, wi;
    if(!me.Bs.logo.image){return;}
    ////
    //  molding
    switch(mode){
    case 'init':
      $('body').append('<a href="/index.html"><img id="Logo" src="'+me.Bs.logo.image+'" alt="ロゴマーク"/></a>');
      //      $('body').append('<img id="Logo" src="'+me.Bs.logo.image+'" alt="ロゴマーク"/>');
      if(me.Bs.mode=='mobile'){
        wi=me.Bs.logo.min;
        $('#Logo').css({
          position: 'fixed', bottom: '10px', right: '10px', width: wi+'px', 'z-index': 1
        });
      }else{
        tp=Math.floor(me.Bs.logo.top*me.Bs.scale);
        lf=Math.floor(me.Bs.wwi-(me.Bs.logo.right+me.Bs.logo.max)*me.Bs.scale)+me.Bs.margin;
        wi=Math.floor(me.Bs.logo.max*me.Bs.scale);
        $('#Logo').css({
          position: 'absolute', top: tp+'px', left: lf+'px', width: wi+'px', 'z-index': 600
        });
      }
      return;
      ////
      //  scroll
    case 'cont':
      if(me.Bs.mode=='mobile'){
        wi=me.Bs.logo.min;
        $('#Logo').css({
          position: 'fixed', bottom: '10px', right: '10px', width: wi+'px', 'z-index': 1,
          top: '', left: ''
        });
      }else{
        let p1=Math.floor(me.Bs.logo.top*me.Bs.scale);
        let p2=p1+Math.floor(me.Bs.logo.max*me.Bs.scale);
        let wl=Math.floor(me.Bs.logo.max*me.Bs.scale), ws=me.Bs.logo.min;
        if(pos>p2){
          tp=Math.floor(me.Bs.logo.next*me.Bs.scale+pos-p2);
          wi=me.Bs.logo.min;
          lf=Math.floor(me.Bs.wwi-me.Bs.logo.right*me.Bs.scale-ws)+me.Bs.margin;
        }else if(pos>p1){
          tp=Math.floor(me.Bs.logo.top*me.Bs.scale
            +(me.Bs.logo.next-me.Bs.logo.top)*me.Bs.scale*(pos-p1)/(p2-p1));
          wi=Math.floor(wl-((wl-ws)*(pos-p1)/(p2-p1)));
          lf=Math.floor(me.Bs.wwi-(me.Bs.logo.right*me.Bs.scale+wi))+me.Bs.margin;
        }else{
          tp=Math.floor(me.Bs.logo.top*me.Bs.scale);
          lf=Math.floor(me.Bs.wwi-(me.Bs.logo.right+me.Bs.logo.max)*me.Bs.scale)+me.Bs.margin;
          wi=Math.floor(me.Bs.logo.max*me.Bs.scale);
        }
        $('#Logo').css({
          position: 'absolute', top: tp+'px', left: lf+'px', width: wi+'px', 'z-index': 600,
          bottom: '', right: ''
        });
      }
      return;
    }
  }
  /**
   * セルの大きさを合わせる
   * @method cell
   */
  cell() {
    let me=this, w, m, n, h, max, min, s, i, l, r, p;

    $('.Cell').each(function(){
      p=$(this).attr('priority')||me.Bs.cell.priority;
      if(p=='number'){
        w=$(this).attr('base')||me.Bs.cell.base;
        min=$(this).attr('min')||me.Bs.cell.min;
        max=$(this).attr('max')||me.Bs.cell.max;
        n=Math.floor($(this).width()/w);
        if(n<min){n=min;} if(n>max){n=max;}
        w=Math.floor($(this).width()/n);
        s=Math.floor(($(this).width()-w*n)/2);

        max=0; i=1; $(this).children().each(function(){
          r=0; l=0; if(i==1){l=s;} if(i==n){r=s;}
          $(this).css({'margin-left': l+'px', 'margin-right': r+'px', width: w+'px'});
          $(this).css({float: 'left'});
          h=$(this).height(); if(h>max){max=h;}
          i++; if(i>n){i=1;}
        });
        $(this).children().each(function(){$(this).css({height: max+'px'});});
      }else{
        if(me.Bs.mode=='mobile'){w=$(this).attr('mobile')||me.Bs.cell.mobile;}
        else{w=$(this).attr('pc')||me.Bs.cell.pc;}
        n=Math.floor($(window).width/w); m=($(window).width-(n*w))/(n*2);
        max=0;

        $(this).children().each(function(){
          $(this).css({'margin-left': m+'px', 'margin-right': m+'px', width: w+'px'});
          $(this).css({float: 'left'});
          h=$(this).height(); if(h>max){max=h;}
        });
        $(this).children().each(function(){$(this).css({height: max+'px'});});
      }
    });
  }
  listing() {
    let me=this, w, x, a;
    $('.Listing').each(function(){
      w=350;
      a=me.Bs.wwi; if(a<w){w=a-10;}
      x=Math.floor(a/(w+10))+1;
      w=Math.floor(a/x);
      $(this).find('dt').each(function(){
        me.css($(this), {outerWidth: a+'px'});
      });
      $(this).find('dd').each(function(){
        me.css($(this), {outerWidth: a+'px'});
        $(this).find('div').each(function(){
          $(this).css({width: w+'px', overflow: 'hidden', float: 'left'});
        });
      });
    });
  }
  /**
   * ロールオーバ処理
   * @return {void} none
   * @method rollover
   */
  rollover() {
    let me=this, op=me.Bs.rollover||{}; op.over=op.over||'_r';
    $('img.Rollover').each(function(){let x=$(this).attr('src'); $(this).attr('save', x);});
    $('img.Rollover').on('mouseover', function(){
      let x=$(this).attr('save'); x=me.insert(x, op.over); $(this).attr('src', x);
    });
    $('img.Rollover').on('mouseout', function(){
      let x=$(this).attr('save'); if(x){$(this).attr('src', x);}
    });
  }
  /**
   * class=Load対応ソースをダイナミックに展開
   * @return {void} none
   * @method ajaxSource
   */
  ajaxSource() {
    let m, e;
    $('.Load').each(function(){
      m=$(this).attr('href'); e=$(this);
      $.ajax({async: false, url: m, success: function(data){e.html(data);}});
    });
  }
  /**
   * 画像を拡大してポップアップ
   * @return {void} none
   * @method photoUp
   */
  photoUp() {
    let me=this, x, wn, hn, px, py, r, rh, rw, f;

    if(!document.getElementById('PhotoU'))
    {x='<img id="PhotoU" src="" />'; $('body').append(x);}
    me.Fdata.photo={area: $('#PhotoU'), mode: 'move'};
    me.flick(me.Fdata.photo);
    $('#PhotoU').on('load', function(){
      rh=$(window).height()/$('#PhotoU').height(); rw=$(window).width()/$('#PhotoU').width();
      if(rh>1.1 && rw>1.1){
        py=Math.floor(($(window).height()-$('#PhotoU').height())/2);
        px=Math.floor(($(window).width()-$('#PhotoU').width())/2);
        hn=$('#PhotoU').height(); wn=$('#PhotoU').width();
      }else{
        if(rh<rw){r=rw*0.9;}else{r=rh*0.9;}
        hn=Math.floor($('#PhotoU').height()*r); wn=Math.floor($('#PhotoU').width()*r);
        py=Math.floor(($(window).height()-hn)/2);
        px=Math.floor(($(window).width()-wn)/2);
      }
      $('#PhotoU').css({
        width: wn+'px', height: hn+'px',
        position: 'fixed', top: py+'px', left: px+'px',
        'z-index': 1010
      });
    });
    //
    $('.PhotoU, .photoU').on('click', function(){
      f=$(this).attr('href');
      if(!f){f=me.insert($(this).attr('src'), '_r');}
      $('#PhotoU').attr('src', f);
      $('#PhotoU').css({display: 'block'});
      me.modal('set', function(){
        $('#PhotoU').css({display: 'none'});
      });
    });
    //
  }
  /**
   * ALT属性のホーバーでのポップアップ
   * @return {void} none
   * @method tipup
   */
  tipup() {
    let me=this, x, y, z, t, w;

    var elm=document.getElementById('Tipup');
    if(!elm){
      $('body').append('<div id="Tipup"> </div>');
      $('#Tipup').css({opacity:0.9, position:'fixed', display:'none', 'z-index': 1000});
    }

    $('.Tipup').on('mouseover', function(e){
      y=e.clientY-me.Bs.tipup.ydiff; x=e.clientX+me.Bs.tipup.xdiff;
      t=$(this).attr('alt'); $('#Tipup').html(t);
      w=$('#Tipup').outerWidth();
      z=e.pageX+me.Bs.tipup.xdiff+w;
      if(z>$(window).width()){x=$(window).width()-w-20;}
      $('#Tipup').css({top: y+'px', left: x+'px'});
      if(t){$('#Tipup').show();}
    });
    $('.Tipup').on('mouseout', function(){$('#Tipup').hide();  $('#Tipup').html('');});
    $('.Tipup').on('mousemove', function(e){
      y=e.clientY-me.Bs.tipup.ydiff; x=e.clientX+me.Bs.tipup.xdiff;
      t=$(this).attr('alt'); $('#Tipup').html(t);
      w=$('#Tipup').outerWidth();
      z=e.pageX+me.Bs.tipup.xdiff+w;
      if(z>$(window).width()){x=$(window).width()-w-20;}
      $('#Tipup').css({top: y+'px', left: x+'px'});
    });
  }
  /**
   * GoogleAnalytics 処理
   * @method analytics
   */
  analytics() {
    var me=this; var a;
    if(me.Bs.analytics.account){
      _gaq.push(['_setAccount', me.Bs.analytics.account], ['_setDomainName', me.Bs.domain]);
      a=[]; if(me.Bs.analytics.value){
        a[0]='_setCustomVar'; a[1]=me.Bs.analytics.index;
        a[2]=me.Bs.analytics.name; a[3]=me.Bs.analytics.value; a[4]=me.Bs.analytics.scope;
        _gaq.push(a);
      }
      a=[]; if(me.Bs.analytics.vertial){
        a[0]='_trackPageview'; //a[1]=me.Bs.analytics.vertial;
        _gaq.push(a);
      }
      _gaq.push(['_setCustomVar', 1, 'Section', 'Life & Style', 3]);
      _gaq.push(['_trackPageview']);

      window.anlyt=(function(){
        let ga=document.createElement('script'); ga.type='text/javascript'; ga.async=true;
        ga.src=('https:' == document.location.protocol ? 'https://ssl' : 'http://www')
          +'.google-analytics.com/ga.js';
        var s=document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      });
    }
  }
  /**
   * twitterサブウィンドウ
   * @method twitter
   */
  twitter() {
    window.twttr=(function(d, s, id){
      let js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};
      if(d.getElementById(id)){return;}
      js=d.createElement(s); js.id=id; js.src='https://platform.twitter.com/widgets.js';
      fjs.parentNode.insertBefore(js,fjs);
      t._e=[];t.ready=function(f){t._e.push(f);};return t;
    }(document,'script','twitter-wjs'));
  }
  /**
   * facebooサブウィンドウ
   * @method facebook
   */
  facebook() {
    window.facebk=(function(d, s, id){
      let js, fjs = d.getElementsByTagName(s)[0];
      if(d.getElementById(id)){return;}
      js=d.createElement(s); js.id=id;
      js.src = '//connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v2.0';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }
  /**
   * SNS関連処理
   * @method sns
   */
  sns() {
    let me=this;

    let wi=me.Bs.sns.width, hi=me.Bs.sns.height, op=me.Bs.sns.option;
    let f=true, t=true;
    $('.Sns').each(function(){
      if($(this).attr('alt')=='twitter'){if(t){me.twitter(); t=false;}}
      if($(this).attr('alt')=='facebook'){if(f){me.facebook(); f=false;}}
    });

    $('.Sns').on('click', function(){
      switch($(this).attr('alt')){
      case 'twitter':
        window.open(
          'https://twitter.com/intent/tweet?url='+location.href+'&text='+document.title
            +'&tw_p=tweetbutton',
          'tweet',
          'width='+wi+',height='+hi+','+op
        );
        break;
      case 'facebook':
        window.open(
          'https://www.facebook.com/sharer/sharer.php?u='+location.href,
          'facebookいいね',
          'width='+wi+',height='+hi+','+op
        );
        break;
      case 'gplus':
        window.open(
          'https://plusone.google.com/_/+1/confirm?hl=ja&url='+location.href+'&title='
            +document.title,
          'google plus',
          'width='+wi+',height='+hi+','+op
        );
        break;
      }
      return false;
    });

  }
  /**
   * DL領域の開閉
   * @return {Void} none
   * @method swing
   */
  swing(mode) {
    let me=this;
    //
    $('.Swing').each(function(){
      let f, op, cl;
      f=false;
      switch($(this).attr('mode')){
      case 'mobile': if(me.Bs.mode=='mobile'){f=true;} break;
      case 'pc': if(me.Bs.mode=='pc'){f=true;} break;
      default: f=true;
      }
      op=$(this).attr('open')||me.Bs.image.open;
      cl=$(this).attr('close')||me.Bs.image.close;
      if(f){
        $(this).find('dt').css({'background': 'url('+cl+') no-repeat bottom left'});
        $(this).find('dd').css({display: 'none'});
      }else{
        $(this).find('dt').css({'background': 'url('+op+') no-repeat bottom left'});
        $(this).find('dd').css({display: 'block'});
      }
    });

    if(mode=='init'){
      $('.Swing dt').on('click', function(){
        let op, cl, p, e, s;
        p=$(this).parents().eq(0);
        e=p.attr('event');
        op=p.attr('open')||me.Bs.image.open;
        cl=p.attr('close')||me.Bs.image.close;
        s=p.find('dd').css('display');
        if(s=='block'){
          p.find('dt').css({'background': 'url('+cl+') no-repeat bottom left'});
          p.find('dd').css({display: 'none'});
        }else{
          p.find('dt').css({'background': 'url('+op+') no-repeat bottom left'});
          p.find('dd').css({display: 'block'});
        }
        if(e){$(window).trigger(e);}
        return false;
      });
    }
  }
};
console.log(typeof(kwParts));
