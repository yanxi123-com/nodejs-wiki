requirejs.config({
    shim: {
        underscore: {
            exports: '_'
        },
        calbox: {
            deps: ['dateboxcore'],
        },
        dateFormat: {
            deps: ['jquery'],
        }
    },
    paths: {
        json2: "http://lib.sinaapp.com/js/json2/json2",
        jquery: "http://libs.baidu.com/jquery/2.0.0/jquery.min",
        jqm: "http://libs.baidu.com/jquerymobile/1.3.0/jquery.mobile-1.3.0.min",
        underscore: "http://libs.baidu.com/underscore/1.3.3/underscore-min",
        dateboxcore: "http://qiri.com/javascripts/lib/jqm-datebox.core",
        calbox: "http://dev.jtsage.com/cdn/datebox/latest/jqm-datebox.mode.calbox.min",
        dateFormat: "http://qiri.com/javascripts/lib/jquery.dateFormat-1.0"
    }
});

requirejs(['jquery', "dateFormat"], function($) {
    var initAll = function() {
      var events = {
          "2013-06-02": ["8:00 launch", "9:00 abcdedd"],
          "2013-06-11": ["launch", "abcdedd"],
          "2013-06-13": ["yoga"],
          "2013-06-18": ["happy", "dfafd", "dfasfd"]
      };
      
      var showEvents = function(date){
        $('#events').html("");
        $.each(events[date] || [], function(i, value) {
            $('#events').append("<li>" + value + "</li>");
        });
      }

      showEvents($.format.date(new Date(), "yyyy-MM-dd"));
      $(document).bind('datebox', function (e, passed) {
        if (passed.method === 'set') {
          showEvents(passed.value);
        }
      });
    };
    $( document ).on( "pagecreate", initAll);
    requirejs(["jqm","dateboxcore", "calbox"], function() {
    });
});
