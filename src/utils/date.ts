import { MS_PER_MINUTE } from "@/models/magic-numbers/time";

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

/** Gets tomorrow's date with the time truncated. */
export function tomorrow() {
	const date = truncateTime(new Date());
	date.setUTCDate(date.getUTCDate() + 1);
	return date;
}

/** Gets the current system time's offset
 *  to the UTC timezone in milliseconds. */
export function getUtcOffsetMs() {
	return new Date().getTimezoneOffset() * MS_PER_MINUTE;
}
