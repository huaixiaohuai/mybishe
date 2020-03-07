// 2019/12/5/13:04
/**
 * 模拟名字空间 syn_r
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
var syn_r = syn_r || {};
// 全局变量
syn_r.arrows_handle1 = null;    //初始化箭头动画句柄
syn_r.arrows_handle2 = null;    //部分箭头停滞动画句柄
syn_r.show_synbean = true;        // 未连接队列状态
syn_r.pause = true;                 // 暂停开始状态
syn_r.anim_handle = null;              // 发包动画流程句柄
syn_r.pause_before;                 // 保存鼠标移入之前的pause值
syn_r.count = 0;                 //判断动画是否执行完毕（count=3,结束;count<3,未结束）
syn_r.live = false;
/*
*     -mes.draw_n_rect(n1_1,n1_2,n2_1,n2_2) //调用内存占用、黑名单占比的函数，n1,n2为整数，传递先后百分比数值的大小（动态）
*     -mes.set_IP(text)                      //调用设置连接IP数的值，text为数值（静态）
*     -mes.play(n4_1,n4_2,n5_1,n5_2,n6_1,n6_2,n7_1,n7_2,n8_1,n8_2)//调用网段统计函数，n4_2,n5_2,n6_2,n7_2,n8_2分别为网段1，2，3，4，5的最后数值（动态）
*     -mes.run_pointer(p1,p2)                   //调用表盘的指针函数，p1（起）,p2（终）为所指位置，p值为{0，1...，7，8}（动态）
*/
syn_r.main = function () {
    syn_r.live = true;
    syn_r.initCanvas();
    initBandwidth();
    clearInterval(enqueueFlag);
    enqueueUser();
   

    $("#start").click(function () {
        if (syn_r.pause) {
            if ($('#start').text() == '开始') {
                syn_r.initAnimation();
                syn_r.drawArrow1();
            }
            $('#start').text("暂停");
            clearInterval(enqueueFlag);
            enqueueUser();
            window.requestAnimationFrame(syn_r.send_package);
        } else {
            $('#start').text("继续");
            clearInterval(enqueueFlag);
        }
        syn_r.pause = syn_r.pause ? false : true;
    });

    $('#restart').click(function () {
        syn_r.initAnimation();
        syn_r.drawArrow1();
        clearInterval(enqueueFlag);
        enqueueUser();
        $('#start').text("暂停");
        syn_r.pause = false;
        window.requestAnimationFrame(syn_r.send_package);//重新请求动画
    });

    $('.package').mouseenter(syn_r.showMessage);

    $('.package').mouseleave(function () {
        syn_r.pause = syn_r.pause_before;
        window.requestAnimationFrame(syn_r.send_package);  // 动画继续
        $('#info').hide();
        $('#info div').remove();  // 将信息移出页面
    });
};



// 只需要初始化一次的内容
syn_r.initCanvas = function () {
    //初始化画布
    var ctx = $('#level0')[0].getContext("2d"); //let 声明的变量只在 let 命令所在的代码块 {} 内有效，在 {} 之外不能访问。
    let server = new Image();
    server.src = './img/server.png';
    server.onload = function () {
        ctx.drawImage(server, 350, 175, 110, 110);
    };
    let hacker = new Image();
    hacker.src = './img/hacker.png';
    hacker.onload = function () {
        ctx.drawImage(hacker, 5, 175, 110, 110);
    };
    let computer = new Image();
    computer.src = './img/computer.png';
    computer.onload = function () {
        ctx.drawImage(computer, 475, 15, 80, 60);
        ctx.drawImage(computer, 475, 375, 80, 60);
        ctx.drawImage(computer, 610, 200, 80, 60);
    };
    $('<div id="user_ip" class="ip">IP:1.1.1.1</div>').appendTo('#level0_div');
    $('#user_ip').css({
        position: 'absolute',
        top: '290px',
        left: '33px'
    });
    $('<div id="server_ip" class="ip">IP:2.2.2.2</div>').appendTo('#level0_div');
    $('#server_ip').css({
        position: 'absolute',
        top: '290px',
        left: '425px'
    });

    //初始化数据包
    $(".package").hide();
    let syn = '<div id="syn1_1" class="package">SYN</div>';
    let ack = '<div id="ack1_1" class="package">ACK</div>';
    $(syn).appendTo('#level0_div');
    $(ack).appendTo('#level0_div');
    // 初始化未连接队列
    $('#queue').css(
        {
            position: 'absolute',
            width: '27px',
            height: '110px',
            top: '175px',
            left: '435px'
        }
    );

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
            width: '26px',
            height: '107.5px',
            top: '176px',
            left: '461px',
            'border-style':'solid',
            'border-width':'1.5px',
            'background-color':'#0b799d',
    });

    $('#queue2 div').css({
        'background-color': 'grey',
        'width': '24.5px',
        'height': '9.7px',
        'margin-top': '1px',
        'visibility': 'hidden'
    });
    //初始化圈圈图
    $('.load').hide();
    $('<div><img id="load1_1" class="load" src="./img/load.gif" width="65" height="40" /></div>').appendTo('#level0_div');
    $('<div><img id="load1_2" class="load" src="./img/load.gif" width="65" height="40" /></div>').appendTo('#level0_div');
    $('<div><img id="load1_3" class="load" src="./img/load.gif" width="65" height="40" /></div>').appendTo('#level0_div');
    // 初始化箭头
    syn_r.drawArrow1();
};

