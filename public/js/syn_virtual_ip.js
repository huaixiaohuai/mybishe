// 2019/12/6/10:48
/**
 * 模拟名字空间 syn_v
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
 * 待解决问题：
 *      syn消失瞬间时，若点击重播，则会出现未擦除的ack
 */
var syn_v = syn_v || {};
// 全局变量
syn_v.arrows_handle1 = null; //初始化箭头动画句柄
syn_v.arrows_handle2 = null; //部分箭头停滞动画句柄
syn_v.show_synbean = true; // 未连接队列状态
syn_v.pause = true; // 暂停开始状态
syn_v.anim_handle = null; // 发包动画流程句柄
syn_v.pause_before; // 保存鼠标移入之前的pause值
syn_v.live = false; // 用户是否选择了该动画

syn_v.main = function () {
    syn_v.live = true;
    syn_v.initCanvas();
    clearInterval(enqueueFlag);
    enqueueUser();
    initBandwidth();
    $("#start").click(function () {
        if (syn_v.pause) {
            if ($('#start').text() == '开始') {
                syn_v.initAnimation();
                syn_v.drawArrow1();
                syn_v.startClone();
                clearInterval(enqueueFlag);
                enqueueUser();
                setTimeout(function () {
                    window.requestAnimationFrame(syn_v.sendPackage);
                }, 2500);
            } else { // 继续的时候不延迟
                window.requestAnimationFrame(syn_v.sendPackage)
            }

            $('#start').text("暂停");
        } else {
            clearInterval(enqueueFlag);
            $('#start').text("继续");
        }
        syn_v.pause = syn_v.pause ? false : true;
    });

    $('#restart').click(function () {   
        syn_v.initAnimation();
        syn_v.drawArrow1();
        syn_v.startClone();
        setTimeout(function () {
            window.requestAnimationFrame(syn_v.sendPackage);
        }, 2500);
     
        clearInterval(enqueueFlag);
        enqueueUser();
        $('#start').text("暂停");
        syn_v.pause = false;
    });

    $('.package').mouseenter(syn_v.showMessage);

    $('.package').mouseleave(function () {
        syn_v.pause = syn_v.pause_before;
        window.requestAnimationFrame(syn_v.sendPackage);  // 动画继续
        $('#info').hide();
        $('#info div').remove();  // 将信息移出页面
    });
}

