# FINAL ASSET MANIFEST — ENCHANTED GROVE

This package is intended to be enough for a full rebuild without substituting the core art with emoji, Unicode symbols or cheap CSS placeholder objects.

## Identity lock
Use these as the source of truth for the main fairy:
- `assets/character/fairy_canonical_fullbody.png`
- `assets/character/fairy_canonical_face.png`

Do NOT replace her face with a generic fairy.

## Clean backgrounds
- `assets/backgrounds/home.webp`
- `assets/backgrounds/spell_path.webp`
- `assets/backgrounds/potion_of_words.webp`
- `assets/backgrounds/whispering_portraits.webp`
- `assets/backgrounds/finale.webp`

These are clean scene assets intended to sit behind real HTML/SVG UI.

## Moon Tree
Four distinct visual states are already extracted:
- `assets/moon_tree/moon_tree_0of3.webp`
- `assets/moon_tree/moon_tree_1of3.webp`
- `assets/moon_tree/moon_tree_2of3.webp`
- `assets/moon_tree/moon_tree_3of3.webp`

## Meaningful rewards
Use the supplied PNGs directly:
- `assets/rewards/firefly_ember.png`
- `assets/rewards/moon_drop.png`
- `assets/rewards/whisper_leaf.png`

## Whispering Portraits
Eight ready framed portrait choices:
- `assets/portraits/portrait_01.webp` ... `portrait_08.webp`

The final game only needs six; choose the six that best match the content personas.

## UI / object references
- `assets/ui/ui_components_sheet.png`
- `assets/ui/gameplay_objects_sheet.png`
- `assets/ui/artifact_atlas.png`

These are implementation references. Recreate their components cleanly in HTML/CSS/SVG when interaction requires independent elements. Do not use Unicode characters instead.

## Audio
Ready local WAV assets:
- `forest_ambient_loop.wav`
- `ui_click.wav`
- `correct_magic.wav`
- `wrong_soft.wav`
- `reward.wav`
- `path_restore.wav`
- `potion_bubble.wav`
- `portrait_speaking.wav`
- `finale_cue.wav`

They may be supplemented with Web Audio for small interaction details, but do not replace them with bare oscillator beeps.

## Screen references
The files in `references/screens/` set the required visual-quality bar.
They are references, not single flattened screens to use as the website UI.

## Educational content
`docs/GAME_CONTENT.json` is authoritative base content.
Do not replace it with trivial prompts such as “find something yellow” or “opposite of cold”.
