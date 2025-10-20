import {AgCharts} from 'ag-charts-community';
import type {AgChartInstance, AgChartOptions} from 'ag-charts-community';

export abstract class Chart {
	protected chart!: AgChartInstance;
	protected chartOptions!: AgChartOptions;

	protected constructor (selector: string, subclassOptions?: AgChartOptions) {
		const container: HTMLElement | null = document.querySelector(selector);
		if (!container) {
			throw new Error('Missing chart container');
		}

		this.chartOptions = {
			container,
			...subclassOptions,
		};

		this.chart = AgCharts.create(this.chartOptions);
	}
}
