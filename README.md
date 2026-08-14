# Enchanted Grove

A cinematic English-learning adventure for ages 10–14 (A1–A2). Restore the Moon Tree by earning the Firefly Ember, Moon Drop, and Whisper Leaf.

## Games

- **Firefly Flight:** move with WASD/arrow keys and collide with the word that answers each clue.
- **Moonlight Potion:** drag ingredients to the cauldron and complete four recipes.
- **Whispering Woods:** listen, explore, and click hidden objects in three scenes.

The project uses semantic HTML, modular vanilla JavaScript, CSS animation, Web Audio, SpeechSynthesis, and localStorage. No API keys or runtime backend are required.

## Run locally

```bash
python3 -m http.server 4173
```

## Structure

`src/shared` contains persistence and audio, `src/games` contains learning content, and `src/styles` contains the responsive visual system. Supplied canonical character art remains under `assets/character`.

## GitHub Pages

Push to the default branch and enable **Settings → Pages → GitHub Actions**. The included workflow publishes the static project directly. The resulting URL is `https://<owner>.github.io/<repository>/`.
