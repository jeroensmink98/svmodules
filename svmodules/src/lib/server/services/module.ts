import type { GetObjectCommandOutput, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { downloadFile, fileExists, uploadFile, getDownloadUrl } from './r2';

export async function uploadModule(namespace: string, name: string, version: string, file: File): Promise<PutObjectCommandOutput | { error: string }> {
	const exists = await fileExists(`${namespace}/${name}/${version}/module.tgz`);
	if (exists) {
		return {
			error: `module ${name} with version ${version} already exists under namespace ${namespace}`
		};
	}

	const response = await uploadFile(await file.arrayBuffer(), `${namespace}/${name}/${version}/module.tgz`);
	return response;
}

export async function getModule(namespace: string, name: string, version: string): Promise<GetObjectCommandOutput | { error: string }> {
	const exists = await fileExists(`${namespace}/${name}/${version}/module.tgz`);
	if (!exists) {
		return { error: 'File does not exist' };
	}

	const response = await downloadFile(`${namespace}/${name}/${version}/module.tgz`);
	return response;
}

export async function getModuleDownloadUrl(namespace: string, name: string, version: string): Promise<{ url: string } | { error: string }> {
	const exists = await fileExists(`${namespace}/${name}/${version}/module.tgz`);
	if (!exists) {
		return { error: 'File does not exist' };
	}

	const url = await getDownloadUrl(`${namespace}/${name}/${version}/module.tgz`);
	return { url };
}
