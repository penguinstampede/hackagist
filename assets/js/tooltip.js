function show_owner_tooltip(el){
  //is there already a tooltip showing here?
  var hgroup = el.parentNode;
  if(hgroup.querySelector('.tooltip') === null){
    var owner_id = el.getAttribute('data-owner-id');
    get_owner(owner_id)
      .then(function(results){
        info = results;
      });
    var tooltip = document.createElement("div");
    tooltip.classList.add('tooltip');
    getTemplate('/assets/ejs/tooltip.ejs', function (err, tpl) {
      if (err) {
          throw err;
      }
      tooltip.innerHTML = ejs.render(tpl, info);
      hgroup.appendChild(tooltip);
    });
  }
}

function hide_owner_tooltip(el){
  var hgroup = el.parentNode;
  if(el.nextElementSibling !== null){
    var tooltip = el.nextElementSibling;
    hgroup.removeChild(tooltip);
  }
}
