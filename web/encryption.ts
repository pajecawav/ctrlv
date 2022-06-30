// taken from https://blog.excalidraw.com/end-to-end-encryption/ with slight modifications

export async function encryptData(
	data: string
): Promise<{ objectKey: string; encrypted: string }> {
	const key = await window.crypto.subtle.generateKey(
		{ name: "AES-GCM", length: 128 },
		true,
		["encrypt", "decrypt"]
	);
	const objectKey = (await window.crypto.subtle.exportKey("jwk", key)).k!;

	const encryptedBuffer = await window.crypto.subtle.encrypt(
		{ name: "AES-GCM", iv: new Uint8Array(12) /* don't reuse key! */ },
		key,
		new TextEncoder().encode(data)
	);
	const encrypted = String.fromCharCode(...new Uint8Array(encryptedBuffer));

	return { objectKey, encrypted };
}

export async function decryptData(
	data: string,
	objectKey: string
): Promise<string> {
	const dataBuffer = new Uint8Array(data.length);
	for (let i = 0; i < data.length; i++) {
		dataBuffer[i] = data.charCodeAt(i);
	}

	const key = await window.crypto.subtle.importKey(
		"jwk",
		{
			k: objectKey,
			alg: "A128GCM",
			ext: true,
			key_ops: ["encrypt", "decrypt"],
			kty: "oct",
		},
		{ name: "AES-GCM", length: 128 },
		false,
		["decrypt"]
	);

	const decrypted = await window.crypto.subtle.decrypt(
		{ name: "AES-GCM", iv: new Uint8Array(12) },
		key,
		dataBuffer
	);

	const decoded = new window.TextDecoder().decode(new Uint8Array(decrypted));

	return decoded;
}
