import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
const namespace = 'acmecorp';

describe('{namespace}', () => {
	it('should return a 200 status code', async () => {
		const response = await fetch(`http://localhost:5173/api/${namespace}`);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.namespace).toBe(namespace);
	});
});

describe('{namespace}/{name}', () => {
	it('should return a 200 status code', async () => {
		const response = await fetch(`http://localhost:5173/api/${namespace}/resource_group`);
		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data.namespace).toBe(namespace);
		expect(data.name).toBe('resource_group');
	});
});

describe('{namespace}/{name}/{version}', () => {
	it('should return a 400 status code for an invalid version', async () => {
		const response = await fetch(`http://localhost:5173/api/${namespace}/resource_group/invalid`);
		expect(response.status).toBe(400);
	});

	it('should return a 400 status code for an invalid file type', async () => {
		const response = await fetch(`http://localhost:5173/api/${namespace}/resource_group/v1.0.0`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		expect(response.status).toBe(400);
	});

	it('should return a 400 for a wrong file type', async () => {
		const fakeContent = new Uint8Array([1, 2, 3, 4]);
		const tgzBlob = new Blob([fakeContent], { type: 'application/png' });
		const response = await fetch(`http://localhost:5173/api/${namespace}/resource_group/v1.0.0`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/png'
			},
			body: tgzBlob
		});
		expect(response.status).toBe(400);
	});

	it('should post a new version', async () => {
		const filePath = path.resolve(__dirname, '../test-fixtures/modules/resource_group.tgz');
		const file = readFileSync(filePath);

		const tgzBlob = new File([file], 'resource_group.tgz', { type: 'application/gzip' });

		const randomVersion = `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;

		const response = await fetch(
			`http://localhost:5173/api/${namespace}/resource_group/${randomVersion}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/gzip'
				},
				body: tgzBlob
			}
		);

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.namespace).toBe(namespace);
		expect(data.name).toBe('resource_group');
		expect(data.version).toBe(randomVersion);
	});

	it('should fail if a new version already exists', async () => {
		const filePath = path.resolve(__dirname, '../test-fixtures/modules/resource_group.tgz');
		const file = readFileSync(filePath);

		const tgzBlob = new File([file], 'resource_group.tgz', { type: 'application/gzip' });

		const response = await fetch(`http://localhost:5173/api/${namespace}/resource_group/1.0.0`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/gzip'
			},
			body: tgzBlob
		});

		expect(response.status).toBe(500);
		const data = await response.json();
		expect(data.error).toBe(
			'module resource_group with version 1.0.0 already exists under namespace acmecorp'
		);
	});
});
