/*
 * jQuery plugin: searcher 0.1
 */

(function($) {
	$.fn.tsearcher = function(pattern, appndr){
		appndr.remove();
		appndr.empty();
		while ( result = pattern.exec(this.text)) != null ) {
			appndr.append('<p>'+ result[0] +' '+ result.index +'</p>');
		}
	}
})(jQuery);

