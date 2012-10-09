(function($) {
	var typeahead = $.fn.typeahead.Constructor,
		defaults = $.fn.typeahead.defaults,
		TypeaheadEnhanced = typeahead;

	TypeaheadEnhanced.lastEvent = null;
	TypeaheadEnhanced.query = '';

	TypeaheadEnhanced.prototype.backups = {
		render: TypeaheadEnhanced.prototype.render,
		keyup: TypeaheadEnhanced.prototype.keyup,
		next: TypeaheadEnhanced.prototype.next,
		prev:  TypeaheadEnhanced.prototype.prev,
	};

	TypeaheadEnhanced.prototype.selectRange = function() {
		var elem = this.$element.get(0),
			textRange,
			start = this.query.length,
			end = elem.value.length;

		elem.focus();
		if (elem.setSelectionRange) {				//all browsers
			elem.setSelectionRange(start, end);
		} else if (elem.createTextRange) {			//but IE < 9 -.-
			textRange = e.createTextRange();
			textRange.collapse(true);
			textRange.moveEnd('character', end);
			textRange.moveStart('character', start);
			textRange.select();
		}											//else default behavior
		return this;
	};

	TypeaheadEnhanced.prototype.fillInput = function(firstItem) {
		var len, e;
		//key != backspace, alt, shift, strg, left, right
		if (this.lastEvent && this.lastEvent.which && !~$.inArray(this.lastEvent.which,[8,16,17,18,37,39]) ) {
			this.query = this.$element.val();
			this.$element.val( firstItem.text() );
			this.selectRange();
		}
		return this;
	};

	TypeaheadEnhanced.prototype.render = function (items) {
		$.proxy(this.backups.render, this)(items);
		this.fillInput(this.$menu.children().first());
		return this;
	};

	TypeaheadEnhanced.prototype.keyup = function (e) {
		this.lastEvent = e;
		if (e.which !== 16) { //dont fire event when only shift is pressed/released
			$.proxy(this.backups.keyup, this)(e);
		}
	};

	TypeaheadEnhanced.prototype.next = function (event) {
		$.proxy(this.backups.next, this)(event);
		this.$element.val( this.$menu.find('li.active').text() );
	};

	TypeaheadEnhanced.prototype.prev = function (event) {
		$.proxy(this.backups.prev, this)(event);
		this.$element.val( this.$menu.find('li.active').text() );
	};

	$.fn.typeaheadEnhanced = function (option) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('typeaheadEnhanced'),
				options = typeof option == 'object' && option;
			if (!data) $this.data('typeaheadEnhanced', (data = new TypeaheadEnhanced(this, options)));
			if (typeof option == 'string') data[option]();
		});
	};

	$.fn.typeaheadEnhanced.defaults = defaults;
	$.fn.typeaheadEnhanced.Constructor = TypeaheadEnhanced;

	/*   TYPEAHEAD DATA-API
	 * ================== */

	$(function () {
		$('body').on('focus.typeaheadEnhanced.data-api', '[data-provide="typeaheadEnhanced"]', function (e) {
			var $this = $(this);
			if ($this.data('typeaheadEnhanced')) return;
			e.preventDefault();
			$this.typeaheadEnhanced($this.data());
		});
	});
})(window.jQuery);