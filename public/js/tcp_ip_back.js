/**
* tcp/ip动画
* 2019/11/30
*/

// 全局变量
var show_synbean = true;  // 未连接队列状态
var hide_synbean = true;
var pause = true;         // 暂停开始状态
var handle = null;        // 动画句柄
var finish = false;       // 判断动画是否执行完毕
var arrow_handle = null;
var pause_flag;  // 保存鼠标移入之前的pause值

/**
* 初始化画布
**/
function initCanvas() {
    var ctx = $("#level0")[0].getContext("2d");
    let user = new Image();
    user.src = "/img/computer.png";
    user.onload = function () {
        ctx.drawImage(user, 50, 175, 100, 100);
    };
    let server = new Image();
    server.src = "/img/server.png";
    server.onload = function () {
        ctx.drawImage(server, 550, 175, 100, 100);
    };
};

function initAnimation() {
    clearInterval(arrow_handle);
    window.cancelAnimationFrame(handle);
    $("#level0")[0].getContext("2d").clearRect(150, 0, 400, 450);
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
    $(".package").hide();
    $("#syn").css(
        {
            left: '150px',
            top: '207px',
        }
    );
    $("#ack1").css(
        {
            left: '500px',
            top: '207px',
        }
    );
    $("#ack2").css(
        {
            left: '150px',
            top: '207px',
        }
    );

    $('#start').text('开始');
    show_synbean = true;     // 未连接队列状态
    hide_synbean = true;
    pause = true;            // 暂停开始状态
    handle = null;           // 动画句柄
    finish = false;          // 判断动画是否执行完毕
    arrow_handle = null;
};

function enqueue(x) {
    $('#queue div').eq(x).css({ 'visibility': 'visible' });
};
function dequeue(x) {
    $('#queue div').eq(x).css({ 'visibility': 'hidden' });
}

function user_server() {
    var _index = 1;
    var ctx = $("#level0")[0].getContext("2d");
    arrow_handle = setInterval(function () {
        ctx.clearRect(150, 0, 400, 450);
        arrowTo(ctx, { x: 150, y: 210 }, { x: 550, y: 210 }, { color: "#376956", activeIndex: _index })
        arrowTo(ctx, { x: 550, y: 240 }, { x: 150, y: 240 }, { color: "#376956", activeIndex: _index })
        if (_index >= 50) {
            _index = 1
        }
        else {
            _index++;
        }
    }, 300);
};

function send_package() {
    var syn_left = parseInt($('#syn').css('left'));
    var ack1_left = parseInt($('#ack1').css('left'));
    var ack2_left = parseInt($('#ack2').css('left'));
    if (!pause) {
        if (syn_left >= 500) $('#syn').hide();
        if (ack1_left <= 150) $('#ack1').hide();
        if (ack2_left >= 500) $('#ack2').hide();
        // 如果syn右移动没有执行完毕
        if (syn_left < 500) {
            $('#syn').show();
            $('#syn').css(
                {
                    'left': '+=2px'
                }
            );
        }

        else if (show_synbean) {
            show_synbean = !show_synbean;
            enqueue(9);
        }

        else if (ack1_left > 150) {
            $('#ack1').show();
            $('#ack1').css(
                {
                    'left': '-=2px'
                }
            );
        }

        else if (ack2_left < 500) {
            $('#ack2').show();
            $('#ack2').css(
                {
                    'left': '+=2px'
                }
            );
        }

        else if (hide_synbean) {
            hide_synbean = !hide_synbean;
            finish = true;
            dequeue(9);
        }

        if (!finish) {
            handle = window.requestAnimationFrame(send_package);
        } else {
            $('#start').text("开始");
            pause = true;
            window.cancelAnimationFrame(handle);
            user_server();
        }
    }
};

function tcp_ip_top() {

    let syn = '<div id="syn" class="package">SYN</div>';
    let ack1 = '<div id="ack1" class="package">ACK</div>';
    let ack2 = '<div id="ack2" class="package">ACK</div>';
    $(syn).appendTo('#level0_div');
    $(ack1).appendTo('#level0_div');
    $(ack2).appendTo('#level0_div');
    initCanvas();
    $("#start").click(function () {
        if (pause) {
            if ($('#start').text() == '开始') initAnimation();
            $('#start').text("暂停");
            window.requestAnimationFrame(send_package);
        } else {
            $('#start').text("继续");
        }
        pause = pause ? false : true;
    });

    $('#restart').click(function () {
        initAnimation();
        $('#start').text("暂停");
        pause = false;
        setTimeout(function () {
            window.requestAnimationFrame(send_package);
        }, 200);
    });

    $('.package').mouseenter(function () {
        // 暂停动画
        pause_flag = pause;
        pause = true;
        window.cancelAnimationFrame(handle);

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
        $('#info').fadeIn('slow');
    });

    $('.package').mouseleave(function () {
        pause = pause_flag;
        window.requestAnimationFrame(send_package);
        $('#info').hide();
        $('#info div').remove();
    });
};

// 清除页面状态
function tcp_ip_clear() {
    $("#level0")[0].getContext("2d").clearRect(0, 0, 700, 450);
    // 解除所有事件绑定
    $('.package').unbind();
    $('.btn').unbind();
    initAnimation();
    $('#syn').remove();
    $('#ack1').remove();
    $('#ack2').remove();
};