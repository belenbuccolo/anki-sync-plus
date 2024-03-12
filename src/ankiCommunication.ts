import { normalizePath, requestUrl } from "obsidian";
import { card, imagesToSend } from "./interfaces";
// import { convertImageToBase64 } from "./utils";

import * as path from "path";

export async function addCardOnAnki(card: card): Promise<string | null> {
	const url = "http://localhost:8765/";

	const body = JSON.stringify({
		action: "addNote",
		version: 6,
		params: {
			note: {
				deckName: card.deck,
				modelName: "Basic",
				fields: {
					Front: card.front,
					Back: card.back,
				},
			},
		},
	});

	const response = await requestUrl({
		url,
		method: "post",
		body,
	});

	return response.json.result;
}

export async function updateCardOnAnki(
	id: number,
	card: card,
): Promise<string | null> {
	const url = "http://localhost:8765/";

	const body = JSON.stringify({
		action: "updateNote",
		version: 6,
		params: {
			note: {
				id: id,
				deckName: card.deck,
				modelName: "Basic",
				fields: {
					Front: card.front,
					Back: card.back,
				},
			},
		},
	});

	const response = await requestUrl({
		url,
		method: "post",
		body,
	});

	return response.json.result;
}

export async function deleteCardOnAnki(id: number): Promise<string | null> {
	const url = "http://localhost:8765/";

	const body = JSON.stringify({
		action: "deleteNotes",
		version: 6,
		params: {
			notes: [id],
		},
	});

	const response = await requestUrl({
		url,
		method: "post",
		body,
	});

	return response.json.result;
}

export async function addDeckOnAnki(name: string): Promise<string | null> {
	const url = "http://localhost:8765/";

	const body = JSON.stringify({
		action: "createDeck",
		version: 6,
		params: {
			deck: name,
		},
	});

	const response = await requestUrl({
		url,
		method: "post",
		body,
	});

	return response.json.result;
}

export async function addImagesOnAnki(
	images: imagesToSend[],
): Promise<string | null> {
	const url = "http://localhost:8765/";

	const actions = [];
	for (const image of images) {
		const normalizedPath = normalizePath(image.path);
		const absolutePath = path.join("/", normalizedPath);

		// const data = await convertImageToBase64(absolutePath);

		actions.push({
			action: "storeMediaFile",
			params: {
				filename: image.filename,
				path: absolutePath,
			},
		});
	}

	const body = JSON.stringify({
		action: "multi",
		params: {
			actions: actions,
		},
	});

	const response = await requestUrl({
		url,
		method: "post",
		body,
	});

	return response.json.result;
}