syn_v.initCanvas = function () {
    //初始化画布
    var ctx = $('#level0')[0].getContext("2d"); //let 声明的变量只在 let 命令所在的代码块 {} 内有效，在 {} 之外不能访问。
    let server = new Image();
    server.src = './img/server.png';
    server.onload = function () {
        ctx.drawImage(server, 365, 175, 110, 110);
    };
    let hacker = new Image();
    hacker.src = './img/hacker.png';
    hacker.onload = function () {
        ctx.drawImage(hacker, 1, 185, 95, 95);

    };

    let computer = new Image();
    computer.src = './img/computer.png';
    computer.onload = function () {
        ctx.drawImage(computer, 475, 20, 70, 60);
        ctx.drawImage(computer, 475, 365, 70, 60);
        ctx.drawImage(computer, 610, 200, 70, 60);
    };
    $('<div id="user_ip" class="ip">IP:5.5.5.5</div>').appendTo('#level0_div');
    $('#user_ip').css({
        position: 'absolute',
        top: '290px',
        left: '20px'
    });
    $('<div id="user_ip1" class="ip">IP:1.1.1.1</div>').appendTo('#level0_div');
    $('#user_ip1').hide();
    $('#user_ip1').css({
        position: 'absolute',
        top: '85px',
        left: '145px',
    });
    $('<div id="user_ip2" class="ip">IP:2.2.2.2</div>').appendTo('#level0_div');
    $('#user_ip2').hide();
    $('#user_ip2').css({
        position: 'absolute',
        top: '260px',
        left: '145px',
    });
    $('<div id="user_ip3" class="ip">IP:3.3.3.3</div>').appendTo('#level0_div');
    $('#user_ip3').hide();
    $('#user_ip3').css({
        position: 'absolute',
        top: '420px',
        left: '145px',
    });
    $('<div id="server_ip" class="ip">IP:4.4.4.4</div>').appendTo('#level0_div');
    $('#server_ip').css({
        position: 'absolute',
        top: '290px',
        left: '425px'
    });

    //初始化数据包
    let syn2_1 = '<div id="syn2_1" class="package">SYN</div>';
    let ack2_1 = '<div id="ack2_1" class="package">ACK</div>';
    let syn2_2 = '<div id="syn2_2" class="package">SYN</div>';
    let ack2_2 = '<div id="ack2_2" class="package">ACK</div>';
    let syn2_3 = '<div id="syn2_3" class="package">SYN</div>';
    let ack2_3 = '<div id="ack2_3" class="package">ACK</div>';
    $(syn2_1).appendTo('#level0_div');
    $(ack2_1).appendTo('#level0_div');
    $(syn2_2).appendTo('#level0_div');
    $(ack2_2).appendTo('#level0_div');
    $(syn2_3).appendTo('#level0_div');
    $(ack2_3).appendTo('#level0_div');

    //初始化提示语
    let prompt = '<div class="prompt">虚拟IP</div>';
    $(prompt).appendTo('#level0_div');
    $('.prompt').hide();
    $('.prompt').css({
        position: 'absolute',
        left: '265px',
        top: '15px',
        'font-size': '36px',
    });

    // 初始化未连接队列
    $('#queue').css({
        position: 'absolute',
        width: '27px',
        height: '100px',
        top: '175px',
        left: '450px'
    });

    $('#queue div').css({
        'background-color': 'grey',
        'width': '25px',
        'height': '10px',
        'margin-top': '1px',
        'visibility': 'hidden'
    });
        // 初始化未连接队列(增加内存时才出现)
    $('#queue2').hide();
    $('#queue2').css({
            position: 'absolute',
            width: '27px',
            height: '107.5px',
            top: '176px',
            left: '476px',
            'border-style':'solid',
            'border-width':'1.5px',
            'background-color':'#0b799d',
    });

    $('#queue2 div').css({
        'background-color': 'grey',
        'width': '25px',
        'height': '9.7px',
        'margin-left':'1px',
        'margin-top': '1px',
        'visibility': 'hidden'
    });

    //初始化圈圈图
    let load2_1 = '<div><img id="load2_1" class="load2" src="./img/load.gif" width="55" height="40" /></div>';
    let load2_2 = '<div><img id="load2_2" class="load2" src="./img/load.gif" width="55" height="40" /></div>';
    let load2_3 = '<div><img id="load2_3" class="load2" src="./img/load.gif" width="55" height="40" /></div>';
    $(load2_1).appendTo('#level0_div');
    $(load2_2).appendTo('#level0_div');
    $(load2_3).appendTo('#level0_div');

    //初始化分身
    $('<div><img id="Vcomputer2_1" class="Vcomputer" src="./img/hacker.png"></div>').appendTo('#level0_div');
    $('<div><img  id="Vcomputer2_2" class="Vcomputer" src="./img/hacker.png"></div>').appendTo('#level0_div');
    $('<div><img  id="Vcomputer2_3" class="Vcomputer" src="./img/hacker.png"></div>').appendTo('#level0_div');

    // 初始化箭头
    syn_v.drawArrow1();
}

