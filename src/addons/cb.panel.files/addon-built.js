define("require-tools/less/normalize",[],function(){function r(e,r,i){if(e.indexOf("data:")===0)return e;e=t(e);var u=i.match(n),a=r.match(n);return a&&(!u||u[1]!=a[1]||u[2]!=a[2])?s(e,r):o(s(e,r),i)}function s(e,t){e.substr(0,2)=="./"&&(e=e.substr(2));if(e.match(/^\//)||e.match(n))return e;var r=t.split("/"),i=e.split("/");r.pop();while(curPart=i.shift())curPart==".."?r.pop():r.push(curPart);return r.join("/")}function o(e,t){var n=t.split("/");n.pop(),t=n.join("/")+"/",i=0;while(t.substr(i,1)==e.substr(i,1))i++;while(t.substr(i,1)!="/")i--;t=t.substr(i+1),e=e.substr(i+1),n=t.split("/");var r=e.split("/");out="";while(n.shift())out+="../";while(curPart=r.shift())out+=curPart+"/";return out.substr(0,out.length-1)}var e=/([^:])\/+/g,t=function(t){return t.replace(e,"$1/")},n=/[^\:\/]*:\/\/([^\/])*/,u=function(e,n,i){n=t(n),i=t(i);var s=/@import\s*("([^"]*)"|'([^']*)')|url\s*\(\s*(\s*"([^"]*)"|'([^']*)'|[^\)]*\s*)\s*\)/ig,o,u,e;while(o=s.exec(e)){u=o[3]||o[2]||o[5]||o[6]||o[4];var a;a=r(u,n,i);var f=o[5]||o[6]?1:0;e=e.substr(0,s.lastIndex-u.length-f-1)+a+e.substr(s.lastIndex-f-1),s.lastIndex=s.lastIndex+(a.length-u.length)}return e};return u.convertURIBase=r,u.absoluteURI=s,u.relativeURI=o,u}),define("require-tools/less/less",["require"],function(e){var t={};t.pluginBuilder="./less-builder";if(typeof window=="undefined")return t.load=function(e,t,n){n()},less;t.normalize=function(e,t){return e.substr(e.length-5,5)==".less"&&(e=e.substr(0,e.length-5)),e=t(e),e};var n=document.getElementsByTagName("head")[0],r=window.location.href.split("/");r[r.length-1]="",r=r.join("/");var i;window.less=window.less||{env:"development"};var s=0,o;t.inject=function(e){s<31&&(o=document.createElement("style"),o.type="text/css",n.appendChild(o),s++),o.styleSheet?o.styleSheet.cssText+=e:o.appendChild(document.createTextNode(e))};var u;return t.load=function(n,s,o,a){e(["./lessc","./normalize"],function(a,f){if(!i){var l=e.toUrl("base_url").split("/");l[l.length-1]="",i=f.absoluteURI(l.join("/"),r)+"/"}var c=s.toUrl(n+".less");c=f.absoluteURI(c,i),u=u||new a.Parser(window.less),u.parse('@import "'+c+'";',function(e,n){if(e)return o.error(e);t.inject(f(n.toCSS(),c,r)),setTimeout(o,7)})})},t}),define("require-tools/less/less!stylesheets/files",[],function(){}),define("views/tree",["less!stylesheets/files.less"],function(){var e=codebox.require("underscore"),t=codebox.require("jQuery"),n=codebox.require("hr/hr"),r=codebox.require("core/box"),i=codebox.require("utils/contextmenu"),s=codebox.require("views/files/base"),o=s.extend({tagName:"li",className:"file-item",template:"files/tree/item.html",events:{"click .name":"select","dblclick .name":"open"},initialize:function(e){o.__super__.initialize.apply(this,arguments);var t=this;return this.subFiles=null,this.paddingLeft=this.options.paddingLeft||0,i.add(this.$el,this.model.contextMenu()),this},finish:function(){return this.$(">.name").css("padding-left",this.paddingLeft),this.$el.toggleClass("type-directory",this.model.isDirectory()),this.subFiles&&this.subFiles.$el.appendTo(this.$(".files")),o.__super__.finish.apply(this,arguments)},select:function(e){e!=null&&(e.preventDefault(),e.stopPropagation()),this.model.isDirectory()?(this.subFiles==null&&(this.subFiles=new u({codebox:this.codebox,model:this.model,paddingLeft:this.paddingLeft+15}),this.subFiles.$el.appendTo(this.$(".files")),this.subFiles.update()),this.$el.toggleClass("open")):this.open()},open:function(e){e!=null&&(e.preventDefault(),e.stopPropagation()),this.model.isDirectory()?this.select():this.model.open({userChoice:!1})}}),u=s.extend({tagName:"ul",className:"cb-files-tree",initialize:function(e){return u.__super__.initialize.apply(this,arguments),this.countFiles=0,this.paddingLeft=this.options.paddingLeft||10,i.add(this.$el,this.model.contextMenu()),this},render:function(){var t=this;return this.$el.empty(),this.$el.toggleClass("root",this.model.isRoot()),this.model.listdir().then(function(n){t.empty(),t.countFiles=0,e.each(n,function(e){if(e.isGit())return;var n=new o({codebox:t.codebox,model:e,paddingLeft:t.paddingLeft});n.update(),n.$el.appendTo(t.$el),t.countFiles=t.countFiles+1}),t.trigger("count",t.countFiles)}),t.ready()}});return u}),define("require-tools/less/less!stylesheets/panel",[],function(){}),define("views/panel",["views/tree","less!stylesheets/panel.less"],function(e){var t=codebox.require("underscore"),n=codebox.require("jQuery"),r=codebox.require("hr/hr"),i=codebox.require("core/search"),s=codebox.require("views/panels/base"),o=s.extend({className:"cb-panel-files",initialize:function(){o.__super__.initialize.apply(this,arguments),this.tree=new e({path:"/"}),this.tree.on("count",function(e){this.toggle(e>0)},this)},render:function(){return this.$el.empty(),this.tree.$el.appendTo(this.$el),this.tree.render(),this.ready()},finish:function(){return this.toggle(this.tree.countFiles>0),o.__super__.finish.apply(this,arguments)}});return o}),define("client",["views/panel"],function(e){var t=codebox.require("core/commands"),n=codebox.require("core/app"),r=codebox.require("core/panels"),i=codebox.require("core/files"),s=codebox.require("core/menu"),o=codebox.require("core/box");s.register("files",{title:"File",position:0},[{type:"action",text:"New file",action:function(){i.openNew()}},{type:"action",text:"New folder",action:function(){o.root.actionMkdir()}},{type:"divider"}]);var u=r.register("files",e),a=t.register("files.tree.open",{title:"Files",icon:"folder-o",position:2,shortcuts:["f"]});u.connectCommand(a)}),function(e){var t=document,n="appendChild",r="styleSheet",i=t.createElement("style");i.type="text/css",t.getElementsByTagName("head")[0][n](i),i[r]?i[r].cssText=e:i[n](t.createTextNode(e))}(".cb-files-tree{margin:0;padding:0;list-style:none}.cb-files-tree.root{position:absolute;top:0;bottom:0;left:0;right:0}.cb-files-tree .file-item{cursor:default;line-height:24px;font-size:14px}.cb-files-tree .file-item>.files{display:none}.cb-files-tree .file-item.active>.name,.cb-files-tree .file-item.active:hover>.name{background-image:-webkit-gradient(linear,left 0%,left 100%,from(#6eaeff),to(#5e9ef3))!important;background-image:-webkit-linear-gradient(top,#6eaeff,0%,#5e9ef3,100%)!important;background-image:-moz-linear-gradient(top,#6eaeff 0%,#5e9ef3 100%)!important;background-image:linear-gradient(to bottom,#6eaeff 0%,#5e9ef3 100%)!important;background-repeat:repeat-x!important;background-color:#5E9EF3;color:#fff}.cb-files-tree .file-item.ui-context-menu>.name{background:rgba(0,0,0,.15)}.cb-files-tree .file-item>.name{color:inherit;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;z-index:1;position:relative}.cb-files-tree .file-item>.name:hover{background-image:-webkit-gradient(linear,left 0%,left 100%,from(#6eaeff),to(#5e9ef3))!important;background-image:-webkit-linear-gradient(top,#6eaeff,0%,#5e9ef3,100%)!important;background-image:-moz-linear-gradient(top,#6eaeff 0%,#5e9ef3 100%)!important;background-image:linear-gradient(to bottom,#6eaeff 0%,#5e9ef3 100%)!important;background-repeat:repeat-x!important;background-color:#5E9EF3;color:#fff}.cb-files-tree .file-item>.name>i{width:11px;color:#666;text-align:center}.cb-files-tree .file-item>.name>i.fa-file{color:transparent;text-shadow:none}.cb-files-tree .file-item>.name>.fa-caret-right{display:inline-block}.cb-files-tree .file-item>.name>.fa-caret-down{display:none}.cb-files-tree .file-item.open>.files{display:block}.cb-files-tree .file-item.open>.name>.fa-caret-right{display:none}.cb-files-tree .file-item.open>.name>.fa-caret-down{display:inline-block}.cb-panel-files{position:absolute;top:0;bottom:0;left:0;width:100%;z-index:10}")