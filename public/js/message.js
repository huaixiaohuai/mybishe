/*
*     -mes.draw_n_rect(n1_1,n1_2,n2_1,n2_2) //调用内存占用、黑名单占比的函数，n1,n2为整数，传递先后百分比数值的大小（动态）
*     -mes.set_IP(text)                      //调用设置连接IP数的值，text为数值（静态）
*     -mes.play(n4_1,n4_2,n5_1,n5_2,n6_1,n6_2,n7_1,n7_2,n8_1,n8_2)//调用网段统计函数，n4_2,n5_2,n6_2,n7_2,n8_2分别为网段1，2，3，4，5的最后数值（动态）
*     -mes.run_pointer(p1,p2)                   //调用表盘的指针函数，p1（起）,p2（终）为所指位置，p值为{0，1...，7，8}（动态）
*/

var mes = mes || {};

mes.main = function () {
    ctx2 = document.getElementById("right").getContext("2d");
    ctx3 = document.getElementById("right2").getContext("2d");
    ctx4 = document.getElementById("right3").getContext("2d");

    ctx3.fillStyle = "rgb(11,121,157)";
    ctx3.font = "18px serif";
    ctx3.fillText("0", 50, 140);
    ctx3.fillText("10GBps", 230, 140);

    ctx4.font = ' 18px Arial';
    ctx4.strokeStyle = "#0b799d";
    ctx4.fillStyle = "rgb(11,121,157)";
    ctx4.fillText("带宽占用量", 130, 150);
    ctx4.strokeRect(4, 162, 154, 30);
    ctx4.fillText("内存占用:", 160, 187);
    //ctx4.strokeRect(4, 205, 154, 30);
    
    let ip_icon = new Image();
    ip_icon.src = '/img/laptop.png';
    ip_icon.onload = function () {
        ctx4.drawImage(ip_icon, 4, 205, 31, 27);
        ctx4.drawImage(ip_icon, 35, 205, 31, 27);
        ctx4.drawImage(ip_icon, 65, 205, 31, 27);
        ctx4.drawImage(ip_icon, 95, 205, 31, 27);
        ctx4.drawImage(ip_icon, 125, 205, 31, 27);
        //ctx4.drawImage(ip_icon, 150, 205, 25, 28);
    };

    
   
    ctx4.fillText("连接IP数:", 160, 227);
   
    ctx4.fillText("高访问网段图表", 7, 284);


    var statistical = new Image();
    statistical.src = "./img/statistical.png";
    statistical.onload = function () {
        ctx2.drawImage(statistical, 0, 290, 300, 180);
    };
    
    ctx4.font = "bold 18px serif";
    ctx4.fillStyle = "black";
    ctx4.fillText("网段1", mes.block[3].rect4.x, mes.block[3].rect4.y + 35);
    ctx4.fillText("网段2", mes.block[3].rect4.x + 60, mes.block[3].rect4.y + 35);
    ctx4.fillText("网段3", mes.block[3].rect4.x + 120, mes.block[3].rect4.y + 35);
    ctx4.fillText("网段4", mes.block[3].rect4.x + 180, mes.block[3].rect4.y + 35);
    ctx4.fillText("网段5", mes.block[3].rect4.x + 240, mes.block[3].rect4.y + 35);
    //画表盘
    /*mes.d = document.getElementById("right");
    ctx2 = mes.d.getContext("2d");*/
    ctx2.strokeStyle = "rgb(11,121,157)";
    ctx2.beginPath();
    for (var i = 5; i > -35; i--) {
        ctx2.moveTo(150, 115);
        ctx2.arc(150, 90, 80, 6 * i * Math.PI / 180, 6 * (i - 1) * Math.PI / 180, true);
    }
    ctx2.closePath();
    ctx2.stroke();
    ctx2.beginPath();
    ctx2.fillStyle = "#fff";
    ctx2.strokeStyle = "#fff";
    ctx2.arc(150, 90, 80 * 19 / 20, 0, 360 * Math.PI / 180, false);
    ctx2.fill();
    ctx2.stroke();
    ctx2.strokeStyle = "rgb(11,121,157)";
    ctx2.beginPath();
    ctx2.lineWidth = 3;//线条的粗细，默认是1,3就加粗了
    for (var i = 1; i > -7; i--) {
        //ctx2 = mes.d.getContext("2d");
        ctx2.moveTo(150, 90);
        ctx2.arc(150, 90, 80, 30 * i * Math.PI / 180, 30 * (i - 1) * Math.PI / 180, true);
    };
    ctx2.closePath();
    ctx2.stroke();
    //画实心圆
    ctx2.beginPath();
    ctx2.fillStyle = "#fff";
    ctx2.arc(150, 90, 80 * 18 / 20, 0, 360 * Math.PI / 180, false);
    ctx2.fill();
}
/**网段图上的格子 */
mes.block = [
    {
        rect1: {                //第一个条形框里的第一个条形
            x: 7,
            y: 164,
            w: 10,
            h: 25,
            color: "#0000ff"
        }
    },
    {
        rect2: {                 //第二个条形框里的第一个条形
            x: 7,
            y: 207,
            w: 10,
            h: 25,
            color: "#0000ff"
        }
    },
    {
        rect3: {                 //第三个条形框里的第一个条形
            x: 7,
            y: 260,
            w: 10,
            h: 25,
            color: "#0000ff"
        }
    },
    {
        rect4: {             //右侧canvas里的每个条形的大小
            x: 7,
            y: 425,
            w: 45,
            h: 13
        }
    }
];
mes.drawRect = function (x, y, w, h) { //绘制右侧canvas里水平条形的单个条形块
    mes.e2 = document.getElementById("right3");
    ctx4 = mes.e2.getContext("2d");
    ctx4.fillStyle = "#0b799d";
    ctx4.fillRect(x, y, w, h);
    ctx4.lineWidth = 2;
    ctx4.strokeStyle = "white";
    ctx4.strokeRect(x, y, w, h);
}
mes.draw_n_rect_1 = function (n, text) {//绘制第一个水平条形的内容，需要画n个条形，修改为某个数值（text）
    mes.e2 = document.getElementById("right3");
    ctx4 = mes.e2.getContext("2d");
    ctx4.fillStyle="#ffffff";
    ctx4.fillRect(5,163,150,28);
    var draw_count1 = 0
    for (; draw_count1 < n; draw_count1++) {
        mes.drawRect(mes.block[0].rect1.x + 10 * draw_count1, mes.block[0].rect1.y, mes.block[0].rect1.w, mes.block[0].rect1.h);
    }
    ctx4.font = 'bold 18px Arial';
    ctx4.fillText(text, 240, 187);
}

