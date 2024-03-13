
import { FileManager, Notice, Vault } from "obsidian";
import {
	addTagToNote,
	appendContentToNote,
	getAnkiCardIdFromFile,
	getCurrentFile,
	getFilesOnFolder,
  
} from "./utils";
import {
	updateExistingCard,
	addNewCard,
	deleteExistingCard,
} from "./operations";
import { AnkiObsidianIntegrationSettings } from "./interfaces";
import { getCardsInfoFromAnki } from "./ankiCommunication";

let isHandlingAction = false;

export async function handleTest() {
	await getCardsInfoFromAnki("australia");
}

export async function handleScanVault(
	vault: Vault,
	settings: AnkiObsidianIntegrationSettings,
	createdDecks: string[],
	fileManager: FileManager,
) {
	if (settings.targetFolder === "") {
		new Notice("Target folder needs to be set for this action");
		return;
	}

	if (isHandlingAction) return;
	isHandlingAction = true;

  const currentFile = getCurrentFile()
  const folderName = currentFile?.parent?.name
  const folderPath = currentFile?.parent?.path

  // Get files from obsidian
	const files = getFilesOnFolder(folderPath || settings.targetFolder, vault);

  // Get notes from anki corresponding to the obsidian notes
	const ankiNotesInfo = await getCardsInfoFromAnki(folderName || settings.defaultDeck);
  
  // Filter the notes that have the tag "marked" and get the reason to fix if it exists
	const ankiNotesToFix = ankiNotesInfo
		.filter((note: any) => note.tags.includes("marked"))
    .map((note: any) => {
      const result = {
        id: note.noteId,
        tags: note.tags,
        reasonToFix: ""
      }

      const hasReasonToFix = note.fields.Back.value.includes("marked:")
      if (hasReasonToFix) {
        result.reasonToFix = note.fields.Back.value.match(/marked:(.*)[;]/)?.[1]?.trim()
      }

      return result
  })


	for (let i = 0; i < files.length; i++) {
		let ankiId = await getAnkiCardIdFromFile(
			await vault.cachedRead(files[i]),
		);

    // Add marked tag and reason to obsidian note
    const ankiNoteToFix = ankiNotesToFix.find((note: any) => note.id === ankiId)
		if (ankiNoteToFix) {
			addTagToNote(files[i], fileManager, "marked");
      if (ankiNoteToFix.reasonToFix) {
        appendContentToNote(files[i], ankiNoteToFix.reasonToFix)
      }
		}

    // If the note was removed from anki, add the removed tag to the obsidian note
    const noteWasRemovedFromAnki = ankiId && !ankiNotesInfo.find((note: any) => note.noteId === ankiId)
    if (noteWasRemovedFromAnki) {
      addTagToNote(files[i], fileManager, "removed")
    }

		try {
			if (ankiId) {
				await updateExistingCard(
					ankiId,
					files[i],
					vault,
					createdDecks,
					settings,
					fileManager,
				);
			} else {
				await addNewCard(
					files[i],
					vault,
					createdDecks,
					settings,
					fileManager,
				);
			}
		} catch (error) {
			new Notice("Error: Could not connect to Anki");
			isHandlingAction = false;
			return;
		}
	}

	isHandlingAction = false;
}

export async function handleAddOrUpdateSingleFile(
	vault: Vault,
	settings: AnkiObsidianIntegrationSettings,
	createdDecks: string[],
	fileManager: FileManager,
) {
	let file = getCurrentFile();
	if (!file) return;

	if (isHandlingAction) return;
	isHandlingAction = true;

	let ankiId = await getAnkiCardIdFromFile(await vault.cachedRead(file));

	try {
		if (ankiId) {
			await updateExistingCard(
				ankiId,
				file,
				vault,
				createdDecks,
				settings,
				fileManager,
			);
		} else {
			await addNewCard(file, vault, createdDecks, settings, fileManager);
		}
	} catch (error) {
		new Notice("Error");
	} finally {
		isHandlingAction = false;
	}
}

export async function handleDeleteSingleFile(
	vault: Vault,
	fileManager: FileManager,
) {
	let file = getCurrentFile();
	if (!file) return;

	if (isHandlingAction) return;
	isHandlingAction = true;

	let ankiId = await getAnkiCardIdFromFile(await vault.cachedRead(file));

	if (!ankiId) {
		new Notice("Error: Note does not contain anki-id");
		return;
	}

	try {
		await deleteExistingCard(ankiId, file, vault, fileManager);
	} catch (error) {
		new Notice("Error: Could not connect to Anki");
	} finally {
		isHandlingAction = false;
	}
}
