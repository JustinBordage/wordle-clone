/** A pure function that truncates
 *  the time from a Date object. */
export function truncateTime(date: Date) {
	const newDate = new Date(date);

	newDate.setUTCHours(0);
	newDate.setUTCMinutes(0);
	newDate.setUTCSeconds(0);
	newDate.setUTCMilliseconds(0);

	return newDate;
}
