import {Chart} from './Chart.js';
import {Format} from './Format.js';
import type {AgCartesianChartOptions} from 'ag-charts-community';
import type {IRateRecord} from './types/IRateRecord.js';

export interface IRegionSchedule {
	region: IRateRecord['npi_region'];
	regionSchedule: [IRateRecord['npi_region'], IRateRecord['baseline_schedule']];
	schedule: IRateRecord['baseline_schedule'];
	values: Array<number>;
}

export interface IRegionScheduleAverage extends IRegionSchedule {
	average: number;
}

export type TRegionScheduleMap = Map<string, IRegionSchedule>;


const collator = new Intl.Collator('en');

export class ChartRates extends Chart {
	protected static SEP_REGION_SCHEDULE = '/';

	protected static OPTIONS_BASE: AgCartesianChartOptions = {
		series: [
			{
				type: 'bar',
				xKey: 'regionSchedule',
				yKey: 'average',
				itemStyler: (params) => {
					return {
						fill: params.datum.schedule === Format.VALUE_FACILITY ? 'gold' : 'blue',
					};
				},
			},
		],
	};

	protected static calculateAverage = (list: TRegionScheduleMap): IRegionScheduleAverage[] => {
		const result: IRegionScheduleAverage[] = [];
		list.forEach(value => {
			const cumulativeValue = value.values.reduce((total, rate) => total + rate, 0);

			result.push({
				...value,
				average: cumulativeValue / value.values.length,
			});
		});

		return result;
	}

	protected static sortByRegionSchedule = (list: Array<IRegionSchedule>): Array<IRegionSchedule> => {
		// secondary sort
		let sortedList: Array<IRegionSchedule> = list.toSorted((a, b) => collator.compare(a.schedule, b.schedule));
		// primary sort
		sortedList.sort((a, b) => collator.compare(a.region, b.region));

		return sortedList;
	}


	constructor (selector: string, options: AgCartesianChartOptions) {
		super(selector, options);
	}
}
