/*页顶导航栏的下拉菜单*/
$(function(){
    $(".sub_menu").hover(
        function(){
            $(".sub_menu .nav").stop(true,true).toggle("slow");
        }
    );
});

/*设置右侧媒体块的收缩*/
$(function(){
    var $thisTitle=$(".media .title");
    var hoverTimer,outTimer;
    $(".media").hover(
            function(){
                clearTimeout(outTimer);
                hoverTimer=setTimeout(function(){
                    $thisTitle.parent().animate({marginRight:"0"},300);
                },300);
            },function(){
                clearTimeout(hoverTimer);
                outTimer=setTimeout(function(){
                    $thisTitle.parent().animate({marginRight:"-400px"},300);
                },0);
            }
        )
});

/*考生模式下我爱东软的span滑动*/
$(function(){
    $("#examinee_dr").hover(
        function(){
            $(this).find("span").slideDown(300);
        },
        function(){
            $(this).find("span").slideUp(300);
        }
    )
});

/*轮播图*/
$(function(){
    var sWidth=$("#slide").width();
    var len=$("#slide ul li").length;
    var index=0;
    var picTimer;
    $("#slide .btn span").mouseover(
        function(){
            index=$("#slide .btn span").index(this);
            showPics(index)
        }
    ).eq(0).trigger("mouseover");
    $("#slide .pre").click(
        function(){
            index-=1;
            if(index==-1){
                index=len-1
            }
            showPics(index)
        }
    );
    $("#slide .next").click(
        function(){
            index+=1;
            if(index==len){
                index=0
            }
            showPics(index)
        }
    );
    $("#slide ul").css("width",sWidth*(len));
    $("#slide").hover(
        function(){
            clearInterval(picTimer)
        },
        function(){
            picTimer=setInterval(
                function(){
                    showPics(index);
                    index++;
                    if(index==len){index=0}
                },
                3000)
        }
    ).trigger("mouseout");
    function showPics(index){
        var nowLeft=-index*sWidth;
        $("#slide ul").stop(true,false).animate({"left":nowLeft},400);
        $("#slide .btn span").removeClass("select").eq(index).addClass("select");
        $("#slide .btn span").stop(true,false).eq(index).stop(true,false);
    }
});

/*页脚*/
$(function() {
    $(".footer_up_on").click(
        function(){
            $(".footer_up").stop(true,false).slideToggle("slow");
        }
    );
    $(".relation li a").hover(
        function(){
            $(this).find(".more_box").stop().slideToggle(300);
        }
    );
    $(".search").hover(
        function(){
            $(".search .keyword").animate({"width":"150px"},200).focus()
        },
        function(){
            $(".search .keyword").animate({"width":"0"},100)
        }
    )
});

/*左侧导航栏切换整体页面*/
$(function(){
    var show=0;
    if(window.localStorage){
        var navShow=localStorage.getItem("who");
        if(navShow==null||navShow==4){
            $(".user li").eq(show).addClass("user_cur").siblings().removeClass("user_cur");
            $(".list").eq(show).slideDown(200).siblings().hide()
        }
        $(".user li").each(
            function(index){
                var li=$(this);
                show=li.attr("user_cur")==true?index:show;
                if(index==navShow){
                    li.addClass("user_cur");
                    $(".list").eq(index).slideDown(200).siblings().hide()
                }
                li.click(
                    function(){
                        li.addClass("user_cur").siblings().removeClass("user_cur");
                        $(".list").eq(index).slideDown(200).siblings().hide();
                        localStorage.setItem("who",index)
                    }
                )
            }
        )
    }
});


/*每个模块的切换*/
$(function(){
    var show=0;
    console.log($(".tab_box>div"));
    if(window.localStorage){
        var tabShow=localStorage.getItem("which");
        if(tabShow==null||tabShow==29){
            $(".user_tabs li a").eq(show).addClass("selected").parent().siblings().children("a").removeClass("selected");
            $(".tab_box>div").eq(show).slideDown(200).siblings("div").hide()
        }
        $(".user_tabs li a").each(
            function(index){
                var li=$(this);
                show=li.attr("selected")==true?index:show;
                if(index==tabShow){
                    li.addClass("selected");
                    $(".tab_box>div").eq(index).slideDown(200).siblings("div").hide()
                }
                li.hover(
                    function(){
                        li.addClass("selected").parent().siblings().children("a").removeClass("selected");
                        $(".tab_box>div").eq(index).slideDown(200).siblings("div").hide();
                        localStorage.setItem("which",index)
                    }
                )
            }
        )
    }
});