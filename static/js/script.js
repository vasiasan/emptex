(function($) {
	$.fn.slctr = function(start, end){
    		//alert(this.val());
		var e = this.jquery ? this[0] : this;
		return this.each(function(){
		    if (!e) {
			return this;
		    } else if (e.setSelectionRange) { //  WebKit
			e.focus(); e.setSelectionRange(start, end);
		    } else if (e.createTextRange) { // IE 
			var range = e.createTextRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		    } else if (e.selectionStart) { // Others
			e.selectionStart = start;
			e.selectionEnd = end;
		    }
            });
	}

	$.fn.tsearcher = function(re, finded){
		//alert(this.val());
		//appndr.contents().remove();
		//appndr.contents().empty();
		var li;
		while (( result = re.exec(this.val()) ) != null ) {
			
			// Chrome Bug search circle
			if ( re.lastIndex == li ) {
				re.lastIndex++;
				continue;
			}
			li = re.lastIndex;
			finded.push([ result.index, li, result[0] ]);
			//console.log(result);
			//appndr.append('<p>'+ result[0] +' ('+ result.index +')</p>');
		}
		return this;
	}

	$.getCurPos = function(TextArea) {
            var e = TextArea.jquery ? TextArea[0] : TextArea;
            
	if ( e.selectionStart ) {
	    return e.selectionStart;
	} else if (document.selection) {
	    e.focus();

	    var r = document.selection.createRange();
	    if (r == null) {
	      return 0;
	    }

	    var re = e.createTextRange(),
		rc = re.duplicate();
	    re.moveToBookmark(r.getBookmark());
	    rc.setEndPoint('EndToStart', re);

	    return rc.text.length;
	}  
	return 0;

	}

	$.comp = function(n1, n2, dir){
	  if ( dir == ">" ){
	    if (n1 > n2)
	      return true
	  }
	  else if ( dir == "<" ){ 
	    if (n1 < n2)
	      return true;
	  }
	  return false;
	}


	$.nslctr = function( CurPos, finded, direction ){
	    if ( finded.length ){
	      if (direction == "<") findarr = finded.reverse();
	      else findarr = finded;

	      if ( direction == ">" ) if (findarr[findarr.length-1][0] <= CurPos) CurPos=-1;
	      if ( direction == "<" ) if (findarr[findarr.length-1][0] >= CurPos) CurPos=Number.POSITIVE_INFINITY;
	      for (var i in findarr)
		  if ( $.comp(findarr[i][0], CurPos, direction) )
		    return findarr[i];
	    }
	    else return 0;
	}
	$.searcher = function ( text, field, searchpatt, direction ) {
		var finded = [];
		var CurPos = $.getCurPos(text)
		text.tsearcher( searchpatt, finded );
		field.html( finded.join( "<br />" ) );
		var nslctn = $.nslctr(CurPos,finded, direction);
	        console.log( findarr[0][0], CurPos );
		//console.log( nslctn );
		if ( nslctn ) text.slctr( nslctn[0], nslctn[0] + nslctn[2].length );
		return finded;
	}

	$.placeRe = function ( to, from ){
		
	}

	$.reForm = function ( patt, ic, rec ){
		var flags = "gm";
		if ( ic ) flags += "i";

		if (! rec )
		  return RegExp ( (patt + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&'), flags );
		return RegExp ( patt, flags );
	}
})(jQuery);

jQuery(function(){
	//$(".panel").draggable();
	/*$(".panel").bind('textchange', function (event, previousText) {
		$(".out").text($(this).val());
		var t = $(".emptex").val();
		var r = $(this).val();
		var lp = t.split(r)[0].length;
		$(".emptex")[0].selectionStart = lp;
		$(".emptex")[0].selectionEnd = lp + String(r).length;;
	});*/
	//$(".srchr").click( $(".emptex").tsearcher( $(".search").val(),  ) )
	//$(".chngr").click( alert( 'Handler for .click() called.' ) );
	var finded = [];
	$(".srchr").click( function () { var ic = Boolean( $(".ignorecase:checked").length );
					var rec = Boolean( $(".regexp:checked").length );
					re = $.reForm( $(".search").val(), ic, rec );
					finded = $.searcher( $('.emptex'), $('.resfield'), re, ">" ) } )

	$(".psrchr").click( function () { var ic = Boolean( $(".ignorecase:checked").length );
					var rec = Boolean( $(".regexp:checked").length );
					re = $.reForm( $(".search").val(), ic, rec );
					finded = $.searcher( $('.emptex'), $('.resfield'), re, "<" ) } )

	$(".chngr").click( function () { var ic = Boolean( $(".ignorecase:checked").length );
					var rec = Boolean( $(".regexp:checked").length );
					re = $.reForm( $(".search").val(), ic, rec );
					//$(".emptex").val( $(".emptex").val().replace( re, $(".replace").val() ) );
					//$('.resfield').html( finded.join( "<br />" ) );
					console.log(finded)
	})
});

// Left panel
jQuery(function(){
        var b = jQuery(".text"),
            d = jQuery(".panel");
	    if (b.length)
		var i = jQuery('#collapsible');

            jQuery.browser.msie && jQuery.browser.version < 7 && b.css("left", "-5px");
            
            i.mouseover(function (r) {
                i.addClass("hover");
            }).mouseout(function () {
                i.removeClass("hover");
            }).click(function () {
                i.removeClass("hover")
                d.toggle();
                if (d.is(":visible")) {
                    b.css("margin-left", "");
                    jQuery.browser.msie && jQuery.browser.version < 7 && b.css("left", "-5px")
                } else {
                    b.css("margin-left", "7px");
                    jQuery.browser.msie && jQuery.browser.version < 7 && b.css("left", "")
                }
            });
})
