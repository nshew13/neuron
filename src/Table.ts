import {
	type GridOptions,
	type ValueFormatterFunc,
	type ValueFormatterParams,
} from 'ag-grid-community';
import {Format} from './Format.js';

export abstract class Table {
	public readonly formatterPercent: ValueFormatterFunc = (params: ValueFormatterParams) => {
		if (params.value === 0) {
			return '-';
		}

		return Format.PERCENT.format(params.value / 100);
	};

	public readonly formatterRate: ValueFormatterFunc = (params: ValueFormatterParams) => Format.CURRENCY.format(params.value);

	// reusable, custom column types
	protected columnTypes: GridOptions['columnTypes'] = {
		percent: {
			valueFormatter: this.formatterPercent,
		},
		rate: {
			valueFormatter: this.formatterRate,
		},
	};

	protected gridOptions!: GridOptions;

	protected constructor (subclassOptions?: GridOptions) {
		this.gridOptions = {
			autoSizeStrategy: {
				type: 'fitCellContents',
			},
			columnTypes: this.columnTypes,
			pagination: true,
			paginationPageSize: 50,
			paginationPageSizeSelector: [25, 50, 100, 250],
			rowData: [],
			...subclassOptions,
		};
	}
}
