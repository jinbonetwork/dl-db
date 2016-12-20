// <![CDATA[
(function ($) {
	function MinbyunXeMenu(element,options) {
		var self = this;
		this.settings = $.extend({}, $.fn.minbyunXeMenu.defaults, options);

		this.Root = jQuery(element);

		self.initMenu();
		jQuery(window).resize(function(e) {
			self.resize();
		});
	}

	MinbyunXeMenu.prototype = {
		initMenu: function() {
			var self = this;

			this.menu = [];
			this.Root.find('.dropdown').each(function() {
				var $this = jQuery(this);

				var obj = {};

				obj.obj = $this;
				obj.head = $this.find('.dropdown__head');
				self.headClick(obj.head);
				obj.inner = $this.find('.dropdown__innerwrap');
				obj.clone = $this.find('.dropdown__invisible');
				obj.head_width = obj.head.parent().width();
				obj.clone_width = obj.clone.find('ul').width();
				obj.inner.find('ul').width(Math.max(obj.head_width, obj.clone_width));

				self.menu.push(obj);
			});
			this.Root.find('.toggle>button').click(function(e) {
				jQuery(this).parent().toggleClass('toggle--unfolded');
			});
			this.toggleMenu = [];
			this.Root.find('.toggle__child .accordian .acditem').each(function() {
				var $this = jQuery(this);

				var obj = {};

				obj.obj = $this;
				obj.head = $this.find('.acditem__head');
				self.toggleheadClick(obj.head);
				obj.inner = $this.find('.acditem__children');
				obj.clone = self.Root.find('.toggle__invisible .acditem.'+$this.attr('data-id'));
				obj.clone_width = obj.clone.find('ul').width();
				obj.inner.find('ul').width(obj.clone_width);

				self.toggleMenu.push(obj);
			});
			self.resize();
		},

		headClick: function(element) {
			element.click(function(e) {
				jQuery(this).parents('.dropdown').toggleClass('dropdown--unfolded');
				jQuery(this).parents('.dropdown').siblings().removeClass('dropdown--unfolded');
			});
		},

		toggleheadClick: function(element) {
			element.click(function(e) {
				jQuery(this).parent().toggleClass('acditem--unfolded');
				jQuery(this).parent().siblings().removeClass('acditem--unfolded');
			});
		},

		resize: function() {
			for(var i=0; i<this.menu.length; i++) {
				var obj = this.menu[i];
				var w = obj.head.parent().parent().outerWidth(true);
				if(w > obj.clone_width) w = obj.clone_width;
				obj.inner.find('.dropdown__items-top-border').width(w+1);
			}
		}
	}

	jQuery.fn.minbyunXeMenu = function(options) {
		return this.each(function() {
			var minbyunXeMenu = new MinbyunXeMenu(jQuery(this),options);
		});
	};

	jQuery.fn.minbyunXeMenu.defaults = {
	};

	jQuery.fn.minbyunXeMenu.settings = {
	};
})(jQuery);

jQuery(function($){
/*	jQuery('.dropdown').each(function() {
		var self = jQuery(this);
		var inv = self.find('.dropdown__invisible');
		self.find('.dropdown__head').click(function(e) {
			jQuery(this).parents('.dropdown').toggleClass('dropdown--unfolded');
		});
	}); */
	jQuery('.main-menu').minbyunXeMenu({});
});
// ]]>
