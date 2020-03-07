// 2019/12/5/13:04
/**
 * 模拟名字空间 smurf_1
 * 变量：
 *      -show_synbean           // 未连接队列状态 
 *      -hide_synbean
 *      -pause                  // 暂停/开始状态 true:暂停 false:进行
 *      -anim_handle            // 发包动画流程句柄
 *      -arrow_handle           // 箭头动画句柄
 *      -pause_before;          // 存储显示包信息之前动画的pause值
 *      -live                   // 用户是否选择了该动画
 * 函数：
 *      -main() 入口函数
 *      -sendPackage() 发送数据包的动画流程
 *      -initCanvas() 初始化页面中只需要初始化一次的内容，由main()调用一次
 *      -initAnimation() 初始化/重置动画过程的参数
 *      -drawArrow() 绘制用户和服务器端建立连接后的箭头动画
 *      -showMessage() 显示数据包的详细信息
 */
var smurf_1 = smurf_1 || {};
// 全局变量
smurf_1.arrows_handle1 = null;    //初始化箭头动画句柄
smurf_1.arrows_handle2 = null;    //部分箭头停滞动画句柄
smurf_1.pause = true;                 // 暂停开始状态
smurf_1.anim_handle = null;              // 发包动画流程句柄
smurf_1.pause_before;                 // 保存鼠标移入之前的pause值
smurf_1.live = false;

smurf_1.main = function () {
    smurf_1.live = true;
    smurf_1.initCanvas();
    initBandwidth();
    smurf_1.initAnimation();
    clearInterval(enqueueFlag);
    enqueueUser();
    $("#start").click(function () {
        if (smurf_1.pause) {
            if ($('#start').text() == '开始') {
                smurf_1.initAnimation();
                smurf_1.drawArrow1();
            }
            clearInterval(enqueueFlag);
            enqueueUser();
            $('#start').text("暂停");
            window.requestAnimationFrame(smurf_1.send_package);
        } else {
            $('#start').text("继续");
            clearInterval(enqueueFlag);
        }
        smurf_1.pause = smurf_1.pause ? false : true;
    });

    $('#restart').click(function () {
        smurf_1.initAnimation();
        smurf_1.drawArrow1();
        $('#start').text("暂停");
        clearInterval(enqueueFlag);
        enqueueUser();
        smurf_1.pause = false;
        window.requestAnimationFrame(smurf_1.send_package);//重新请求动画
    });

    $('.package').mouseenter(smurf_1.showMessage);

    $('.package').mouseleave(function () {
        smurf_1.pause = smurf_1.pause_before;
        window.requestAnimationFrame(smurf_1.send_package);  // 动画继续
        $('#info').hide();
        $('#info div').remove();  // 将信息移出页面
    });
};


