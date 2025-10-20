import {createGrid} from 'ag-grid-community';
import {Format} from './Format.js';
import {Table} from './Table.js';
import type {DialogDetails} from './DialogDetails.js';
import type {IRateRecord} from './types/IRateRecord.js';

export class TableRates extends Table {
	constructor (selector: string, data: IRateRecord[], dialogDetails: DialogDetails) {
		/*
		 * "constant" fields in this data:
		 *  - code
		 *  - code_type
		 *  - negotiation_type
		 *  - network_name
		 *  - payer_name
		 */
		super({
			columnDefs: [
				{
					headerName: 'Entity Name',
					field: 'entity_name',
					cellClass: 'clickable',
					onCellClicked: (e) => dialogDetails.show(e),
				},
				// {
				// 	field: 'mrf_rate',
				// 	type: 'rate',
				// 	cellClass: params => {
				// 		let classes = 'right-align';
				//
				// 		if (params.value !== (params.data as IRateRecord).rate) {
				// 			classes += ' warning';
				// 		}
				//
				// 		return classes;
				// 	}
				// },
				{
					headerName: 'Rate',
					field: 'rate',
					type: 'rate',
					cellClass: 'right-align',
				},
				{
					headerName: 'NPI Region',
					field: 'npi_region',
				},
				{
					headerName: 'Baseline Schedule',
					field: 'baseline_schedule',
					valueFormatter: (params) => Format.formatSchedule(params.value),
				},
				{
					headerName: 'Baseline',
					field: 'baseline_rate',
					type: 'rate',
					cellClass: 'right-align',
				},
				{
					headerName: '% Baseline',
					field: 'relative_to_baseline',
					type: 'percent',
					cellClass: 'right-align',
				},
				{
					headerName: 'Taxonomy',
					field: 'npi_taxonomy_name',
				},
				{
					headerName: 'Billing Class',
					field: 'billing_class',
				},
			],
			rowData: data,
		});

		const myGridElement = document.querySelector(selector);
		if (myGridElement) {
			const gridApi = createGrid(
				myGridElement as HTMLElement,
				this.gridOptions,
			);
			if (!gridApi) {
				throw new Error('Missing grid');
			}

			// initially sort by name then rate
			gridApi.applyColumnState({
				state: [
					{colId: 'entity_name', sort: 'asc', sortIndex: 0},
					{colId: 'rate', sort: 'asc', sortIndex: 1},
				],
			});
		} else {
			throw new Error('Missing grid element');
		}
	}
}
