import {
	AllCommunityModule,
	ModuleRegistry,
} from 'ag-grid-community';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import {ChartRatesAverage} from './ChartRatesAverage.js';
import {ChartRatesBaseline} from './ChartRatesBaseline.js';
import {DialogDetails} from './DialogDetails.js';
import {NeuronAPI} from './NeuronAPI.js';
import {TableRates} from './TableRates.js';
import type {IRateRecord} from './types/IRateRecord.js';
import type SlButton from '@shoelace-style/shoelace/dist/components/button/button.js';
import type SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import type SlSpinner from '@shoelace-style/shoelace/dist/components/spinner/spinner.js';


(function () {
	const dialogDetails = new DialogDetails('sl-dialog[data-details]');

	function init () {
		ModuleRegistry.registerModules([AllCommunityModule]);

		const api = new NeuronAPI();
		api.loadData().then((data) => {
			// @ts-ignore not going to build a response interface right now
			const rateData = data?.['99203']?.rates as IRateRecord[] ?? [];

			new TableRates('#dataGrid', rateData, dialogDetails);
			new ChartRatesAverage('#chartRateAverage', rateData);
			new ChartRatesBaseline('#chartRateBaseline', rateData);

			const drawerRateAverage: SlDrawer | null = document.querySelector('sl-drawer[label~="Average"]');
			const buttonRateAverage: SlButton | null = document.querySelector('sl-button[data-target="chartRateAverage"]');
			if (drawerRateAverage && buttonRateAverage) {
				buttonRateAverage.addEventListener('click', () => drawerRateAverage.show());
			}

			const drawerRateBaseline: SlDrawer | null = document.querySelector('sl-drawer[label~="Baseline"]');
			const buttonRateBaseline: SlButton | null = document.querySelector('sl-button[data-target="chartRateBaseline"]');
			if (drawerRateBaseline && buttonRateBaseline) {
				buttonRateBaseline.addEventListener('click', () => drawerRateBaseline.show());
			}

			const spinner: SlSpinner | null = document.querySelector('sl-spinner');
			const loadedContent: NodeList | null = document.querySelectorAll('.hide-while-loading');
			if (spinner && loadedContent) {
				loadedContent.forEach(node => (node as HTMLElement).classList.remove('hide-while-loading'));
				spinner.remove();
			}
		});
	}

	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		init();
	} else {
		document.addEventListener('DOMContentLoaded', init);
	}
})();
