export class Format {
	private static readonly RE_SCHEDULE_FACILITY = /PFS_FACILITY_/;
	private static readonly RE_SCHEDULE_NONFACILITY = /PFS_NONFACILITY_/;

	static readonly VALUE_FACILITY = 'Facility';
	static readonly VALUE_NONFACILITY = 'Non-Facility';
	static readonly VALUE_NOT_FOUND = 'N/A';

	public static readonly CURRENCY = new Intl.NumberFormat(
		'en-US',
		{
			style: 'currency',
			currency: 'USD',
		}
	);

	public static readonly PERCENT = new Intl.NumberFormat(
		'en-US',
		{
			style: 'percent',
			// minimumSignificantDigits: 3,
			maximumSignificantDigits: 5,
		}
	);

	public static readonly formatSchedule = (input: string): string => {
		if (Format.RE_SCHEDULE_FACILITY.test(input)) {
			return Format.VALUE_FACILITY;
		} else if (Format.RE_SCHEDULE_NONFACILITY.test(input)) {
			return Format.VALUE_NONFACILITY;
		} else {
			return Format.VALUE_NOT_FOUND;
		}
	};
}
