/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: mb.containerPlus.plugins.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matbicoc@gmail.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 08/04/14 0.32
 *  *****************************************************************************
 */

/**
 *
 * MODAL BEHAVIOR ***************************************************************
 *
 * */

jQuery.containerize.addMethod("modal",function(){
	jQuery.cMethods.modal = {name: "modal", author:"pupunzi", type:"plug-in", version:"1.0"};
	var el = this;

	function openModal(o){
		var $overlay=$("<div/>").attr("id","mb_overlay").css({position:"fixed",width:"100%", height:"100%", top:0, left:0, background:"#000", opacity:.8}).hide();

		if($("#mb_overlay").length)
			return;

		$("body").prepend($overlay);
		$overlay.mb_bringToFront();
		o.css("position","fixed");
		o.mb_bringToFront();

		o.containerize("centeronwindow",false);
		$overlay.fadeIn(300);
	}

	function closeModal(o){
		$("#mb_overlay").fadeOut(300,function(){$(this).remove();})
	}

	var opt = {
		onRestore:function(o){openModal(o.$)},
		onClose: function(o){closeModal(o.$)}
	};

	jQuery.extend (el.opt,opt);

	return el.$;

});

/**
 *
 * CHANGE CONTENT VIA AJAX ***************************************************************
 *
 * @ajaxURL : the path to the file containing the HTML to be injected
 * @data : the parameter object to be sent in the request
 *
 * */

jQuery.containerize.addMethod("changecontent", function(ajaxURL, data){
	jQuery.cMethods.changecontent = {name: "changecontent", author:"pupunzi", type:"plug-in", version:"1.0"};
	var el = this;
	var contentPlaceHolder = el.content;

//	if data is a string convert it to object
	data = data!=null && typeof data == "string" ? eval("("+data+")") : data;

	var request = jQuery.ajax({
		url     : ajaxURL,
		type    : "GET",
		data    : data,
		cache   : false,
		dataType: "html"
	});
	request.done(function (resp) {
		contentPlaceHolder.html(resp);
	});
	request.fail(function (jqXHR, textStatus) {
		contentPlaceHolder.html("error: "+textStatus);
	});

	return el.$;

});

/**
 *
 * AUTORESIZE BEHAVIOR IF THE CONTENT CHANGES ***************************************************************
 *
 * */

jQuery.containerize.addMethod("autoresize", function(){
	jQuery.cMethods.autoresize = {name: "autoresize", author:"pupunzi", type:"plug-in", version:"1.0"};
	var el = this;
	var contentPlaceHolder = el.content;
	contentPlaceHolder.on("DOMNodeInserted DOMNodeRemoved",function(){

		if(el.fullscreen)
			return;
		contentPlaceHolder.css({height:"auto"});
		var h = (contentPlaceHolder.get(0).scrollHeight) + el.header.height() + el.footer.height()+20;
		var w = (contentPlaceHolder.get(0).scrollWidth) ;
		contentPlaceHolder.parent("div").css({height: h, width: w});
		el.$.containerize("adjust");
		el.$.containerize("setContainment", el.$.data("containment"));
	});

	return el.$;
});

/**
 *
 * RESPONSIVE BEHAVIOR  ***************************************************************
 *
 * */
jQuery.containerize.addMethod("responsive", function(){
	jQuery.cMethods.autoresize = {name: "responsive", author:"pupunzi", type:"plug-in", version:"1.0"};
	var el = this;

	var win = el.$.data("containment")? el.$.parent() : jQuery(window);

	jQuery(window).on("resize.responsive",function(){

		if(el.fullscreen || el.isIconized)
			return;

		clearTimeout(el.responsiveCheck);

		el.responsiveCheck = setTimeout(function(){

			if(win.width() < el.$.width()){
				el.$.css({ left:0, width:win.width()});
				el.$.containerize("adjust", true);

			}else if(win.height() < el.$.height()){

				el.$.css({ top:0, height:win.height()});
				el.$.containerize("adjust", true);

			} else if(win.height() > el.$.height()){

				 if(el.state)
					el.$.css( el.state );


				el.$.containerize("adjust", true);

			} else if(win.width() > el.$.width()){

				if(el.state)
					el.$.css( el.state );

				el.$.containerize("adjust", true);

			}

			if(el.isCenteronwindow)
				el.$.containerize("centeronwindow");

			var isInWin = (el.$.offset().left + el.$.width() < jQuery(window).width()) && (el.$.offset().top + el.$.height() < jQuery(window).height()) ;

			if(!isInWin){

				var diffW = (el.$.offset().left + el.$.width()) - jQuery(window).width();
				var diffH = (el.$.offset().top + el.$.height()) - jQuery(window).height();

				var diffW = diffW < 0 ? 0 : diffW + 20;
				var diffH = diffH < 0 ? 0 : diffH + 20;

				var l = el.$.position().left - diffW;
				var t = el.$.position().top - diffH;

				el.$.css({ left: l, top: t});

			}

		}, 10);


	});

//	jQuery(window).resize();

	return el.$;
});


/**
 *
 * APPENDTO changes the current dom location of the container ***************************************************************
 *
 * */

jQuery.containerize.addMethod("appendto", function(elementSelector){
	jQuery.cMethods.autoresize = {name: "appendto", author:"pupunzi", type:"plug-in", version:"1.0"};
	var el = this;
	setTimeout(function(){
		el.$.appendTo(elementSelector,true);
	}, 10);
	return el.$;
});



