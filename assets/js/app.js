/**
* we can use the Hackaday API from client-side JS...
* but I don't want to hard-code my API key!
* so it is loaded in the footer for now.
* we'll get the owner info for each item, save to sessionstorage to create a tooltip
* when hovering over an owner's name, look to sessionstorage, if not, get the info from ajax
* sessionstorage instead of localstorage just in case some info about the user changes... but we don't need to keep re-querying the API!
**/

function show_owner_tooltip(el){
  //is there already a tooltip showing here?
  var hgroup = el.parentNode;
  if(hgroup.querySelector('.tooltip') === null){
    var owner_id = el.getAttribute('data-owner-id');
    var info = JSON.parse(get_owner(owner_id));
    var tooltip = document.createElement("div");
    tooltip.classList.add('tooltip');
    var template = document.getElementById('tooltip-template').innerHTML;
    template = template.replace(/&lt;/g, '<');
    template = template.replace(/&gt;/g, '>');
    tooltip.innerHTML = ejs.render(template, info);
    hgroup.appendChild(tooltip);
  }
}

function hide_owner_tooltip(el){
  var hgroup = el.parentNode;
  if(el.nextElementSibling !== null){
    var tooltip = el.nextElementSibling;
    hgroup.removeChild(tooltip);
  }
}

function get_owner(owner_id){
  if (!get_owner_from_storage(owner_id))
    return get_owner_from_api(owner_id);
  else
    return get_owner_from_storage(owner_id);
}

function get_owner_from_storage(owner_id){
  //grab sessionstorage, look for owner id, return false if not there
  if (sessionStorage.getItem('hackagist_owner_' + owner_id))
    return sessionStorage.getItem('hackagist_owner_' + owner_id);
  else
    return false;
}

function get_owner_from_api(owner_id){
  var request = new XMLHttpRequest();
  request.open('GET', 'https://api.hackaday.io/v1/users/' + owner_id + '?api_key=' + hdapi, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var resp = request.responseText;
      sessionStorage.setItem('hackagist_owner_' + owner_id, resp);
      return resp;
      //save to sessionstorage to avoid doing this again right away
    } else {
      // We reached our target server, but it returned an error

    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();
}

function check_owners(){
  var project_owners = document.querySelectorAll('.project .owner');
  Array.prototype.forEach.call(project_owners, function(el, i){
    var owner_id = el.getAttribute('data-owner-id');
    get_owner(owner_id);
  });
}

function start_listening(){
  //get owner info for tooltips
  var project_owners = document.querySelectorAll('.project .owner');
  Array.prototype.forEach.call(project_owners, function(el, i){
    el.addEventListener("mouseenter", function( event ) {
      show_owner_tooltip(el);
    }, false);
    el.parentNode.addEventListener("mouseleave", function( event ) {
      hide_owner_tooltip(el);
    }, false);
  });
}

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

check_owners();
ready(start_listening);
