// 2019/12/4/15:00
/**
 * 模拟名字空间 tcp
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
 *      -initEnv() 初始化/重置动画过程的参数
 *      -drawArrow() 绘制用户和服务器端建立连接后的箭头动画
 *      -showMessage() 显示数据包的详细信息
 */

var tcp = tcp || {};

tcp.show_synbean = true;
tcp.hide_synbean = true;
tcp.pause = true;
tcp.anim_handle = null;
tcp.arrow_handle = null;
tcp.pause_before;
tcp.live = false;

tcp.main = function () {
    tcp.live = true;
    tcp.initCanvas();
    // 服务器状态
    mes.draw_n_rect(0, 20, 0, 0);
    mes.set_IP("100");
    mes.play(0, 1, 0, 1, 0, 1, 0, 1, 0, 1);
    mes.run_pointer(0, 1);
    $("#start").click(function () {
        if (tcp.pause) {
            if ($('#start').text() == '开始') tcp.initEnv();
            $('#start').text("暂停");
            window.requestAnimationFrame(tcp.sendPackage);
        } else {
            $('#start').text("继续");
        }
        tcp.pause = tcp.pause ? false : true;
    });

    $('#restart').click(function () {
        tcp.initEnv();
        $('#start').text("暂停");
        tcp.pause = false;
        window.requestAnimationFrame(tcp.sendPackage); // 重新请求动画
    });

    $('.package').mouseenter(tcp.showMessage);

    $('.package').mouseleave(function () {
        tcp.pause = tcp.pause_before;
        window.requestAnimationFrame(tcp.sendPackage);  // 动画继续
        $('#info').hide();
        $('#info div').remove();  // 将信息移出页面
    });
};

tcp.sendPackage = function () {
    // 获取包的位置
    let syn_left = parseInt($('#syn').css('left'));
    let ack1_left = parseInt($('#ack1').css('left'));
    let ack2_left = parseInt($('#ack2').css('left'));
    let finish = false;
    if (!tcp.pause) {
        if (syn_left >= 500) $('#syn').hide();
        if (ack1_left <= 150) $('#ack1').hide();
        if (ack2_left >= 500) $('#ack2').fadeOut('normal');
        // 如果syn右移动没有执行完毕
        if (syn_left < 500) {
            $('#syn').show();
            tcp.removeTip()
            tcp.showTip("第一次握手：客户端发送连接请求SYN到服务器")
            $('#syn').css(
                {
                    'left': '+=2px'
                }
            );
        }
        else if (tcp.show_synbean) {
            tcp.show_synbean = !tcp.show_synbean;
            $('#queue div').eq(9).css({ 'visibility': 'visible' });
        }

        else if (ack1_left > 150) {
            $('#ack1').show();
            tcp.removeTip()
            tcp.showTip("第二次握手：服务器接收客户端发来的SYN,将连接信息放入半连接队列，并向客户端返回SYN+ACK")
            $('#ack1').css(
                {
                    'left': '-=2px'
                }
            );
        }

        else if (ack2_left < 500) {
            $('#ack2').show();
            tcp.removeTip()
            tcp.showTip("第三次握手：客户端向服务器发送ACK")
            $('#ack2').css(
                {
                    'left': '+=2px'
                }
            );
        }

        else if (tcp.hide_synbean) {
            tcp.removeTip()
            tcp.showTip("服务器收到客户端发来的ACK后，将该连接从半连接队列里面移除。至此TCP三次握手完成，连接成功建立！")
            tcp.hide_synbean = !tcp.hide_synbean;
            $('#queue div').eq(9).css({ 'visibility': 'hidden' });
            finish = true;
        }

        if (finish) {
            $('#start').text('开始');
            tcp.pause = true;
            tcp.drawArrow();
        } else {
            tcp.anim_handle = window.requestAnimationFrame(tcp.sendPackage);
        }
    }
};