syn_r.drawArrow1 = function () {
    clearInterval(syn_r.arrows_handle1);
    clearInterval(syn_r.arrows_handle2);
    clearInterval(syn_r.arrows_handle3);
    let canvas = $('#level1')[0];
    let ctx = canvas.getContext('2d'); // 第一层画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var _index = 1;
    arrowTo(ctx, { x: 478, y: 65 }, { x: 390, y: 175 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
    arrowTo(ctx, { x: 405, y: 175 }, { x: 485, y: 75 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
    arrowTo(ctx, { x: 613, y: 220 }, { x: 458, y: 220 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
    arrowTo(ctx, { x: 458, y: 240 }, { x: 613, y: 240 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
    arrowTo(ctx, { x: 478, y: 415 }, { x: 390, y: 285 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
    arrowTo(ctx, { x: 405, y: 285 }, { x: 478, y: 395 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
    syn_r.arrows_handle1 = setInterval(function () {  //setInterval每隔0.3s，箭头高亮
        ctx.clearRect(0, 0, canvas.width, canvas.height);   //清除指定的矩形区域，然后这块区域会变的完全透明。        
        arrowTo(ctx, { x: 478, y: 65 }, { x: 390, y: 175 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 405, y: 175 }, { x: 485, y: 75 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 613, y: 220 }, { x: 458, y: 220 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 458, y: 240 }, { x: 613, y: 240 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 478, y: 415 }, { x: 390, y: 285 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 405, y: 285 }, { x: 478, y: 395 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        if (_index >= 50) {
            _index = 1
        }
        else {
            _index++;
        }
    }, 300);
}

syn_r.drawArrow2 = function () {
    clearInterval(syn_r.arrows_handle1);
    clearInterval(syn_r.arrows_handle2);
    clearInterval(syn_r.arrows_handle3);
    let canvas = $('#level1')[0];
    let ctx = canvas.getContext('2d'); // 第一层画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var _index = 1;
    arrowTo(ctx, { x: 478, y: 65 }, { x: 390, y: 175 }, { color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 405, y: 175 }, { x: 485, y: 75 })
    arrowTo(ctx, { x: 613, y: 220 }, { x: 458, y: 220 }, { color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 458, y: 240 }, { x: 613, y: 240 })
    arrowTo(ctx, { x: 478, y: 415 }, { x: 390, y: 285 }, { color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 405, y: 285 }, { x: 478, y: 395 })
    syn_r.arrows_handle2 = setInterval(function () {  //setInterval每隔0.3s，箭头高亮
        ctx.clearRect(0, 0, canvas.width, canvas.height);   //清除指定的矩形区域，然后这块区域会变的完全透明。
        arrowTo(ctx, { x: 478, y: 65 }, { x: 390, y: 175 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 405, y: 175 }, { x: 485, y: 75 })
        arrowTo(ctx, { x: 613, y: 220 }, { x: 458, y: 220 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 458, y: 240 }, { x: 613, y: 240 })
        arrowTo(ctx, { x: 478, y: 415 }, { x: 390, y: 285 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 405, y: 285 }, { x: 478, y: 395 })
        if (_index >= 50) {
            _index = 1
        }
        else {
            _index++;
        }
    }, 300);
}

syn_r.drawArrow3 = function () {
    clearInterval(syn_r.arrows_handle1);
    clearInterval(syn_r.arrows_handle2);
    clearInterval(syn_r.arrows_handle3);
    let canvas = $('#level1')[0];
    let ctx = canvas.getContext('2d'); // 第一层画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var _index = 1;
    arrowTo(ctx, { x: 478, y: 65 }, { x: 390, y: 175 }, { color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 405, y: 175 }, { x: 485, y: 75 })
    arrowTo(ctx, { x: 613, y: 220 }, { x: 458, y: 220 }, { color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 458, y: 240 }, { x: 613, y: 240 },{ color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 478, y: 415 }, { x: 390, y: 285 }, { color: "#0099CC", activeIndex: _index })
    arrowTo(ctx, { x: 405, y: 285 }, { x: 478, y: 395 },{ color: "#0099CC", activeIndex: _index })
    syn_r.arrows_handle3 = setInterval(function () {  //setInterval每隔0.3s，箭头高亮
        ctx.clearRect(0, 0, canvas.width, canvas.height);   //清除指定的矩形区域，然后这块区域会变的完全透明。
        arrowTo(ctx, { x: 478, y: 65 }, { x: 390, y: 175 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 405, y: 175 }, { x: 485, y: 75 })
        arrowTo(ctx, { x: 613, y: 220 }, { x: 458, y: 220 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 458, y: 240 }, { x: 613, y: 240 },{ color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 478, y: 415 }, { x: 390, y: 285 }, { color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        arrowTo(ctx, { x: 405, y: 285 }, { x: 478, y: 395 },{ color: "#0099CC", activeColor: "#00ffff", activeIndex: _index })
        if (_index >= 50) {
            _index = 1
        }
        else {
            _index++;
        }
    }, 300);
}

//盾牌出现
syn_r.drawShield = function () {
    var ctx = $('#level0')[0].getContext("2d");
    var shield = new Image();
    shield.src = './img/shield.png';
    shield.onload = function () {
        ctx.drawImage(shield, 120, 190, 35, 80);
    };
}

//盾牌隐藏
syn_r.hideShield = function () {
    var ctx = $('#level0')[0].getContext("2d");
    ctx.clearRect(120, 190, 35, 80);
}

//需要多次初始化的内容
syn_r.initAnimation = function () {
    // 初始化箭头
    syn_r.hideShield();
    window.cancelAnimationFrame(syn_r.anim_handle);
    initBandwidth();//恢复带宽表盘
    $('#select_title').hide();

    mes.draw_n_rect(0,30, 0,0);
    mes.set_IP('500');
    mes.play(0,2,0, 2,0, 1,0, 1,0, 1);
    mes.run_pointer(0,1);
    $('#queue div').css({
        'visibility': 'hidden'
    });
    $('#queue2').hide();
    $('#queue2 div').css({
        'visibility': 'hidden'
    });
    //数据包的位置
    $(".package").hide();
    $(".package").css({
        "font-size": "18px",
        'height': '24px',
        'width': '40px'
    })
    $("#syn1_1").css({
        left: '115px',
        top: '220px',
    });
    $("#ack1_1").css({
        left: '310px',
        top: '220px',
    });
    //圈圈图的位置
    $(".load").hide();
    $('#load1_1').css({
        left: '484px',
        top: '22px',
    })
    $('#load1_2').css({
        left: '484px',
        top: '382px',
    })
    $('#load1_3').css({
        left: '619px',
        top: '207px',
    })
    //恢复开始按钮
    $('#start').text('开始');
    syn_r.show_synbean = true; // 未连接队列状态
    syn_r.pause = true; // 暂停开始状态
    syn_r.anim_handle = null; // 动画句柄
    syn_r.count = 0;// 判断动画是否执行完毕
};

syn_r.send_package = function () {
    var syn_left = parseInt($('#syn1_1').css('left')); //初始时syn_left=115px
    var ack_left = parseInt($('#ack1_1').css('left')); //初始时ack_left=310px
    var ack_top = parseInt($('#ack1_1').css('top'));
    if (!syn_r.pause) {
        if (syn_left >= 310) {
            $('#syn1_1').hide();
            if (syn_r.show_synbean) {
                enqueue_back(9 - syn_r.count); //syn到达服务器，入队
                // enqueue();
                if (syn_r.count >= 3)
                    syn_r.show_synbean = false;
            }
        }
        if (ack_left <= 137) $('#ack1_1').hide();
        // 如果syn右移动没有执行完毕
        if (syn_left < 310) {
            $('#syn1_1').show();
            $('#syn1_1').css({
                'left': '+=2px'
            });
        } else if (ack_left > 137) { //服务器发送ACK, 黑客出现盾牌
            $('#ack1_1').show();
            syn_r.drawShield();
            $('#ack1_1').css({
                'left': '-=2px'
            });
        } else if (ack_top < 426) //ACK被盾牌挡住，下落，最终ACK与盾牌一起消失
        {
            $('#ack1_1').show();
            $('#ack1_1').css({
                'top': '+=2px'
            })
        } else {
            syn_r.hideShield();
            $('#ack1_1').hide(function () {
                $("#syn1_1").css({
                    left: '115px',
                    top: '220px',
                });
                $("#ack1_1").css({
                    left: '310px',
                    top: '220px',

                }); //结束一次后复位
            });
            syn_r.count++;
        }

        if (syn_r.count < 3) {
            syn_r.anim_handle = window.requestAnimationFrame(syn_r.send_package);
            if(syn_r.count>0)
            {
                    $('#load1_1').delay(500).show();
                    $('#load1_2').delay(1000).show();
            }  
        } else {
            $('#start').text("开始");
            clearInterval(enqueueFlag);
            syn_r.drawArrow2();
            syn_r.pause = true;
            for (var i = 9 - syn_r.count; i >= 0; i--) {
                enqueue_back(i);
                // enqueue();
            }
            $(".load").show();
            mes.draw_n_rect(30,100, 0,0);
            mes.set_IP('500');
            mes.play(0,6,0, 1,0, 1,0, 1,0, 1);
            mes.run_pointer(1,2);
            syn_r.defendAnimation();
            window.cancelAnimationFrame(syn_r.anim_handle);
        }
    }
   
};
syn_r.IP = function () {
    //ip检测--加入黑名单的动画
    // 服务器向来源IP发包检测其是否回复
    // 不回复则直接加入黑名单
    // 创建一个探测包
    let messenger = '<div id="messenger" class="package">探测包</div>';
    $(messenger).css({
        width: "40px",
        height: "18px",
        "font-size": "12px",
        left: "310px",
        top: "225px",
        display: "block"
    }).appendTo('#level0_div');

    // 发送探测包
    syn_r.IP.handle = null;
    syn_r.IP.hasShield = false; // 是否画好了盾牌
    syn_r.IP.end = false;
    let messenger_go = function () {
        let messenger_left = parseInt($('#messenger').css('left'));
        let messenger_top = parseInt($('#messenger').css('top'));
        if (messenger_left > 137) {
            $('#messenger').css({ left: "-=1px" });
        } else if (messenger_top < 426) {
            if (!syn_r.IP.hasShield) {
                syn_r.drawShield();
                syn_r.IP.hasShield = true;
            }
            $('#messenger').css({ 'top': '+=2px' })
        } else {
            window.cancelAnimationFrame(syn_r.IP.handle);
            syn_r.IP.end = true;
            syn_r.IP.handle = null;
            // 隐藏探测包、隐藏盾牌
            $('#messenger').remove();
            syn_r.hideShield();
            // 显示信息
            let prompt3 = '<div id="prompt3">没有回复，加入黑名单</div>';
            $(prompt3).css({
                position: 'absolute',
                left: '125px',
                top: '225px',
                'font-size': '20px',
            }).appendTo('#level0_div');
            setTimeout(function () {
                // 移除信息
                $('#prompt3').remove();
                // 清除未连接队列中的相应信息
                for (var i = 9; i >= 0; i--) {
                    if ($('#queue div').eq(i).attr('class') == 'syn' && $('#queue div').eq(i).css('visibility') == 'visible') {
                        $('#queue div').eq(i).css({
                            'visibility': 'hidden'
                        }).attr({
                            'class': ''
                        });
                    }
                }
                // 用户回复连接
                $(".load").hide();
                mes.draw_n_rect(100,30, 0,0);
                clearInterval(enqueueFlag);
                enqueueUser();
                syn_r.drawArrow1();
            }, 2000);
        }
        if (!syn_r.IP.end) {
            syn_r.IP.handle = window.requestAnimationFrame(messenger_go);
        }
    }
    window.requestAnimationFrame(messenger_go);
}

syn_r.defendAnimation=function()
{
    $('#select_title').show();
    $('#options').unbind("mouseleave");
    $('#options').mouseleave(function () {
        //选择每次防御前都会恢复到之前的状态
        $('#queue2').hide();
        $("form input").each(function () {//循环绑定事件
            if (this.checked && syn_r.live) {
                console.log('this.checked && syn_r.live')
                if (this.id == 'option1') {
                    console.log('option1');
                    //增加带宽的动画-对syn攻击无效
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
                    //增加内存的动画-对syn攻击短暂有效
                    $('#queue2').show();
                    mes.draw_n_rect(100,50,0,0);
                    $('.load').hide();
                    syn_r.drawArrow1();

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
                            $('#load1_1').show();
                            $('#load1_2').show();
                            $('.load').show(function(){
                                $('.prompt2').fadeOut(); 
                                syn_r.drawArrow2();
                                
                            }); 
                            mes.draw_n_rect(50,100, 0,0);//内存从50%升到100%   
                        })
                    },3500)
                    
                }
                if (this.id == 'option3') {
                    //ip检测--加入黑名单的动画
                    syn_r.IP();
                }
                if (this.id == 'option4') {
                    //随机丢弃的动画
                    //将未连接队列随机丢弃一半
                    for (var i = 4; i >= 0; i--) {
                        dequeue_back(i);
                    }
                   
                    clearInterval(enqueueFlag);
                    enqueueUser();//用户也随机入队
                    mes.draw_n_rect(100,50,0,0);
                    //然后短暂恢复2个用户的连接
                    syn_r.drawArrow3();
                    $('#load1_2').hide();
                    $('#load1_3').hide(function(){
                        setTimeout(function(){
                            //攻击一段时间后，然后再次填满
                            let prompt2 = '<div class="prompt2">持续攻击一段时间以后</div>';
                            $(prompt2).appendTo('#level0_div');
                            $('.prompt2').css({
                                position: 'absolute',
                                left: '220px',
                                top: '20px',
                                'font-size': '20px',
                            });
                            setTimeout(function(){
                                $('.prompt2').hide(function(){
                                    clearInterval(enqueueFlag);
                                    for (var i = 4; i >= 0; i--) {
                                        enqueue_back(i);
                                    }
                                    $('.load').show();
                                    syn_r.drawArrow2();                   
                                })
                                mes.draw_n_rect(50,100,0,0);
                            },1000)
                        },3000)
                    });

                }
            }
        });
        $("#options").slideUp();
    });
}
syn_r.showMessage = function () {
    //暂停动画
    syn_r.pause_before = syn_r.pause;
    syn_r.pause = true;
    window.cancelAnimationFrame(syn_r.anim_handle);
    //设置显示内容
    let client_ip = '1.1.1.1';
    let server_ip = '2.2.2.2';
    let package_id = $(this).attr('id');
    let message = null;
    if (package_id == 'syn1_1') {
        message = '<div style:"text-align:left;">发送IP: ' + client_ip + '<br />接收IP: ' + server_ip + '</div>';
    } else {
        message = '<div style:"text-align:left;">发送IP: ' + server_ip + '<br />接收IP: ' + client_ip + '</div>';
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

// 清除页面状态
syn_r.clear = function () {
    $("#level0")[0].getContext("2d").clearRect(0, 0, 700, 450);
    $("#level1")[0].getContext("2d").clearRect(0, 0, 700, 450);
    // 解除所有事件绑定
    clearInterval(syn_r.arrows_handle1);
    clearInterval(syn_r.arrows_handle2);
    clearInterval(syn_r.arrows_handle3);
    clearInterval(enqueueFlag);
    syn_r.arrows_handle1 = null;
   
    $('.package').unbind();
    $('#start').unbind();
    $('#restart').unbind();
    syn_r.initAnimation();
    $('.prompt2').remove();
    $('.package').remove();
    $('.ip').remove();
    $('.load').remove();
    syn_r.live = false;
};

