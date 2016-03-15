// Progress Bar
$(document).ready(function(){
  // Initialize
  this.celeryStats = this.celeryStats || {};

  var GOAL = 10000;
  var USER_ID = 'YOUR_USER_ID';
  var COLLECTION_ID = 'YOUR_COLLECTION_ID';
  var url = 'https://api.trycelery.com/v2/reports/campaign?user_id=' +
    USER_ID +
    '&collection_id=' +
    COLLECTION_ID;

  // Fetch campaign stats from Celery
  var fetchCeleryStats = function() {
    $.ajax({
      type: 'GET',
      url: url,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      context: this
    }).done(function(data, textStatus, jqXHR) {
      var data = data.data;

      this.celeryStats = {
        orders: data.orders,
        units: data.units,
        sales: data.sales
      };

      $('#bar').goalProgress({
        goalAmount: GOAL / 100,
        currentAmount: data.sales / 100,
        backers: data.orders,
        textBefore: '',
        textAfter: ' backers'
      });

    }).fail(function(jqXHR, textStatus, errorThrown) {
      // Poll Celery API again to fetch stats if failed
      fetchCeleryStats();
    });
  };

  // Execute
  fetchCeleryStats();
});

!function($){
  $.fn.extend({
    goalProgress: function(options) {
      var defaults = {
        goalAmount: 100,
        currentAmount: 50,
        backers: 0,
        speed: 0,
        textBefore: '',
        textAfter: '',
        milestoneNumber: 70,
        milestoneClass: 'almost-full',
        callback: function() {}
      }

      var options = $.extend(defaults, options);
      return this.each(function(){
        var obj = $(this);

        // Collect and sanitize user input
        var goalAmountParsed = parseInt(defaults.goalAmount);
        var currentAmountParsed = parseInt(defaults.currentAmount);

        // Calculate size of the progress bar
        var percentage = Math.min((currentAmountParsed / goalAmountParsed) * 100, 100);
        var milestoneNumberClass = (percentage > defaults.milestoneNumber) ? ' ' + defaults.milestoneClass : ''

        // Generate the HTML
        var progressBar = '<div class="progressBar">' + defaults.textBefore + defaults.backers + defaults.textAfter + '</div>';
        var progressBarWrapped = '<div class="goalProgress' + milestoneNumberClass + '">' + progressBar + '</div>';

        // Append to the target
        obj.append(progressBarWrapped);

        // Ready
        var rendered = obj.find('div.progressBar');

        // Remove Spaces
        rendered.each(function() {
          $(this).html($(this).text().replace(/\s/g, ' '));
        });

        // Animate!
        rendered.animate({width: percentage +'%'}, defaults.speed, defaults.callback);

        if(typeof callback == 'function') {
          callback.call(this)
        }
      });
    }
  });
}(window.jQuery);
// ]]></script>