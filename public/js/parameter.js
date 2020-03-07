var memory = {
    max_size: 16,
    use: 0.2
};

var memory = {
    max_size: 16,
    use: 0.2
};

var bandwidth = {
    max_size: 16,
    use: 0.1
}

var IP_count;

var top_five = new Array();
top_five[0] = { count: 0, ip: "0.0.0.0" };
top_five[1] = { count: 0, ip: "0.0.0.0" };
top_five[2] = { count: 0, ip: "0.0.0.0" };
top_five[3] = { count: 0, ip: "0.0.0.0" };
top_five[4] = { count: 0, ip: "0.0.0.0" };

var blacklist = 0;

var user_speed = 20;

var handle = setInterval(function () {

}, 1000 / 60);

clearInterval(handle);