// 需要多次初始化的内容
tcp.initEnv = function () {
    // 清除可能存在的动画
    clearInterval(tcp.arrow_handle);
    window.cancelAnimationFrame(tcp.anim_handle);
    $("#level0")[0].getContext("2d").clearRect(150, 0, 400, 450);

    $('#queue div').css({
        'visibility': 'hidden'
    });
    // 数据包的位置
    $(".package").hide();
    $('#syn').css({
        'left': '150px',
        'top': '207px',
    });
    $('#ack1').css({
        'left': '500px',
        'top': '207px',
    });
    $('#ack2').css({
        'left': '150px',
        'top': '207px',
    });
    // 恢复开始按钮按钮
    $('#start').text('开始');
    tcp.show_synbean = true;
    tcp.hide_synbean = true;
    tcp.pause = true;
    tcp.anim_handle = null;
    tcp.arrow_handle = null;
};

//提示出现
tcp.showTip = function (tip) {
    let tips = '<div id="tip">'+tip+'</div>';
    $(tips).css({
        position: 'absolute',
        left: '25px',
        top: '15px',
        'font-size': '20px',
    }).appendTo('#level0_div');
}

//提示擦除
tcp.removeTip = function (){
    $('#tip').remove()
}

// 只需要初始化一次的内容
tcp.initCanvas = function () {
    // 初始化画布
    let ctx = $("#level0")[0].getContext("2d");
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    let user = new Image();
    let server = new Image();
    user.src = "/img/computer.png";
    server.src = "/img/server.png";
    user.onload = function () {
        ctx.drawImage(user, 50, 175, 100, 100);
    };
    $('<div id="user_ip" class="ip">IP:1.1.1.1</div>').appendTo('#level0_div');
    $('#user_ip').css({
        position: 'absolute',
        top: '275px',
        left: '70px'
    });
    server.onload = function () {
        ctx.drawImage(server, 550, 175, 100, 100);
    };
    $('<div id="server_ip" class="ip">IP:2.2.2.2</div>').appendTo('#level0_div');
    $('#server_ip').css({
        position: 'absolute',
        top: '275px',
        left: '570px'
    });

    // 初始化数据包
    $(".package").hide();
    $('<div id="syn" class="package">SYN</div>').appendTo('#level0_div');
    $('<div id="ack1" class="package">ACK</div>').appendTo('#level0_div');
    $('<div id="ack2" class="package">ACK</div>').appendTo('#level0_div');
    // 初始化未连接队列
    $('#queue').css(
        {
            position: 'absolute',
            width: '25px',
            height: '100px',
            top: '175px',
            left: '626px'
        }
    );
    $('#queue div').css({
        'background-color': 'grey',
        'width': '25px',
        'height': '9px',
        'margin-top': '1px',
        'visibility': 'hidden'
    });
};

tcp.drawArrow = function () {
    let _index = 1;
    let ctx = $("#level0")[0].getContext("2d");
    tcp.arrow_handle = setInterval(function () {
        ctx.clearRect(150, 0, 400, 450);
        arrowTo(ctx, { x: 150, y: 210 }, { x: 550, y: 210 }, { color: "#376956", activeIndex: _index })
        arrowTo(ctx, { x: 550, y: 240 }, { x: 150, y: 240 }, { color: "#376956", activeIndex: _index })
        if (_index >= 50)
            _index = 1
        else
            _index++;
    }, 300);
};

tcp.showMessage = function () {
    // 暂停动画
    tcp.pause_before = tcp.pause;
    tcp.pause = true;
    window.cancelAnimationFrame(tcp.anim_handle);
    // 设置显示内容
    let client_ip = '1.1.1.1';
    let server_ip = '2.2.2.2';
    let package_id = $(this).attr('id');
    let message = null;
    if (package_id == 'syn' || package_id == 'ack2') {
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
};

// 清除页面状态
tcp.clear = function () {
    $("#level0")[0].getContext("2d").clearRect(0, 0, 700, 450);
    // 解除所有事件绑定
    $('.package').unbind().remove();
    $('.ip').remove();
    tcp.removeTip()
    $('#start').unbind();
    $('#restart').unbind();
    tcp.initEnv();
    tcp.live = false;
};