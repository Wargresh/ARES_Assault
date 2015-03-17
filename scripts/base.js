/*
 * Click Click v0.2
 * NOW WITH 50% MORE SAVING
 */

//variables
var player = {
    clicks: 0,
    autoclicks: 0,
    cost: 1,
    upgrade_speed: 0,
    click_rate: 1000,
    interval_auto: null
};

//functions
function update_total_clicks() { //updates the number of player.clicks   
    var e = document.getElementById("total_clicks");
    e.innerHTML = player.clicks;
}

function buy_something(c, button) {
    if (player.clicks < c) {
        button.className = 'btn btn-danger';
        setTimeout(function () {
            var e = document.getElementsByClassName("btn-danger")[0];
            e.className = 'btn btn-success';
        }, 1000);
        return false;
    }
    player.clicks -= c;
    return true;
}

function update_workers() {
    var e2 = document.getElementById("time_period");
    e2.innerHTML = parseFloat(player.click_rate / 1000.0).toFixed(2);
    clearInterval(player.interval_auto);
    player.interval_auto = setInterval(function () {
        player.clicks += player.autoclicks;
        update_total_clicks();
    }, player.click_rate);
}

function set_cookie(c_name, value) {
    expiry = new Date();
    expiry.setTime(new Date().getTime() + (10 * 60 * 1000));
    var c_value = escape(btoa(JSON.stringify(value))) + "; expires=" + expiry.toUTCString();
    document.cookie = c_name + "=" + c_value;
}

function get_cookie(cookie_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + cookie_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(cookie_name + "=");
    }
    if (c_start == -1) return false;
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);
    if (c_end == -1) {
        c_end = c_value.length;
    }
    c_value = JSON.parse(atob(unescape(c_value.substring(c_start, c_end))));
    return c_value;
}

function update_view() {
    var e2 = document.getElementById("upgrade_speed");
    e2.innerHTML = 'Buy for ' + ((Math.pow(3, player.upgrade_speed)) * 100);
    var e2 = document.getElementById("speed_level");
    e2.innerHTML = 'lvl  ' + player.upgrade_speed;

    var e = document.getElementById("clicks_per_second");
    e.innerHTML = player.autoclicks;
    var e2 = document.getElementById("buy_click");
    e2.innerHTML = 'Buy for ' + player.cost;
    var e2 = document.getElementById("autoclicker_level");
    e2.innerHTML = 'lvl  ' + player.autoclicks;
    update_total_clicks();
    update_workers();
}

function load_game() {
    var save_data = get_cookie('clickclick_save');
    console.log(save_data);
    if (!save_data) return;
    console.log(save_data);
    player = save_data;
    update_view();
}

function load_custom_game() {
    var save_data = prompt("Please enter your save key", "save key");
    save_data = JSON.parse(atob(save_data));
    if (!save_data || !verify_save(save_data)) {
        alert('could not load the save..');
        load_custom_game();
        return;
    }
    player = save_data;
    update_view();
}

function save_game() {
    set_cookie('clickclick_save', player);
    if (!verify_save(getCookie('clickclick_save'))) {
        alert('Whoops! We could not save your game :( Here is the save data please save this: ' + btoa(JSON.stringify(player)));
        load_custom_game();
    }
}

function verify_save(obj) {
    if (typeof obj != 'object') return false;
    //any other validations you need

    return true;
}
//click events
document.getElementById("click").onclick = function () {
    player.clicks++;
    update_total_clicks(); //updates the text
};
document.getElementById("buy_click").onclick = function () {
    if (!buy_something(player.cost, this)) return;
    player.autoclicks++;
    player.cost = Math.pow(2, player.autoclicks); //new player.cost
    update_view();
    save_game();

};
document.getElementById("upgrade_speed").onclick = function () {
    var upgrade_cost = (Math.pow(3, player.upgrade_speed)) * 100;
    if (!buy_something(upgrade_cost, this)) return;
    player.upgrade_speed++;
    player.click_rate = player.click_rate * .90;
    update_view();
    save_game();
};

load_game(); //attempt to load the game
//start our autoclickers
update_workers();
setInterval(function () {
    save_game();
}, 10000);