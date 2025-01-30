import { isValidSemver } from '$lib';
import { uploadModule, getModuleDownloadUrl } from '$lib/server/services/module';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const namespace = params.namespace ?? '';
	const name = params.name ?? '';
	let version = params.version ?? '';

	if (!isValidSemver(version)) {
		return new Response(
			JSON.stringify({
				error: 'Invalid version'
			}),
			{ status: 400 }
		);
	}

	// strip the v
	version = version.replace(/^v/, '');

	const result = await getModuleDownloadUrl(namespace, name, version);

	if ('error' in result) {
		return new Response(JSON.stringify({ error: result.error }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	return new Response(
		JSON.stringify({
			downloadUrl: result.url
		}),
		{
			headers: {
				'Content-Type': 'application/json',
				'X-Terraform-Get': result.url
			}
		}
	);
};

export const POST: RequestHandler = async ({ request, params }) => {
	const namespace = params.namespace;
	const name = params.name;
	let version = params.version;

	if (!namespace || !name || !version) {
		return new Response(
			JSON.stringify({
				error: 'Invalid request - must include a namespace, name, and version'
			}),
			{ status: 400 }
		);
	}

	if (!isValidSemver(version)) {
		return new Response(
			JSON.stringify({
				error: 'Invalid version'
			}),
			{ status: 400 }
		);
	}

	// strip the v
	version = version.replace(/^v/, '');

	const contentType = request.headers.get('content-type');
	if (!request.body || !contentType?.includes('application/gzip')) {
		return new Response(
			JSON.stringify({
				error: 'Invalid request - must include a .tgz file'
			}),
			{ status: 400 }
		);
	}

	const fileBuffer = await request.arrayBuffer();
	const file = new File([fileBuffer], `${name}-${version}.tgz`, { type: 'application/gzip' });

	const response = await uploadModule(namespace, name, version, file);

	if ('error' in response) {
		return new Response(
			JSON.stringify({
				error: response.error
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	return new Response(
		JSON.stringify({
			namespace,
			name,
			version,
			etag: response.ETag
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
