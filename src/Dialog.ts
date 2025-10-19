import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import type SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import type {CellClickedEvent} from 'ag-grid-community';

export abstract class Dialog {
	protected dialog!: SlDialog | null;

	protected constructor (selector: string) {
		this.dialog = document.querySelector(selector);
		if (this.dialog === null) {
			console.warn('Missing dialog element');
		}
	}

	protected abstract setContent (content: unknown): void;

	show (e: CellClickedEvent) {
		if (this.dialog) {
			this.setContent(e.data);
			this.dialog.show().then();
		}
	}
}
