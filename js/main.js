require([], function (){
	var showCode = false;

	$(window).scroll(function() {
	    var a = $(window).scrollTop();
	    if(a > 126) {
	        $('.go-top').fadeIn();
	    }else {
	        $('.go-top').fadeOut();
	    }
	});

	$(".go-top").click(function(){
		$("body").animate({scrollTop:"0px"},'600');
	});

	$('.show-code').click(function() {
		var module = showCode ? 'fadeOut' : 'fadeIn';
		$('.support-author .pay-code')[module]();
		showCode = !showCode;
	});

	$('.toc-close').click(function() {
		$('.toc-article').fadeOut();
		$('.show-toc-btn').fadeIn();
	});

	$('.show-toc-btn').click(function() {
		$('.toc-article').fadeIn();
		$('.show-toc-btn').fadeOut();
	});


	var search_flag = false;   //输入框不显示
	$('.search-wrap span').on('click', function() {
		if(!search_flag) {
			$('.search-wrap').animate({'width': '230px'}, 300);
			setTimeout(function() {
				$('.search-wrap input').focus();
			}, 350);
		} else {
			$('.search-wrap input').blur().val('');
			$('.search-result ul').empty();
			$('.search-wrap').animate({'width': '34px'}, 300);
		}
		search_flag = !search_flag;
	});
	$('.search-wrap input').change(function() {
		var txt = $(this).val();
		if(txt == '') {
			$('.search-result ul').empty();
			return ;
		}
		$.getJSON('/data/getArticleUrl.json', function(d) {
			var arr = d.data, len = d.data.length, num = 0;
			var html = '';
			for(var i = 0; i < len; i++) {
				if(arr[i].title.indexOf(txt) != -1 || arr[i].url.indexOf(txt) != -1 || arr[i].tags.indexOf(txt) != -1) {   //搜索出了此文章
					num ++;
					html += '<li><a href="'+ arr[i].url +'">'+ arr[i].title +'</a></li>';
				}
			}
			$('.search-result ul').html(html);
			if(num > 12) {
				$('.search-result ul').css('overflow-y', 'scroll');
			} else {
				$('.search-result ul').css('overflow-y', 'hidden');
			}
		});
	});

	var isMobileInit = false;
	var loadMobile = function(){
		require(['/js/mobile.js'], function(mobile){
			mobile.init();
			isMobileInit = true;
		});
	}
	var isPCInit = false;
	var loadPC = function(){
		require(['/js/pc.js'], function(pc){
			pc.init();
			isPCInit = true;
		});
	}

	var browser={
	    versions:function(){
	    var u = window.navigator.userAgent;
	    return {
	        trident: u.indexOf('Trident') > -1, //IE内核
	        presto: u.indexOf('Presto') > -1, //opera内核
	        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
	        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
	        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者安卓QQ浏览器
	        iPad: u.indexOf('iPad') > -1, //是否为iPad
	        webApp: u.indexOf('Safari') == -1 ,//是否为web应用程序，没有头部与底部
	        weixin: u.indexOf('MicroMessenger') == -1 //是否为微信浏览器
	        };
	    }()
	}

	$(window).bind("resize", function(){
		if(isMobileInit && isPCInit){
			$(window).unbind("resize");
			return;
		}
		var w = $(window).width();
		if(w >= 700){
			loadPC();
		}else{
			loadMobile();
		}
	});


	if(browser.versions.mobile === true || $(window).width() < 700){
		loadMobile();
	}else{
		loadPC();
	}

	//是否使用fancybox
	if(yiliaConfig.fancybox === true){
		require(['/fancybox/jquery.fancybox.js'], function(pc){
			var isFancy = $(".isFancy");
			if(isFancy.length != 0){
				var imgArr = $(".article-inner img");
				for(var i=0,len=imgArr.length;i<len;i++){
					var src = imgArr.eq(i).attr("src");
					var title = imgArr.eq(i).attr("alt");
					imgArr.eq(i).replaceWith("<a href='"+src+"' title='"+title+"' rel='fancy-group' class='fancy-ctn fancybox'><img src='"+src+"' title='"+title+"'></a>");
				}
				$(".article-inner .fancy-ctn").fancybox();
			}
		});

	}
	//是否开启动画
	if(yiliaConfig.animate === true){

		require(['/js/jquery.lazyload.js'], function(){
			//avatar
			$(".js-avatar").attr("src", $(".js-avatar").attr("lazy-src"));
			$(".js-avatar")[0].onload = function(){
				$(".js-avatar").addClass("show");
			}
		});

		if(yiliaConfig.isHome === true){
			//content
			function showArticle(){
				$(".article").each(function(){
					if( $(this).offset().top <= $(window).scrollTop()+$(window).height() && !($(this).hasClass('show')) ) {
						$(this).removeClass("hidden").addClass("show");
						$(this).addClass("is-hiddened");
					}else{
						if(!$(this).hasClass("is-hiddened")){
							$(this).addClass("hidden");
						}
					}
				});
			}
			$(window).on('scroll', function(){
				showArticle();
			});
			showArticle();
		}

	}

	//是否新窗口打开链接
	if(yiliaConfig.open_in_new == true){
		$(".article a[href]").attr("target", "_blank");
	}

});


if($(".instagram").length) {
	var bp = document.createElement('script');
    bp.src = '/js/photo.js';
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);

    require(['/js/photo.js', '/fancybox/jquery.fancybox.js', '/js/jquery.lazyload.js'], function(obj) {
        obj.init();
    });
}
