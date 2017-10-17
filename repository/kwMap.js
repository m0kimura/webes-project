'use strict';
/* global kwBase google */
let kwMap=class kwMap extends kwBase {
  constructor(op, Bs, Save, Sec, Fdata) {
    super(op, Bs, Save, Sec, Fdata);
  }
  setConfig(op) {
    let me=this;
    console.log('map.js');
    me.Bs.map=op.Map||{};
    me.Bs.map.close=me.Bs.map.close||me.pngclose;
    me.Bs.map.scale=me.Bs.map.scale||10;
    me.Bs.map.animate=me.Bs.map.animate||me.Bs.animate;
    me.Bs.map.height=me.Bs.map.height||500;
    me.Bs.map.width=me.Bs.map.width||500;
  }
  onInit() { // molding
    let me=this;
    if(!me.Bs.map.key){return;}
    if(!document.getElementById('Pbody')){
      $('body').append('<div id="Pbody" ix=0> </div>');
      $('body').append('<img src="'+me.Bs.map.close+'" alt="close" id="Pclose"/>');
      var el=document.createElement('script');
      var flg=true;
      el.type='text/javascript';
      el.src='https://maps.googleapis.com/maps/api/js?key='+me.Bs.map.key+'&language=ja&region=JP"';
      el.onload=function(){if(flg){flg=false; onload();}};
      el.onreadystatechange=function(){
        if(this.readyState=='loaded'||this.readyState=='complete')
        {if(flg){flg=false; onload();}}
      };
      document.body.appendChild(el);
    }else{
      $('#Pbody').html('');
    }
    $('#Pbody').css({
      display: 'none', position: 'absolute', padding: '0 0 12px 0', 'z-index': 900
    });
    $('#Pclose').css({
      border: 'none','display': 'none', position: 'absolute', 'z-index': 901
    });
  }
  onResize() {
    let me=this, w, h, obj;
    $('.Map').each(function(){
      obj=$(this);
      if(obj[0].localName!='img'){
        w=obj.attr('wi')||me.Bs.map.width; h=obj.attr('hi')||me.Bs.map.height;
        if(me.Bs.mode!='mobile'){
          w=Math.floor(w*me.Bs.scale); h=Math.floor(h*me.Bs.scale);
          obj.css({width: w+'px', height: h+'px'});
        }else{
          h=obj.attr('mobile')||obj.attr('hi')||me.Bs.map.height;
          obj.css({width: '100%'});
        }
      }else{me.cancel(obj);}
    });
  }
  onScroll() {
    var me=this, tp, ra;
    if(me.Bs.mode=='mobile'){
      ra=$('#Pbody').attr('rate');
      tp=Math.floor($(window).scrollTop()+$(window).height()*(100-ra)/100);
      $('#Pbody').css({top: tp+'px'}); $('#Pclose').css({top: tp+'px'});
    }else{
      ra=$('#Pbody').attr('rate');
      tp=Math.floor($(window).scrollTop()+$(window).height()*(100-ra)/200);
      $('#Pbody').css({top: tp+'px'}); $('#Pclose').css({top: tp+'px'});
    }
  }
  blockMap(obj, ix) {
    let me=this, ti, w, h, o;
    w=obj.attr('wi')||me.Bs.map.width; h=obj.attr('hi')||me.Bs.map.height;
    if(me.Bs.mode=='mobile'){
      h=obj.attr('mobile')||h;
      obj.css({width: '100%', height:h+'px', display: 'block'});
    }else{
      w=Math.floor(w*me.Bs.scale); h=Math.floor(h*me.Bs.scale);
      obj.css({width: w+'px', height: h+'px', display: 'block'});
    }
    o={};
    me.Save.map[ix]={};
    o.zoom=obj.attr('scale')-0||me.Bs.map.scale;
    o.mapTypeId=google.maps.MapTypeId.ROADMAP;
    me.Save.map[ix].obj=new google.maps.Map(obj[0], o);
    var lat=obj.attr('lat')-0||35; var lon=obj.attr('lon')-0||135;
    var ps=new google.maps.LatLng(lat, lon);
    me.Save.map[ix].obj.setCenter(ps);
    ti=obj.attr('title')||'';
    new google.maps.Marker({position: ps, map: me.Save.map[ix].obj, title: ti});
    google.maps.event.addDomListener(window, 'resize', function() {
      var ce=me.Save.map[ix].obj.getCenter();
      google.maps.event.trigger(me.Save.map[ix].obj, 'resize');
      me.Save.map[ix].obj.setCenter(ce);
    });
  }
  onload() {
    let me=this, ix, obj;
    me.Save.map=[];
    ix=0;
    $('.Map').each(function(){
      obj=$(this); $(this).attr('ix', ix);
      if(obj[0].localName=='img'){me.monitoring(obj, ix);}else{me.blockMap(obj, ix);}
      ix++;
    });
  }
  monitoring(obj, ix) {
    let me=this;
    me.Save.map[ix]={};
    obj.on('click', function(){
      var ix=$(this).attr('ix'); $('#Pbody').attr('ix', ix);
      if(!me.Save.map[ix]){me.Save.map[ix]={};}
      if(me.Save.map[ix].toggle){me.dimout(ix);}
      else{if(me.Bs.mode=='mobile'){me.elevate($(this), ix);}else{me.popup($(this), ix);}}
      return false;
    });

    $('#Pclose').on('click', function(){me.dimout(ix);});
  }
  popup(obj, ix) {
    let me=this;
    let lat=obj.attr('lat')-0||35; var lon=obj.attr('lon')-0||135; var ti=obj.attr('title')||'';
    let ra=obj.attr('rate')||me.Bs.map.rate||80;
    let tp=$(window).scrollTop()+$(window).height()*(100-ra)/200;
    let wi=Math.floor($(window).width()*ra/100);
    let hi=Math.floor($(window).height()*ra/100);
    let lf=($(window).width()-wi)/2; //var cl=lf+wi-$('#Pclose').width();
    $('#Pbody').attr('ix', ix); $('#Pbody').attr('rate', ra);
    $('#Pbody').css({
      display: 'block', width: wi+'px', height: hi+'px', top: tp+'px', left: lf+'px',
      'z-index': 900
    });
    lf=lf+wi-$('#Pclose').width();
    $('#Pclose').css({
      position: 'abosolute', left: lf+'px', top: tp+'px',
      display: 'block', 'z-index': 901
    });
    let o={};
    o.zoom=obj.attr('scale')||me.Bs.map.scale;
    o.mapTypeId=google.maps.MapTypeId.ROADMAP;

    let x=document.getElementById('Pbody');
    me.Save.map[ix].obj=new google.maps.Map(x, o);
    me.Save.map[ix].obj.setCenter(new google.maps.LatLng(lat, lon));
    let ps=new google.maps.LatLng(lat, lon);
    new google.maps.Marker({position: ps, map: me.Save.map[ix].obj, title: ti});
    me.Save.map[ix].toggle=true;
    $('#Pbody').animate({opacity: 1.0}, me.Bs.map.animate);
  }
  elevatefunction(obj, ix){
    let me=this;
    let lat=obj.attr('lat')-0||35; var lon=obj.attr('lon')-0||135; var ti=obj.attr('title')||'';
    let ra=obj.attr('rate')||me.Bs.map.rate||50;
    let tp=Math.floor($(window).scrollTop()+$(window).height()*(100-ra)/100);
    let wi=$(window).width();
    let hi=Math.floor($(window).height()*(100-ra)/100);
    let lf=$(window).width()-$('#Pclose').outerWidth();
    $('#Pbody').attr('ix', ix); $('#Pbody').attr('rate', ra);
    $('#Pbody').css({
      position: 'fixed', top: $(window).height()+'px', left: 0,
      display: 'block', width: wi+'px', height: hi+'px', 'z-index': 900
    });
    $('#Pclose').css({
      position: 'absolute', left: lf+'px', top: $(window).height()+'px',
      display: 'block', 'z-index': 901
    });
    let o={}; o.zoom=obj.attr('scale')||me.Bs.map.scale; o.mapTypeId=google.maps.MapTypeId.ROADMAP;
    let x=document.getElementById('Pbody'); let map=new google.maps.Map(x, o);
    map.setCenter(new google.maps.LatLng(lat, lon));
    let ps=new google.maps.LatLng(lat, lon);
    new google.maps.Marker({position: ps, map: map, title: ti});
    $('#Pbody').animate({top: tp+'px'}, me.Bs.map.animate);
    $('#Pclose').animate({top: tp+'px'}, me.Bs.map.animate);
    me.Save.map[ix].toggle=true;
  }
  dimout(ix) {
    let me=this;
    if(me.Bs.mode=='mobile'){
      var t=$(window).height()+$(window).scrollTop();
      $('#Pbody').animate({top: t+'px'}, me.Bs.map.animate, function(){
        $('#Pbody').css('display','none');
      });
      $('#Pclose').animate({top: t+'px'}, me.Bs.map.animate, function(){
        $('#Pclose').css('display','none');
      });
    }else{
      $('#Pclose').css('display','none'); $('#Pbody').fadeOut('fast');
    }
    me.Save.map[ix].toggle=false;
  }
  cancel() {
    let me=this;
    if(me.Bs.mode!='mobile'){
      $('#Pclose').css('display','none');
      $('#Pbody').animate({opacity: 0, height: 0}, me.Bs.map.animate);
      var ix=$('#Pbody').attr('ix');
      me.Save.map[ix]={};
    }
  }
};
console.log(typeof(kwMap));