mes.draw_n_rect = function (n1_1,n1_2,n2_1,n2_2) {
    mes.e2 = document.getElementById("right3");
    ctx4 = mes.e2.getContext("2d");
    //var text1 = n1 + "%";
    //var text2 = n2 + "%";
    var i1 = n1_1;
    var i2 = n2_1;
    mes.draw_n_rect_1(0," ");
    //mes.draw_n_rect_2(0," ");
    if(n1_2>=n1_1)
    {
        if(n1_2>0)
        {
        var timer1 = setInterval(function () {
            ctx4.fillStyle = "#ffffff";
            ctx4.fillRect(240, 167, 60, 30);
            var text1_temp = i1 + "%";
            if(i1>0)
            {
                mes.draw_n_rect_1(3 * i1 / 20, text1_temp);
            }
            else if(i1<=0)
            {
                mes.draw_n_rect_1(0,"0 %");
            }
            if (i1 >= n1_2) {
                clearInterval(timer1);
            }
            i1++;
        }, 50)
        }
        else if(n1_2<=0)
        {
        var text1_temp = "0 %";
        mes.draw_n_rect_1(0,text1_temp);
        }
    }
    else if(n1_2<n1_1)
    {
        if(n1_2>=0)
        {
        var timer1 = setInterval(function () {
            ctx4.fillStyle = "#ffffff";
            ctx4.fillRect(240, 167, 60, 30);
            var text1_temp = i1 + "%";
            if(i1>=0)
            {
                mes.draw_n_rect_1(3 * i1 / 20, text1_temp);
            }
            /*else if(i1<=0)
            {
                mes.draw_n_rect_1(0,"0 %");
            }*/
            if (i1 <= n1_2) {
                clearInterval(timer1);
            }
            i1--;
        }, 50)
        }

    }


    // if(n2_1<=n2_2)
    // {
    //     if(n2_1>=0)
    //     {
    //         var timer2 = setInterval(function () {
    //         ctx4.fillStyle = "#ffffff";
    //         ctx4.fillRect(260, 213, 40, 30);
    //         var text2_temp = n2_2;
    //         mes.draw_n_rect_2(3 * i2 / 20, text2_temp);
    //         if (i2 >= n2_2) {
    //             clearInterval(timer2);
    //         }
    //         i2++;
    //     }, 50)
    //     }
    // }
    // else if(n2_1>n2_2)
    // {
    //     if(n2_2>=0)
    //     {
    //     var timer2 = setInterval(function () {
    //         ctx4.fillStyle = "#ffffff";
    //         ctx4.fillRect(260, 213, 40, 30);
    //         var text2_temp = i2 + "%";
    //         mes.draw_n_rect_2(3 * i2 / 20, text2_temp);
    //         if (i2 <= n2_2) {
    //             clearInterval(timer2);
    //         }
    //         i2--;
    //     }, 50);
    //     }
    // }
      
}
/*draw_n_rect_1(n1,text1);
draw_n_rect_2(n2,text2);*/
//draw_n_rect(100,50);//调用内存占用、黑名单占比的函数示例,传递百分比的大小------------------

