import secrets from '../secrets.json' with {type: 'json'};

export class NeuronAPI {
	private API_BASE = 'https://neuron.serifhealth.com/api/rates/v1?network_template_ids=07c56f6b-82cd-44a4-af42-d570b6ae89c6&limit=1000&codes=99203';
	private readonly API_KEY: string = '';

	/**
	 * calls API for given endpoint
	 *
	 * In a real scenario, this method would take additional parameters, including,
	 * for example, the endpoint to append to API_BASE. Alternatively, we may
	 * build out further layers of abstraction, depending on repeated use cases.
	 *
	 * @param method
	 * @returns {Promise<Response>}
	 */
	protected async callApi (method = 'GET'): Promise<Response> {
		if (!this.API_KEY) {
			throw new Error('Missing API key');
		}

		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('X-API-KEY', this.API_KEY);

		const response = await fetch(
			this.API_BASE,
			{
				method,
				headers,
			}
		);

		if (!response.ok) {
			throw new Error(`callApi status: ${response.status}`);
		}

		return response;
	};

	constructor () {
		this.API_KEY = (secrets?.API_KEY ?? '');
	}

	async loadData (): Promise<Record<string, unknown>> {
		const response = await this.callApi();
		if (!response.ok) {
			throw new Error(`loadJokes status: ${response.status}`);
		}

		return response.json();
	};
}
