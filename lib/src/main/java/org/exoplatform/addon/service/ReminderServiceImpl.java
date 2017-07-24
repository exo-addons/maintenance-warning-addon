package org.exoplatform.addon.service;

import java.util.List;

import org.exoplatform.calendar.service.Calendar;
import org.exoplatform.calendar.service.CalendarService;
import org.exoplatform.calendar.service.GroupCalendarData;
import org.exoplatform.container.PortalContainer;
import org.exoplatform.services.log.ExoLogger;
import org.picocontainer.Startable;
import org.exoplatform.services.log.Log;

public class ReminderServiceImpl implements Startable {
	private static final Log log = ExoLogger
			.getLogger(ReminderServiceImpl.class);
	private Boolean isExistGroupMaintenance = false;
	public static String nameCalendarMaintenance = "Tribe Maintenance";

	public ReminderServiceImpl() {
	}

	@Override
	public void start() {
		log.info("initializing " + nameCalendarMaintenance + " group calendar");
		String username = "root";
		Calendar cal = new Calendar();

		CalendarService calendarService = (CalendarService) PortalContainer
				.getInstance().getComponentInstance(CalendarService.class);
		List<GroupCalendarData> groupCalendarDataList;
		try {
			groupCalendarDataList = calendarService.getGroupCalendars(
					new String[] { "/platform/users" }, true, username);
			// search if name Calendar Maintenance exist in all groups calendar
			for (GroupCalendarData groupCalendar : groupCalendarDataList) {
				for (Calendar calen : groupCalendar.getCalendars()) {
					if (calen.getName().equals(nameCalendarMaintenance)) {
						isExistGroupMaintenance = true;
					}
				}
			}

			/**
			 * if no group maintenance, initialize Calendar Tribe Maintenance
			 */
			if (!isExistGroupMaintenance) {
				log.info("Create group calendar: " + nameCalendarMaintenance);
				initializeCalendarMaintenance(calendarService, cal,
						nameCalendarMaintenance);
			} else {
				log.info("Exist already group calendar: "
						+ nameCalendarMaintenance);
			}
		} catch (Exception e) {
			log.error(e);
		}

	}

	@Override
	public void stop() {
		// nothing
	}

	/**
	 * initialize Maintenance with view permission for all users, edit
	 * permission for admins
	 * 
	 * @param calendarService
	 * @param calTempo
	 * @param nameCalendarMaintenance
	 * @throws Exception
	 */
	private void initializeCalendarMaintenance(CalendarService calendarService,
			Calendar calTempo, String nameCalendarMaintenance) throws Exception {
		calTempo.setName(nameCalendarMaintenance);
		calTempo.setDescription("Tribe Maintenance Event");
		calTempo.setPublic(true);
		calTempo.setGroups(new String[] { "/platform/users" });
		calTempo.setViewPermission(new String[] { "/platform/users/:*.*" });
		calTempo.setEditPermission(new String[] { "/platform/administrators/:*.*" });
		calendarService.savePublicCalendar(calTempo, true);
	}

}