mes.draw_n_rect_2 = function (n, text) {//绘制第二个水平条形的内容
    mes.e2 = document.getElementById("right3");
    ctx4 = mes.e2.getContext("2d");
    ctx4.fillStyle="#ffffff";
    ctx4.fillRect(5,206,150,28);
    var draw_count2 = 0
    for (; draw_count2 < n; draw_count2++) {
        mes.drawRect(mes.block[1].rect2.x + 10 * draw_count2, mes.block[1].rect2.y, mes.block[1].rect2.w, mes.block[1].rect2.h);
    }
    ctx4.font = 'bold 18px Arial';
    ctx4.fillText(text, 260, 227);
}
mes.set_IP = function (text) {
    mes.e2 = document.getElementById("right3");
    ctx4 = mes.e2.getContext("2d");
    ctx4.fillStyle = "#ffffff";

    ctx4.fillRect(240, 210, 100, 50);
    ctx4.fillStyle = "#0b799d";
    ctx4.fillText(text, 240, 227);//调整连接IP数的值--------------------
}
//set_IP(1024);

// mes.drawRect2 = function (x, y, w, h) { //绘制右侧canvas里的单个条形块
//     mes.e = document.getElementById("right2");
//     ctx3 = mes.e.getContext("2d");
//     ctx3.fillRect(x, y, w, h);
//     ctx3.lineWidth = 1;
//     ctx3.strokeStyle = "white";
//     ctx3.strokeRect(x, y, w, h);
// }

















/**
 * mes.draw_n_rect_4 5 6 7 8：绘制网段图
 */
