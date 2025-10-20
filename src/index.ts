import {
	AllCommunityModule,
	ModuleRegistry,
	createGrid,
	type GridOptions,
	type ValueFormatterFunc,
	type ValueFormatterParams,
} from 'ag-grid-community';
import {DialogDetails} from './DialogDetails.js';
import {Neuron} from './Neuron.js';


(function () {
	const FORMAT_CURRENCY = new Intl.NumberFormat(
		'en-US',
		{
			style: 'currency',
			currency: 'USD',
		}
	);

	const FORMAT_PERCENT = new Intl.NumberFormat(
		'en-US',
		{
			style: 'percent',
			minimumSignificantDigits: 3,
			maximumSignificantDigits: 5,
		}
	);

	const formatterPercent: ValueFormatterFunc = (params: ValueFormatterParams) => {
		if (params.value === 0) {
			return '-';
		}

		return FORMAT_PERCENT.format(params.value / 100);
	}
	const formatterRate: ValueFormatterFunc = (params: ValueFormatterParams) => FORMAT_CURRENCY.format(params.value);

	const dialogDetails = new DialogDetails('sl-dialog[data-details]');

	function init () {
		ModuleRegistry.registerModules([AllCommunityModule]);

		// reusable, custom column types
		const columnTypes: GridOptions['columnTypes'] = {
			percent: {
				valueFormatter: formatterPercent,
			},
			rate: {
				valueFormatter: formatterRate,
			},
		};

		const gridOptions: GridOptions = {
			autoSizeStrategy: {
				type: 'fitCellContents',
			},
			columnTypes,
			pagination: true,
			paginationPageSize: 50,
			paginationPageSizeSelector: [25, 50, 100, 250],
			rowData: [],

			/*
			 * "constant" fields in this data:
			 *  - code
			 *  - code_type
			 *  - negotiation_type
			 *  - network_name
			 *  - payer_name
			 */

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
					headerName: 'NPI Region',
					field: 'npi_region',
				},
				{
					headerName: 'Billing Class',
					field: 'billing_class',
				},
			],
		};

		const myGridElement = document.querySelector('#myGrid');
		if (myGridElement) {
			const gridApi = createGrid(myGridElement as HTMLElement, gridOptions as any);
			new Neuron(gridApi);

			// initially sort by name then rate
			gridApi.applyColumnState({
				state: [
					{ colId: 'entity_name', sort: 'asc', sortIndex: 0 },
					{ colId: 'rate', sort: 'asc', sortIndex: 1 },
				],
			});
		} else {
			throw new Error('Missing grid element');
		}
	}

	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		init();
	} else {
		document.addEventListener('DOMContentLoaded', init);
	}
})();
