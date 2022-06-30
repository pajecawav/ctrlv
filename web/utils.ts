import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

export function cn(...values: any[]): string {
	return values.filter(Boolean).join(" ");
}

export function formatCreatedDate(date: number | string | dayjs.Dayjs) {
	date = dayjs(date);
	const now = dayjs();
	const format = date.isSame(now, "year") ? "D MMM" : "D MMM, YYYY";
	return date.format(format);
}

export function formatRelativeTime(date: number | string | dayjs.Dayjs) {
	date = dayjs(date);
	return date.fromNow();
}
