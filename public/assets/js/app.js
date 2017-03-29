function fadeIn(a) {
    a.style.opacity = 0;
    var b = +new Date(), c = function() {
        a.style.opacity = +a.style.opacity + (new Date() - b) / 400, b = +new Date(), +a.style.opacity < 1 && (window.requestAnimationFrame && requestAnimationFrame(c) || setTimeout(c, 16));
    };
    c();
}

function show_owner_tooltip(a) {
    var b = a.parentNode;
    if (null === b.querySelector(".tooltip")) {
        var c = a.getAttribute("data-owner-id"), d = JSON.parse(get_owner(c)), e = document.createElement("div");
        e.classList.add("tooltip");
        var f = document.getElementById("tooltip-template").innerHTML;
        f = f.replace(/&lt;/g, "<"), f = f.replace(/&gt;/g, ">"), e.innerHTML = ejs.render(f, d), 
        b.appendChild(e);
    }
}

function hide_owner_tooltip(a) {
    var b = a.parentNode;
    if (null !== a.nextElementSibling) {
        var c = a.nextElementSibling;
        b.removeChild(c);
    }
}

function get_owner(a) {
    return get_owner_from_storage(a) ? get_owner_from_storage(a) : get_owner_from_api(a);
}

function get_owner_from_storage(a) {
    return !!sessionStorage.getItem("hackagist_owner_" + a) && sessionStorage.getItem("hackagist_owner_" + a);
}

function get_owner_from_api(a) {
    var b = new XMLHttpRequest();
    b.open("GET", "https://api.hackaday.io/v1/users/" + a + "?api_key=" + hdapi, !0), 
    b.onload = function() {
        if (b.status >= 200 && b.status < 400) {
            var c = b.responseText;
            return sessionStorage.setItem("hackagist_owner_" + a, c), c;
        }
    }, b.onerror = function() {}, b.send();
}

function check_owners() {
    var a = document.querySelectorAll(".project .owner");
    Array.prototype.forEach.call(a, function(a, b) {
        get_owner(a.getAttribute("data-owner-id"));
    });
}

function start_listening() {
    imagesLoaded(document.getElementById("projects"), function(a) {
        new Masonry(".row", {
            itemSelector: ".project"
        });
        fadeIn(document.getElementById("projects"));
    });
    var a = document.querySelectorAll(".project .owner");
    Array.prototype.forEach.call(a, function(a, b) {
        a.addEventListener("mouseenter", function(b) {
            show_owner_tooltip(a);
        }, !1), a.parentNode.addEventListener("mouseleave", function(b) {
            hide_owner_tooltip(a);
        }, !1);
    });
}

function ready(a) {
    "loading" != document.readyState ? a() : document.addEventListener("DOMContentLoaded", a);
}

check_owners(), ready(start_listening);
//# sourceMappingURL=app.js.map