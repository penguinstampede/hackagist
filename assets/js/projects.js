function show_projects(btn){
  var layout = btn.getAttribute('data-show'),
    project_container = document.getElementById('projects'),
    current_page = (btn.parentNode.parentNode.parentNode.nextElementSibling.getAttribute('data-page-number') * 1);
  project_container.style.opacity = 0;
  btn.parentNode.parentNode.parentNode.setAttribute('data-display', layout);
  get_project_page(current_page, layout);
}

function create_project_layout(the_projects, layout){
  //we need to get the owner names!
  Promise.all([get_owners(the_projects.projects)])
    .then(function(the_owners){
      var project_container = document.getElementById('projects');
      getTemplate('/assets/ejs/project-' + layout + '.ejs', function (err, tpl) {
        if (err) {
            throw err;
        }
        var project_row = document.createElement("div");
        project_row.classList.add('row');
        project_row.innerHTML = ejs.render(tpl, {the_projects: the_projects, the_owners: the_owners[0]});
        window.setTimeout(function(){
          //wait half a second in case things are nicely cached and the opacity has't gone to 0 yet
          project_container.innerHTML = '';
          project_container.appendChild(project_row);
          refresh_project_grid();
        }, 500);
      });
    });
}

function get_project_page_from_storage(page_id){
  //grab sessionstorage, look for page id, return false if not there
  if (sessionStorage.getItem('hackagist_page_' + page_id))
    return JSON.parse(sessionStorage.getItem('hackagist_page_' + page_id));
  else
    return false;
}

function get_project_page_from_api(page_id, callback){
  var request = new XMLHttpRequest();
  request.open('GET', 'https://api.hackaday.io/v1/projects?per_page=12&page=' + page_id + '&api_key=' + hdapi, true);
  request.responseType = 'json';
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var resp = request.response;
      sessionStorage.setItem('hackagist_page_' + page_id, JSON.stringify(resp));
      return callback(null, resp);
    } else {
      return callback(error);
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log('error!');
  };

  request.send();
}

function change_project_page(btn){
  var direction   = btn.getAttribute('data-direction'),
    current_page  = (btn.parentNode.parentNode.parentNode.getAttribute('data-page-number') * 1),
    last_page     = (btn.parentNode.parentNode.parentNode.getAttribute('data-last-page') * 1),
    layout        = btn.parentNode.parentNode.parentNode.previousElementSibling.getAttribute('data-display'),
    page_to_load = 1;
  if(direction == 'prev')
    page_to_load = current_page - 1;
  else
    page_to_load = current_page + 1;
  get_project_page(page_to_load, layout);
  btn.parentNode.parentNode.parentNode.setAttribute('data-page-number', page_to_load);
  var page_number = document.querySelectorAll('.page-number');
  for (var i = 0, max = page_number.length; i < max; i++) {
    page_number[i].innerHTML = page_to_load;
  }
  if (page_to_load > 1 && page_to_load < last_page){
    var page_number = document.querySelectorAll('.page-turn');
    for (var i = 0, max = page_number.length; i < max; i++) {
      page_number[i].classList = 'page-turn';
    }
  } else if (page_to_load == 1) {
    var page_number = document.querySelectorAll('.page-turn[data-direction="prev"]');
    for (var i = 0, max = page_number.length; i < max; i++) {
      page_number[i].classList = 'page-turn disabled';
    }
  } else if (page_to_load == last_page) {
    var page_number = document.querySelectorAll('.page-turn[data-direction="next"]');
    for (var i = 0, max = page_number.length; i < max; i++) {
      page_number[i].classList = 'page-turn disabled';
    }
  }
}

function get_project_page(page_id, layout){
  var project_container = document.getElementById('projects');
  project_container.style.opacity = 0;

  if (get_project_page_from_storage(page_id)) {
    the_projects = get_project_page_from_storage(page_id);
    create_project_layout(the_projects, layout);
  } else {
    get_project_page_from_api(page_id, function(err, the_projects) {
      if(err == null)
        create_project_layout(the_projects, layout);
      else
        console.log('error!');
    });
  }
}

function refresh_project_grid(){
  imagesLoaded( document.getElementById('projects'), function( instance ) {
    var msnry = new Masonry( '#projects .row', {
      itemSelector: '.project'
    });
    document.getElementById('projects').style.opacity = 1;
  });

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
