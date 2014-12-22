// gj = $ 
(function(gj) {

var reminderObj = {};

reminderObj.init = function(){
    //default configuration values
    var portalENV = parent.eXo.env.portal;
    var configuration = {
    serverURL: top.location.host,
    spaceServicePath: "/" + ((portalENV.rest) ? portalENV.rest : "rest") + "/reminderservice/call",
    containerName: (portalENV.context).replace('/', ''),
    portalName: portalENV.portalName
    }

    // interval seconds
    var INTERVAL_DISPLAY_POPUP = 15;
    var isPopUpActivate = true;
    var isDescriptionExist = false;
    //http://localhost:8080/rest/reminderservice/call
    var callURL = "http://"+configuration.serverURL + configuration.spaceServicePath;
    var timerReminder;


    //close popup then repeat after timer interval 
    gj(".uiIconClose").click(function() {
    gj("#reminderPopUp").hide();
    clearInterval(timerReminder);
    timerReminder = setInterval(FetchData, INTERVAL_DISPLAY_POPUP * 1000);
    });


    gj("#reminderOK").click(function() {
       gj("#reminderPopUp").hide();
       clearInterval(timerReminder);
        timerReminder = setInterval(FetchData, INTERVAL_DISPLAY_POPUP * 1000);
       if (gj('input#reminderDismiss').is(':checked')) {
        isPopUpActivate = false;
        }
    });

    function FetchData() 
      {
      if (isPopUpActivate)
        {
		      gj.ajax({ type: "GET",   
			      url: callURL,   
            dataType: 'json',
            error : function(){
            gj("#reminderPopUp").hide();
            },
		       	success : function(data) {                 
                gj.each(data, function(index, element) 
                  {
                  if (element.description)
                    {
                      var d = new Date();
                      var currentTime = d.getTime(); 
                      var remainingMinutes = Math.round((element.fromDate.time - currentTime)/(60*1000));
                      var reminderDescription = splitData(element.description, remainingMinutes);
                      gj("#reminderContent").html("" + reminderDescription);
                      isDescriptionExist = true;
                    }
                  }
                );
		       	}
		      });

          //if checkbox and description exist
          if (!gj('input#reminderDismiss').is(':checked') && isDescriptionExist) {gj("#reminderPopUp").show();}  
          else{ //gj("#reminderPopUp").hide();
          }        
        }
      }
    timerReminder = setInterval(FetchData, INTERVAL_DISPLAY_POPUP * 1000);

  //split data JSON, get only Description, add remaining time minute
  function splitData(data, remainingMinutes){
    var res1 = data.split("Description:");
    var res = res1[1].split("<br>")[0];
      if (data.indexOf("%remaining_time%")){
        res = res.replace("%remaining_time%", "<strong>"+remainingMinutes+"</strong>"); 
      }
  return res;
  }
  }

function htmlForTextWithEmbeddedNewlines(text) {
    var htmls = [];
    var lines = text.split(/\n/);
    // The temporary <div/> is to perform HTML entity encoding reliably.
    //
    // document.createElement() is *much* faster than jQuery('<div></div>')
    // http://stackoverflow.com/questions/268490/
    //
    // You don't need jQuery but then you need to struggle with browser
    // differences in innerText/textContent yourself
    var tmpDiv = gj(document.createElement('div'));
    for (var i = 0 ; i < lines.length ; i++) {
        htmls.push(tmpDiv.text(lines[i]).html());
    }
    return htmls.join("<br>");
}

  return reminderObj;
})(gj);