mes.draw_n_rect_4 = function (n) {//绘制右侧第一个竖直条形，n为单个竖直条形里面的条形的个数
    mes.e = document.getElementById("right2");
    ctx3 = mes.e.getContext("2d");
    var draw_count4 = 0;
    for (; draw_count4 < n; draw_count4++) {
        ctx3.fillStyle = 'rgb(' + 3 * draw_count4 + ',' + 25 * draw_count4 + ',157)';
        mes.drawRect2(mes.block[3].rect4.x, mes.block[3].rect4.y - 15 * draw_count4, mes.block[3].rect4.w, mes.block[3].rect4.h);
    }
}
mes.draw_n_rect_5 = function (n) {//绘制右侧第二个竖直条形，n为单个竖直条形里面的条形的个数
    mes.e = document.getElementById("right2");
    ctx3 = mes.e.getContext("2d");
    var draw_count5 = 0;
    for (; draw_count5 < n; draw_count5++) {
        ctx3.fillStyle = 'rgb(' + 3 * draw_count5 + ',' + 25 * draw_count5 + ',157)';
        mes.drawRect2(mes.block[3].rect4.x + 60, mes.block[3].rect4.y - 15 * draw_count5, mes.block[3].rect4.w, mes.block[3].rect4.h);
    }
}
mes.draw_n_rect_6 = function (n) {//绘制右侧第三个竖直条形，n为单个竖直条形里面的条形的个数
    mes.e = document.getElementById("right2");
    ctx3 = mes.e.getContext("2d");
    var draw_count6 = 0;
    for (; draw_count6 < n; draw_count6++) {
        ctx3.fillStyle = 'rgb(' + 3 * draw_count6 + ',' + 25 * draw_count6 + ',157)';
        mes.drawRect2(mes.block[3].rect4.x + 120, mes.block[3].rect4.y - 15 * draw_count6, mes.block[3].rect4.w, mes.block[3].rect4.h);
    }
}
mes.draw_n_rect_7 = function (n) {//绘制右侧第四个竖直条形，n为单个竖直条形里面的条形的个数
    mes.e = document.getElementById("right2");
    ctx3 = mes.e.getContext("2d");
    var draw_count7 = 0;
    for (; draw_count7 < n; draw_count7++) {
        ctx3.fillStyle = 'rgb(' + 3 * draw_count7 + ',' + 25 * draw_count7 + ',157)';
        mes.drawRect2(mes.block[3].rect4.x + 180, mes.block[3].rect4.y - 15 * draw_count7, mes.block[3].rect4.w, mes.block[3].rect4.h);
    }
}
mes.draw_n_rect_8 = function (n) {//绘制右侧第五个竖直条形，n为单个竖直条形里面的条形的个数
    mes.e = document.getElementById("right2");
    ctx3 = mes.e.getContext("2d");
    var draw_count8 = 0;
    for (; draw_count8 < n; draw_count8++) {
        ctx3.fillStyle = 'rgb(' + 3 * draw_count8 + ',' + 25 * draw_count8 + ',157)';
        mes.drawRect2(mes.block[3].rect4.x + 240, mes.block[3].rect4.y - 15 * draw_count8, mes.block[3].rect4.w, mes.block[3].rect4.h);
    }
}
mes.play4 = function (n4_1,n4_2) {
    mes.e = document.getElementById("right2");
    ctx3 = mes.e.getContext("2d");
    if(n4_1<=n4_2)
    {
        var i4 = n4_1;
        var timer4 = setInterval(
        function () {
            ctx3.clearRect(5,290,60,180);
            mes.draw_n_rect_4(i4);
            if (i4 > n4_2 - 1) {
                clearInterval(timer4);
            }
            i4++;
        }, 200);
    }
    else if(n4_1>n4_2)
    {
        var i4 = n4_1;
        var timer4 = setInterval(
        function () {
            ctx3.clearRect(5,290,60,180);
            mes.draw_n_rect_4(i4);
            if (i4 <= n4_2) {
                clearInterval(timer4);
            }
            i4--;
        }, 200);
    }
}
mes.play5 = function (n5_1,n5_2) {
    mes.e = document.getElementById("right2");
    ctx3 = mes.e.getContext("2d");
    if(n5_1<=n5_2)
    {
        var i5 = n5_1;
        var timer5 = setInterval(
        function () {
            ctx3.clearRect(55,290,60,180);
            mes.draw_n_rect_5(i5);
            if (i5 > n5_2 - 1) {
                clearInterval(timer5);
            }
            i5++;
        }, 200);
    }
    else if(n5_1>n5_2)
    {
        var i5 = n5_1;
        var timer5 = setInterval(
        function () {
            ctx3.clearRect(55,290,60,180);
            mes.draw_n_rect_5(i5);
            if (i5 <= n5_2) {
                clearInterval(timer5);
            }
            i5--;
        }, 200);
    }
    
}
mes.play6 = function (n6_1,n6_2) {
    mes.e = document.getElementById("right2");
    ctx3 = mes.e.getContext("2d");
    if(n6_1<=n6_2)
    {
        var i6 = n6_1;
        var timer6 = setInterval(
        function () {
            ctx3.clearRect(115,290,60,180);
            mes.draw_n_rect_6(i6);
            if (i6 > n6_2 - 1) {
                clearInterval(timer6);
            }
            i6++;
        }
        , 200);
    }
    else if(n6_1>n6_2)
    {
        var i6 = n6_1;
        var timer6 = setInterval(
        function () {
            ctx3.clearRect(115,290,60,180);
            mes.draw_n_rect_6(i6);
            if (i6 <= n6_2) {
                clearInterval(timer6);
            }
            i6--;
        }
        , 200);
    }
    
}
mes.play7 = function (n7_1,n7_2) {
    mes.e = document.getElementById("right2");
    ctx3 = mes.e.getContext("2d");
    if(n7_1<=n7_2)
    {
        var i7 = n7_1;
        var timer7 = setInterval(
        function () {
            ctx3.clearRect(175,290,60,180);
            mes.draw_n_rect_7(i7);
            if (i7 > n7_2 - 1) {
                clearInterval(timer7);
            }
            i7++;
        }
        , 200);
    }
    else if(n7_1>n7_2)
    {
        var i7 = n7_1;
        var timer7 = setInterval(
        function () {
            ctx3.clearRect(175,290,60,180);
            mes.draw_n_rect_7(i7);
            if (i7 <= n7_2) {
                clearInterval(timer7);
            }
            i7--;
        }
        , 200);
    }
    
}
mes.play8 = function (n8_1,n8_2) {
    mes.e = document.getElementById("right2");
    ctx3 = mes.e.getContext("2d");
    if(n8_1<n8_2)
    {
        var i8 = n8_1;
        var timer8 = setInterval(
        function () {
            ctx3.clearRect(235,290,60,180);
            mes.draw_n_rect_8(i8);
            if (i8 > n8_2 - 1) {
                clearInterval(timer8);
            }
            i8++;
        }
        , 200);
    }
    else if(n8_1>n8_2)
    {
        var i8 = n8_1;
        var timer8 = setInterval(
        function () {
            ctx3.clearRect(235,290,60,180);
            mes.draw_n_rect_8(i8);
            if (i8 <= n8_2) {
                clearInterval(timer8);
            }
            i8--;
        }
        , 200);
    }
    
}
mes.play = function (n4_1,n4_2, n5_1,n5_2, n6_1,n6_2, n7_1,n7_2, n8_1,n8_2) {
    //mes.e = document.getElementById("right2");
    //ctx3 = mes.e.getContext("2d");
    //ctx3.clearRect(0,290,300,180);
    mes.play4(0);
    mes.play5(0);
    mes.play6(0);
    mes.play7(0);
    mes.play8(0);
    mes.play4(n4_1,n4_2);
    mes.play5(n5_1,n5_2);
    mes.play6(n6_1,n6_2);
    mes.play7(n7_1,n7_2);
    mes.play8(n8_1,n8_2);
}
//play(4,6,3,2,5);//网段统计函数调用示例-----------------

