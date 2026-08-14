# Enchanted Grove — Game Design

## Core loop
Choose a game in the Grove, understand a short English instruction, act on it in the world, receive visible environmental feedback, and return a recovered relic to the Moon Tree. Three relics awaken the tree and unlock the finale.

## Games

### Firefly Flight
- **Role / genre:** action movement and collection.
- **Controls:** WASD or arrows; touch directional pad on coarse pointers.
- **Content:** 9 prompts across Meadow, Stream, and Canopy.
- **Learning:** categories, opposites, spelling, everyday vocabulary.
- **Difficulty:** stationary targets, then drifting targets, then faster targets.
- **Failure:** three hearts; a wrong collision bumps the avatar and costs a heart. At zero, only the current stage restarts.
- **Progress / reward:** the path lights in nine segments; success blooms flowers and creates sparks. Reward: Firefly Ember.

### Moonlight Potion
- **Role / genre:** drag-and-drop recipe puzzle.
- **Controls:** drag or click an ingredient, then drop/click the cauldron.
- **Content:** four recipes, three steps each.
- **Learning:** colours, numbers, size, nouns, short instructions.
- **Difficulty:** direct nouns, quantities, then comparative/attribute clues.
- **Failure:** ingredient returns; the cauldron puffs. After two misses the required ingredient glows.
- **Progress / reward:** liquid colour and rune quadrants change after every recipe. Reward: Moon Drop.

### Whispering Woods
- **Role / genre:** listening, hidden object, exploration.
- **Controls:** listen and click objects directly in three scenes.
- **Content:** 9 prompts across Forest Edge, Moon Pond, and Ancient Glade.
- **Learning:** listening, object vocabulary, descriptions, prepositions.
- **Difficulty:** clear attributes, then spatial and functional clues.
- **Failure:** no lives; after two misses the target area shimmers.
- **Progress / reward:** found lights fill a constellation and each scene brightens. Reward: Whisper Leaf.

## Screens and feedback
Home, three game screens, reusable How to Play and Settings modals, stage/recipe transitions, reward screen, and final awakening screen. Correct actions use contextual light, bloom, collection trails, and short consonant audio. Wrong actions use a soft shake/puff and low tone. No score is shown because changes in the Grove are the reward.

## Audio
Procedural Web Audio provides a quiet generative ambient/music bed plus UI, correct, wrong, collection, potion, reward, and finale cues. It starts only after user interaction. SpeechSynthesis reads listening prompts. Music/SFX toggles and volumes persist.

## State and persistence
`enchantedGrove.v1` stores `fireflyFlightCompleted`, `moonlightPotionCompleted`, `whisperingWoodsCompleted`, `moonTreeAwakened`, `musicEnabled`, `sfxEnabled`, `musicVolume`, `sfxVolume`, and `reducedMotion`. Reset clears progression but preserves preferences.

## Responsive and accessibility
Desktop-first layouts target 1366×768, 1440×900, and 1920×1080. Below 900px cards stack and game HUD compacts; coarse pointers receive controls. All controls are keyboard-focusable, modals manage focus, prompts are always textual, contrast is high, and motion follows both system preference and the override.

## Acceptance criteria
Exactly three mechanically distinct, fully completable games; canonical character asset used; 9/12/9 learning interactions; working navigation, instructions, restart, settings, sound, persistence, rewards, awakening, responsive layouts, reduced motion, relative asset paths, no external keys, no dead controls, and a clean production build.
