// created by 涔夊潳 on 11.30

function reSlider(conf) {

	this.config = {
		elem: conf && conf.elem || '',
		allowAuto: conf && conf.allowAuto || false,    //与许自动播放
		spaceTime: conf && conf.spaceTime || 8     //间隔时间
	};

    this.currentid = 1;
    this.white = '#fff';
    this.gray = '#555';

	this.init();

}

reSlider.prototype.init = function() {

	var me = this;
	me.elem = $('#' + me.config.elem).length !== 0 ? $('#' + me.config.elem) : $('.' + me.config.elem);
    me.sliders = me.elem.find('.sliders');
    me.slide = me.elem.find('.slide');

	me.wid = me.slide.width();
	me.num = me.slide.length;

    me.elem.css({position: 'relative'});
    // me.sliders.css({width: '100%', height: '100%'});
    me.slide.css({position: 'absolute', left: 0});

	if(me.num <= 1) {
		return;
	}

    var html = '<div class="slide-nav" style="width:100%;text-align:center;height:15px;position:absolute;bottom:50px;">';
    for(var i = 0; i < me.num; i ++) {
        html += '<i data-num="'+ (i+1) +'" style="width:15px;height:15px;border-radius:50%;background:#555;display:inline-block;margin:0 5px;cursor:pointer;"></i>';
    }
    me.elem.append(html + '</div>');
    me.elem.find('.slide-nav i:first-child').css('background', me.white);

	me.play();

};


reSlider.prototype.play = function() {
	var me = this, timer;

	if(me.config.allowAuto) {
		timer = setInterval(function() {
			me.next(me.currentid);
		}, me.config.spaceTime * 1000);

		me.elem.find('.slide-nav').on('mouseover', function() {
			clearInterval(timer);
		}).on('mouseout', function() {
			timer = setInterval(function() {
				me.next(me.currentid);
			}, me.config.spaceTime * 1000);
		});
	}


	me.elem.find('.slide-btn-prev').on('click', function() {
		me.prev(me.currentid);
	});
	me.elem.find('.slide-btn-next').on('click', function() {
		me.next(me.currentid);
	});

    me.elem.find('.slide-nav i').on('click', function() {
        me.currentid = $(this).attr('data-num');
        me.elem.find('.slide-nav i').css('background', me.gray);
        $(this).css('background', me.white);

        me.slide.fadeOut(800);
        setTimeout(function() {
            me.elem.find('.slide[data-num="'+ me.currentid +'"]').fadeIn(1000);
        }, 400);
    });

};

reSlider.prototype.next = function(index) {    //next下一页
	var me = this;

    me.currentid = index < me.num ? (index + 1) : 1;

    me.elem.find('.slide-nav i').css('background', me.gray);
    me.elem.find('.slide-nav i[data-num="'+ me.currentid +'"]').css('background', me.white);

    me.slide.fadeOut(800);
    setTimeout(function() {
        me.elem.find('.slide[data-num="'+ me.currentid +'"]').fadeIn(1200);
    }, 400);

};

reSlider.prototype.prev = function(index) {     //prev上一页
	var me = this;

    me.currentid = index > 1 ? (index - 1) : me.num;

    me.elem.find('.slide-nav i').css('background', me.gray);
    me.elem.find('.slide-nav i[data-num="'+ me.currentid +'"]').css('background', me.white);

    me.slide.fadeOut(800);
    setTimeout(function() {
        me.elem.find('.slide[data-num="'+ me.currentid +'"]').fadeIn(1000);
    }, 400);

};
