/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2012. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: mbicocchi@open-lab.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*
 * jQuery.mb.components: mb.c+.plugins
 * version: - 18/03/12 - 27
 * © 2001 - 2012 Matteo Bicocchi (pupunzi), Open Lab
 */


$.containerize.addMethod("fullScreen",function(){
  var el = this;
  if(!el.fullscreen){
    if(el.$.data("resize"))
      el.$.resizable("disable");
    el.$.draggable("disable");
    el.oWidth= el.$.outerWidth();
    el.oHeight= el.$.outerHeight();
    el.oTop= el.$.position().top;
    el.oLeft= el.$.position().left;
    el.oPos= el.$.css("position");
    el.$.css({top:0,left:0, width:$(window).width(), height:$(window).height(), position:"fixed"});
    el.$.containerize("adjust");
    el.fullscreen=true;

    if(typeof el.opt.onFullScreen === "function")
      el.opt.onFullScreen(el);

  }else{
    if(el.$.data("resize"))
      el.$.resizable("enable");
    if(el.$.data("drag"))
      el.$.draggable("enable");
    el.$.css({top:el.oTop,left:el.oLeft, width:el.oWidth, height:el.oHeight, position: el.oPos});
    el.$.containerize("adjust");
    el.fullscreen=false;
  }
});

$.containerize.addMethod("rememberme",function(){
  var el = this;
  el.$.bind("resized",function(){
    $.mbCookie.set(el.id+"_w", el.$.outerWidth(),7);
    $.mbCookie.set(el.id+"_h", el.$.outerHeight(),7);
  });
  el.$.bind("dragged",function(){
    $.mbCookie.set(el.id+"_t", el.$.css("top"),7);
    $.mbCookie.set(el.id+"_l", el.$.css("left"),7);
  });

  el.$.bind("iconized",function(){
    $.mbCookie.set(el.id+"_iconized", true,7);
  });

  el.$.bind("restored",function(){
    $.mbCookie.remove(el.id+"_iconized");
  });

  var w = $.mbCookie.get(el.id+"_w") ? $.mbCookie.get(el.id+"_w") : el.$.css("width");
  var h = $.mbCookie.get(el.id+"_h") ? $.mbCookie.get(el.id+"_h") : el.$.css("height");
  var t = $.mbCookie.get(el.id+"_t") ? $.mbCookie.get(el.id+"_t") : el.$.css("top");
  var l = $.mbCookie.get(el.id+"_l") ? $.mbCookie.get(el.id+"_l") : el.$.css("left");
  el.$.css({width:w, height:h, left:l, top:t});

  if($.mbCookie.get(el.id+"_iconized")){
    el.$.containerize("close");
    el.$.containerize("iconize");
  }
});

$.containerize.addMethod("iconize",function(dockId){
  var el = this;
  if(el.fullscreen)
    return;
  el.$.containerize("storeView");

  if(typeof el.opt.onBeforeIconize === "function")
    el.opt.onBeforeIconize(el);

  var t = dockId ? $("#"+dockId).offset().top : el.$.css("top");
  var l = dockId ? $("#"+dockId).offset().left : 0;
  el.content.css({overflow:"hidden"});
  el.$.animate({top:t,left:l,width:0,height:0,opacity:0},el.opt.effectDuration, function(){
    $(this).containerize("close");
    if(!dockId){
      el.iconElement = $("<div/>").addClass("containerIcon "+ el.$.data("skin")).css({position:"absolute", top:t, left:l});
      var title = $("<span/>").addClass("mbc_title").html(el.containerTitle.html());
      el.iconElement.append(title);
      $("body").append(el.iconElement);
    }else{
      el.iconElement = $("<span/>").addClass("containerDocked").html(el.containerTitle.html());
      $("#"+dockId).append(el.iconElement);
    }
    el.$.trigger("iconized");
    el.iconElement.bind("click",function(){
      $(this).remove();
      el.$.containerize("restoreView",true);
      el.$.mb_bringToFront();
      el.$.trigger("restored");
    })
  });
});
