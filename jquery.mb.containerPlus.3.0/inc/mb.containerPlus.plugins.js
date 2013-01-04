/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: mb.containerPlus.plugins.js
 *
 *  Copyright (c) 2001-2013. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 04/01/13 17.13
 *  *****************************************************************************
 */


$.containerize.addMethod("modal",function(){
  var el = this;

  function openModal(o){
    var $overlay=$("<div/>").attr("id","mb_overlay").css({position:"fixed",width:"100%", height:"100%", top:0, left:0, background:"#000", opacity:.7}).hide();

    if($("#mb_overlay").length)
      return;

    $("body").prepend($overlay);
    $overlay.mb_bringToFront();
    o.mb_bringToFront();

    o.containerize("centeronwindow",false);
    $overlay.fadeIn(500);
  }

  function closeModal(o){
    $("#mb_overlay").fadeOut(500,function(){$(this).remove();})
  }

  var opt = {
    onRestore:function(o){openModal(o.$)},
    onClose: function(o){closeModal(o.$)}
  };

  $.extend (el.opt,opt);
});

