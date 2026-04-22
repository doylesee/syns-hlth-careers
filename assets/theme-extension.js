csns.maps.script.channel = "";
csns.maps.script.client_id = null;
csns.maps.script.api_key = "XXXXX";
csns.maps.script.version = 3.23;

$(document).ready(function(){ tm_initialize_search_form(); });

//// ### TM functions
function tm_initialize_search_form(){
  var selectors = window.tmjobsearch.form_defaults.input_selectors;
  selectors.ns_location = "input[type=text][name=ns_location]";

  if($("#search_form").length>0){
    var comprest = {}
    var jobform = new window.tmjobsearch.form("search_form", {
      radius_distance_in_miles: tm_vars.radius_in_miles,
      radius_distance_default: 25,
      radius_distance: tm_vars.param_ns_dist,
      onSubmit: function(e){
        window.setTimeout( tm_form_submit , 100);
        return false;
      },
      placeTypes: ['geocode'],
      placeComponentRestrictions: comprest,
      onBeforePlaceLoad: function(place, radius, location_string){
        return [place, radius, location_string];
      }
    });
  }
}

function tm_form_submit(){
  $("#submit_search").empty();
  var jsform = $("#search_form");

  var q = jsform.find("input[name=q]").val();
  tm_append_input_value_to_submit_search('q', q);

  var cfpositiontype = jsform.find("#cf-positiontype").val();
  tm_append_input_value_to_submit_search('cf[positiontype]', cfpositiontype);

  var cfemploymenttype = jsform.find("#cf-employmenttype").val();
  tm_append_input_value_to_submit_search('cf[employmenttype]', cfemploymenttype);

  var cfjobtype = jsform.find("#cf-jobtype").val();
  tm_append_input_value_to_submit_search('cf[jobtype]', cfjobtype);

  var radius = jsform.find( window.tmjobsearch.form_defaults.input_selectors.radius).val();
  // var mk = $("input[name=ns_mk]:checked").val();
  // var mks = mk == "mi" ? "miles" : "km";
  mks = "miles";
  var dist = parseInt($("#job-search-radius").val());
  var dists = isNaN(dist) ? 25 : dist;

  var newwithin = "";
  if(radius!="" && radius.indexOf(",,")<0){
    var lat = radius.split(",")[0];
    var long = radius.split(",")[1];
    newwithin = "/within/"+dists+"/"+mks+"/of/"+lat+"/"+long;
  }else{
    var dist = parseInt($("#job-search-radius").val());
    dist = dist ? dist : 25;
    var mk = $("input[name=ns_mk]:checked").val();
    if(mk=="km"){
      if(dist!=25){ //dont submit default
        tm_append_input_value_to_submit_search('near_dist_km', dist);
      }
    }else if(mk=="mi"){
      tm_append_input_value_to_submit_search('near_dist_miles', dist);
    }

    var location_country = jsform.find( window.tmjobsearch.form_defaults.input_selectors.location_country).val();
    tm_append_input_value_to_submit_search('location_country', location_country);
    var location_state = jsform.find( window.tmjobsearch.form_defaults.input_selectors.location_state).val();
    tm_append_input_value_to_submit_search('location_state', location_state);
    var location = jsform.find( window.tmjobsearch.form_defaults.input_selectors.location).val();
    tm_append_input_value_to_submit_search('location', location);
  }

  var action = $("#submit_search").attr("action");
  if(action.indexOf("/within") >= 1){
    action = action.replace(/\/within\/[\w\.\/]+of\/[\-\w\.]+\/[\-\w\.]+/, newwithin);
  }else{
    action += newwithin;
  }
  $("#submit_search").attr("action", action);

  var ns_location = jsform.find("input[name=ns_location]").val();
  tm_append_input_value_to_submit_search('ns_location', ns_location);

  var per_page = jsform.find("input[name=per_page]").val();
  if(per_page!=null && per_page!="" && per_page!="25"){
    tm_append_input_value_to_submit_search('per_page', per_page);
  }

  var sort_by = jsform.find("input[name=sort_by]").val();
  if(sort_by!="" && sort_by!=DEFAULT_SORT){
    tm_append_input_value_to_submit_search('sort_by', sort_by);
  }
  tm_finish_submit();
}

function tm_append_input_value_to_submit_search(name, val){
  if(name!=null && name!="" && val!=null && val!=""){
    var t_input = $("<input type='hidden'/>");
    t_input.attr("name", name);
    t_input.val(val);
    $("#submit_search").append(t_input);
  }
}

function tm_finish_submit(keywords, location){
  var url = url_from_form("#submit_search");

  tm_get_jobs_ajax(url, "search");
}

// MAIN AJAX job function
function tm_get_jobs_ajax(url, ajax_event_name){
  window.location.href = url;
}

function tm_event_jobs_ajax_start(full_url, ajax_event_name){
  $(document.body).addClass("tm_loading");
  $("#tm_job_results_toggle_tabs").hide();
  $("#tm_job_results_options").hide();
  tm_scroll_to("#tm_job_results_header");
}

function url_from_form(form_selector){
  var url = null;
  var form = $(form_selector);
  if(form.length>0){
    var action = form.attr("action");
    var query = form.serialize();
    url = action;
    if(query.length>0){
      url += "?" + query;
    }
  }
  return url;
}

var DEFAULT_SORT = "score";

//// ### COOKIE FUNCTIONS
function setCookie(name,value,days) {
  var expires="";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    expires = "; expires="+date.toGMTString();
  } else {
    //ie 11 is Netscape
    if (navigator.appName != "Microsoft Internet Explorer" &&
       navigator.appName != "Netscape"){
      expires = ";expires=0";
    }
  }
  document.cookie = name+"="+value+";path=/"+expires;
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
//// ### END Cookie functions