function show_projects(a) {
    var b = a.getAttribute("data-show"), c = document.getElementById("projects"), d = 1 * a.parentNode.parentNode.parentNode.nextElementSibling.getAttribute("data-page-number");
    c.style.opacity = 0;
    for (var e = document.querySelectorAll(".view-type"), f = 0, g = e.length; f < g; f++) e[f].setAttribute("data-display", b);
    get_project_page(d, b);
}

function create_project_layout(a, b) {
    Promise.all([ get_owners(a.projects) ]).then(function(c) {
        var d = document.getElementById("projects");
        getTemplate("/assets/ejs/project-" + b + ".ejs", function(b, e) {
            if (b) throw b;
            var f = document.createElement("div");
            f.classList.add("row"), f.innerHTML = ejs.render(e, {
                the_projects: a,
                the_owners: c[0]
            }), window.setTimeout(function() {
                d.innerHTML = "", d.appendChild(f), refresh_project_grid();
            }, 500);
        });
    });
}

function get_project_page_from_storage(a) {
    return !!sessionStorage.getItem("hackagist_page_" + a) && JSON.parse(sessionStorage.getItem("hackagist_page_" + a));
}

function get_project_page_from_api(a, b) {
    var c = new XMLHttpRequest();
    c.open("GET", "https://api.hackaday.io/v1/projects?per_page=12&page=" + a + "&api_key=" + hdapi, !0), 
    c.responseType = "json", c.onload = function() {
        if (c.status >= 200 && c.status < 400) {
            var d = c.response;
            return sessionStorage.setItem("hackagist_page_" + a, JSON.stringify(d)), b(null, d);
        }
        return b(error);
    }, c.onerror = function() {
        console.log("error!");
    }, c.send();
}

function change_project_page(a) {
    var b = a.getAttribute("data-direction"), c = 1 * a.parentNode.parentNode.parentNode.getAttribute("data-page-number"), d = 1 * a.parentNode.parentNode.parentNode.getAttribute("data-last-page"), e = a.parentNode.parentNode.parentNode.previousElementSibling.getAttribute("data-display"), f = 1;
    f = "prev" == b ? c - 1 : c + 1, get_project_page(f, e);
    for (var g = document.querySelectorAll("nav.pagination"), h = 0, i = g.length; h < i; h++) g[h].setAttribute("data-page-number", f);
    for (var j = document.querySelectorAll(".page-number"), h = 0, i = j.length; h < i; h++) j[h].innerHTML = f;
    if (f > 1 && f < d) for (var j = document.querySelectorAll(".page-turn"), h = 0, i = j.length; h < i; h++) j[h].classList = "page-turn"; else if (1 == f) for (var j = document.querySelectorAll('.page-turn[data-direction="prev"]'), h = 0, i = j.length; h < i; h++) j[h].classList = "page-turn disabled"; else if (f == d) for (var j = document.querySelectorAll('.page-turn[data-direction="next"]'), h = 0, i = j.length; h < i; h++) j[h].classList = "page-turn disabled";
}

function get_project_page(a, b) {
    document.getElementById("projects").style.opacity = 0, get_project_page_from_storage(a) ? (the_projects = get_project_page_from_storage(a), 
    create_project_layout(the_projects, b)) : get_project_page_from_api(a, function(a, c) {
        null == a ? create_project_layout(c, b) : console.log("error!");
    });
}

function refresh_project_grid() {
    imagesLoaded(document.getElementById("projects"), function(a) {
        new Masonry("#projects .row", {
            itemSelector: ".project"
        });
        document.getElementById("projects").style.opacity = 1;
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

function get_owners(a) {
    return new Promise(function(b, c) {
        var d = [];
        for (p in a) d.push(get_owner(a[p].owner_id));
        Promise.all(d).then(function(a) {
            b(a);
        }).catch(function(a) {
            c(Error(a));
        });
    });
}

function get_owner(a) {
    return new Promise(function(b, c) {
        get_owner_from_storage(a) ? b(JSON.parse(get_owner_from_storage(a))) : get_owner_from_api(a).then(function(a) {
            b(a);
        });
    });
}

function get_owner_from_storage(a) {
    return !!sessionStorage.getItem("hackagist_owner_" + a) && sessionStorage.getItem("hackagist_owner_" + a);
}

function get_owner_from_api(a) {
    return new Promise(function(b, c) {
        var d = new XMLHttpRequest();
        d.open("GET", "https://api.hackaday.io/v1/users/" + a + "?api_key=" + hdapi, !0), 
        d.responseType = "json", d.onload = function() {
            if (d.status >= 200 && d.status < 400) {
                var e = d.response;
                sessionStorage.setItem("hackagist_owner_" + a, JSON.stringify(e)), b(e);
            } else c(new Error("unable to complete GET request"));
        }, d.onerror = function() {
            c(new Error("unable to complete GET request"));
        }, d.send();
    });
}

function check_owners() {
    for (owner in owners_pg1) {
        var a = owners_pg1[owner].id;
        sessionStorage.setItem("hackagist_owner_" + a, JSON.stringify(owners_pg1[owner]));
    }
}

function show_owner_tooltip(a) {
    var b = a.parentNode;
    if (null === b.querySelector(".tooltip")) {
        get_owner(a.getAttribute("data-owner-id")).then(function(a) {
            info = a;
        });
        var c = document.createElement("div");
        c.classList.add("tooltip"), getTemplate("/assets/ejs/tooltip.ejs", function(a, d) {
            if (a) throw a;
            c.innerHTML = ejs.render(d, info), b.appendChild(c);
        });
    }
}

function hide_owner_tooltip(a) {
    var b = a.parentNode;
    if (null !== a.nextElementSibling) {
        var c = a.nextElementSibling;
        b.removeChild(c);
    }
}

function getTemplate(a, b) {
    var c = new XMLHttpRequest();
    c.open("GET", a, !0), c.onload = function() {
        if (c.status >= 200 && c.status < 400) {
            var a = c.responseText;
            return b(null, a);
        }
        return b(error);
    }, c.onerror = function() {
        return b(error);
    }, c.send();
}

function hasClass(a, b) {
    return a.classList ? a.classList.contains(b) : new RegExp("(^| )" + b + "( |$)", "gi").test(a.className);
}

function start_listening() {
    var a = document.querySelectorAll("nav .page-turn");
    Array.prototype.forEach.call(a, function(a, b) {
        a.addEventListener("click", function(b) {
            b.preventDefault(), hasClass(a, "disabled") || change_project_page(a);
        }, !1);
    });
    var b = document.querySelectorAll(".view-type .show");
    Array.prototype.forEach.call(b, function(a, b) {
        a.addEventListener("click", function(b) {
            b.preventDefault(), show_projects(a);
        }, !1);
    }), refresh_project_grid();
}

function ready(a) {
    "loading" != document.readyState ? a() : document.addEventListener("DOMContentLoaded", a);
}

sessionStorage.setItem("hackagist_page_1", JSON.stringify(projects_pg1)), check_owners(), 
ready(start_listening);
//# sourceMappingURL=app.js.map