var showCalendarList = function(){
    var events = {
        "2013-06-01": ["8:00 launch", "9:00 abcdedd"],
        "2013-06-11": ["launch", "abcdedd"],
        "2013-06-13": ["yoga"],
        "2013-06-18": ["happy", "dfafd", "dfasfd"]
    };
    
    var showEvents = function(){
      
      $('#events-list').html("");
      var html = "";
      $.each(events, function(key, dayEvents) {
        html += "<li><p>" + key + "</p><ul>";
        $.each(dayEvents, function(i, value) {
            html += "<li>" + value + "</li>";
        });
        html += "</ul></li>";
      });
      $('#events-list').html(html);
    }

    showEvents();
};

$( document ).on( "pagecreate", showCalendarList);
