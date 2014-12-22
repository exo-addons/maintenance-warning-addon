#!/bin/sh

echo "MVN CLEAN INSTALL"
echo "================="
mvn clean install

echo "Copy jar"
echo "================="
cp /home/annb/java/eXoProjects/repo/git/exoplatform/calendar-reminder/config/target/calendar-reminder-config-1.0.x-SNAPSHOT.jar /home/annb/Desktop/PLFNG-2810/platform-4.1.x-pkgpriv-stabilization-SNAPSHOT/lib/calendar-reminder-config-1.0.x-SNAPSHOT.jar


cp /home/annb/java/eXoProjects/repo/git/exoplatform/calendar-reminder/lib/target/calendar-reminder-lib-1.0.x-SNAPSHOT.jar /home/annb/Desktop/PLFNG-2810/platform-4.1.x-pkgpriv-stabilization-SNAPSHOT/lib/calendar-reminder-lib-1.0.x-SNAPSHOT.jar


echo "Copy war"
echo "================="
cp /home/annb/java/eXoProjects/repo/git/exoplatform/calendar-reminder/webapp/target/calendar-reminder-webapp.war /home/annb/Desktop/PLFNG-2810/platform-4.1.x-pkgpriv-stabilization-SNAPSHOT/webapps/calendar-reminder-webapp.war

echo "END"


