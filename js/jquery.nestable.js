/*!
 * Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 * Dual-licensed under the BSD or MIT licenses
 */
var initListView=function()
{
    var updateOutput = function(e)
    {
        var list   = e.length ? e : $(e.target),
            output = list.data('output');
        if (window.JSON) {
            output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
        } else {
            output.val('JSON browser support required for this demo.');
        }
    };

    // output initial serialised data
    updateOutput($('#nestable1').data('output', $('#nestable1-output')));
    updateOutput($('#nestable2').data('output', $('#nestable2-output')));

    $('#nestable-menu').on('click', function(e)
    {
        var target = $(e.target),
            action = target.data('action');
        if (action === 'expand-all') {
            $('.dd').nestable('expandAll');
        }
        if (action === 'collapse-all') {
            $('.dd').nestable('collapseAll');
        }
    });

    $('#nestable3').nestable();

};
(function($, window, document, undefined)
{
    var hasTouch = 'ontouchstart' in document;

    /**
     * Detect CSS pointer-events property
     * events are normally disabled on the dragging element to avoid conflicts
     * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
     */
    var hasPointerEvents = (function()
    {
        var el    = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    })();

    var defaults = {
        listNodeName    : 'ol',
        itemNodeName    : 'li',
        rootClass       : 'dd',
        listClass       : 'dd-list',
        itemClass       : 'dd-item',
        dragClass       : 'dd-dragel',
        handleClass     : 'dd-handle',
        collapsedClass  : 'dd-collapsed',
        placeClass      : 'dd-placeholder',
        noDragClass     : 'dd-nodrag',
        emptyClass      : 'dd-empty',
        expandBtnHTML   : '<button data-action="expand" type="button">Expand</button>',
        collapseBtnHTML : '<button data-action="collapse" type="button">Collapse</button>',
        group           : 0,
        maxDepth        : 2,
        threshold       : 20
    };

    function Plugin(element, options)
    {
        this.w  = $(document);
        this.el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {

        init: function()
        {
            var list = this;

            list.reset();

            list.el.data('nestable-group', this.options.group);

            list.placeEl = $('<div class="' + list.options.placeClass + '"/>');

            $.each(this.el.find(list.options.itemNodeName), function(k, el) {
                list.setParent($(el));
            });

            list.el.on('click', 'button', function(e) {
                if (list.dragEl) {
                    return;
                }
                var target = $(e.currentTarget),
                    action = target.data('action'),
                    item   = target.parent(list.options.itemNodeName);
                if (action === 'collapse') {
                    list.collapseItem(item);
                }
                if (action === 'expand') {
                    list.expandItem(item);
                }
            });

            var onStartEvent = function(e)
            {
                var handle = $(e.target);
                if (!handle.hasClass(list.options.handleClass)) {
                    if (handle.closest('.' + list.options.noDragClass).length) {
                        return;
                    }
                    handle = handle.closest('.' + list.options.handleClass);
                }

                if (!handle.length || list.dragEl) {
                    return;
                }

                list.isTouch = /^touch/.test(e.type);
                if (list.isTouch && e.touches.length !== 1) {
                    return;
                }

                e.preventDefault();
                list.dragStart(e.touches ? e.touches[0] : e);
            };

            var onMoveEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragMove(e.touches ? e.touches[0] : e);
                }
            };

            var onEndEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragStop(e.touches ? e.touches[0] : e);
                }
            };

            if (hasTouch) {
                list.el[0].addEventListener('touchstart', onStartEvent, false);
                window.addEventListener('touchmove', onMoveEvent, false);
                window.addEventListener('touchend', onEndEvent, false);
                window.addEventListener('touchcancel', onEndEvent, false);
            }

            list.el.on('mousedown', onStartEvent);
            list.w.on('mousemove', onMoveEvent);
            list.w.on('mouseup', onEndEvent);

        },

        serialize: function()
        {
            var data,
                depth = 0,
                list  = this;
            step  = function(level, depth)
            {
                var array = [ ],
                    items = level.children(list.options.itemNodeName);
                items.each(function()
                {
                    var li   = $(this),
                        item = $.extend({}, li.data()),
                        sub  = li.children(list.options.listNodeName);
                    if (sub.length) {
                        item.children = step(sub, depth + 1);
                    }
                    array.push(item);
                });
                return array;
            };
            data = step(list.el.find(list.options.listNodeName).first(), depth);
            return data;
        },

        serialise: function()
        {
            return this.serialize();
        },

        reset: function()
        {
            this.mouse = {
                offsetX   : 0,
                offsetY   : 0,
                startX    : 0,
                startY    : 0,
                lastX     : 0,
                lastY     : 0,
                nowX      : 0,
                nowY      : 0,
                distX     : 0,
                distY     : 0,
                dirAx     : 0,
                dirX      : 0,
                dirY      : 0,
                lastDirX  : 0,
                lastDirY  : 0,
                distAxX   : 0,
                distAxY   : 0
            };
            this.isTouch    = false;
            this.moving     = false;
            this.dragEl     = null;
            this.dragRootEl = null;
            this.dragDepth  = 0;
            this.hasNewRoot = false;
            this.pointEl    = null;
        },

        expandItem: function(li)
        {
            li.removeClass(this.options.collapsedClass);
            li.children(this.options.listNodeName).show();

            var length=li.find("li.dd-item").length;
            for(var i=0;i<length;i++)
                li.find("li.dd-item").eq(i).children().css("z-index","-1");
			for(var i=0;i<length-1;i++)
				li.find("li.dd-item").eq(i).children().animate({
                	opacity:"1", marginTop:"0"},1000);

			li.find("li.dd-item").eq(length-1).children().animate({
				opacity:"1", marginTop:"0"},1000,function () {
				for(var i=0;i<length;i++)
					li.find("li.dd-item").eq(i).children().css("z-index","1");
				li.children('[data-action="expand"]').hide();
				li.children('[data-action="collapse"]').show();
			});

        },

        collapseItem: function(li)
        {
            var thisObject=this;
            var lists = li.children(this.options.listNodeName);
            if (lists.length) {
                var length=li.find("li.dd-item").length;
                for(var i=0;i<length;i++)
                    li.find("li.dd-item").eq(i).children().css("z-index","-1");
				for(var i=0;i<length-1;i++)
					li.find("li.dd-item").eq(i).children().animate({
                    	opacity:"0", marginTop:"-205px"},1000);

				li.find("li.dd-item").eq(length-1).children().animate({
					opacity:"0", marginTop:"-205px"},1000,function () {
					for(var i=0;i<length;i++)
						li.find("li.dd-item").eq(i).children().css("z-index","1");
					li.children('[data-action="collapse"]').hide();
					li.children('[data-action="expand"]').show();
					li.children(thisObject.options.listNodeName).hide();
				});

            }
        },

        expandAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.expandItem($(this));
            });
        },

        collapseAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.collapseItem($(this));
            });
        },

        setParent: function(li)
        {
            if (li.children(this.options.listNodeName).length) {
                li.prepend($(this.options.expandBtnHTML));
                li.prepend($(this.options.collapseBtnHTML));
            }
            li.children('[data-action="expand"]').hide();
        },

        unsetParent: function(li)
        {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action]').remove();
            li.children(this.options.listNodeName).remove();
        },

        dragStart: function(e)
        {
            var mouse    = this.mouse,
                target   = $(e.target),
                dragItem = target.closest(this.options.itemNodeName);

            this.placeEl.css('height', dragItem.height());

            mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
            mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
            mouse.startX = mouse.lastX = e.pageX;
            mouse.startY = mouse.lastY = e.pageY;

            this.dragRootEl = this.el;

            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);
            this.dragEl.css('width', dragItem.width());
