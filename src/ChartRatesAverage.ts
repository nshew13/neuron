import {ChartRates, type IRegionSchedule, type TRegionScheduleMap} from './ChartRates.js';
import {Format} from './Format.js';
import type {IRateRecord} from './types/IRateRecord.js';
import type {AgCartesianChartOptions} from 'ag-charts-community';

export class ChartRatesAverage extends ChartRates {
	constructor (selector: string, data: IRateRecord[]) {
		const dataByRegionSchedule: TRegionScheduleMap = new Map();

		// TODO: centralize this in intermediate ChartRates class
		data.forEach(data => {
			const formattedSchedule = Format.formatSchedule(data.baseline_schedule);

			// let's drop the `null` schedules for a prettier chart
			if (formattedSchedule === Format.VALUE_NOT_FOUND) {
				return;
			}

			const regionSchedule: IRegionSchedule['regionSchedule'] = [data.npi_region, formattedSchedule];
			const regionScheduleString = regionSchedule.join(ChartRates.SEP_REGION_SCHEDULE);
			const entry = dataByRegionSchedule.get(regionScheduleString);

			if (typeof entry !== 'undefined') {
				entry.values.push(data.baseline_rate);
				// N.B.: Array/Set refs makes it unnecessary to re-set
				// dataByRegionSchedule.set(regionSchedule, entry);
			} else {
				dataByRegionSchedule.set(regionScheduleString, {
					values: [data.baseline_rate],
					region: data.npi_region,
					schedule: formattedSchedule,
					regionSchedule,
				});
			}
		});

		const averageBaselineByRegionSchedule = ChartRates.calculateAverage(dataByRegionSchedule);
		const sortedAverageBaselineByRegionSchedule = ChartRates.sortByRegionSchedule(averageBaselineByRegionSchedule);

		const options: AgCartesianChartOptions = {
			...ChartRates.OPTIONS_BASE,
			data: sortedAverageBaselineByRegionSchedule,
			axes: [
				{
					position: 'bottom',
					type: 'grouped-category',
					title: {
						text: 'NPI Region/Schedule',
					},
					depthOptions: [
						{},
						{ label: { fontWeight: "bold" } },
					],
				},
				{
					position: 'left',
					type: 'number',
					title: {
						text: '% Avg Rate',
					},
					label: {
						formatter: (data) => Format.CURRENCY.format(data.value),
					},
				},
			],
		};

		super(selector, options);
	}
}
