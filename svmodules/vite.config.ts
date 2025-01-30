import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import type { Connect, ViteDevServer } from 'vite';
import type { ServerResponse } from 'http';

const myPlugin = {
	name: 'log-request-middleware',
	configureServer(server: ViteDevServer) {
		server.middlewares.use(
			(req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
				console.log(`[${new Date().toISOString()}] Request:
				URL: ${req.url}
				Method: ${req.method}
				User-Agent: ${req.headers['user-agent']}
				IP: ${req.socket.remoteAddress}	
				`);
				next();
			}
		);
	}
};

export default defineConfig({
	plugins: [sveltekit(), myPlugin],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
