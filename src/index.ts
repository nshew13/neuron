import {
	AllCommunityModule,
	ModuleRegistry,
	createGrid,
	themeBalham,
	type GridOptions,
	type ValueFormatterFunc,
	type ValueFormatterParams,
} from 'ag-grid-community';
import {Neuron} from './Neuron.js';


(function () {
	const FORMAT_CURRENCY = new Intl.NumberFormat(
		'en-US',
		{
			style: 'currency',
			currency: 'USD',
		}
	);

	const formatterRate: ValueFormatterFunc = (params: ValueFormatterParams) => FORMAT_CURRENCY.format(params.value);

	function init () {
		ModuleRegistry.registerModules([AllCommunityModule]);

		// reusable, custom column types
		const columnTypes: GridOptions['columnTypes'] = {
			rate: {
				valueFormatter: formatterRate,
			}
		};

		const gridOptions: GridOptions = {
			columnTypes,
			autoSizeStrategy: {
				type: 'fitCellContents',
			},
			pagination: true,
			paginationPageSize: 50,
			paginationPageSizeSelector: [25, 50, 100, 250],
			theme: themeBalham,
			rowData: [],
			columnDefs: [
				{
					headerName: 'Entity ID',
					field: 'matched_id',
				},
				{
					headerName: 'Entity Name',
					field: 'entity_name',
				},
				{
					headerName: 'Rate',
					field: 'rate',
					type: 'rate',
					cellClass: 'right-align',
				},
				{
					headerName: 'Payer Name',
					field: 'payer_name',
				},
				{
					headerName: 'Region',
					field: 'network_region',
				},
			],
		};

		const myGridElement = document.querySelector('#myGrid');
		if (myGridElement) {
			const gridApi = createGrid(myGridElement as HTMLElement, gridOptions as any);
			new Neuron(gridApi);

			// initially sort by ID then rate
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
