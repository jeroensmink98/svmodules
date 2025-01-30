import { describe, it, expect } from 'vitest';
const namespace = 'acmecorp';

describe('get module', () => {
	it('should return a 200 status code for a valid version including a v prefix', async () => {
		const response = await fetch(`http://localhost:5173/api/${namespace}/resource_group/v1.0.0`);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.downloadUrl).toBeDefined();
	});

	it('should return a 200 status code for a valid version', async () => {
		const response = await fetch(`http://localhost:5173/api/${namespace}/resource_group/1.0.0`);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.downloadUrl).toBeDefined();
	});

	it('should return 404 for a non-existent module download', async () => {
		const response = await fetch(`http://localhost:5173/api/${namespace}/non-existent/1.0.0`);
		expect(response.status).toBe(404);
		const data = await response.json();
		expect(data.error).toBe('File does not exist');
	});
});
