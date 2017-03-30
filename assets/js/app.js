/**
* we can use the Hackaday API from client-side JS...
* but I don't want to hard-code my API key!
* so it is loaded in the footer for now.
* we'll get the owner info for each item, save to sessionstorage to create a tooltip
* when hovering over an owner's name, look to sessionstorage, if not, get the info from ajax
* sessionstorage instead of localstorage just in case some info about the user changes... but we don't need to keep re-querying the API!
**/

function getTemplate(file, callback) {
    var request = new XMLHttpRequest();
    request.open('GET',file, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText;
        return callback(null, resp);
      } else {
        return callback(error);
      }
    };
    request.onerror = function() {
      return callback(error);
    };
    request.send();
}

function hasClass(el, className){
  if (el.classList)
    return el.classList.contains(className);
  else
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}

function start_listening(){
  //get prev/next page
  var nav_buttons = document.querySelectorAll('nav .page-turn');
  Array.prototype.forEach.call(nav_buttons, function(el, i){
    el.addEventListener("click", function( event ) {
      event.preventDefault();
      if(!hasClass(el, 'disabled')){
        change_project_page(el);
      }
    }, false);
  });

  var view_buttons = document.querySelectorAll('.view-type .show');
  Array.prototype.forEach.call(view_buttons, function(el, i){
    el.addEventListener("click", function( event ) {
      event.preventDefault();
      show_projects(el);
    }, false);
  });

  refresh_project_grid();
}

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

sessionStorage.setItem('hackagist_page_1', JSON.stringify(projects_pg1));
check_owners();
ready(start_listening);
