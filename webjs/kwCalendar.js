/**
 * カレンダー表示モジュール
 * @module kwCalendar
 */
'use strict';
/* global kwBase */
let kwCalendar=class kwCalendar extends kwBase{
  constructor(op, Bs, Save, Sec, Fdata) {
    super(op, Bs, Save, Sec, Fdata);
  }
  config(op) {
    let me=this;
    me.Bs.calendar=op.Calendar;
    me.Bs.calendar.twidth=me.Bs.calendar.twidth||100;
    me.Bs.calendar.width=me.Bs.calendar.wiidth||120;
    me.Bs.calendar.height=me.Bs.calendar.hieight||120;
    me.Bs.calendar.hheight=me.Bs.calendar.hheight||20;
    me.Bs.calendar.dayheight=me.Bs.calendar.dayheight||20;
    me.Bs.calendar.backcolor=me.Bs.calendar.backcolor||'#eff9fc';
    me.Bs.calendar.bordercolor=me.Bs.calendar.bordercolor||'#c3d9ff';
    me.Bs.calendar.start=me.Bs.calendar.start||'2013/1/1';
    me.Bs.calendar.days=me.Bs.calendar.days||30;
    me.Bs.calendar.lines=me.Bs.calendar.lines||me.data.length;
    me.Bs.calendar.area=me.Bs.calendar.area||'here';
    //
    me.Bs.calendar.click=me.Bs.calendar.click||function(d){alert(d['id']);};
    me.Bs.calendar.mover=me.Bs.calendar.mover||function(){};
    me.Bs.calendar.mout=me.Bs.calendar.mout||function(){};
  }
  main(mode) {
    let me=this;
    if(mode=='init'){
      $('.calendar').each(()=>{
        me.init(this, $(this));
      });
    }
    me.prame(me.Bs.calendar); me.plock(me.Bs.calendar);
  }
  init(me, here) {
    let x=here.html(); let op=JSON.parse(x); $('.calendar').html='';
    op=op||{};

    here.append('<div id="frame" style="z-index: 1;"></div>');
    here.append('<div id="prame" style="z-index: 1"></div>');

    me.frame(me.Bs.calendar); me.block(me.Bs.calendar);
    console.log(op);
    //op.height=500; op.consix=1;
    //$('#frame').css({display: 'none'}); me.prame(me.Bs.calendar); me.plock(me.Bs.calendar);
  }
  frame(op) {
    let me=this;
    let wi=op.width, hi=op.height, hh=op.hheight;
    let bc=op.backcolor, dc=op.bordercolor;
    let start=op.start; //days=op.days, lines=op.lines;
    op.cclick=op.cclick||function(){};
    //
    $('#frame').append('<table id="fhead" border=0 cellspacing=0 cellpadding=0><tbody></tbody></table>');
    $('#fhead').css({position: 'absolute', left: 0});
    $('#fhead').append('<tr id="fwek"></tr>');
    let d, i, n=0, x; d=new Date(start); //let m=d.getMonth()+1;
    d.setTime(d.getTime()-d.getDay()*24*60*60000);
    let w=['日','月','火','水','木','金','土'];
    for(i=0; i<7; i++){
      $('#fwek').append('<td class="bgday">'+w[i]+'</td>');
    }
    n=0; var j=-1; i=0; var st=d.getTime();
    me.cons=[];
    while(n<3){
      var f=new Date(); f.setTime(st); f.setTime(st + (i * 24 * 3600 * 1000));
      if(f.getDay()==0){j++; $('#fhead').append('<tr id="ffrm'+j+'"></tr>'); me.cons[j]=[];}
      if(f.getDate()==1){switch(n){case 0: n=1; break; case 1: n=2; break;}} if(n==2 && f.getDay()==6){n=99;}
      switch(f.getDay()){case 0: x='bgfm2'; break; case 6: x='bgfm2'; break; default: x='bgfm1';}
      $('#ffrm'+j).append('<td class="'+x+'" data-date="'+f+'">'+f.getDate()+'</td>'); me.cons[j][f.getDay()]=f;
      i++;
    }
    $('.bgday').css({
      width: wi, height: hh, backgroundColor: '#efefef', borderLeft: '1px solid '+dc,
      borderBottom: '1px solid '+dc, textAlign: 'center'
    });
    $('.bgfm1').css({
      width: wi, height: hi, backgroundColor: '#ffffff', borderLeft: '1px solid '+dc,
      borderBottom: '1px solid '+dc, textAlign: 'left', verticalAlign: 'top',
      fontSize: '1.2em'
    });
    $('.bgfm2').css({
      width: wi, height: hi, backgroundColor: bc, borderLeft: '1px solid '+dc,
      borderBottom: '1px solid '+dc, textAlign: 'left', verticalAlign: 'top',
      fontSize: '1.2em'
    });
    $('.bgfm1, .bgfm2').click(function(){
      let d=$(this).attr('data-date'); op.cclick(d);
    });
  }
  block(op) {
    let me=this; op=op||{};
    let wi=op.width, hi=op.height, hh=op.hheight, dh=op.dayheight;
    let bcol, i, k=0, dt=new Date(), l=0, m, n;
    let blk=[]; for(m=0; m<4; m++){blk[m]=[]; for(n=0; n<5; n++){blk[m][n]=false;}}

    let j=-1; bcol=$(this).attr('data-color');
    for(i=0; i<me.cons.length; i++){
      l=-1;
      for(m=0; m<4; m++){for(n=0; n<7; n++){blk[m][n]=false;}}
      for(k in me.data){
        let d1=new Date(me.data[k]['start']); let d2=new Date(me.data[k]['end']);
        if(d1<=me.cons[i][6] && d2>=me.cons[i][0]){
          j++; l++;
          if(d1<me.cons[i][0]){d1=me.cons[i][0];}
          if(d2>me.cons[i][6]){d2=me.cons[i][6];}
          let s=Math.floor((d1.getTime()-me.cons[i][0].getTime())/(24*60*60*1000));
          let e=Math.floor((d2.getTime()-me.cons[i][0].getTime())/(24*60*60*1000));
          $('#frame').append('<img id="fpos'+j+'" class="fpos" src="'+me.f08+'" />');
          $('#frame').append('<div id="fpot'+j+'" class="fpot"></div>');
          switch(me.data[k]['status']){
          case 'off': if(d1<dt){bcol='#f00';}else{bcol='#00f';} break;
          case 'on': bcol='#0f0'; break;
          case 'cmp': bcol='#00f'; break;
          }
          let o;
          for(m=0; m<4; m++){
            o=true;
            for(n=s; n<e+1; n++){if(blk[m][n]){o=false;}}
            if(o){l=m; for(n=s; n<e+1; n++){blk[l][n]=true;} break;}
          }
          if(o){
            let w=(e-s+1)*(wi+1)-5; var t=(i*(hi+1))+((l+1)*(dh+2))+hh+4; var p=s*(wi+1)+3;
            $('#fpos'+j).css({
              position: 'absolute', backgroundColor: bcol, height: dh, width: w, left: p, top: t, zIndex: 5
            });
            $('#fpot'+j).css({
              position: 'absolute', height: dh, width: w, left: p, top: t, zIndex: 6, overflow: 'hidden',
              fontSize: '0.8em'
            });
            $('#fpot'+j).attr('data-ix', k);
            $('#fpot'+j).html(me.data[k]['title']);
          }else{
            $('#fpos4').attr('src', me.f01); $('#fpos4').attr('class', 'fpox');
          }
        }
      }
    }
    $('.fpot').click(function(){
      let i=$(this).attr('data-ix'); var d=me.data[i]; op.click(d);
    });
    $('.fpot').hover(
      function(){let i=$(this).attr('data-ix'); let d=me.data[i]; op.mover(d);},
      function(){let i=$(this).attr('data-ix'); var d=me.data[i]; op.mout(d);}
    );
    $('.fpox').click(function(){
      alert('ok');
    });
  }
  prame(op) {
    let me=this; op=op||{};
    let wi=op.width, hi=op.height, hh=op.hheight;
    let bc=op.backcolor; var dc=op.bordercolor; op.consix=op.consix||0;
    op.cclick=op.cclick||function(){};
    //
    $('#prame').append('<table id="phead" border=0 cellspacing=0 cellpadding=0><tbody></tbody></table>');
    $('#phead').css({position: 'absolute', left: 0});
    $('#phead').append('<tr id="pwek"></tr>');
    let d=new Date(), i; d.setTime(me.cons[op.consix][0].getTime());
    var w=['日','月','火','水','木','金','土'];
    for(i=0; i<7; i++){
      d.setTime(d.getTime()+i*24*60*60000); var k=d.getDay();
      $('#pwek').append('<td class="bgday">'+w[k]+'</td>');
    }
    let st=me.cons[op.consix][0], j=op.consix, x;
    $('#phead').append('<tr id="pfrm'+j+'"></tr>');
    for(i=0; i<7; i++){
      let f=new Date(); f.setTime(st.getTime() + (i * 24 * 3600 * 1000));
      switch(f.getDay()){case 0: x='bgpm2'; break; case 6: x='bgpm2'; break; default: x='bgpm1';}
      $('#pfrm'+j).append('<td class="'+x+'">'+f.getDate()+'</td>');
    }

    $('.bgday').css({width: wi, height: hh, backgroundColor: '#efefef', borderLeft: '1px solid '+dc, borderBottom: '1px solid '+dc, textAlign: 'center'});
    $('.bgpm1').css({width: wi, height: hi, backgroundColor: '#ffffff', borderLeft: '1px solid '+dc, borderBottom: '1px solid '+dc, textAlign: 'center'});
    $('.bgpm2').css({width: wi, height: hi, backgroundColor: bc, borderLeft: '1px solid '+dc, borderBottom: '1px solid '+dc, textAlign: 'center'});
    $('.bgpm1, .bgpm2').click(function(){
      let d=$(this).attr('data-date'); op.cclick(d);
    });
  }
  plock(op) {
    let me=this; op=op||{};
    let wi=op.width, hi=op.height, hh=op.hheight, dh=op.dayheight;
    op.consix=op.consix||0;
    let bcol, i, k=0, dt=new Date(), l=0, m, n;
    let blk=[]; for(m=0; m<5; m++){blk[m]=[]; for(n=0; n<5; n++){blk[m][n]=false;}}
    let j=-1;
    i=op.consix;
    l=-1;
    for(k in me.data){
      let d1=new Date(me.data[k]['start']), d2=new Date(me.data[k]['end']);
      if(d1<=me.cons[i][6] && d2>=me.cons[i][0]){
        j++; l++;
        if(d1<me.cons[i][0]){d1=me.cons[i][0];}
        if(d2>me.cons[i][6]){d2=me.cons[i][6];}
        let s=Math.floor((d1.getTime()-me.cons[i][0].getTime())/(24*60*60*1000));
        let e=Math.floor((d2.getTime()-me.cons[i][0].getTime())/(24*60*60*1000));
        $('#prame').append('<img id="ppos'+j+'" class="ppos" src="'+me.f08+'" />');
        $('#prame').append('<div id="ppot'+j+'" class="ppot"></div>');
        switch(me.data[k]['status']){
        case 'off': if(d1<dt){bcol='#f00';}else{bcol='#00f';} break;
        case 'on': bcol='#0f0'; break;
        case 'cmp': bcol='#00f'; break;
        }
        let o;
        for(m=0; m<5; m++){
          o=true;
          for(n=s; n<e+1; n++){if(blk[m][n]){o=false;}}
          if(o){l=m; for(n=s; n<e+1; n++){blk[l][n]=true;} break;}
        }
        if(o){
          var w=(e-s+1)*(wi+1)-5; var t=((i-1)*(hi+1))+(l*(dh+2))+hh+4; var p=s*(wi+1)+3;
          $('#ppos'+j).css({position: 'absolute', backgroundColor: bcol, height: dh, width: w, left: p, top: t});
          $('#ppos'+j).attr('data-ix', k);
          $('#ppot'+j).css({position: 'absolute', height: dh, width: w, left: p, top: t, zIndex: 6, overflow: 'hidden'});
          $('#ppot'+j).attr('data-ix', k);
          $('#ppot'+j).html(me.data[k]['title']);
        }
      }
    }
    $('.ppot').click(function(){
      let i=$(this).attr('data-ix'), d=me.data[i]; op.click(d);
    });
    $('.ppot').hover(
      function(){let i=$(this).attr('data-ix'), d=me.data[i]; op.mover(d);},
      function(){let i=$(this).attr('data-ix'), d=me.data[i]; op.mout(d);}
    );
  }
};
console.log(typeof(kwCalendar));
