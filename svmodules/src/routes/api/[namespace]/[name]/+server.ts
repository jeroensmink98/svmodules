import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const namespace = params.namespace;
	const name = params.name;

	return new Response(
		JSON.stringify({
			namespace,
			name
		})
	);
};
