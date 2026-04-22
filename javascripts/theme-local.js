// Set height
function setHeight(the_selector) {
  var a_height = 0;
  $(the_selector).css('height','auto');
  $(the_selector).each(function() {
    if ($(this).height() > a_height) {
      a_height = $(this).height();
    }
  });
  $(the_selector).height(a_height);
}

// START: Facet Search scripts
window.facet_history = true;
// Function for expanding/collapsing Facet options
function facet_expand_collapse(facet_item_this){
  facet_item_this.parent().next('.facet-item__options').slideToggle();
  facet_item_this.parents('.facet-item').toggleClass('facet-item--expanded facet-item--collapsed');
}
  
// Function for Ajax-ing Job Search Results
function ds_tm_get_jobs_ajax(url){
  
  window.facet_loading = true;
  
  var t = $(".jobs-section").offset().top;
  t = t > 0 ? t : 1;
  
  $('html, body').animate({scrollTop: t}, 400, 'swing');
  //$("#jresult").html("loading...");
  $('.facet-loading').show();
  $('.jobs-section__inner').hide();
  
  if(window.facet_history==true && window.history!=null && window.history.pushState!=null){
    window.history.pushState({},"",url);
  }
  
  $.get(url, function(data) {
    $(".facet-section").html( $(data).find('.facet-section').html() );
    $(".jobs-section").html( $(data).find('.jobs-section').html() );
    $(".job-function").html( $(data).find('.job-function').html() );

    var tagtitle = $(data).filter('title').text();
    document.title = (tagtitle!="") ? tagtitle : "CareFirst Careers";
      
    $(".jobs-section__list").hide();
    $(".jobs-section__list").fadeIn(500);
 
    $('.facet-section').removeClass("ds_tm_ff_wait");
    window.facet_loading = false;

    $('.facet-loading').hide();
    $('.jobs-section__inner').show();
  });
}

function ds_tm_facet_click(e){
    e.preventDefault();
    var l = $(e.target).closest(".facet-item__option-link");
 
    if(window.facet_loading==true) {
        $('.facet-section').addClass("ds_tm_ff_wait");
    }
    else {
        l.addClass("ds_tm_ff_loading");
        $('.facet-section').addClass("ds_tm_ff_wait");

        var url = l.attr("href");
        ds_tm_get_jobs_ajax(url);
    }
}
  
// Function to showing more Facet options over the facet_num_limit
function ds_tm_facet_more_click(e){
  var l = $(e.target).closest(".facet-item__show-more");
  var facetname = l.attr("ref");
  //$("#facet-item__row--"+facetname).show();
  $("#facet-item__row--"+facetname).slideToggle();
  l.parent().addClass('hide');
}
  
$(document).ready(function() { 
    // Expanding/collapsing Facet options
    $(document).on("click", ".facet-item__heading h3", function(){ facet_expand_collapse($(this)); });
  
    // Ajax-ing Job Search Results
    //$(document).on("click", ".facet-item__option-link", function(e){ ds_tm_facet_click(e); });
  
    // Showing more Facet options over the facet_num_limit
    $(document).on("click", ".facet-item__show-more", function(e){ ds_tm_facet_more_click(e); });
});
// END: Facet Search scripts

$(document).ready(function() {
  // Responsive videos
  var $allVideos = $("iframe[src^='https://player.vimeo.com'], iframe[src^='https://www.youtube.com'], object, embed");
  $allVideos.each(function() {
    $(this).attr('data-aspectRatio', this.height / this.width).removeAttr('height').removeAttr('width');
  });
  $(window).resize(function() {
    $allVideos.each(function() {
      newHeight = $(this).width() * $(this).attr('data-aspectRatio');
      $(this).attr('style','height: '+newHeight+'px !important');
    });
  }).resize();

  // Header section: Top / Mobile Menu show/hide toggle
  $('.header__mobile-menu').click(function() {
    $('.header__menu').toggleClass('active');
  });

  // Header section: Select dropdown functionality
  $('.header__menu-top-select-outer select').change(function () {
    window.location.href = $(this).val();
  });

  // Banner section
  $('.banner__list').slick({
    arrows        : false,
    autoplay      : true,
    autoplaySpeed : 5000,
    dots          : false,
    fade          : true,
    infinite      : true,
    speed         : 1000
  });

  // Home page
  if ($('#career_site_home_page').length > 0) {
    // Employeee Stories carousel
    $('.employee-stories__list').slick({
      asNavFor        : '.employee-stories__profile-list',
      arrows          : false,
      fade            : true,
      initialSlide    : 2,
      slidesToScroll  : 1,
      slidesToShow    : 1
    });
    $('.employee-stories__profile-list').slick({
      asNavFor        : '.employee-stories__list',
      centerMode      : false,
      dots            : false,
      focusOnSelect   : true,
      initialSlide    : 2,
      slidesToScroll  : 1,
      slidesToShow    : 5
    });
  }

  // Job Search page
  $(document).on("click", ".facet-filter-results-button--mobile", function(e){
    $('.facet-section-inner, .facet-filter-results-button--mobile .facet-section__clear-all').toggleClass('hide');
  });

  // Job Details page
  if ( $('.job-details').length != 0 ) {
    // Apply buttons
    $('#apply--bottom').click(function() {
      $('#apply--top a')[0].click();
    });

    // Remove all empty DIVs
    $('.job-details__content-description div, .job-details__content-description p').each(function() {
      if ( $.trim($(this).text()).length == 0 ) {
        $(this).remove();
      }
    });
  }

});

$(window).load(function() {
  $('body').addClass('scroll');
  $('.preloader').fadeOut();
  $('#page-container').addClass('fadeIn');

  $('#header-menu ul li a.active').addClass('on');

  $(window).resize(function() {
    // Banner section
    if ($(window).width() >= 1024) {
      setHeight('.banner__search-item');
    }

    // Logos
    if ($('.logos').length > 0) {
      setHeight('.logos__image');
      setHeight('.logos__column');
    }
  }).resize();
});