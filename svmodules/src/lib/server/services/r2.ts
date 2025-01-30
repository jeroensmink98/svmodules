import { S3Client, PutObjectCommand, type PutObjectCommandOutput, GetObjectCommand, HeadObjectCommand, type GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET_NAME } from '$env/static/private';

export const s3Client = new S3Client({
	region: 'auto',
	endpoint: R2_ENDPOINT,
	credentials: {
		accessKeyId: R2_ACCESS_KEY,
		secretAccessKey: R2_SECRET_KEY
	}
});

export const uploadFile = async (fileContent: ArrayBuffer | Buffer | Uint8Array, fileName: string): Promise<PutObjectCommandOutput> => {
	const content = fileContent instanceof ArrayBuffer ? new Uint8Array(fileContent) : fileContent;

	const command = new PutObjectCommand({
		Bucket: R2_BUCKET_NAME,
		Key: fileName,
		Body: content,
		ContentType: 'application/gzip'
	});

	const response = await s3Client.send(command);
	return response;
};

export const downloadFile = async (fileName: string): Promise<GetObjectCommandOutput> => {
	const command = new GetObjectCommand({
		Bucket: R2_BUCKET_NAME,
		Key: fileName
	});

	const response = await s3Client.send(command);
	return response;
};

export const fileExists = async (fileName: string): Promise<boolean> => {
	try {
		const command = new HeadObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: fileName
		});

		await s3Client.send(command);
		return true;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		// If the file doesn't exist, S3 will throw a NotFound error
		return false;
	}
};

export const getDownloadUrl = async (fileName: string): Promise<string> => {
	const command = new GetObjectCommand({
		Bucket: R2_BUCKET_NAME,
		Key: fileName
	});

	// Generate a signed URL that expires in 15 minutes (900 seconds) by default
	const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
	console.log(signedUrl);
	return signedUrl;
};
