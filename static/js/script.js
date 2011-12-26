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
	$.fn.getSelection = function() {
            var e = this.jquery ? this[0] : this;
            
            return (
                /* mozilla / dom 3.0 */
                ('selectionStart' in e && function() {
                    var l = e.selectionEnd - e.selectionStart;
                    return {
                        start: e.selectionStart,
                        end: e.selectionEnd,
                        length: l,
                        text: e.value.substr(e.selectionStart, l)};
                })
                
                /* exploder */
                || (document.selection && function() {
                    e.focus();
                    
                    var r = document.selection.createRange();
                    if (r == null) {
                        return {
                            start: 0,
                            end: e.value.length,
                            length: 0};
                    }
                    
                    var re = e.createTextRange();
                    var rc = re.duplicate();
                    re.moveToBookmark(r.getBookmark());
                    rc.setEndPoint('EndToStart', re);
                    
                    // IE bug - it counts newline as 2 symbols when getting selection coordinates,
                    //  but counts it as one symbol when setting selection
                    var rcLen = rc.text.length,
                        i,
                        rcLenOut = rcLen;
                    for (i = 0; i < rcLen; i++) {
                        if (rc.text.charCodeAt(i) == 13) rcLenOut--;
                    }
                    var rLen = r.text.length,
                        rLenOut = rLen;
                    for (i = 0; i < rLen; i++) {
                        if (r.text.charCodeAt(i) == 13) rLenOut--;
                    }
                    
                    return {
                        start: rcLenOut,
                        end: rcLenOut + rLenOut,
                        length: rLenOut,
                        text: r.text};
                })
                
                /* browser not supported */
                || function() {
                    return {
                        start: 0,
                        end: e.value.length,
                        length: 0};
                }

            )();
        }


	$.fn.tsearcher = function(re, finded){
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
			finded.push([ result.index, result[0] ]);
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
		//field.html( finded.join( "<br />" ) );
		var nslctn = $.nslctr(CurPos,finded, direction);
		if ( nslctn ) text.slctr( nslctn[0], nslctn[0] + nslctn[1].length );
		return finded;
	}

	//implicitly use variables ("pattern", "from finded array" and "in text position") inside
	$.placeRe = function ( repl, from, chngp ){
		//repl // pattern
		//from //array from finded = [begin, end, finded-text]
		//chngp // what change * - all, ## - cursor position;

		return function(){
			//arguments //format - [finded-text, var1, var2, ..., var##, finded-text-position, text]
			var ft = arguments[0];
			var te = arguments[arguments.length-1];
			var ftp = arguments[arguments.length-2];
			
			if ( chngp != "*" && ftp != chngp[0] ){
				return ft;
			}

			// replace only if it has in finded
			// because replace in multistring mode change not only finded
			if ( chngp == "*" )
			  for (var i in from){
				if ( from[i][0] < ftp ) continue;
				if ( from[i][0] == ftp ) break;
				if ( from[i][0] > ftp ) return ft;
			  }

			var ind = 0, fi = 0;
			//console.log( te, ftp, ft );
			var endrepl = new String;
			while ( ( ind = repl.indexOf('$', fi ) ) + 1 ){
				endrepl = endrepl.concat(repl.slice(fi, ind));
				var nchar = repl[ ind + 1 ];
				//console.log(repl, ind, repl[ind], nchar, fi);
				if ( nchar >= 0 && nchar <= 9 ){
					endrepl = endrepl.concat( arguments[ nchar ] );
					//console.log(endrepl);
					fi = ind + 2;
					continue;
				}
				else
					switch ( nchar ){
						case "`":
							endrepl = endrepl.concat( te.slice(0, ftp ) );
							fi = ind + 2;
							continue;
						case "&":
							endrepl = endrepl.concat( ft );
							fi = ind + 2;
							continue;
						case "'":
							endrepl = endrepl.concat( te.slice( ftp  + ft.length ) );
							fi = ind + 2;
							continue;
						case "$":
							endrepl = endrepl.concat( "$" );
							fi = ind + 2;
							continue;
					}
			}
			return endrepl = endrepl.concat( repl.slice(fi) );

		}
	}

	$.reForm = function ( patt, ic, rec ){
		var flags = "gm";
		if ( ic ) flags += "i";

		if (! rec )
		  return RegExp ( (patt + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&'), flags );
		return RegExp ( patt, flags );
	}

	//replace control characters to their codes
	$.contrCharForm = function ( inp ){
	    var outp = new String;
	    for (var i = 0; i < inp.length; i++){
		if (inp[i] == '\\')
		    switch (inp[i + 1]) {
			case 'n': { outp += "\n"; i++; continue; }
			case 't': { outp += "\t"; i++; continue; }
		    }
		outp += inp[i];
	    }
	    return outp;
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
					finded = $.searcher( $('.emptex'), $('.resfield'), re, ">" );
				} )

	$(".psrchr").click( function () { var ic = Boolean( $(".ignorecase:checked").length );
					var rec = Boolean( $(".regexp:checked").length );
					re = $.reForm( $(".search").val(), ic, rec );
					finded = $.searcher( $('.emptex'), $('.resfield'), re, "<" )
				} )

	$(".chngr").click( function () { var ic = Boolean( $(".ignorecase:checked").length );
					var rec = Boolean( $(".regexp:checked").length );
					re = $.reForm( $(".search").val(), ic, rec );
					switch ( $(this).val() ){
					    case "→":
						var direction = ">";
						break;
					    case "*":
						var nslctn = "*"
						break;
					    case "←":
						var direction = "<";
						break;
					}
					var replaceForm = $.contrCharForm( $(".replace").val() );

					var CurPos = $.getCurPos( $(".emptex") );
					
					var finded = [];
					$('.emptex').tsearcher( re, finded );
					if (! nslctn ) var nslctn = $.nslctr(CurPos,finded, direction);
					
					$(".emptex").val( $(".emptex").val().replace( re, $.placeRe( replaceForm, finded, nslctn ) ) );
					//console.log( $(this).val(), CurPos, nslctn );
				})
	/* // default button for enter on form
	$(“form input, form select”).live(‘keypress’, function (e) {
		if ($(this).parents(‘form’).find(‘button[type=submit].default, input[type=submit].default’).length <= 0)
			return true;
		if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
			$(this).parents(‘form’).find(‘button[type=submit].default, input[type=submit].default’).click();
			return false;
		} else {
			return true;
		}
	});
	*/
	$('.fontfamily').change( function(){ $('.emptex').css('font-family', $(this).val() ); } );
	$('.fontsize').change( function(){ $('.emptex').css('font-size', $(this).val()+"px" ); } )


	//document.getElementById("select").scrollHeight	$(this).outerHeight()
});

// Left panel
jQuery(function(){
        var b = jQuery(".text"),
            d = jQuery(".panel");
	    if (b.length)
		var i = jQuery('#collapsible');

            //jQuery.browser.msie && jQuery.browser.version < 7 && b.css("left", "-5px");
            
            i.mouseover(function (r) {
                i.addClass("hover");
            }).mouseout(function () {
                i.removeClass("hover");
            }).click(function () {
                i.removeClass("hover")
                d.toggle();
                if (d.is(":visible")) {
                    b.css("margin-left", "");
                    //jQuery.browser.msie && jQuery.browser.version < 7 && b.css("left", "-5px")
                } else {
                    b.css("margin-left", "7px");
                    //jQuery.browser.msie && jQuery.browser.version < 7 && b.css("left", "")
                }
            });
})
