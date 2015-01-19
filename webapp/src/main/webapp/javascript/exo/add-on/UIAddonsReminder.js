// gj = $ 
(function(gj) {

    var reminderObj = {};
    var timerReminder;
    var func;

    reminderObj.init = function() {
        //default configuration values
        var portalENV = parent.eXo.env.portal;
        var configuration = {
            serverURL: top.location.host,
            spaceServicePath: "/" + ((portalENV.rest) ? portalENV.rest : "rest") + "/reminderservice/call",
            containerName: (portalENV.context).replace('/', ''),
            portalName: portalENV.portalName
        }

        // interval seconds 15*4*5 seconds
        var INTERVAL_DISPLAY_POPUP = 15 * 4 * 5;

        var isPopUpActivate = true;
        var isDescriptionExist = false;
        //http://localhost:8080/rest/reminderservice/call
        var callURL = "http://" + configuration.serverURL + configuration.spaceServicePath;

        var remainingMinutes;

        func = function FetchData() {
            if (isPopUpActivate) {
                gj.ajax({
                    type: "GET",
                    url: callURL,
                    dataType: 'json',
                    error: function() {
                        gj("#blockPopUp").hide();
                    },
                    success: function(data) {
                        gj("#block").html("");
                        gj.each(data, function(index, element) {
                            if (element.description) {
                                //update INTERVAL
                                INTERVAL_DISPLAY_POPUP = element.repeatIntervalMinute * 60;
                                var d = new Date();
                                var currentTime = d.getTime();
                                var inputHidden = "<input type='hidden' value=" + element.fromDate.time + " id=" + element.fromDate.time + " />";
                                remainingMinutes = Math.round((element.fromDate.time - currentTime) / (60 * 1000));
                                var reminderDescription = splitData(element.description);
                                isDescriptionExist = true;
                                storeCookies(reminderDescription, element.fromDate.time, remainingMinutes, isDescriptionExist, inputHidden, timerReminder, INTERVAL_DISPLAY_POPUP, func);
                            }
                        });
                    }
                });
            }
        }

        timerReminder = setInterval(func, INTERVAL_DISPLAY_POPUP * 1000);

        //split data JSON, get only Description, add remaining time minute
        function splitData(data) {
            var res1 = data.split("Description:");
            var res = res1[1].split("<br>")[0];
            return res;
        }
    }

    //search on cookie, if reminder--time is true, display the popup
    function storeCookies(reminderDescription, time, remainingMinutes, isDescriptionExist, inputHidden, timerReminder, INTERVAL_DISPLAY_POPUP, func) {
        //if cookie is true, display the popup with correct description, otherwise don't
        if (typeof gj.cookie("reminder--" + time) === 'undefined') {
            gj.cookie("reminder--" + time, true);
        } else {

            if (gj.cookie("reminder--" + time) == 'true') {
                if (remainingMinutes > 0 && isDescriptionExist) {
                    clearInterval(timerReminder);
                    var id = "reminderContent-" + time;
                    var text = "" + htmlForTextWithEmbeddedNewlines(reminderDescription, remainingMinutes) + inputHidden;
                    var strVar = "";

                    strVar += "<div id='" + id + "' style=\"width: 100%; height: 100%; display: none; position: fixed; background: none repeat scroll 0px 0px rgba(0, 0, 0, 0.3); top: 0px; left: 0px; z-index: 9991;\" class=\"mark-layer\">";
                    strVar += "<div class=\"UIPopupWindow uiPopup UIDragObject NormalStyle\" id=\"reminderPopUp\" style=\"display: block;\">			";
                    strVar += "		<div class=\"popupHeaderReminder clearfix\" >";
                    strVar += "			<a class=\"uiIconClose pull-right\" id=\"reminderClose" + time + "\" title=\"Close Window\" onclick=\"\"><\/a>		";
                    strVar += "		<\/div>";
                    strVar += "		<div class=\"uiContentBox\">";
                    strVar += "			<div class=\"media\">	";
                    strVar += "			<img src=\"\/maintenance-warning-addon-webapp\/img\/coffee.png\" class=\"pull-left\">";
                    strVar += "			<div class=\"media-body\">";
                    strVar += "			<img src=\"\/maintenance-warning-addon-webapp\/img\/itstime.png\">	";
                    strVar += "				<div id=\"reminderContent\" class=\"reminderContent\">";
                    strVar += text;
                    strVar += "				<\/div>	";
                    strVar += "				<p>";
                    strVar += "					<span class=\"uiCheckbox\"><input type=\"checkbox\" id=\"reminderDismiss" + time + "\" value=\"" + time + "\" class=\"checkbox\"><span>Do not display again<\/span><\/span>";
                    strVar += "				<\/p>";
                    strVar += "				<\/div>";
                    strVar += "			<\/div>";
                    strVar += "		<\/div>						";
                    strVar += "		";
                    strVar += "		<div class=\"uiAction uiActionBorderOK\">      ";
                    strVar += "		   <button class=\"btn\" type=\"button\" onclick=\"\" id=\"reminderOK" + time + "\">OK<\/button>       		";
                    strVar += "		<\/div>				";
                    strVar += "	<\/div>";
                    strVar += "<\/div>";

                    var idS = "#" + id;
                    gj("#block").append(strVar);
                    createScript(time, timerReminder, INTERVAL_DISPLAY_POPUP, func);
                    gj(idS).show();

                }
            } else {

                //        console.log(remainingMinutes +"---"+ !gj('input#reminderDismiss').is(':checked') +"--"+ isDescriptionExist );
                //         console.log("DON'T DISPLAYTRUW "+"reminder--"+time +">>"+ gj.cookie("reminder--"+time) );
            }
        }
    }

    function createScript(time, timerReminder, INTERVAL_DISPLAY_POPUP, func) {
        var idOK = "#reminderOK" + time;
        var idClose = "#reminderClose" + time;
        var idPopUp = "#reminderContent-" + time;
        clearInterval(timerReminder);
        gj(idOK).click(function() {

            var valueInput = "#reminderDismiss" + time;
            var valueReminder = "reminder--" + time;
            if (gj(valueInput).is(':checked')) {
                isPopUpActivate = true;
                gj.cookie(valueReminder, false);
            } else {
                isPopUpActivate = true;
            }

            gj(idPopUp).hide();
            clearInterval(timerReminder);
            timerReminder = setInterval(func, INTERVAL_DISPLAY_POPUP * 1000);
        });

        //close popup then repeat after timer interval 
        gj(idClose).click(function() {
            gj(idPopUp).hide();
            clearInterval(timerReminder);
            timerReminder = setInterval(func, INTERVAL_DISPLAY_POPUP * 1000);
        });
    }

    function htmlForTextWithEmbeddedNewlines(text, remainingMinutes) {
        var htmls = [];
        var lines = text.split(/\n/);
        var tmpDiv = gj(document.createElement('div'));
        for (var i = 0; i < lines.length; i++) {
            var text = tmpDiv.text(lines[i]).html();
            if (text.indexOf("%remaining_time%")) {
                text = text.replace("%remaining_time%", "<p style='margin-right: 5em; margin-top: 1em;' class='center'><span class='minutes'>" + remainingMinutes + "</span> minutes</p>");
            }
            htmls.push(text);
        }
        return htmls.join("<br>");
    }

    return reminderObj;
})(gj);