;
			if(dragItem.children().length>1) {
				if (dragItem.children().eq(2).attr("class").toString().indexOf("person") != -1) {
					this.reset();
					return;
				}
			}
			else
			{
				if(dragItem.children().attr("class").toString().indexOf("person")!=-1||dragItem.children().attr("class").toString().indexOf("undraged")!=-1)
				{
					this.reset();
					return;
				}

			}


            dragItem.after(this.placeEl);
            dragItem[0].parentNode.removeChild(dragItem[0]);
            dragItem.appendTo(this.dragEl);

            $(document.body).append(this.dragEl);
            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX,
                'top'  : e.pageY - mouse.offsetY
            });
            // total depth of dragging item
            var i, depth,
                items = this.dragEl.find(this.options.itemNodeName);
            for (i = 0; i < items.length; i++) {
                depth = $(items[i]).parents(this.options.listNodeName).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }
        },

        dragStop: function(e)
        {
            var el = this.dragEl.children(this.options.itemNodeName).first();
            el[0].parentNode.removeChild(el[0]);
            this.placeEl.replaceWith(el);

            this.dragEl.remove();
            this.el.trigger('change');
            if (this.hasNewRoot) {
                this.dragRootEl.trigger('change');
            }
            this.reset();
        },

        dragMove: function(e)
        {
            var list, parent, prev, next, depth,
                opt   = this.options,
                mouse = this.mouse;

            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX,
                'top'  : e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX  = e.pageX;
            mouse.nowY  = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            var newAx   = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!mouse.moving) {
                mouse.dirAx  = newAx;
                mouse.moving = true;
                return;
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev(opt.itemNodeName);
                // increase horizontal level if previous sibling exists and is not collapsed
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {
                    // cannot increase level when item above is collapsed
                    list = prev.find(opt.listNodeName).last();
                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt.listNodeName).length;
                    if (depth + this.dragDepth <= opt.maxDepth) {
                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                            list.append(this.placeEl);
                            prev.append(list);
                            this.setParent(prev);
                        } else {
                            // else append to next level up
                            list = prev.children(opt.listNodeName).last();
                            list.append(this.placeEl);
                        }
                    }
                }
                // decrease horizontal level
                if (mouse.distX < 0) {
                    // we can't decrease a level if an item preceeds the current one
                    next = this.placeEl.next(opt.itemNodeName);
                    if (!next.length) {
                        parent = this.placeEl.parent();
                        this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                        if (!parent.children().length) {
                            this.unsetParent(parent.parent());
                        }
                    }
                }
            }

            var isEmpty = false;

            // find list item under cursor
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            }
            this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            }
            if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.parent(opt.itemNodeName);
            }
            if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
            }
            else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
                return;
            }

            // find parent list of item under cursor
            var pointElRoot = this.pointEl.closest('.' + opt.rootClass),
                isNewRoot   = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {
                // check if groups match if dragging over new root
                if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
                    return;
                }
                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
                if (depth > opt.maxDepth) {
                    return;
                }
                var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
                parent = this.placeEl.parent();
                // if empty create new list to replace empty placeholder
                if (isEmpty) {
                    list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
                    list.append(this.placeEl);
                    this.pointEl.replaceWith(list);
                }
                else if (before) {
                    this.pointEl.before(this.placeEl);
                }
                else {
                    this.pointEl.after(this.placeEl);
                }
                if (!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
                if (!this.dragRootEl.find(opt.itemNodeName).length) {
                    this.dragRootEl.append('<div class="' + opt.emptyClass + '"/>');
                }
                // parent root list has changed
                if (isNewRoot) {
                    this.dragRootEl = pointElRoot;
                    this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
                }
            }
        }

    };

    $.fn.nestable = function(params)
    {
        var lists  = this,
            retval = this;

        lists.each(function()
        {
            var plugin = $(this).data("nestable");

            if (!plugin) {
                $(this).data("nestable", new Plugin(this, params));
                $(this).data("nestable-id", new Date().getTime());
            } else {
                if (typeof params === 'string' && typeof plugin[params] === 'function') {
                    retval = plugin[params]();
                }
            }
        });

        return retval || lists;
    };

})(window.jQuery || window.Zepto, window, document);


