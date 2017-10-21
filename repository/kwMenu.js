/* global kwBase */
let kwMenu=class kwMenu extends kwBase {
  /**
   * オブジェクトコンストラクション
   * @param  {object} op    実行時オプション
   * @param  {object} Bs    共通パラメータ
   * @param  {object} Save  セション越え持ち越しデータ
   * @param  {object} Sec   セクション管理データ
   * @param  {object} Fdata フリック制御データ
   * @return {void}         none
   * @method
   */
  constructor(op, Bs, Save, Sec, Fdata) {
    super(op, Bs, Save, Sec, Fdata);
  }
  /**
   * 共通変数設定
   * @param  {object} op 実行時オプション
   * @method
   */
  setConfig(op) {
    let me=this;
    me.Bs.locateSide=op.LocateSide||'no';
    me.Bs.section=op.Section||{};
    me.Bs.section.mobile=me.Bs.section.mobile||'vertical';
    me.Bs.section.wide=me.Bs.section.wide||'no';
    me.Bs.section.type=me.Bs.section.type||'Posbar';
    me.Bs.scroll=op.Scroll||{};
    me.Bs.scroll.animate=me.Bs.scroll.animate||me.Bs.animate;
    me.Bs.slidein=op.Slidein||{};
    me.Bs.slidein.animate=me.Bs.slidein.animate||op.Animate;
    me.Bs.accordion=op.Accordion||{};
    me.Bs.accordion.image=me.Bs.accordion.image||'/image/sign.png';
    me.Bs.accordion.mobile=me.Bs.accordion.mobile||me.Bs.accordion.image;
    me.Bs.accordion.animate=me.Bs.accordion.animate||me.Bs.animate;
  }
  /**
   * イメージ、枠、設定後初期処理
   * @return {void} none
   * @method
   */
  onInit() {
    this.section('init');
    this.section('padding'); this.folding('init');
    //this.section('position');
    this.locateSide('init');
  }
  /**
   * ウィンドウリサイズ時処理
   * @return {void} none
   * @method
   */
  onResize() {
    this.section('padding'); this.folding(); this.slidein('out');
  }
  /**
   * 画面スクロール時処理
   * @return {[void} none
   * @method
   */
  onScroll(pos) {
    this.section('indicator', pos);
    this.locateSide('cont', pos);
    this.slidein('out');
  }
  /**
   * 表示設定終了後最終段階処理
   * @method
   */
  onLast() {
    this.section('position'); this.section('monitor');
    this.locateSide('init'); this.slidein('init');
    let x=location.hash; if(x){this.section('goto', x);}
  }
  /**
   * 右サイドからのメニュースライドイン
   * @param  {string} mode 処理タイミング init/out
   * @return {void}        none
   * @method
   */
  slidein(mode) {
    let me=this, l, m, d, t, w, h; if(!me.Bs.slidein.use){return;}
    switch(mode){
    case 'init':
      me.Save.slidein=me.Save.slidein||{}; me.Save.slidein.on=false;
      $('body').append('<div id="East"></div>');
      d=$('#Side').html(); $('#East').html(d);
      $('#East').css({height: 'auto'});
      $('#East').css({
        position: 'absolute', top: 0, left: '2000px', 'z-index': 700, display: 'none'
      });
      $('.Slidein').on('click', function(){
        m=$('#East').css('margin-left');
        if(me.cut(m)!=0){
          me.Save.slidein.on=false;
          l=$(window).width();
          $('#East').stop();
          $('#East').animate({'margin-left': 0}, me.Bs.slidein.animate, function(){
            $('#East').css({display: 'none'});
            me.modal('clear');
          });
        }else{
          me.Save.slidein.on=true;
          me.modal('set', function(){
            $('#East').css({'margin-left': 0, display: 'none'});
            me.Save.slidein.on=false;
          });
          l=$(window).width(); t=$(window).scrollTop(); w=Math.floor(l*0.7);
          h=$('#East').outerHeight(); if(h<me.Bs.whi){h=me.Bs.whi;}
          $('#East').css({
            display: 'block', position: 'absolute', top: t+'px', left: l+'px',
            width: w+'px', height: h+'px'
          });
          m=$('#East').outerWidth()*-1;
          $('#East').stop();
          $('#East').animate({'margin-left': m+'px'}, me.Bs.slidein.animate);
        }
        return false;
      });
      me.Fdata.slidein={area: $('#East'), direct: 'V', mode: 'move', modal: true};
      me.flick(me.Fdata.slidein, function(){
        //$('#East').css({display: 'none', 'margin-left': 0, left: '2000px'});
        //me.Save.slidein.on=false;
      });
      return;
    case 'out':
      l=$(window).width();
      $('#East').stop();
      $('#East').css({'margin-left': 0, display: 'none', left: '2000px'});
      me.modal('clear');
      return false;
    }
  }
  /**
   * サイドメニューの自動位置づけ
   * @param  {string} mode タイミングinit/cont
   * @param  {integer} pos 位置
   * @return {void}        none
   * @method
   */
  locateSide(mode, pos) {
    let me=this, k, p, h, s, y;
    if(me.Bs.locateSide=='yes'){
      s='#Top';
      if(mode=='init'){
        me.Save.sidepad=parseInt($('#Side').css('padding-top'))-0;
      }else{
        s='#Top';
        for(k in me.Sec){if(pos<me.Sec[k].pos){break;} s=k;}
        if(s=='#Top'){y=0;}else{y=$(s).position().top;}
        //if(s=='#Top'){p=me.Save.sidepad;}
        //else{p=me.Sec[s].pos-me.Bs.shrinkHeight+me.Save.sidepad;}
        p=y+me.Save.sidepad;
        h=$('#Side').outerHeight();
        $('#Side').css({'padding-top': p+'px'});
        me.css($('#Side'), {outerHeight: h});
      }
    }
  }
  /**
   * ドロップダウンメニュー
   * @method
   */
  dropdown() {
    let me=this, op=me.Bs.dropdown, vi, o, s;
    $('.Dropdown').each(function(){
      vi=op.animate||500;
      $(this).find('dd').css('display', 'none');
      $(this).find('dt').click(function(){
        if($(this).siblings().css('display')=='block'){
          $(this).siblings().slideUp(vi); o=$(this).find('img');
          if(o){s=o.attr('data-src'); o.attr('src', s);}
        }else{
          $(this).siblings().slideDown(vi); o=$(this).find('img');
          if(o){
            s=o.attr('src');
            o.attr('data-src', s); o.attr('src', me.insert(s, '_r'));
          }
        }
      });
    });
  }
  /**
   * アコーディオンメニュー
   * @param  {string} mode 処理タイミング init/cont
   * @method
   */
  accordion(mode){
    let me=this;
    ////
    //  initialize 初期化
    let initialize=function(dl){
      let s=dl.attr('img')||me.Bs.accordion.image;
      if(me.Bs.mode=='mobile'){s=dl.attr('mobile')||me.Bs.accordion.mobile||s;}
      dl.attr('save', s);

      if(dl.attr('state')!='open')
      {s=me.insert(s, '_r'); dl.find('dd').css('display', 'none');}
      dl.find('dt').prepend('<img src="'+s+'"/>');
    };
    ////
    //  changeImage イメージ対応
    let changeImage=function(dl){
      let s;
      dl.find('dt').each(function(){
        s=dl.attr('save');
        if(me.Bs.mode=='mobile'){s=dl.attr('mobile')||me.Bs.accordion.mobile||s;}
        if(dl.attr('state')!='open'){s=me.insert(s, '_r');}
        $(this).find('img').attr('src', s);
      });
    };
    ////
    //  monitoring クリック監視
    let monitoring=function(dl, vi){
      dl.find('dt').each(function(){
        let dt=$(this), s;
        dt.on('click', function(){
          s=dl.attr('save');
          if(dl.attr('state')!='open'){
            dl.find('dd').slideDown(vi); dl.attr('state', 'open');
          }else{
            dl.find('dd').slideUp(vi); dl.attr('state', 'close'); s=me.insert(s, '_r');
          }
          dt.find('img').attr('src', s);
          me.section('position');
        });
      });
    };
    ////
    $('.Accordion').each(function(){
      let dl=$(this);
      let vi=dl.attr('animate')||me.Bs.accordion.animate;

      if(mode=='init'){
        initialize(dl, vi); monitoring(dl, vi);
      }else{
        changeImage(dl);
      }
    });
  }
  /**
   * 折りたたみメニュー
   * @param  {string} mode 処理タイミング init/cont
   * @method
   */
  folding(mode) {
    let me=this, f, g, op, cl, no, o;

    f=true; $('.Folding').eq(0).each(function(){f=false;}); if(f){return;}

    if(mode=='init'){

      $('.Folding dl dt').on('click', function(){
        f=false;
        o=$(this).parents().eq(1);
        switch(o.attr('mode')){
        case 'mobile': if(me.Bs.mode=='mobile'){f=true;} break;
        case 'pc': if(me.Bs.mode=='pc'){f=true;} break;
        default: f=true;
        }

        op=$(this).attr('open')||me.Bs.image.open;
        cl=$(this).attr('close')||me.Bs.image.close;
        no=$(this).attr('none')||me.Bs.image.none;

        if(f){
          $(this).parent('dl').siblings().each(function(){
            $(this).find('dt').css({'background-image': 'url('+cl+')'});
            $(this).find('dd').css({display: 'none'});
          });
          $(this).parent('dl').eq(0).find('dt').css({'background-image': 'url('+op+')'});
          $(this).parent('dl').eq(0).find('dd').css({display: 'block'});
        }
      });

    }

    $('.Folding').each(function(){

      f=false;
      switch($(this).attr('mode')){
      case 'mobile': if(me.Bs.mode=='mobile'){f=true;} break;
      case 'pc': if(me.Bs.mode=='pc'){f=true;} break;
      default: f=true;
      }

      op=$(this).attr('open')||me.Bs.image.open;
      cl=$(this).attr('close')||me.Bs.image.close;
      no=$(this).attr('none')||me.Bs.image.none;

      if(f){
        $(this).find('dl').each(function(){
          g=true; $(this).find('a').each(function(){
            if($(this).attr('class')=='now'){g=false;}
          });
          if(g){
            $(this).find('dt').css({'background-image': 'url('+cl+')'});
            $(this).find('dd').css({display: 'none'});
          }else{
            $(this).find('dt').css({'background-image': 'url('+op+')'});
            $(this).find('dd').css({display: 'block'});
          }
        });
      }else{
        $('.Folding').find('dl').each(function(){
          $(this).find('dt').css({'background-image': 'url('+no+')'});
          $(this).find('dd').css({display: 'block'});}
        );
      }
    });
  }
  /**
   * セクションメニュー
   * @param  {string} mode   処理モード init/position/goto/indicator
   * @param  {integer} pos   ページ縦位置
   * @param  {bool} direct   移動時アニメーションなし
   * @method
   */
  section(mode, pos, direct) {
    let me=this, id, p, t, out, k, s, i, j, f, y, nx, pr, obj;
    switch(mode){
    case 'init':
      // 初期化
      me.Save.section=false;
      if(me.Bs.section.type=='injection'){
        $('.Gmenu').find('.now').find('dd').each(function(){
          $(this).html('<div class="Posbar"></div>');
        });
      }
      $('.Posbar').each(function(){
        out='<ul>';
        let now='now'; i=0;
        $('section').each(function(){
          id='#'+$(this).attr('id');
          if(i==0 && id!='#Top'){
            me.Sec['#Top']={}; me.Sec['#Top'].index=i; me.Sec['#Top'].title='トップ';
            me.Sec['#Top'].pos=0;
            out+='<li class="'+now+'"><a href="#Top">トップ</a></li>';
            i=1;
          }
          t=$(this).find('h2').html();
          if(t){
            p=t.search(/\//); if(p>0){t=t.substr(0, p);}
            out+='<li class="'+now+'"><a href="'+id+'">'+t+'</a></li>';
            now='';
            if(!me.Sec[id]){me.Sec[id]={};}
            me.Sec[id].title=t; me.Sec[id].index=i;
          }else{
            console.log('<h2>tag not found');
            if(!me.Sec[id]){me.Sec[id]={};} me.Sec[id].title='Not Found';
          }
          i++;
        });
        out+='</ul>';
        $(this).html(out);
        me.Save.section=true;
      });

      obj=$('.Posbar').find('li').eq(1);
      if(obj.length){
        $('#SectionNext').attr('href', obj.find('a').attr('href'));
        $('#SectionNext').attr('alt', obj.find('a').html());
        $('#SectionNext').css({opacity: 1.0});
      }else{
        $('#SectionNext').attr('href', '');
        $('#SectionNext').attr('alt', '');
        $('#SectionNext').css({opacity: 0.5});
      }
      $('#SectionPrev').attr('href', '');
      $('#SectionPrev').attr('alt', '');
      $('#SectionPrev').css({opacity: 0.5});
      $('.Posbar').find('li').eq(0).attr('class', 'now');
      return;
    // 監視
    case 'monitor':
      $(document).on('click', '.Posbar a', function(){
        var x=$(this).attr('href'); if(x){me.section('goto', x);}
        return false;
      });
      $('#SectionNext, #SectionPrev').click(function(){
        let x=$(this).attr('href'); if(x){me.section('goto', x);}
        return false;
      });
      return;
    // 位置づけ
    case 'position':
      if(!me.Save.section){return;}
      $('section').each(function(){
        k='#'+$(this).attr('id');
        if(k=='#Top'){y=0;}
        else{
          //y=$(k).position().top+$('main').position().top-me.Save.fixedTop;
          y=$(k).position().top-me.Save.fixedTop;
        }
        me.Sec[k].pos=y;
      });
      return;
    // スクロール
    case 'goto':
      if(!me.Save.section){return;}

      if(me.Bs.mode=='mobile' && me.Bs.section.mobile=='horizontal'){
        me.Fdata.section.move=me.Sec[pos].index+1;
        me.flick(me.Fdata.section, function(data){me.section('indicator.mb', data);});
      }else{
        let tag;
        if(navigator.userAgent.toLowerCase().indexOf('applewebkit')>0){tag='body';}else{tag='html';}
        if(pos.charAt(0)=='#'){
          me.Now=pos;
          let y;
          if(pos=='#Top'){y=0;}else{y=$(pos).position().top+$('main').position().top-me.Save.fixedTop;}
          if(direct){$(tag).scrollTop(y);}
          else{$('body').animate({'scrollTop': y}, me.Bs.scroll.animate, 'swing');}
        }
      }
      return false;
    // ナウ(Now)表示制御
    case 'indicator':
      if(!me.Save.section){return;}
      $('.Posbar').each(function(){
        s='#Top'; j=0; f=true; i=0;
        for(k in me.Sec){
          $(this).find('li').eq(i).attr('class', '');
          if($(k).position()){
            y=$(k).position().top+$('main').position().top-me.Save.fixedTop;
            if(pos<y){f=false;} if(f){s=k; j=i;}
          }
          i++;
        }
        $(this).find('li').eq(j).attr('class', 'now');
        me.Now=s;
        nx=j+1; pr=j-1; obj;
        obj=$('.Posbar').find('li').eq(nx);
        if(obj.length){
          $('#SectionNext').attr('href', obj.find('a').attr('href'));
          $('#SectionNext').attr('alt', obj.find('a').html());
          $('#SectionNext').css({opacity: 1.0});
        }else{
          $('#SectionNext').attr('href', '');
          $('#SectionNext').attr('alt', '');
          $('#SectionNext').css({opacity: 0.5});
        }
        if(pr<0){
          $('#SectionPrev').attr('href', '');
          $('#SectionPrev').attr('alt', '');
          $('#SectionPrev').css({opacity: 0.5});
        }else{
          obj=$('.Posbar').find('li').eq(pr);
          $('#SectionPrev').attr('href', obj.find('a').attr('href'));
          $('#SectionPrev').attr('alt', obj.find('a').html());
          $('#SectionPrev').css({opacity: 1.0});
        }
      });
      return;
    case 'indicator.mb':
      if(me.Bs.mode=='mobile'){
        let i=1;
        $('.Posbar').find('li').each(function(){
          if(i==pos.ix){$(this).attr('class', 'now');}else{$(this).attr('class', '');}
          i++;
        });
      }
      return;

    }
  }

};
console.log(typeof(kwMenu));
