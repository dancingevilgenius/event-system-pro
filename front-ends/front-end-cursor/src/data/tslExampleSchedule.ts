/**
 * Example schedule from https://www.thesaberlegion.org/schedule.html
 * TSL X – 10th Annual Tournament (Minneapolis, Minnesota).
 *
 * Line format:
 *   YYYY-MM-DD | h:mm AM/PM - h:mm AM/PM | Title | resourceId | Description
 *   YYYY-MM-DD | all-day | Title | resourceId | Description
 *
 * resourceId values: hampton-inn | ymca-gaviidae | main-cinema | state-theatre
 */
export const TSL_EXAMPLE_SCHEDULE = `
2026-07-29 | 8:00 PM - 10:00 PM | Charter Rep Dinner / Reception | hampton-inn | Arrival Day / Charter Rep Reception — Hampton Inn & Suites Minneapolis/Downtown
2026-07-30 | 9:00 AM - 10:00 AM | Setup Space Opens | ymca-gaviidae | Absolutely NO gear inspection yet
2026-07-30 | 10:00 AM - 12:00 PM | Gear Inspection | ymca-gaviidae | Membership optional picture yearly subscription
2026-07-30 | 12:30 PM - 2:00 PM | Lunch Break | ymca-gaviidae | Registration + Standard Day One
2026-07-30 | 2:00 PM - 2:30 PM | Opening Ceremonies | ymca-gaviidae |
2026-07-30 | 2:30 PM - 3:00 PM | How to Line Judge Review | ymca-gaviidae |
2026-07-30 | 3:00 PM - 4:00 PM | Standard Day One — Groups A, B, C | ymca-gaviidae | 12 Fighters · Rotational Judging
2026-07-30 | 4:00 PM - 5:00 PM | Standard Day One — Groups D, E, F | ymca-gaviidae | 12 Fighters · Rotational Judging
2026-07-30 | 5:00 PM - 6:00 PM | Standard Day One — Groups G, H, I | ymca-gaviidae | 12 Fighters · Rotational Judging
2026-07-30 | 6:00 PM - 6:30 PM | End of Day / Everyone Out | ymca-gaviidae | Everyone out by 6:30 PM
2026-07-30 | 6:30 PM - 7:00 PM | Documentary Premiere — Doors Open | main-cinema | Main Cinema
2026-07-30 | 7:00 PM - 9:00 PM | Documentary Premiere | main-cinema | Mandatory premiere time
2026-07-31 | 8:00 AM - 8:30 AM | Gear Inspection (By Appointment) | ymca-gaviidae | Everything Else Day
2026-07-31 | 8:30 AM - 10:30 AM | 50+ Masters Tournament | ymca-gaviidae | 2 Directors & Honor Calls · Double Elimination
2026-07-31 | 9:00 AM - 10:30 AM | Women's Division Tournament | ymca-gaviidae | 2 Directors & Honor Calls · Double Elimination
2026-07-31 | 10:30 AM - 12:00 PM | Unity Tournament | ymca-gaviidae |
2026-07-31 | 12:30 PM - 2:00 PM | Lunch Break | ymca-gaviidae |
2026-07-31 | 2:00 PM - 3:00 PM | Exotic Weapons — Groups A, B, C | ymca-gaviidae | 12 Fighters · Rotational Judging
2026-07-31 | 3:00 PM - 4:00 PM | Exotic Weapons — Groups D, E, F | ymca-gaviidae | 12 Fighters · Rotational Judging
2026-07-31 | 4:00 PM - 5:00 PM | Exotic Weapons — Groups G, H, I | ymca-gaviidae | 12 Fighters · Rotational Judging
2026-07-31 | 5:00 PM - 6:00 PM | Exotic Weapons — Groups J, K, L | ymca-gaviidae | 12 Fighters · Rotational Judging
2026-07-31 | 6:00 PM - 7:30 PM | Exotics Single Elimination | ymca-gaviidae |
2026-07-31 | 8:00 PM - 10:00 PM | Charter / Small Group Dinners | hampton-inn |
2026-08-01 | 8:30 AM - 9:30 AM | Standard Day Two — Groups A, B, C | ymca-gaviidae | 12 Fighters · Rotational Judging
2026-08-01 | 9:30 AM - 10:30 AM | Standard Day Two — Groups D, E, F | ymca-gaviidae | 12 Fighters · Rotational Judging
2026-08-01 | 10:30 AM - 11:30 AM | Standard Day Two — Groups G, H, I | ymca-gaviidae | 12 Fighters · Rotational Judging
2026-08-01 | 11:30 AM - 12:30 PM | Standard Day Two — Groups J, K, L | ymca-gaviidae | 12 Fighters · Rotational Judging
2026-08-01 | 12:30 PM - 2:00 PM | Lunch Break | ymca-gaviidae |
2026-08-01 | 2:00 PM - 4:30 PM | Standard Primary Single Elimination | ymca-gaviidae | Finals
2026-08-01 | 4:30 PM - 6:00 PM | Standard Redemption Single Elimination | ymca-gaviidae | Finals
2026-08-01 | 6:00 PM - 6:30 PM | End of Day / Everyone Out | ymca-gaviidae | Everyone out by 6:30 PM
2026-08-01 | 8:00 PM - 11:00 PM | TSL Saber Prom | state-theatre | State Theatre
2026-08-02 | 10:30 AM - 11:30 AM | Tag Team Rotational — Groups A, B, C | ymca-gaviidae | Community Day
2026-08-02 | 11:30 AM - 12:00 PM | Rotate Break | ymca-gaviidae |
2026-08-02 | 12:00 PM - 1:00 PM | Tag Team Rotational — Groups D, E, F | ymca-gaviidae |
2026-08-02 | 1:00 PM - 2:00 PM | Tag Team Single Elimination | ymca-gaviidae |
2026-08-02 | 2:00 PM - 6:00 PM | Patch-A-Palooza & Saber Games | ymca-gaviidae | All YMCA classes today are ours · Bag storage until 6 PM
2026-08-02 | 6:00 PM - 6:30 PM | Everyone Out | ymca-gaviidae | Everyone out by 6:30 PM
`.trim();

export const TSL_SCHEDULE_RESOURCES = [
  { id: 'hampton-inn', title: 'Hampton Inn Downtown', eventColor: 'indigo' as const },
  { id: 'ymca-gaviidae', title: 'YMCA at Gaviidae', eventColor: 'teal' as const },
  { id: 'main-cinema', title: 'Main Cinema', eventColor: 'purple' as const },
  { id: 'state-theatre', title: 'State Theatre', eventColor: 'orange' as const },
];