smurf_1.showMessage = function () {
    //暂停动画
    smurf_1.pause_before = smurf_1.pause;
    smurf_1.pause = true;
    window.cancelAnimationFrame(smurf_1.anim_handle);
    //设置显示内容
    let package_id = $(this).attr('id');
    if(package_id=="receive1"||package_id=="receive2"||package_id=="receive3")
        message = '<div style:"text-align:left;">回复地址：3.3.3.3</div>';
    else
        message = '<div style:"text-align:left;">源地址：3.3.3.3</div>';

    $(message).appendTo('#info');
    // 设置显示位置
    let top = parseInt($(this).css('top')) - parseInt($('#info').css('height')) - 5;
    let left = parseInt($(this).css('left')) + parseInt($(this).css('width')) / 2 - parseInt($('#info').css('width')) / 2;
    $('#info').css(
        {
            'top': top + 'px',
            'left': left + 'px'
        }
    );
    // 淡入显示
    $('#info').fadeIn('normal');
};
smurf_1.defendAnimation=function()
{
    $('#select_title').show();
    $('#options').unbind("mouseleave");
    $('#options').mouseleave(function () {
        $('#queue2').hide();
        $("form input").each(function () {//循环绑定事件
            if (this.checked && smurf_1.live) {
                if (this.id == 'option1') {
                    //增加带宽的动画
                    mes.run_pointer(6,3);                
                    mes.e = document.getElementById("right2");
                    ctx3 = mes.e.getContext("2d");
                    ctx3.clearRect(190,130,80,10);
                    ctx3.fillStyle = "rgb(11,121,157)";
                    ctx3.font = "18px serif";
                    ctx3.fillText("0", 50, 140);
                    ctx3.fillText("20GBps", 230, 140);
                    setTimeout(function(){
                        smurf_1.drawArrow1();
                    },1000);
                    setTimeout(function(){
                        $('.load').hide();
                        enqueueUser();
                    },1800);
               }
                if (this.id == 'option2') {//改动
                    //增加内存的动画
                    //smurf增加内存是无效的，因为目标系统都很快就会被大量的echo信息吞没，
                    //这样轻而易举地就能够阻止该系统处理其它任何网络传输，从而引起拒绝为正常系统服务。
                    $('#queue2').show();
                    mes.draw_n_rect(50,25,0,0);
                }
                if (this.id == 'option3') {
                    //ip检测--加入黑名单的动画
                    console.log(111);
                }
                if (this.id == 'option4') {
                    //将未连接队列随机丢弃一半--无效
                    for (var i = 7; i >= 5; i--) {
                        dequeue_back(i);
                    }  
                    mes.draw_n_rect(50,25,0,0);
                    setTimeout(function(){
                        //攻击一段时间后，然后再次到达50%
                        let prompt2 = '<div class="prompt2">持续攻击一段时间以后</div>';
                        $(prompt2).appendTo('#level0_div');
                        $('.prompt2').css({
                            position: 'absolute',
                            left: '220px',
                            top: '20px',
                            'font-size': '20px',
                        });
                        setTimeout(function(){
                            $('.prompt2').fadeOut(function(){
                                clearInterval(enqueueFlag);
                                for (var i = 9; i >= 5; i--) {
                                    enqueue_back(i);
                                }       
                            })
                            mes.draw_n_rect(25,50,0,0);
                        },2000)
                    },4000)     
                }
            }
        });
        $("#options").slideUp();
    });
}
smurf_1.send_package = function () {
    let icmp = parseInt($('#icmp').css('left'));
    let icmp1 = parseInt($('#icmp1').css('left'));
    let receive = parseInt($('#receive1').css('left'));

    if (!smurf_1.pause) {
        if (icmp >= 200) {
            $('#icmp').hide();
        }
        if (icmp1 >= 275) {
            $('#icmp1,#icmp2,#icmp3').hide();
        }
        if (icmp < 200) {
            $('#icmp').css({ left: '+=1px' }).show();
        }
        else if (icmp1 < 275) {
            $('#icmp1').css({ left: '+=0.5px', top: '-=1px' }).show();
            $('#icmp2').css({ left: '+=0.5px' }).show();
            $('#icmp3').css({ left: '+=0.5px', top: '+=1px' }).show();
        }
        else {
            if (receive < 525) {
                $('#receive1').css({ left: '+=1px', top: '+=0.6px' }).show();
                $('#receive2').css({ left: '+=1px' }).show();
                $('#receive3').css({ left: '+=1px', top: '-=0.6px' }).show();
            }
            else {
                $('#receive1').hide();
                $('#receive2').hide();
                $('#receive3').hide();
                $('#start').text("开始");
                clearInterval(enqueueFlag);
                smurf_1.drawArrow2();
                smurf_1.pause = true;
                for (var i = 9; i >= 5; i--) {//改动
                    enqueue_back(i);
                }
                $(".load").show();
                mes.draw_n_rect(30,50,0, 0);
                mes.set_IP("10K");
                mes.play(0,2,0, 2,0, 7,0,1,0,1);
                mes.run_pointer(1,6);
                smurf_1.defendAnimation();
                window.cancelAnimationFrame(smurf_1.anim_handle);
            }
        }
        smurf_1.anim_handle = window.requestAnimationFrame(smurf_1.send_package);
    }
};

//需要多次初始化的内容
smurf_1.initAnimation = function () {
    window.cancelAnimationFrame(smurf_1.anim_handle);
    initBandwidth();
    mes.draw_n_rect(0,30,0, 0);
    mes.set_IP("500");
    mes.play(0,2,0, 2,0, 1,0,1,0,1);
    mes.run_pointer(0,1);
    $('#select_title').hide();
    $('#queue div').css({
        'visibility': 'hidden'
    });
    $('#queue2').hide();
    $('#queue2 div').css({
        'visibility': 'hidden'
    });

    $('.package').hide();
    // icmp 的初始位置  90 -- 160 
    $('#icmp').css({
        left: '90px',
        top: '210px'
    });

    // 路由转发之后的icmp的位置
    $('#icmp1').css({
        left: '200px',
        top: '210px'
    });
    $('#icmp2').css({
        left: '200px',
        top: '210px'
    });
    $('#icmp3').css({
        left: '200px',
        top: '210px'
    });

    // receive包终点 left: '525px', top: '210px' 
    $('#receive1').css({
        left: '350px',
        top: '100px'
    });

    $('#receive2').css({
        left: '350px',
        top: '210px'
    });

    $('#receive3').css({
        left: '350px',
        top: '325px'
    });

    //圈圈图的位置
    $(".load").hide();
    //恢复开始按钮
    $('#start').text('开始');
    syn_r.pause = true; // 暂停开始状态
    syn_r.anim_handle = null; // 动画句柄
};


