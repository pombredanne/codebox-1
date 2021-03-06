define([
    "hr/utils",
    "hr/dom",
    "hr/hr"
], function(_, $, hr) {
    var GridView = hr.View.extend({
        className: "component-grid",
        defaults: {
            columns: 0 // 0 means auto
        },
        events: {
            
        },

        initialize: function() {
            GridView.__super__.initialize.apply(this, arguments);

            this.columns = this.options.columns;
            this.views = [];

            return this;
        },

        /*
         *  Add a view
         */
        addView: function(view) {
            this.views.push(view);
            return this.render();
        },

        /*
         *  Remove a view
         */
        removeView: function(view) {
            if (!_.isString(view)) view = view.cid;

            this.views = _.filter(this.views, function(_v) {
                return _v.cid != view;
            });
            return this.render();
        },

        /*
         *  Change layout by defining 
         */
        setLayout: function(n) {
            this.columns = n;
            return this.render();
        },

        /*
         *  Return current layout
         */
        getLayout: function() {
            var layout = this.columns || Math.floor(Math.sqrt(this.views.length));

            var nColumns = Math.min(layout, this.views.length);
            var nLines = Math.ceil(this.views.length/layout);

            return {
                'columns': nColumns,
                'lines': nLines
            };
        },

        /*
         *  Signal an update on tha layout to all views
         */
        signalLayout: function() {
            _.each(this.views, function(view) {
                view.trigger("grid:layout");
            });
        },

        /*
         *  Re-render the complete layout
         */
        render: function() {
            var x, y;

            // Detach view
            _.each(this.views, function(view) {
                view.$el.detach();
            });

            // Clear the view
            this.$el.empty();

            // Calcul layout
            var layout = this.getLayout();

            var sectionWidth = (100/layout.columns).toFixed(3);
            var sectionHeight = (100/layout.lines).toFixed(3);

            // Add grid content
            x = 0; y = 0;
            _.each(this.views, function(view, i) {
                var $section, $content;

                // Container object
                $section = $("<div>", {
                    'class': 'grid-section',
                    'css': {
                        'left': (x * sectionWidth)+"%",
                        'top': (y * sectionHeight)+"%",
                        'width': sectionWidth+"%",
                        'height': sectionHeight+"%"
                    }
                });
                $section.appendTo(this.$el);

                // Content
                $content = $("<div>", {
                    'class': 'grid-section-content'
                });
                $content.append(view.$el);
                $content.appendTo($section);
                view.trigger("grid:layout");

                // Resize bar
                if (x < (layout.columns - 1)) {
                    // Horrizontal
                    var hBar = $("<div>", {
                        'class': "grid-resize-bar-h",
                        'mousedown': this.resizerHandler(x, y, "h")
                    });
                    hBar.appendTo($section);
                    $content.addClass("with-bar-h");
                }

                if (y < (layout.lines - 1)) {
                    // Vertical
                    var vBar = $("<div>", {
                        'class': "grid-resize-bar-v",
                        'mousedown': this.resizerHandler(x, y, "v")
                    });
                    vBar.appendTo($section);
                    $content.addClass("with-bar-v");
                }

                // Calcul next position
                x = x + 1;
                if (x >= layout.columns) {
                    x = 0;
                    y = y + 1;
                }
            }, this);

            return this.ready();
        },

        // Create a resizer handler
        resizerHandler: function(x, y, type) {
            var that = this;
            var $document = $(document);
            var oX, oY, dX, dY;
            return function(e) {
                e.preventDefault();
                oX = e.pageX;
                oY = e.pageY;

                var f = function(e) {
                    dx = oX - e.pageX;
                    dy = oY - e.pageY;

                    if (type == "h") {
                        that.resizeColumn(x, -dx);
                    } else {
                        that.resizeLine(y, -dy);
                    }

                    oX = e.pageX;
                    oY = e.pageY;
                };

                $document.mousemove(f);
                $document.mouseup(function(e) {
                    $document.unbind('mousemove', f);
                });
            };
        },

        getSection: function(sx, sy) {
            var x, y, layout = this.getLayout(), that = this;

            x = 0; y = 0;
            return this.$("> .grid-section").filter(function() {
                var r = false;

                if ((sx != null && sx == x)
                || (sy != null && sy == y)) {
                    r = true;
                }

                // Calcul next position
                x = x + 1;
                if (x >= layout.columns) {
                    x = 0;
                    y = y + 1;
                }

                return r;
            });
        },

        _resize: function(type, i, d) {
            var getSection = _.bind(_.partialRight(this.getSection, null), this);
            var pixelToPercent = _.bind(_.partialRight(this.pixelToPercent, null), this);
            var size = function(el, s) {
                if (!s) return el.width();
                return el.width(s);
            };
            var position = "left";

            if (type == "h") {
                getSection = _.bind(_.partial(this.getSection, null), this);
                pixelToPercent = _.bind(_.partial(this.pixelToPercent, null), this);
                position = "top";
                size = function(el, s) {
                    if (!s) return el.height();
                    return el.height(s);
                }
            }

            var $sections = getSection(i);
            var $sectionsAfter = getSection(i+1);

            // New size for next sections
            var sAfterN = pixelToPercent(size($sectionsAfter)-d);

            // New size for current sections
            var sCurrentN = pixelToPercent(size($sections)+d);

            // Limited size
            if (sCurrentN < 10 || sAfterN < 10) return false;

            // Resize next line
            $sectionsAfter.css(_.object([position], [pixelToPercent($sectionsAfter.position()[position]+d)+"%"]));
            size($sectionsAfter, sAfterN+"%");

            // Resize current line
            size($sections, sCurrentN+"%");

            this.signalLayout();

            return true;
        },

        resizeLine: function(i, d) {
            return this._resize("h", i, d);
        },

        resizeColumn: function(i, d) {
            return this._resize("w", i, d);
        },

        pixelToPercent: function(x, y) {
            if (x != null) return ((x*100) / this.$el.width());
            if (y != null) return ((y*100) / this.$el.height());
        }
    });

    return GridView;
});