/**
 * initdata的第一个参数是div的id，说明把得到的数据显示在哪个地方下。
 * initdata的第二个参数是初始化内容，以货物的对象为例。
 * initdata的第三个参数表示是初始化哪些内容，type=1时为人员信息，type=2时为货物信息。
 */
function initpersondata(obj,data) {
    var div=document.getElementById(obj);
    var ol=document.createElement("ol");
    div.appendChild(ol);
    ol.setAttribute("class","dd-list");
    for(var i=1;i<=data.length;i++) {
        var li = document.createElement("li");
        ol.appendChild(li);
        li.setAttribute("class", "dd-item");
        li.setAttribute("id", "Person_" + i);
        var div2 = document.createElement("div");
        li.appendChild(div2);
        div2.setAttribute("class", "person_listItem dd-handle mdl-card mdl-shadow--4dp");
        var div3=document.createElement("div");
        div2.appendChild(div3);
        div3.setAttribute("class","person_listItem_title mdl-card__title mdl-card--border");
        var span1=document.createElement("span");
        div3.appendChild(span1);
        var img1=document.createElement("img");
        span1.appendChild(img1);
        img1.setAttribute("src","images/person_photo.png");
        var h1=document.createElement("h3");
        span1.appendChild(h1);
        h1.setAttribute("class","mdl-card__title-text");
        h1.innerHTML=data[i-1].getdmNickName();//输出Name
        var div4=document.createElement("div");
        div2.appendChild(div4);
        div4.setAttribute("class","mdl-card__supporting-text");
        var div5=document.createElement("div");
        div4.appendChild(div5);
        var span2=document.createElement("span");
        div5.appendChild(span2);
        var img2=document.createElement("img");
        span2.appendChild(img2);
        img2.setAttribute("id","person_listItem_phone_number");
        img2.setAttribute("src","images/person_listItem_phone_number.png");
        var div6=document.createElement("div");
        span2.appendChild(div6);
        div6.setAttribute("class","mdl-tooltip");
        div6.setAttribute("data-mdl-for","person_listItem_phone_number");
        div6.innerHTML="电话号码";
        var h2=document.createElement("h5");
        span2.appendChild(h2);
        h2.innerHTML=data[i-1].getdmTelephone();
        var span3=document.createElement("span");
        div5.appendChild(span3);
        var img3=document.createElement("img");
        span3.appendChild(img3);
        img3.setAttribute("id","person_listItem_id_num");
        img3.setAttribute("src","images/person_listItem_id_num.png");
        var div7=document.createElement("div");
        span3.appendChild(div7);
        div7.setAttribute("class","mdl-tooltip");
        div7.setAttribute("data-mdl-for","person_listItem_id_num");
        div7.innerHTML="身份证号";
        var h3=document.createElement("h5");
        span3.appendChild(h3);
        h3.innerHTML=data[i-1].getdmEmail();
        var div8=document.createElement("div");
        div4.appendChild(div8);
        var img4=document.createElement("img");
        div8.appendChild(img4);
        img4.setAttribute("id","person_listItem_address");
        img4.setAttribute("src","images/person_listItem_address.png");
        var div9=document.createElement("div");
        div8.appendChild(div9);
        div9.setAttribute("class","mdl-tooltip");
        div9.setAttribute("data-mdl-for","person_listItem_address");
        div9.innerHTML="所属中转站";
        var h4=document.createElement("h5");
        div8.appendChild(h4);
        h4.innerHTML=data[i-1].getdmAddress();
    }
}
function initladingdata(obj,data,type) {
    var div=document.getElementById(obj);
    var ol=document.createElement("ol");
    div.appendChild(ol);
    ol.setAttribute("class","dd-list");
    for(var i=1;i<=data.getLadingInfoList().length;i++) {
        var li = document.createElement("li");
        ol.appendChild(li);
        li.setAttribute("class", "dd-item");
        li.setAttribute("id", "Lading_" + i);
        var div2 = document.createElement("div");
        li.appendChild(div2);
        if(type=="0")
            div2.setAttribute("class", "lading_listItem dd-handle mdl-card mdl-shadow--4dp");
        else
            div2.setAttribute("class", "lading_listItem_undraged dd-handle mdl-card mdl-shadow--4dp");
        var div3=document.createElement("div");
        div2.appendChild(div3);
        div3.setAttribute("class","mdl-card__title");
        var h1=document.createElement("h3");
        div3.appendChild(h1);
        h1.setAttribute("id","lading_listItem_id");
        h1.setAttribute("class","mdl-card__title-text");
        h1.innerHTML=data.getLadingInfoList()[i-1].getLadingIdNum();//输出Name
        var div4=document.createElement("div");
        div3.appendChild(div4);
        div4.setAttribute("class","mdl-tooltip");
        div4.setAttribute("data-mdl-for","lading_listItem_id");
        div4.innerHTML="货物单号";
        var div5=document.createElement("div");
        div2.appendChild(div5);
        div5.setAttribute("class","mdl-card__supporting-text");
        var div6=document.createElement("div");
        div5.appendChild(div6);
        var span1=document.createElement("span");
        div6.appendChild(span1);
        var img1=document.createElement("img");
        span1.appendChild(img1);
        img1.setAttribute("id","lading_listItem_name");
        img1.setAttribute("src","images/lading_listItem_name.png");
        var div7=document.createElement("div");
        span1.appendChild(div7);
        div7.setAttribute("class","mdl-tooltip");
        div7.setAttribute("data-mdl-for","lading_listItem_name");
        div7.innerHTML="收货人姓名";
        var h1=document.createElement("h5");
        span1.appendChild(h1);
        h1.innerHTML=data.getLadingInfoList()[i-1].getReceiverName();
        var span2=document.createElement("span");
        div6.appendChild(span2);
        var img2=document.createElement("img");
        span2.appendChild(img2);
        img2.setAttribute("id","lading_listItem_phone");
        img2.setAttribute("src","images/lading_listItem_phone.png");
        var div8=document.createElement("div");
        span2.appendChild(div8);
        div8.setAttribute("class","mdl-tooltip");
        div8.setAttribute("data-mdl-for","lading_listItem_phone");
        div8.innerHTML="收货人联系方式";
        var h2=document.createElement("h5");
        span2.appendChild(h2);
        h2.innerHTML=data.getLadingInfoList()[i-1].getReceiverPhone();
        var div9=document.createElement("div");
        div5.appendChild(div9);
        var img3=document.createElement("img");
        div9.appendChild(img3);
        img3.setAttribute("id","lading_listItem_address");
        img3.setAttribute("src","images/lading_listItem_address.png");
        var div10=document.createElement("div");
        div9.appendChild(div10);
        div10.setAttribute("class","mdl-tooltip");
        div10.setAttribute("data-mdl-for","lading_listItem_address");
        div10.innerHTML="收货人地址";
        var h3=document.createElement("h5");
        div9.appendChild(h3);
        h3.innerHTML=data.getLadingInfoList()[i-1].getReceiverAddress();
        var div11=document.createElement("div");
        div5.appendChild(div11);
        var img4=document.createElement("img");
        div11.appendChild(img4);
        img4.setAttribute("id","lading_listItem_updateTime");
        img4.setAttribute("src","images/lading_listItem_updateTime.png");
        var div12=document.createElement("div");
        div11.appendChild(div12);
        div12.setAttribute("class","mdl-tooltip");
        div12.setAttribute("data-mdl-for","lading_listItem_updateTime");
        div12.innerHTML="货物信息更新时间";
        var h4=document.createElement("h5");
        div11.appendChild(h4);
        h4.innerHTML=data.getLadingInfoList()[i-1].getUpDataTime();
    }
}