// 只需要初始化一次的内容
smurf_1.initCanvas = function () {
    //初始化画布
    var ctx = $('#level0')[0].getContext("2d"); //let 声明的变量只在 let 命令所在的代码块 {} 内有效，在 {} 之外不能访问。

    let server = new Image();
    server.src = './img/server.png';
    server.onload = function () {
        ctx.drawImage(server, 550, 175, 100, 100);
    };
    $('<div id="server_ip" class="ip">IP:3.3.3.3</div>').appendTo('#level0_div');
    $('#server_ip').css({
        position: 'absolute',
        top: '275px',
        left: '610px'
    });

    let hacker = new Image();
    hacker.src = './img/hacker.png';
    hacker.onload = function () {
        ctx.drawImage(hacker, 0, 175, 100, 100);
    };
    $('<div id="hacker_ip" class="ip">IP:1.1.1.1</div>').appendTo('#level0_div');
    $('#hacker_ip').css({
        position: 'absolute',
        top: '275px',
        left: '20px'
    });

    let router = new Image();
    router.src = "./img/router.png";
    router.onload = function () {
        ctx.drawImage(router, 175, 200, 50, 50);
    };
    $('<div id="router_ip" class="ip">IP:2.2.2.2</div>').appendTo('#level0_div');
    $('#router_ip').css({
        position: 'absolute',
        top: '240px',
        left: '170px'
    });

    let computer = new Image();
    computer.src = './img/computer.png';
    computer.onload = function () {
        ctx.drawImage(computer, 460, 10, 80, 60);
        ctx.drawImage(computer, 460, 380, 80, 60);

        ctx.drawImage(computer, 300, 50, 50, 50);
        ctx.drawImage(computer, 300, 200, 50, 50);
        ctx.drawImage(computer, 300, 350, 50, 50);
    };
    $('<div id="computer_ip1" class="ip">IP:2.2.2.3</div>').appendTo('#level0_div');
    $('#computer_ip1').css({
        position: 'absolute',
        top: '100px',
        left: '290px'
    });
    $('<div id="computer_ip2" class="ip">IP:2.2.2.4</div>').appendTo('#level0_div');
    $('#computer_ip2').css({
        position: 'absolute',
        top: '250px',
        left: '290px'
    });
    $('<div id="computer_ip3" class="ip">IP:2.2.2.5</div>').appendTo('#level0_div');
    $('#computer_ip3').css({
        position: 'absolute',
        top: '400px',
        left: '290px'
    });


    //初始化数据包
    $(".package").hide();
    $('<div id="icmp" class="package">ICMP请 求</div>').appendTo('#level0_div');
    $('<div id="icmp1" class="package">ICMP请 求</div>').appendTo('#level0_div');
    $('<div id="icmp2" class="package">ICMP请 求</div>').appendTo('#level0_div');
    $('<div id="icmp3" class="package">ICMP请 求</div>').appendTo('#level0_div');
    $('<div id="receive1" class="package">ICMP响 应</div>').appendTo('#level0_div');
    $('<div id="receive2" class="package">ICMP响 应</div>').appendTo('#level0_div');
    $('<div id="receive3" class="package">ICMP响 应</div>').appendTo('#level0_div');
    $('.package').css({
        'height': '26px',
        'width': '25px',
        'font-size': '10px'
    });
    // 初始化未连接队列
    $('#queue').css(
        {
            position: 'absolute',
            width: '23px',
            height: '100px',
            top: '175px',
            left: '627px',
        }
    );
    $('#queue div').css({
        'background-color': 'grey',
        'width': '23px',
        'height': '9px',
        'margin-top': '1px',
        'visibility': 'hidden'
    });

    $('#queue2').hide();
    $('#queue2').css({
            position: 'absolute',
            width: '23px',
            height: '97px',
            top: '176px',
            left: '650px',
            'border-style':'solid',
            'border-width':'1.5px',
            'background-color':'#0b799d',
    });

    $('#queue2 div').css({
        'background-color': 'grey',
        'width': '23px',
        'height': '8.7px',
        'margin-top': '1px',
        'visibility': 'hidden'
    });
    //初始化圈圈图
    $('.load').hide();
    $('<div><img id="load1" class="load" src="./img/load.gif" width="65" height="40" /></div>').appendTo('#level0_div');
    $('<div><img id="load2" class="load" src="./img/load.gif" width="65" height="40" /></div>').appendTo('#level0_div');
    $('#load1').css({
        top: '16px',
        left: '469px'
    });
    $('#load2').css({
        top: '386px',
        left: '469px'
    });

    $('#start').text('开始');
    // 初始化箭头
    smurf_1.drawArrow1();
};

