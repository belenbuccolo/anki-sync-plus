# AnkiSync+

Unlock the power of seamless integration between [Obsidian](https://obsidian.md/) and [Anki](https://apps.ankiweb.net/) with AnkiSync+, a feature-packed plugin designed to enhance your flashcard creation experience.

![](https://github.com/RochaG07/anki-sync-plus/blob/master/media/demo.gif)

## ✨ Key Features

-   🗃️ _Automated Card Management:_ Scan the selected folder effortlessly to add new cards or update existing ones. Keep your knowledge up-to-date with ease.
-   📃 _Note-Based Card Actions:_ Choose to add, update, or delete individual cards directly from your currently selected note. Tailor your flashcards to your evolving learning needs.
-   🏷️ _Organize with Tags:_ Organize your flashcards into decks using tags as deck names. The first tag found on a note becomes the deck name, streamlining your card organization.
-   ❌ _Tag Exclusion:_ Customize deck names by excluding specific tags. Ensure your decks reflect your unique learning preferences.
-   🌫️ _Tag Filtering:_ Define tags to exclude during file scans, preventing unwanted tags from cluttering your flashcard collection.
-   🗑️ _Auto Cleanup:_ Say goodbye to clutter. Automatically delete the "anki-id" property on notes when cards are removed in Anki during updates.
-   🖼️ _Image Support:_ Seamlessly integrate images into your flashcards and notes for enhanced visual learning.
-   ✏️ _Excalidraw Integration:_ Take your diagrams and visual explanations to the next level with support for embedded [Excalidraw](https://github.com/zsviczian/obsidian-excalidraw-plugin) drawings.
-   🔡 _Customizable Regex:_ Fine-tune card creation by using regular expressions to omit matching text, ensuring that your flashcards are concise and focused.

## 👨‍🔧 Setup

1. Launch Anki and access your preferred profile.
2. Confirm that you have [AnkiConnect](https://ankiweb.net/shared/info/2055492159) installed.
3. In Anki, go to Tools -> Addons -> AnkiConnect -> Configuration, and modify it to match the following settings.

```json
{
	"apiKey": null,
	"apiLogPath": null,
	"ignoreOriginList": [],
	"webBindAddress": "127.0.0.1",
	"webBindPort": 8765,
	"webCorsOriginList": ["http://localhost", "app://obsidian.md"]
}
```

## 💖 Support

If you find value in this plugin and wish to contribute to its ongoing development, you have the option to show your support on Ko-fi.

[<img style="float:left" src="https://user-images.githubusercontent.com/14358394/115450238-f39e8100-a21b-11eb-89d0-fa4b82cdbce8.png" width="200">](https://ko-fi.com/rochag07)
