maintenance-warning-addon
=====================


Build
---------------
Simply build it with :

	mvn clean install


Deploy to eXo
---------------
After build with this add-on:
* Copy file maintenance-warning-addon/webapp/target/maintenance-warning-addon-webapp.war into Platform-Tomcat/webapps
* Copy file maintenance-warning-addon/lib/target/maintenance-warning-addon-lib-1.0.x-SNAPSHOT.jar and maintenance-warning-addon/config/target/maintenance-warning-addon-config-1.0.x-SNAPSHOT.jar into Platform-Tomcat/lib
* Start tomcat.
* Note: three files above are also available in maintenance-warning-addon/bundle/target/maintenance-warning-addon-bundle-1.0.x-SNAPSHOT.zip

Configuration
---------------

