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
    var remainingMinutes; 




    //close popup then repeat after timer interval 
    gj(".uiIconClose").click(function() {
    gj("#blockPopUp").hide();
    clearInterval(timerReminder);
    timerReminder = setInterval(FetchData, INTERVAL_DISPLAY_POPUP * 1000);
    });


    gj("#reminderOK").click(function() {
       gj("#blockPopUp").hide();
       clearInterval(timerReminder);
       timerReminder = setInterval(FetchData, INTERVAL_DISPLAY_POPUP * 1000);
       var valueInput= "reminder--"+gj("#reminderContent input" ).val();  
       if (gj('input#reminderDismiss').is(':checked')) {
        isPopUpActivate = true;
        gj.cookie(valueInput, false);
        }
        else{
        isPopUpActivate = true;
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
            gj("#blockPopUp").hide();
            },
		       	success : function(data) {                 
                gj.each(data, function(index, element) 
                  {
                  if (element.description)
                    {
                      //update INTERVAL
                      //INTERVAL_DISPLAY_POPUP = element.repeatIntervalMinute * 60;
                      var d = new Date();
                      var currentTime = d.getTime(); 
                      var inputHidden ="<input type='hidden' value="+element.fromDate.time+" id="+element.fromDate.time+" />";
                      remainingMinutes = Math.round((element.fromDate.time - currentTime)/(60*1000));
                      var reminderDescription = splitData(element.description );
                      isDescriptionExist = true;
                      storeCookies(reminderDescription, element.fromDate.time ,remainingMinutes, isDescriptionExist, inputHidden );
                    }
                  }
                );
		       	}
		      });




        }
      }



    timerReminder = setInterval(FetchData, INTERVAL_DISPLAY_POPUP * 1000);

  //split data JSON, get only Description, add remaining time minute
  function splitData(data)
    {
      var res1 = data.split("Description:");
      var res = res1[1].split("<br>")[0];
    return res;
    }
  }


    //search on cookie, if reminder--time is true, display the popup
    function storeCookies(reminderDescription, time, remainingMinutes, isDescriptionExist, inputHidden )
      {
        //if cookie is true, display the popup with correct description, otherwise don't
        if (typeof gj.cookie("reminder--"+time) === 'undefined') {
                gj.cookie("reminder--"+time, true);
        }  
        else{

                if (gj.cookie("reminder--"+time) == 'true'){
                console.log("DISPLAY popupW "+"reminder--"+time + ">>"+ gj.cookie("reminder--"+time) );

                if(remainingMinutes > 0 && isDescriptionExist )
                    {
                     console.log(remainingMinutes +"---"+ !gj('input#reminderDismiss').is(':checked') +"--"+ isDescriptionExist );
                     gj("#reminderContent").html(""+htmlForTextWithEmbeddedNewlines(reminderDescription,remainingMinutes) + inputHidden);
                     gj('input#reminderDismiss').prop('checked', false);
                     gj("#blockPopUp").show();
                    }
                }
                else{
                    console.log(remainingMinutes +"---"+ !gj('input#reminderDismiss').is(':checked') +"--"+ isDescriptionExist );
                    console.log("DON'T DISPLAYTRUW "+"reminder--"+time +">>"+ gj.cookie("reminder--"+time) );
                }           
        }

      }

function htmlForTextWithEmbeddedNewlines(text, remainingMinutes) {
    var htmls = [];
    var lines = text.split(/\n/);
    var tmpDiv = gj(document.createElement('div'));
    for (var i = 0 ; i < lines.length ; i++) {
        var text = tmpDiv.text(lines[i]).html();
      if (text.indexOf("%remaining_time%")){
        text = text.replace("%remaining_time%", "<p style='margin-right: 5em; margin-top: 1em;' class='center'><span class='minutes'>"+remainingMinutes+"</span> minutes</p>"); 
      }
        htmls.push(text);
    }
    return htmls.join("<br>");
}

  return reminderObj;
})(gj);
