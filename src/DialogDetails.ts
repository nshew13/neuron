import {Dialog} from './Dialog.js';
import type {IRateRecord} from './types/IRateRecord.js';

export class DialogDetails extends Dialog {
	constructor (selector: string) {
		super(selector);
	}

	protected setContent (details: IRateRecord) {
		const content = this.dialog?.querySelector('slot#content');
		if (content) {
			content.innerHTML = `${details.entity_name}
<ul>
  <li>ID: ${details.matched_id}</li>
  <li>address: ${details.entity_address}</li>
  <li>Network ID: ${details.network_id}</li>
  <li>Network name: ${details.network_name}</li>
</ul>`;
		}
	}
}
