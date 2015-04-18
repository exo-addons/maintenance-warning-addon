maintenance-warning-addon
=====================


Build
---------------
Simply build it with :

	mvn clean install


Deploy to eXo
---------------
By Add-on Manager:
$ ./addon install exo-maintenance-warning:1.0.0

Prerequisites for Installing Maintenance Warning Addon
---------------
1) Configure your local Time Zone correctly with Tomcat server

![check TimeZone](resource/ScreenShots/1_TimeZone.png)


2) A calendar group "Maintenance" is already installed you should add your event detail in this group. View only for all Platform users, modify for administrators.

![select Maintenance calendar](resource/ScreenShots/2_MaintenanceCalendar.png)

3) As an adminstrator, choose More Details then check "Display a notification pop-up" and "Repeat", then choose your preferences time. 

![check display Popup](resource/ScreenShots/3_DisplayPopup.png)