smurf_1.drawArrow1 = function () {
    clearInterval(smurf_1.arrows_handle1);
    clearInterval(smurf_1.arrows_handle2);
    let canvas = $('#level1')[0];
    let ctx = canvas.getContext('2d'); // 第一层画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var _index = 1;
    arrowTo(ctx, { x: 490, y: 70 }, { x: 590, y: 175 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
    arrowTo(ctx, { x: 610, y: 175 }, { x: 510, y: 70 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
    arrowTo(ctx, { x: 490, y: 380 }, { x: 590, y: 275 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
    arrowTo(ctx, { x: 610, y: 275 }, { x: 510, y: 380 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
    smurf_1.arrows_handle1 = setInterval(function () {  //setInterval每隔0.3s，箭头高亮
        ctx.clearRect(0, 0, canvas.width, canvas.height);   //清除指定的矩形区域，然后这块区域会变的完全透明。
        arrowTo(ctx, { x: 490, y: 70 }, { x: 590, y: 175 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
        arrowTo(ctx, { x: 610, y: 175 }, { x: 510, y: 70 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
        arrowTo(ctx, { x: 490, y: 380 }, { x: 590, y: 275 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
        arrowTo(ctx, { x: 610, y: 275 }, { x: 510, y: 380 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
        if (_index >= 50) {
            _index = 1
        }
        else {
            _index++;
        }
    }, 300);
};

smurf_1.drawArrow2 = function () {
    clearInterval(smurf_1.arrows_handle1);
    clearInterval(smurf_1.arrows_handle2);
    let canvas = $('#level1')[0];
    let ctx = canvas.getContext('2d'); // 第一层画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var _index = 1;
    arrowTo(ctx, { x: 490, y: 70 }, { x: 590, y: 175 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
    arrowTo(ctx, { x: 610, y: 175 }, { x: 510, y: 70 });
    arrowTo(ctx, { x: 490, y: 380 }, { x: 590, y: 275 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
    arrowTo(ctx, { x: 610, y: 275 }, { x: 510, y: 380 });
    smurf_1.arrows_handle2 = setInterval(function () {  //setInterval每隔0.3s，箭头高亮
        ctx.clearRect(0, 0, canvas.width, canvas.height);   //清除指定的矩形区域，然后这块区域会变的完全透明。
        arrowTo(ctx, { x: 490, y: 70 }, { x: 590, y: 175 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
        arrowTo(ctx, { x: 610, y: 175 }, { x: 510, y: 70 });
        arrowTo(ctx, { x: 490, y: 380 }, { x: 590, y: 275 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
        arrowTo(ctx, { x: 610, y: 275 }, { x: 510, y: 380 });
        if (_index >= 50) {
            _index = 1
        }
        else {
            _index++;
        }
    }, 300);
};

// 清除页面状态
smurf_1.clear = function () {
    $("#level0")[0].getContext("2d").clearRect(0, 0, 700, 450);
    $("#level1")[0].getContext("2d").clearRect(0, 0, 700, 450);
    // 解除所有事件绑定
    clearInterval(enqueueFlag);
    clearInterval(smurf_1.arrows_handle1);
    clearInterval(smurf_1.arrows_handle2);
    smurf_1.arrows_handle1=null;
    $('.package').unbind().remove();
    $('#start').unbind();
    $('#restart').unbind();
    smurf_1.initAnimation();
    $('.package').remove();
    $('.ip').remove();
    $('.load').remove();
    $('.prompt2').remove();
    smurf_1.live = false;
};