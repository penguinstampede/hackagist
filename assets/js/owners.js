function get_owners(projects){
  return new Promise(function(resolve, reject) {
    var promises = [];
    for (p in projects) {
      promises.push(get_owner(projects[p]["owner_id"]));
    }
    Promise.all(promises)
      .then(function(results){
        resolve(results);
      })
      .catch(function(e){
        reject(Error(e));
      });
  });
}

function get_owner(owner_id){
  return new Promise(function(resolve, reject) {
    var owner = {};
    if (get_owner_from_storage(owner_id) ){
      resolve(JSON.parse(get_owner_from_storage(owner_id)));
    } else {
      get_owner_from_api(owner_id)
        .then(function(results){
          resolve(results);
        });
    }
  });
}

function get_owner_from_storage(owner_id){
  //grab sessionstorage, look for owner id, return false if not there
  if (sessionStorage.getItem('hackagist_owner_' + owner_id))
    return sessionStorage.getItem('hackagist_owner_' + owner_id);
  else
    return false;
}

function get_owner_from_api(owner_id){
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.hackaday.io/v1/users/' + owner_id + '?api_key=' + hdapi, true);
    request.responseType = 'json';
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.response;
        sessionStorage.setItem('hackagist_owner_' + owner_id, JSON.stringify(resp));
        resolve(resp);
        //save to sessionstorage to avoid doing this again right away
      } else {
        reject(new Error("unable to complete GET request"));
      }
    };
    request.onerror = function() {
      reject(new Error("unable to complete GET request"));
    };
    request.send();
  });
}

function check_owners(){
  for(owner in owners_pg1){
    var owner_id = owners_pg1[owner]["id"];
    sessionStorage.setItem('hackagist_owner_' + owner_id, JSON.stringify(owners_pg1[owner]));
  }
}
