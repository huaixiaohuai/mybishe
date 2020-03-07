$(document).ready(function () {
    (function () {
        var oList = document.querySelectorAll('.list h2'),
            oHide = document.querySelectorAll('.hide'),
            oIcon = document.querySelectorAll('.list i'),
            lastIndex = 0;
        for (var i = 0; i < oList.length; i++) {
            oList[i].index = i;//自定义属性
            oList[i].isClick = false;
            oList[i].initHeight = oHide[i].clientHeight;
            oHide[i].style.height = '0';
            oList[i].onclick = function () {
                if (this.isClick) {
                    oHide[this.index].style.height = '0';
                    oIcon[this.index].className = '';
                    oList[this.index].className = '';
                    oList[this.index].isClick = false;
                }
                else {
                    oHide[lastIndex].style.height = '0';
                    oIcon[lastIndex].className = '';
                    oList[lastIndex].className = '';
                    if (this.index == 0) {
                        oHide[this.index].style.height = '60px';
                    } else {
                        oHide[this.index].style.height = '120px';
                    }
                    oIcon[this.index].className = 'on';
                    oList[this.index].className = 'on';
                    oList[lastIndex].isClick = false;
                    oList[this.index].isClick = true;
                    lastIndex = this.index;
                }
            }
        }
    })();
})

var left = left || {};
left.select = function (x) {
    x.style.background = "#616161";
    x.style.color = "#fafafa";
}
left.cancel_select = function (x) {
    x.style.background = "#222222";
    x.style.color = "#bbbbbb";
}