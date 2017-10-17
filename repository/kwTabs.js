'use strict';
/* global kwBase */
let kwTabs=class kwTabs extends kwBase {
  constructor(op, Bs, Save, Sec, Fdata) {
    super(op, Bs, Save, Sec, Fdata);
  }
  setConfig(op) {
    let me=this;
    console.log('tabs.js');
    me.Bs.tab=op.Tab||{};
    me.Bs.tab.animate=me.Bs.tab.animate||me.Bs.animate;
  }
  onInit() {
    let me=this; let ix, id;
    me.Save.tabs=[];
    ix=0;
    $('.Tabs').each(function(){
      me.Save.tabs[ix]=me.config($(this));
      me.createTabs(me.Bs.mode, $(this), me.Save.tabs[ix], ix);
      me.molding(me.Bs.mode, $(this), me.Save.tabs[ix], ix);
      me.monitoring(me.Bs.mode, $(this), ix);
      id=me.Save.tabs[ix][0].id;
      me.Fdata.tabs={area: $(this).find('dd'), object: $('#'+id), max: me.Save.tabs[ix].length};
      me.flick(me.Fdata.tabs);
      ix++;
    });
  }
  onResize() {
    let me=this; let ix, jx, sj;
    ix=0; $('.Tabs').each(function(){
      me.changeTabs(me.Bs.mode, $(this), me.Save.tabs[ix]);
      me.molding(me.Bs.mode, $(this), me.Save.tabs[ix], ix);
      jx=0; sj=0;
      $(this).find('dt').find('li').each(function(){
        if($(this).attr('open')=='y'){sj=jx;}
        jx++;
      });
      me.locating($(this), ix, sj, true);
      ix++;
    });
  }
  molding(mode, obj, save, ix) {
    let me=this, max=0, wi, d, l, j, h;
    wi=obj.find('dt').outerWidth();
    obj.find('.Tabpage').each(function(){
      h=$(this).outerHeight(); if(h>max){max=h;}
    });

    if(mode=='mobile'){
      l=0; j=0;
      obj.find('.Tabpage').each(function(){
        me.css($(this), {
          outerHeight: max+'px', outerWidth: wi+'px',
          position: 'absolute', left: l+'px', top: 0,
          display: 'block'
        });
        me.Save.tabs[ix][j].width=wi;
        l=l+wi; j++;
      });
    }else{
      j=0;
      obj.find('.Tabpage').each(function(){
        if(save[j].open){d='block';}else{d='none';}
        me.css($(this), {
          outerHeight: max+'px', outerWidth: wi+'px',
          position: 'absolute', left: 0, top: 0,
          display: d
        });
        me.Save.tabs[ix][j].width=wi;
        j++;
      });
    }
    obj.find('dd').css({
      overflow: 'hidden', height: max+'px', width: wi+'px'
    });
    $('#'+me.Save.tabs[ix][0].id).css({
      position: 'relative', top: 0, left: 0, height: max+'px'
    });
  }
  locating(obj, ix, jx, direct) {
    let me=this, j, l;
    if(me.Bs.mode=='mobile'){
      l=me.Save.tabs[ix][0].width*jx*-1;
      if(direct){
        $('#'+me.Save.tabs[ix][0].id).css({marginLeft: l+'px'});
      }else{
        $('#'+me.Save.tabs[ix][0].id).animate({marginLeft: l+'px'}, me.Bs.tab.animate);
      }
    }else{
      j=0;
      obj.find('.Tabpage').each(function(){
        if(jx==j){$(this).css({display: 'block'});}else{$(this).css({display: 'none'});}
        j++;
      });
    }
  }
  config(obj) {
    let j, w, id, save=[], t;
    w=obj.outerWidth();
    id='TB'+Math.floor(Math.random()*1000);
    j=0;
    obj.find('.Tabpage').each(function(){
      save[j]={};
      save[j].id=id;
      save[j].width=w;
      save[j].img=$(this).attr('img');
      if($(this).attr('mobile')){
        save[j].mobile=$(this).attr('mobile')||$(this).attr('img');
      }
      t=$(this).attr('title');
      switch(t){
      case 'h2': case 'h3': case 'h4':
        save[j].title=$(this).find(t).html();
        break;
      default:
        save[j].title=t;
      }
      save[j].open=$(this).attr('open');
      j++;
    });
    return save;
  }
  createTabs(mode, obj, save, ix) {
    let me=this, s, j;
    obj.find('dt').append('<ul></ul>');
    for(j in save){
      if(save[j].img){
        if(mode=='mobile'){s=save[j].mobile;}else{s=save[j].img;}
        if(save[j].open){s=me.insert(s, '_r');}
        obj.find('dt').find('ul').append(
          '<li ix="'+ix+'" jx="'+j+'"><img src="'+s+'" alt="'+save[j].title+'"/></li>'
        );
      }else{
        if(save[j].open){s='Open';}else{s='Close';}
        obj.find('dt').find('ul').append(
          '<li ix="'+ix+'" jx="'+j+'" class="'+s+' '+mode+'">'+save[j].title+'</li>'
        );
      }
    }
    obj.find('dd').append('<div id="'+save[j].id+'"></div>');
    obj.find('dd').children().each(function(){
      $(this).appendTo('#'+save[j].id);
    });
  }
  monitoring(mode, obj, ix) {
    let me=this, obk, j, s;
    obj.find('dt').each(function(){
      obk=$(this);
      obk.find('li').each(function(){
        $(this).on('click', function(){
          ix=$(this).attr('ix')-0; var jx=$(this).attr('jx')-0;
          if(me.Save.tabs[ix][jx].img){
            j=0;
            obk.find('img').each(function(){
              if(jx==j){s=me.insert(me.Save.tabs[ix][jx].img, '_r');}
              else{s=me.Save.tabs[ix][jx].img;}
              $(this).attr('src', s);
              j++;
            });
          }else{
            j=0;
            obk.find('li').each(function(){
              if(jx==j){s='open';}else{s='close';}
              $(this).attr('class', s);
              j++;
            });
          }
          me.locating(obj, ix, jx);
        });
      });
    });
  }
  changeTabs(mode, obj, save) {
    let me=this, j, s, f;
    obj.find('dt').each(function(){
      $(this).find('img').each(function(){
        j=$(this).attr('jx');
        s=$(this).attr('src'); f=s.find(/_r/);
        if(mode=='mobile'){s=save[j].mobile||save[j].img;}else{s=save[j].img;}
        if(f){s=me.insert(s, '_r');}
        $(this).attr('src', s);
      });
    });
  }
};
console.log(typeof(kwTabs));
