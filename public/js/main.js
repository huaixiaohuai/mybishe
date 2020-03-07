$(function () {
    mes.main();
    $('#select_title').hide();
    ddos_v.main();
    // 每个动画开始之前都应该对其他动画进行一次完全清除
    $('#tcp_ip').click(function () {

        if (syn_r.live) syn_r.clear();
        if (syn_v.live) syn_v.clear();
        if (tcp.live) tcp.clear(); // 重复点击tcp_ip
        if (smurf_1.live) smurf_1.clear();
        if (ddos_r.live) ddos_r.clear(); // 重复点击ddos_r
        if (ddos_v.live) ddos_v.clear();
        tcp.main();
    });

    $('#syn_real_ip').click(function () {

        if (tcp.live) tcp.clear();
        if (syn_v.live) syn_v.clear();
        if (syn_r.live) syn_r.clear(); //重复点击syn_real_ip
        if (smurf_1.live) smurf_1.clear();
        if (ddos_r.live) ddos_r.clear(); // 重复点击ddos_r
        if (ddos_v.live) ddos_v.clear();
        syn_r.main();
    });

    $('#syn_virtual_ip').click(function () {
        if (tcp.live) tcp.clear();
        if (syn_r.live) syn_r.clear();
        if (syn_v.live) syn_v.clear(); //重复点击syn_virtual_ip
        if (smurf_1.live) smurf_1.clear();
        if (ddos_r.live) ddos_r.clear(); // 重复点击ddos_r
        if (ddos_v.live) ddos_v.clear();
        syn_v.main();
    });

    $('#smurf_1').click(function () {
        if (tcp.live) tcp.clear();
        if (syn_v.live) syn_v.clear();
        if (syn_r.live) syn_r.clear();
        if (smurf_1.live) smurf_1.clear(); // 重复点击smurf_1
        if (ddos_r.live) ddos_r.clear(); // 重复点击ddos_r
        if (ddos_v.live) ddos_v.clear();
        smurf_1.main();
    });

    $('#ddos_real_ip').click(function () {
        if (tcp.live) tcp.clear();
        if (syn_v.live) syn_v.clear();
        if (syn_r.live) syn_r.clear();
        if (smurf_1.live) smurf_1.clear();
        if (ddos_r.live) ddos_r.clear(); // 重复点击ddos_r
        if (ddos_v.live) ddos_v.clear();
        ddos_r.main();
    });
    $('#ddos_virtual_ip').click(function () {
        if (tcp.live) tcp.clear();
        if (syn_v.live) syn_v.clear();
        if (syn_r.live) syn_r.clear();
        if (smurf_1.live) smurf_1.clear();
        if (ddos_r.live) ddos_r.clear(); // 重复点击ddos_r
        if (ddos_v.live) ddos_v.clear();
        ddos_v.main();
    });
});

function initBandwidth() {
    mes.e = document.getElementById("right2");
    ctx3 = mes.e.getContext("2d");
    ctx3.clearRect(0, 0, mes.e.width, mes.e.height);
    ctx3.fillStyle = "rgb(11,121,157)";
    ctx3.font = "18px serif";
    ctx3.fillText("0", 50, 140);
    ctx3.fillText("10GBps", 230, 140);
}

function enqueue_back(x) {
    $('#queue div').eq(x).css({
        'visibility': 'visible',
        'background-color': '#FFD700'
    }).attr({
        'class': 'syn'
    });
};
function enqueue_back2(x) {
    $('#queue2 div').eq(x).css({
        'visibility': 'visible',
        'background-color': '#FFD700'
    }).attr({
        'class': 'syn'
    });
};

function dequeue_back(x) {
    $('#queue div').eq(x).css({
        'visibility': 'hidden'
    }).attr({
        'class': ''
    });
}

function enqueue() {
    for (var i = 9; i >= 0; i--) {
        if ($('#queue div').eq(i).css('visibility') == 'hidden') {
            $('#queue div').eq(i).css({
                'visibility': 'visible',
                'background-color': '#FFD700'
            }).attr({
                'class': 'syn'
            });
            break;
        }
    }
};

function dequeue() {
    for (var i = 9; i >= 0; i--) {
        if ($('#queue div').eq(i).attr('class') == 'syn' && $('#queue div').eq(i).css('visibility') == 'visible') {
            $('#queue div').eq(i).css({
                'visibility': 'hidden'
            }).attr({
                'class': ''
            });
            break;
        }
    }
}

var enqueueFlag = null;

function enqueueUser() {
    enqueueFlag = setInterval(function () {
        let rand = Math.random();
        if (rand < 0.3) {
            for (var i = 9; i >= 0; i--) {
                // #15E7E7
                if ($('#queue div').eq(i).css('visibility') == 'hidden') {
                    $('#queue div').eq(i).css({
                        'visibility': 'visible',
                        'background-color': '#15E7E7'
                    }).attr({
                        'class': 'user'
                    });
                    break;
                }
            }
        } else {
            for (var i = 0; i < 10; i++) {
                if ($('#queue div').eq(i).attr('class') == 'user' && $('#queue div').eq(i).css('visibility') == 'visible') {
                    $('#queue div').eq(i).css({
                        'visibility': 'hidden'
                    }).attr({
                        'class': ''
                    });
                    break;
                }
            }
        }
    }, 500);
};