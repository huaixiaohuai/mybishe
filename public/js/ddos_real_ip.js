// 2019/12/5/13:04
/**
 * 模拟名字空间 ddos_r
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

var ddos_r = ddos_r || {};
// 全局变量
ddos_r.arrows_handle1 = null;    //初始化箭头动画句柄
ddos_r.arrows_handle2 = null;    //部分箭头停滞动画句柄
ddos_r.pause = true;                 // 暂停开始状态
ddos_r.anim_handle = null;              // 发包动画流程句柄
ddos_r.pause_before;                 // 保存鼠标移入之前的pause值
ddos_r.live = false;
ddos_r.sleep = false;

ddos_r.main = function () {
    ddos_r.live = true;
    ddos_r.initCanvas();
    clearInterval(enqueueFlag);
    enqueueUser();
    initBandwidth();
    $("#start").click(function () {
        if (ddos_r.pause) {
            if ($('#start').text() == '开始') {
                ddos_r.initAnimation();
                ddos_r.drawArrow1();
            }
            $('#start').text("暂停");
            window.requestAnimationFrame(ddos_r.send_package);
            clearInterval(enqueueFlag);
            enqueueUser();
        } else {
            $('#start').text("继续");
            clearInterval(enqueueFlag);
        }
        ddos_r.pause = ddos_r.pause ? false : true;
    });

    $('#restart').click(function () {
        ddos_r.initAnimation();
        ddos_r.drawArrow1();
        $('#start').text("暂停");
        clearInterval(enqueueFlag);
        enqueueUser();
        ddos_r.pause = false;
        window.requestAnimationFrame(ddos_r.send_package);//重新请求动画
    });

    $('.package').mouseenter(ddos_r.showMessage);

    $('.package').mouseleave(function () {
        ddos_r.pause = ddos_r.pause_before;
        window.requestAnimationFrame(ddos_r.send_package);  // 动画继续
        $('#info').hide();
        $('#info div').remove();  // 将信息移出页面
    });
};


ddos_r.showMessage = function () {
    //暂停动画
    ddos_r.pause_before = ddos_r.pause;
    ddos_r.pause = true;
    window.cancelAnimationFrame(ddos_r.anim_handle);
    //设置显示内容
    let package_id = $(this).attr('id');
    let message = null;
    if (package_id == "cmd1" || package_id == "cmd2" || package_id == "cmd3") {
        message = '<div style:"text-align:left;">攻击2.2.2.2</div>';
    } else if (package_id == "get1") {
        message = '<div style:"text-align:left;">发送IP: 1.2.3.4 <br /> 接收IP: 2.2.2.2</div>';
    } else if (package_id == "get2") {
        message = '<div style:"text-align:left;">发送IP: 4.3.2.1 <br /> 接收IP: 2.2.2.2</div>';
    } else if (package_id == "get3") {
        message = '<div style:"text-align:left;">发送IP: 3.1.2.4 <br /> 接收IP: 2.2.2.2</div>';
    }
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

ddos_r.send_package = function () {
    // 90-175
    let cmd = parseInt($('#cmd2').css('left'));
    //250 - 375
    let get = parseInt($('#get2').css('left'));

    if (!ddos_r.pause) {
        if (cmd >= 175) {
            $('#cmd1,#cmd2,#cmd3').hide();
            if (!ddos_r.sleep) {
                setTimeout(function () {
                    ddos_r.anim_handle = window.requestAnimationFrame(ddos_r.send_package);
                }, 500);
                ddos_r.sleep = true;
                return;
            }
        }

        if (cmd < 175) {
            $('#cmd1').css({ left: '+=0.5px', top: '-=0.6px' }).show();
            $('#cmd2').css({ left: '+=0.5px' }).show();
            $('#cmd3').css({ left: '+=0.5px', top: '+=0.6px' }).show();
        }

        else {
            if (get < 375) {
                $('#get1').css({ left: '+=0.6px', top: '+=0.5px' }).show();
                $('#get2').css({ left: '+=0.6px' }).show();
                $('#get3').css({ left: '+=0.6px', top: '-=0.5px' }).show();
                $('#load1').delay(500).show();
                $('#load2').delay(1000).show();
            }
            else {
                $('#get1,#get2,#get3').hide();
                $('#start').text("开始");
                clearInterval(enqueueFlag);
                ddos_r.drawArrow2();
                ddos_r.pause = true;
                window.cancelAnimationFrame(ddos_r.anim_handle);
                for (var i = 9; i >= 5; i--) {
                    enqueue_back(i);
                }
                $(".load").show();
                mes.draw_n_rect(30, 50, 0, 0);
                mes.set_IP("10k");
                mes.play(0, 5, 0, 5, 0, 5, 0, 5, 0, 5);
                mes.run_pointer(1, 8);
                ddos_r.defendAnimation();
            }
        }
        ddos_r.anim_handle = window.requestAnimationFrame(ddos_r.send_package);
    }
};
ddos_r.IP = function () {
    // ip检测--加入黑名单的动画
    // 服务器向来源IP发包检测其是否回复
    // 不回复则直接加入黑名单
    // 创建一个探测包
    let messenger1 = '<div id="messenger1" class="package messenger">探测包</div>';
    let messenger2 = '<div id="messenger2" class="package messenger">探测包</div>';
    let messenger3 = '<div id="messenger3" class="package messenger">探测包</div>';

    $(messenger1).css({
        width: "40px",
        height: "18px",
        "font-size": "12px",
        left: "360px",
        top: "180px",
        display: "block"
    }).appendTo('#level0_div');

    $(messenger2).css({
        width: "40px",
        height: "18px",
        "font-size": "12px",
        left: "360px",
        top: "225px",
        display: "block"
    }).appendTo('#level0_div');

    $(messenger3).css({
        width: "40px",
        height: "18px",
        "font-size": "12px",
        left: "360px",
        top: "270px",
        display: "block"
    }).appendTo('#level0_div');

    // 发送探测包
    ddos_r.IP.handle = null;
    ddos_r.IP.hasShield = false; // 是否画好了盾牌
    ddos_r.IP.end = false;

    let messenger_go = function () {
        let messenger2_left = parseInt($('#messenger2').css('left'));
        if (messenger2_left >= 250) {
            $('.messenger').css({ left: "-=1px" });
            $('#messenger1').css({ top: "-=0.5px" });
            $('#messenger3').css({ top: "+=0.5px" });
        } else {
            window.cancelAnimationFrame(syn_r.IP.handle);
            ddos_r.IP.end = true;
            ddos_r.IP.handle = null;
            setTimeout(function () {
                $('.messenger').remove();
            }, 1000)
            // 显示信息
            setTimeout(function () {
                let prompt3 = '<div id="prompt3">没有回复，加入黑名单</div>';
                $(prompt3).css({
                    position: 'absolute',
                    left: '125px',
                    top: '225px',
                    'font-size': '20px',
                }).appendTo('#level0_div');
            }, 2000);

            setTimeout(function () {
                // 移除信息
                $('#prompt3').remove();
            }, 3000)

            setTimeout(function () {
                // 清空未连接队列
                for (var i = 0; i <= 9; i++) {
                    $('#queue div').eq(i).css({
                        'visibility': 'hidden'
                    }).attr({
                        'class': ''
                    });
                }
                $('.load').hide();
                ddos_r.drawArrow1();
                clearInterval(enqueueFlag);
                enqueueUser();
            }, 4000);
        }
        if (!ddos_r.IP.end) {
            ddos_r.IP.handle = window.requestAnimationFrame(messenger_go);
        }
    }
    window.requestAnimationFrame(messenger_go);
}
ddos_r.defendAnimation = function () {
    $('#select_title').show();
    $('#options').unbind("mouseleave");
    $('#options').mouseleave(function () {
        $('#queue2').hide();
        $("form input").each(function () {//循环绑定事件
            if (this.checked && ddos_r.live) {
                if (this.id == 'option1') {
                    //增加带宽的动画
                    mes.run_pointer(8, 4);
                    mes.e = document.getElementById("right2");
                    ctx3 = mes.e.getContext("2d");
                    ctx3.clearRect(190, 130, 80, 10);
                    ctx3.fillStyle = "rgb(11,121,157)";
                    ctx3.font = "18px serif";
                    ctx3.fillText("0", 50, 140);
                    ctx3.fillText("20GBps", 230, 140);
                    setTimeout(function () {
                        ddos_r.drawArrow1();
                    }, 1000);
                    setTimeout(function () {
                        $('.load').hide();
                        enqueueUser();
                    }, 1800);
                }
                if (this.id == 'option2') {
                    //增加内存的动画
                    $('#queue2').show();
                    mes.draw_n_rect(50, 25, 0, 0);
                }
                if (this.id == 'option3') {
                    //ip检测--加入黑名单的动画
                    ddos_r.IP();
                }
                if (this.id == 'option4') {
                    //随机丢弃的动画
                    clearInterval(enqueueFlag);
                    //将未连接队列随机丢弃一半--无效
                    for (var i = 7; i >= 5; i--) {
                        dequeue_back(i);
                    }
                    mes.draw_n_rect(50, 25, 0, 0);
                    setTimeout(function () {
                        //攻击一段时间后，然后再次到达50%
                        let prompt2 = '<div class="prompt2">持续攻击一段时间以后</div>';
                        $(prompt2).appendTo('#level0_div');
                        $('.prompt2').css({
                            position: 'absolute',
                            left: '220px',
                            top: '20px',
                            'font-size': '20px',
                        });
                        setTimeout(function () {
                            $('.prompt2').fadeOut(function () {
                                clearInterval(enqueueFlag);

                                for (var i = 9; i >= 5; i--) {
                                    enqueue_back(i);
                                }

                                ddos_r.drawArrow2();
                                $('.load').show();
                            })
                            mes.draw_n_rect(25, 50, 0, 0);
                        }, 2000)
                    }, 4000)
                }
            }
        });
        $("#options").slideUp();
    });
}
//需要多次初始化的内容
ddos_r.initAnimation = function () {
    window.cancelAnimationFrame(ddos_r.anim_handle);
    initBandwidth();
    mes.draw_n_rect(0, 30, 0, 0);
    mes.set_IP("500");
    mes.play(0, 2, 0, 2, 0, 1, 0, 1, 0, 1);
    mes.run_pointer(0, 1);

    $('#queue div').css({
        'visibility': 'hidden'
    });
    $('#queue2').hide();
    $('#queue2 div').css({
        'visibility': 'hidden'
    });

    $('.package').hide();
    // 90-175
    $('#cmd1').css({
        left: '90px',
        top: '210px'
    });
    $('#cmd2').css({
        left: '90px',
        top: '210px'
    });
    $('#cmd3').css({
        left: '90px',
        top: '210px'
    });

    //250 - 375
    $('#get1').css({
        left: '250px',
        top: '100px'
    });

    $('#get2').css({
        left: '250px',
        top: '210px'
    });

    $('#get3').css({
        left: '250px',
        top: '325px'
    });

    //圈圈图的位置
    $(".load").hide();
    //恢复开始按钮
    $('#start').text('开始');
    syn_r.pause = true; // 暂停开始状态
    syn_r.anim_handle = null; // 动画句柄
    syn_r.sleep = false;
};


// 只需要初始化一次的内容
ddos_r.initCanvas = function () {
    //初始化画布
    var ctx = $('#level0')[0].getContext("2d"); //let 声明的变量只在 let 命令所在的代码块 {} 内有效，在 {} 之外不能访问。

    let server = new Image();
    server.src = './img/server.png';
    server.onload = function () {
        ctx.drawImage(server, 400, 175, 100, 100);
    };
    $('<div id="server_ip" class="ip">IP:2.2.2.2</div>').appendTo('#level0_div');
    $('#server_ip').css({
        position: 'absolute',
        top: '275px',
        left: '470px'
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

    let computer = new Image();
    computer.src = './img/computer.png';
    computer.onload = function () {
        ctx.drawImage(computer, 475, 15, 80, 60);
        ctx.drawImage(computer, 475, 375, 80, 60);
        ctx.drawImage(computer, 610, 200, 80, 60);

        ctx.drawImage(computer, 200, 50, 50, 50);
        ctx.drawImage(computer, 200, 200, 50, 50);
        ctx.drawImage(computer, 200, 350, 50, 50);
    };
    $('<div id="computer_ip1" class="ip">IP:1.2.3.4</div>').appendTo('#level0_div');
    $('#computer_ip1').css({
        position: 'absolute',
        top: '100px',
        left: '190px'
    });
    $('<div id="computer_ip2" class="ip">IP:4.3.2.1</div>').appendTo('#level0_div');
    $('#computer_ip2').css({
        position: 'absolute',
        top: '250px',
        left: '190px'
    });
    $('<div id="computer_ip3" class="ip">IP:3.1.2.4</div>').appendTo('#level0_div');
    $('#computer_ip3').css({
        position: 'absolute',
        top: '400px',
        left: '190px'
    });


    //初始化数据包
    $(".package").hide();
    $('<div id="cmd1" class="package">控制命令</div>').appendTo('#level0_div');
    $('<div id="cmd2" class="package">控制命令</div>').appendTo('#level0_div');
    $('<div id="cmd3" class="package">控制命令</div>').appendTo('#level0_div');
    $('<div id="get1" class="package">发起请求</div>').appendTo('#level0_div');
    $('<div id="get2" class="package">发起请求</div>').appendTo('#level0_div');
    $('<div id="get3" class="package">发起请求</div>').appendTo('#level0_div');
    $('.package').css({
        'height': '26px',
        'width': '25px',
        'font-size': '10px',
        'display': 'none'
    });
    // 初始化未连接队列
    $('#queue').css(
        {
            position: 'absolute',
            width: '23px',
            height: '100px',
            top: '175px',
            left: '477px'
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
        height: '97.5px',
        top: '176px',
        left: '500px',
        'border-style': 'solid',
        'border-width': '1.5px',
        'background-color': '#0b799d',
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
    $('<div><img id="load3" class="load" src="./img/load.gif" width="65" height="40" /></div>').appendTo('#level0_div');
    $('#load1').css({
        top: '21px',
        left: '484px'
    });
    $('#load2').css({
        top: '206px',
        left: '619px'
    });
    $('#load3').css({
        top: '382px',
        left: '484px'
    });

    $('#start').text('开始');
    // 初始化箭头
    ddos_r.drawArrow1();
};

ddos_r.drawArrow1 = function () {
    clearInterval(ddos_r.arrows_handle1);
    clearInterval(ddos_r.arrows_handle2);
    clearInterval(ddos_r.arrows_handle3);
    let canvas = $('#level1')[0];
    let ctx = canvas.getContext('2d'); // 第一层画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var _index = 1;
    arrowTo(ctx, { x: 500, y: 70 }, { x: 440, y: 175 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
    arrowTo(ctx, { x: 460, y: 175 }, { x: 520, y: 70 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
    arrowTo(ctx, { x: 615, y: 220 }, { x: 500, y: 220 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
    arrowTo(ctx, { x: 500, y: 240 }, { x: 615, y: 240 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
    arrowTo(ctx, { x: 500, y: 375 }, { x: 440, y: 275 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
    arrowTo(ctx, { x: 460, y: 275 }, { x: 520, y: 375 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })

    ddos_r.arrows_handle1 = setInterval(function () {  //setInterval每隔0.3s，箭头高亮
        ctx.clearRect(0, 0, canvas.width, canvas.height);   //清除指定的矩形区域，然后这块区域会变的完全透明。
        arrowTo(ctx, { x: 500, y: 70 }, { x: 440, y: 175 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 460, y: 175 }, { x: 520, y: 70 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 615, y: 220 }, { x: 500, y: 220 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 500, y: 240 }, { x: 615, y: 240 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 500, y: 375 }, { x: 440, y: 275 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 460, y: 275 }, { x: 520, y: 375 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        if (_index >= 50) {
            _index = 1
        }
        else {
            _index++;
        }
    }, 300);
};

ddos_r.drawArrow2 = function () {
    clearInterval(ddos_r.arrows_handle1);
    clearInterval(ddos_r.arrows_handle2);
    clearInterval(ddos_r.arrows_handle3);
    let canvas = $('#level1')[0];
    let ctx = canvas.getContext('2d'); // 第一层画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var _index = 1;
    arrowTo(ctx, { x: 500, y: 70 }, { x: 440, y: 175 }, { color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 460, y: 175 }, { x: 520, y: 70 });
    arrowTo(ctx, { x: 615, y: 220 }, { x: 500, y: 220 }, { color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 500, y: 240 }, { x: 615, y: 240 });
    arrowTo(ctx, { x: 500, y: 375 }, { x: 440, y: 275 }, { color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 460, y: 275 }, { x: 520, y: 375 });
    ddos_r.arrows_handle2 = setInterval(function () {  //setInterval每隔0.3s，箭头高亮
        ctx.clearRect(0, 0, canvas.width, canvas.height);   //清除指定的矩形区域，然后这块区域会变的完全透明。
        arrowTo(ctx, { x: 500, y: 70 }, { x: 440, y: 175 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 460, y: 175 }, { x: 520, y: 70 });
        arrowTo(ctx, { x: 615, y: 220 }, { x: 500, y: 220 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 500, y: 240 }, { x: 615, y: 240 });
        arrowTo(ctx, { x: 500, y: 375 }, { x: 440, y: 275 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 460, y: 275 }, { x: 520, y: 375 });
        if (_index >= 50) {
            _index = 1
        }
        else {
            _index++;
        }
    }, 300);
};

ddos_r.drawArrow3 = function () {
    clearInterval(ddos_r.arrows_handle1);
    clearInterval(ddos_r.arrows_handle2);
    clearInterval(ddos_r.arrows_handle3);
    let canvas = $('#level1')[0];
    let ctx = canvas.getContext('2d'); // 第一层画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var _index = 1;
    arrowTo(ctx, { x: 500, y: 70 }, { x: 440, y: 175 }, { color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 460, y: 175 }, { x: 520, y: 70 }, { color: "#0099CC", activeIndex: _index });
    arrowTo(ctx, { x: 615, y: 220 }, { x: 500, y: 220 }, { color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 500, y: 240 }, { x: 615, y: 240 });
    arrowTo(ctx, { x: 500, y: 375 }, { x: 440, y: 275 }, { color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 460, y: 275 }, { x: 520, y: 375 }, { color: "#0099CC", activeIndex: _index });
    ddos_r.arrows_handle3 = setInterval(function () {  //setInterval每隔0.3s，箭头高亮
        ctx.clearRect(0, 0, canvas.width, canvas.height);   //清除指定的矩形区域，然后这块区域会变的完全透明。
        arrowTo(ctx, { x: 500, y: 70 }, { x: 440, y: 175 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 460, y: 175 }, { x: 520, y: 70 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index });
        arrowTo(ctx, { x: 615, y: 220 }, { x: 500, y: 220 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 500, y: 240 }, { x: 615, y: 240 });
        arrowTo(ctx, { x: 500, y: 375 }, { x: 440, y: 275 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 460, y: 275 }, { x: 520, y: 375 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index });

        if (_index >= 50) {
            _index = 1
        }
        else {
            _index++;
        }
    }, 300);
};

// 清除页面状态
ddos_r.clear = function () {
    $("#level0")[0].getContext("2d").clearRect(0, 0, 700, 450);
    $("#level1")[0].getContext("2d").clearRect(0, 0, 700, 450);
    // 解除所有事件绑定
    clearInterval(enqueueFlag);
    clearInterval(ddos_r.arrows_handle1);
    clearInterval(ddos_r.arrows_handle2);
    ddos_r.arrows_handle1 = null;
    $('.package').unbind().remove();
    $('#start').unbind();
    $('#restart').unbind();
    ddos_r.initAnimation();
    $('.load').remove();
    $('.ip').remove();
    $('.prompt2').remove();
    ddos_r.live = false;
};