//绘制指针
mes.pointer = function (i) {
    mes.e2 = document.getElementById("right3");
    ctx4 = mes.e2.getContext("2d");
    ctx4.beginPath();
    ctx4.fillStyle = "rgb(11,121,157)";
    ctx4.arc(150, 90, 8 * 18 / 20, 0, 360 * Math.PI / 180, false);
    ctx4.fill();
    ctx4.beginPath();
    ctx4.strokeStyle = "rgb(11,121,157)";
    ctx4.lineWidth = 5;
    ctx4.moveTo(150 - 20 * Math.cos(30 * i * Math.PI / 180), 90 - 20 * Math.sin(30 * i * Math.PI / 180));
    ctx4.lineTo(150 + 60 * Math.cos(30 * i * Math.PI / 180), 90 + 60 * Math.sin(30 * i * Math.PI / 180));
    ctx4.closePath();
    ctx4.stroke();
}
//运行动态指针

mes.run_pointer = function (p1,p2) {
    mes.e2 = document.getElementById("right3");
    ctx4 = mes.e2.getContext("2d");
    ctx4.arc(150,90,68, 40 * Math.PI / 180, 145 * Math.PI / 180, true)

    if(p1<=p2)
    {
        var t=p1;
        var timer3 = setInterval(function () {
            mes.e2 = document.getElementById("right3");    
            ctx4 = mes.e2.getContext("2d");
            ctx4.fillStyle = "#ffffff";
            ctx4.arc(150, 90, 68, 40 * Math.PI / 180, 145 * Math.PI / 180, true);
            ctx4.fill();
            ctx4.arc(150, 90, 25, 0, 360 * Math.PI / 180, true);
            ctx4.fill();
            mes.pointer(t + 5);
            t++;
            if (t > p2) {
                clearInterval(timer3);
            }
        }, 120)
    }
    else if(p1>p2)
    {
        var t=p1;
        var timer3 = setInterval(function () {
            mes.e2 = document.getElementById("right3");  
            ctx4 = mes.e2.getContext("2d");
            ctx4.fillStyle = "#ffffff";
            ctx4.arc(150, 90, 68, 40 * Math.PI / 180, 145 * Math.PI / 180, true);
            ctx4.fill();
            ctx4.arc(150, 90, 25, 0, 360 * Math.PI / 180, true);
            ctx4.fill();
            mes.pointer(t + 5);
            t--;
            if (t < p2) {
                clearInterval(timer3);
            }
        }, 120)
    }
    
}
    // run_pointer(8); //调用指针运行函数示例（从左到右，依次为0，1）------------------------------