syn_v.drawArrow1 = function () {
    clearInterval(syn_v.arrows_handle1);
    clearInterval(syn_v.arrows_handle2);
    clearInterval(syn_v.arrows_handle3);
    let canvas = $('#level1')[0];
    let ctx = canvas.getContext('2d'); // 第一层画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var _index = 1;
    arrowTo(ctx, { x: 478, y: 40 }, { x: 390, y: 177 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
    arrowTo(ctx, { x: 405, y: 177 }, { x: 480, y: 60 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
    arrowTo(ctx, { x: 613, y: 223 }, { x: 475, y: 223 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
    arrowTo(ctx, { x: 475, y: 237 }, { x: 613, y: 237 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
    arrowTo(ctx, { x: 478, y: 415 }, { x: 390, y: 285 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
    arrowTo(ctx, { x: 405, y: 285 }, { x: 478, y: 395 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
    syn_v.arrows_handle1 = setInterval(function () {  //setInterval每隔0.3s，箭头高亮
        ctx.clearRect(0, 0, canvas.width, canvas.height);   //清除指定的矩形区域，然后这块区域会变的完全透明。
        arrowTo(ctx, { x: 478, y: 40 }, { x: 390, y: 177 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
        arrowTo(ctx, { x: 405, y: 177 }, { x: 480, y: 60 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
        arrowTo(ctx, { x: 613, y: 223 }, { x: 475, y: 223 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 475, y: 237 }, { x: 613, y: 237 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 478, y: 415 }, { x: 390, y: 285 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
        arrowTo(ctx, { x: 405, y: 285 }, { x: 478, y: 395 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        if (_index >= 50) {
            _index = 1
        }
        else {
            _index++;
        }
    }, 300);
}

syn_v.drawArrow2 = function () {
    clearInterval(syn_v.arrows_handle1);
    clearInterval(syn_v.arrows_handle2);
    clearInterval(syn_v.arrows_handle3);
    let canvas = $('#level1')[0];
    let ctx = canvas.getContext('2d'); // 第一层画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var _index = 1;
    arrowTo(ctx, { x: 478, y: 40 }, { x: 390, y: 177 }, { color: "#0099CC", activeIndex: _index });
    arrowTo(ctx, { x: 405, y: 177 }, { x: 480, y: 60 })
    arrowTo(ctx, { x: 613, y: 223 }, { x: 475, y: 223 }, { color: "#0099CC", activeIndex: _index });
    arrowTo(ctx, { x: 475, y: 237 }, { x: 613, y: 237 })
    arrowTo(ctx, { x: 478, y: 415 }, { x: 390, y: 285 }, { color: "#0099CC", activeIndex: _index });
    arrowTo(ctx, { x: 405, y: 285 }, { x: 478, y: 395 })
  
    syn_v.arrows_handle2 = setInterval(function () {  //setInterval每隔0.3s，箭头高亮
        ctx.clearRect(0, 0, canvas.width, canvas.height);   //ra清除指定的矩形区域，然后这块区域会变的完全透明。
        arrowTo(ctx, { x: 478, y: 40 }, { x: 390, y: 177 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index });
        arrowTo(ctx, { x: 405, y: 177 }, { x: 480, y: 60 })
        arrowTo(ctx, { x: 613, y: 223 }, { x: 475, y: 223 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index });
        arrowTo(ctx, { x: 475, y: 237 }, { x: 613, y: 237 })
        arrowTo(ctx, { x: 478, y: 415 }, { x: 390, y: 285 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index });
        arrowTo(ctx, { x: 405, y: 285 }, { x: 478, y: 395 })
        if (_index >= 50) {
            _index = 1;
        }
        else {
            _index++;
        }
    }, 300);
}

syn_v.drawArrow3 = function () {
    clearInterval(syn_v.arrows_handle1);
    clearInterval(syn_v.arrows_handle2);
    clearInterval(syn_v.arrows_handle3);
    let canvas = $('#level1')[0];
    let ctx = canvas.getContext('2d'); // 第一层画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var _index = 1;
    arrowTo(ctx, { x: 478, y: 40 }, { x: 390, y: 177 }, { color: "#0099CC", activeIndex: _index });
    arrowTo(ctx, { x: 405, y: 177 }, { x: 480, y: 60 },{ color: "#0099CC", activeIndex: _index });
    arrowTo(ctx, { x: 613, y: 223 }, { x: 475, y: 223 }, { color: "#0099CC", activeIndex: _index });
    arrowTo(ctx, { x: 475, y: 237 }, { x: 613, y: 237 },{ color: "#0099CC", activeIndex: _index });
    arrowTo(ctx, { x: 478, y: 415 }, { x: 390, y: 285 }, { color: "#0099CC", activeIndex: _index });
    arrowTo(ctx, { x: 405, y: 285 }, { x: 478, y: 395 });
  
    syn_v.arrows_handle3 = setInterval(function () {  //setInterval每隔0.3s，箭头高亮
        ctx.clearRect(0, 0, canvas.width, canvas.height);   //ra清除指定的矩形区域，然后这块区域会变的完全透明。
        arrowTo(ctx, { x: 478, y: 40 }, { x: 390, y: 177 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index });
        arrowTo(ctx, { x: 405, y: 177 }, { x: 480, y: 60 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index });
        arrowTo(ctx, { x: 613, y: 223 }, { x: 475, y: 223 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index });
        arrowTo(ctx, { x: 475, y: 237 }, { x: 613, y: 237 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index })
        arrowTo(ctx, { x: 478, y: 415 }, { x: 390, y: 285 }, { color: "#0099CC", activeColor: "#00ffff" ,activeIndex: _index });
        arrowTo(ctx, { x: 405, y: 285 }, { x: 478, y: 395 });
        if (_index >= 50) {
            _index = 1;
        }
        else {
            _index++;
        }
    }, 300);
}

//需要多次初始化的内容
syn_v.initAnimation = function () {
    //清除可能存在的动画
    $('.Vcomputer').hide();
    $('#user_ip1').hide();
    $('#user_ip2').hide();
    $('#user_ip3').hide();
    $('#select_title').hide();
    initBandwidth();
    window.cancelAnimationFrame(syn_v.anim_handle);
    mes.draw_n_rect(0,30,0, 0);
    mes.set_IP("500");
    mes.play(0,2,0, 2,0, 1,0,1,0,1);
    mes.run_pointer(0,1);
    $('#queue div').css({
        'visibility': 'hidden'
    });
    $('#queue2').hide();
    $('#queue2 div').css({
        'visibility': 'hidden'
    });
    // //数据包的位置
    $(".package").hide();
    $(".package").css({
        "font-size": "18px",
        'height': '24px',
        'width': '40px'
    })
    $("#syn2_1").css({
        left: '213px',
        top: '50px',
    });
    $("#syn2_2").css({
        left: '213px',
        top: '220px',
    });
    $("#syn2_3").css({
        left: '213px',
        top: '375px',
    });
    $("#ack2_1").css({
        left: '345px',
        top: '146px',
    });
    $("#ack2_2").css({
        left: '322px',
        top: '218px',
    });
    $("#ack2_3").css({
        left: '345px',
        top: '290px',
    });
    //圈圈图的位置
    $(".load2").hide();
    $('#load2_1').css({
        left: '484px',
        top: '27px',
    })
    $('#load2_2').css({
        left: '484px',
        top: '372px',
    })
    $('#load2_3').css({
        left: '618px',
        top: '207px',
    })
    //恢复开始按钮
    $('#start').text('开始');
    syn_v.show_synbean = true; // 未连接队列状态
    syn_v.pause = true; // 暂停开始状态
    syn_v.anim_handle = null; // 动画句柄
};

syn_v.sendPackage = function () { //初始时syn_left=213px
    var syn1_left = parseInt($('#syn2_1').css('left'));
    var syn2_left = parseInt($('#syn2_2').css('left'));
    var syn3_left = parseInt($('#syn2_3').css('left'));
    var ack1_top = parseInt($('#ack2_1').css('top'));
    var ack2_left = parseInt($('#ack2_2').css('left'));
    var ack3_top = parseInt($('#ack2_3').css('top'));
    let finish_syn = false;
    if (!syn_v.pause) {
        if (syn1_left >= 325) {
            $('#Vcomputer2_1').fadeOut('fast', function () { //虚拟Ip来源消失后，syn再消失，然后入队，然后ack出现
                $('#user_ip1').hide();
                $('#syn2_1').fadeOut(function () {
                    if (syn_v.show_synbean) {
                        enqueue_back(8);
                    }
                    if (ack1_top <= 0)  //ack1是最先到的
                    {
                        $('#ack2_1').hide();
                    }
                    else {
                        $('#ack2_1').show();
                        $('#ack2_1').css({
                            'left': '-=0.5px',
                            'top': '-=0.5px'
                        });
                    }
                });
            });
        }
        else {
            $('#syn2_1').show();
            $('#syn2_1').css({
                'left': '+=0.5px',
                'top': '+=0.5px'
            });
        }


        if (syn2_left >= 325) {
            $('#Vcomputer2_2').fadeOut('fast', function () {
                $('#user_ip2').hide();
                $('#syn2_2').fadeOut(function () {
                    if (syn_v.show_synbean) {
                        enqueue_back(9); //syn到达服务器，入队
                    }
                    if (ack2_left <= 0) {
                        $('#ack2_2').fadeOut();
                    }
                    else {
                        $('#ack2_2').show();
                        $('#ack2_2').css({
                            'left': '-=0.8px',
                        });
                    }

                });
            });

        }
        else {
            $('#syn2_2').show();
            $('#syn2_2').css({
                left: '+=0.8px',
            });
        }

        if (syn3_left >= 325) {
            $('#Vcomputer2_3').fadeOut('fast', function () {
                $('#user_ip3').hide();
                $('#syn2_3').fadeOut(function () {
                    if (syn_v.show_synbean) {
                        enqueue_back(7); //syn到达服务器，入队
                        finish_syn = true; //syn全都到了
                    }
                    if (ack3_top >= 426) {
                        $('#ack2_3').fadeOut();
                    }
                    else {
                        $('#ack2_3').show();
                        $('#ack2_3').css({
                            'left': '-=0.396px',
                            'top': '+=0.3px'
                        });
                    }
                });
            });

        }
        else {
            $('#syn2_3').show();
            $('#syn2_3').css({
                'left': '+=0.396px',
                'top': '-=0.3px'
            });
        }

        if (ack1_top <= 0 && ack2_left <= 0 && ack3_top >= 426) {
            for (var i = 6; i >= 0; i--) {
                enqueue_back(i);
            }
            $(".load2").show();
            $('#start').text('开始');
            clearInterval(enqueueFlag);
            enqueueUser();
            syn_v.drawArrow2();
           
            syn_v.pause = true;
            mes.draw_n_rect(30,100,0, 0);
            mes.set_IP('10M');
            mes.play(0,2, 0,2,0, 2,0, 2,0, 2);
            mes.run_pointer(1,2);
            syn_v.defendAnimation();
            window.cancelAnimationFrame(syn_v.anim_handle);

        }
        else {
            syn_v.anim_handle = window.requestAnimationFrame(syn_v.sendPackage);
            setTimeout(function(){
                $('#load2_2').delay(2500).show();
                $('#load2_3').delay(3000).show();
            },2500)
        }
    };
}

syn_v.IP = function () {
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
        left: "310px",
        top: "200px",
        display: "block"
    }).appendTo('#level0_div');

    $(messenger2).css({
        width: "40px",
        height: "18px",
        "font-size": "12px",
        left: "310px",
        top: "225px",
        display: "block"
    }).appendTo('#level0_div');

    $(messenger3).css({
        width: "40px",
        height: "18px",
        "font-size": "12px",
        left: "310px",
        top: "250px",
        display: "block"
    }).appendTo('#level0_div');

    // 发送探测包
    syn_v.IP.handle = null;
    syn_v.IP.hasShield = false; // 是否画好了盾牌
    syn_v.IP.end = false;

    let messenger_go = function () {
        let messenger2_left = parseInt($('#messenger2').css('left'));
        if (messenger2_left >= 0) {
            $('.messenger').css({ left: "-=1px" });
            $('#messenger1').css({ top: "-=1px" });
            $('#messenger3').css({ top: "+=1px" });
            if (parseInt($('#messenger1').css('top')) <= 0) {
                $('#messenger1').remove();
            }
            if (parseInt($('#messenger3').css('top')) >= 430) {
                $('#messenger3').remove();
            }
        } else {
            window.cancelAnimationFrame(syn_r.IP.handle);
            syn_v.IP.end = true;
            syn_v.IP.handle = null;
            $('#messenger2').remove();
            // 显示信息
            setTimeout(function () {
                let prompt3 = '<div id="prompt3">没有回复，加入黑名单</div>';
                $(prompt3).css({
                    position: 'absolute',
                    left: '125px',
                    top: '225px',
                    'font-size': '20px',
                }).appendTo('#level0_div');
            }, 1000);

            setTimeout(function () {
                // 移除信息
                $('#prompt3').remove();
                // 未连接队列移除三个
                for (var i = 2; i >= 0; i--) {
                    if ($('#queue div').eq(i).attr('class') == 'syn' && $('#queue div').eq(i).css('visibility') == 'visible') {
                        $('#queue div').eq(i).css({
                            'visibility': 'hidden'
                        }).attr({
                            'class': ''
                        });
                    }
                }
                $('#load2_1').hide();
                $('#load2_3').hide();
                syn_v.drawArrow3();
            }, 2000);

            setTimeout(function () {
                let prompt3 = '<div id="prompt3">继续攻击一段时间后...</div>';
                $(prompt3).css({
                    position: 'absolute',
                    left: '125px',
                    top: '225px',
                    'font-size': '20px',
                }).appendTo('#level0_div');
            }, 4000);

            setTimeout(function () {
                // 移除信息
                $('#prompt3').remove();
                // 未连接队列加满
                for (var i = 9; i >= 0; i--) {
                    $('#queue div').eq(i).css({
                        'visibility': 'visible',
                        'background-color': '#FFD700'
                    }).attr({
                        'class': 'syn'
                    });
                }
                $('#load2_1').show();
                $('#load2_3').show();
                syn_v.drawArrow2();
            }, 6000);
        }
        if (!syn_v.IP.end) {
            syn_v.IP.handle = window.requestAnimationFrame(messenger_go);
        }
    }
    window.requestAnimationFrame(messenger_go);
}
syn_v.defendAnimation=function()
{
    $('#select_title').show();
    $('#options').unbind("mouseleave");
    $('#options').mouseleave(function () {
        $('#queue2').hide();
        $("form input").each(function () {//循环绑定事件
            if (this.checked && syn_v.live) {
                if (this.id == 'option1') {
                    //增加带宽的动画
                    mes.run_pointer(2,1);                
                    mes.e = document.getElementById("right2");
                    ctx3 = mes.e.getContext("2d");
                    ctx3.clearRect(190,130,80,10);
                    ctx3.fillStyle = "rgb(11,121,157)";
                    ctx3.font = "18px serif";
                    ctx3.fillText("0", 50, 140);
                    ctx3.fillText("20GBps", 230, 140);
               }
                if (this.id == 'option2') {
                    //增加内存的动画
                    $('#queue2').show();
                    mes.draw_n_rect(100,50,0,0);
                    $('.load2').hide();
                    syn_v.drawArrow1();
                   
                    let prompt2 = '<div class="prompt2">持续攻击一段时间以后</div>';
                    $(prompt2).appendTo('#level0_div');
                    $('.prompt2').hide();
                    $('.prompt2').css({
                        position: 'absolute',
                        left: '220px',
                        top: '20px',
                        'font-size': '20px',
                    });
                    setTimeout(function(){
                        $('.prompt2').fadeIn(function(){
                            for (var i = 9; i >= 0; i--) {
                                enqueue_back2(i);
                            }
                            $('#load2_2').show();
                            $('#load2_3').show();
                            $('.load2').show(function(){
                                $('.prompt2').fadeOut(); 
                                syn_v.drawArrow2();
                                mes.draw_n_rect(50,100, 0,0);//内存从50%升到100%
                            }); 
                               
                        })
                    },3500)
                    
                }
                if (this.id == 'option3') {
                    //ip检测--加入黑名单的动画
                    syn_v.IP();
                }
                if (this.id == 'option4') {
                    //随机丢弃的动画
                    //将未连接队列随机丢弃一半
                    //随机丢弃的动画
                    //将未连接队列随机丢弃一半
                    for (var i = 4; i >= 0; i--) {
                        dequeue_back(i);
                    }
                   
                    clearInterval(enqueueFlag);
                    enqueueUser();//用户也随机入队
                    mes.draw_n_rect(100,50,0,0);
                    //然后短暂恢复2个用户的连接
                    syn_v.drawArrow3();
                    $('#load2_1').hide();
                    console.log(11111);
                    $('#load2_3').hide();
                    
                    setTimeout(function(){
                        //攻击一段时间后，然后再次填满
                        console.log(22222);
                        let prompt2 = '<div class="prompt2">持续攻击一段时间以后</div>';
                        console.log(33333);
                        console.log(prompt2);
                        $(prompt2).appendTo('#level0_div');
                        console.log(44444);
                        $('.prompt2').css({
                            position: 'absolute',
                            left: '220px',
                            top: '20px',
                            'font-size': '20px',
                        });
                        setTimeout(function(){
                            $('.prompt2').fadeOut(function(){
                                clearInterval(enqueueFlag);
                                for (var i = 4; i >= 0; i--) {
                                    enqueue_back(i);
                                }
                                
                                $('.load2').show();
                                syn_v.drawArrow2();
                                
                            });
                            mes.draw_n_rect(50,100,0,0);
                        },2000)
                    },4000)              
                }
            }
        });
        $("#options").slideUp();
    });
}
syn_v.showMessage = function () {
    //暂停动画
    syn_v.pause_before = syn_v.pause;
    syn_v.pause = true;
    window.cancelAnimationFrame(syn_v.anim_handle);
    //设置显示内容
    let client_ip1 = '1.1.1.1';
    let client_ip2 = '2.2.2.2';
    let client_ip3 = '3.3.3.3';
    let server_ip = '4.4.4.4';
    let package_id = $(this).attr('id');
    let message = null;
    if (package_id == 'syn2_1') {
        message = '<div style:"text-align:left;">发送IP: ' + client_ip1 + '<br />接收IP: ' + server_ip + '</div>';
    }
    else if (package_id == 'syn2_2') {
        message = '<div style:"text-align:left;">发送IP: ' + client_ip2 + '<br />接收IP: ' + server_ip + '</div>';
    }
    else if (package_id == 'syn2_3') {
        message = '<div style:"text-align:left;">发送IP: ' + client_ip3 + '<br />接收IP: ' + server_ip + '</div>';

    }
    else if (package_id == 'ack2_1') {
        message = '<div style:"text-align:left;">发送IP: ' + server_ip + '<br />接收IP: ' + client_ip1 + '</div>';
    }
    else if (package_id == 'ack2_2') {
        message = '<div style:"text-align:left;">发送IP: ' + server_ip + '<br />接收IP: ' + client_ip2 + '</div>';
    }
    else if (package_id == 'ack2_3') {
        message = '<div style:"text-align:left;">发送IP: ' + server_ip + '<br />接收IP: ' + client_ip3 + '</div>';
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
}

//攻击者分身出3个傀儡机
syn_v.startClone = function () {
    $(".prompt").show();
    $('.Vcomputer').css(
        {
            width: '60px',
            height: '60px',
            left: '150px',
            opacity: '0.75',
        }
    );
    $('#Vcomputer2_1').css({
        top: '25px',
    });
    $('#Vcomputer2_2').css({
        top: '200px',
    });
    $('#Vcomputer2_3').css({
        top: '360px',
    });
    

    $('.Vcomputer').fadeIn(2500, function () {
        $('#user_ip1').show();
        $('#user_ip2').show();
        $('#user_ip3').show();
        $(".prompt").hide();
    });

}
syn_v.clear = function () {
    $('#level0')[0].getContext("2d").clearRect(0, 0, 700, 450);
    $('#level1')[0].getContext("2d").clearRect(0, 0, 700, 450);
    clearInterval(enqueueFlag);
    clearInterval(syn_v.arrows_handle1);
    clearInterval(syn_v.arrows_handle2);
    clearInterval(syn_v.arrows_handle3);
    syn_v.arrows_handle1 = null;
    $('.package').unbind();
    $('#start').unbind();
    $('#restart').unbind();
    syn_v.initAnimation();
    $('.load2').remove();
    $('.Vcomputer').remove();
    $('.package').remove();
    $('.ip').remove();
    $('.prompt').remove();
    $('.prompt2').remove();
    
    syn_v.live = false;
}