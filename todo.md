# Terminal Resume — TODO

## Quick wins

- [ ] Typing sound — Soft keyboard click sounds during the typewriter animation with a mute toggle
- [x] Easter egg — Hidden command or konami code that unlocks a secret section (fun facts, hobbies, a joke)
- [ ] Ambient particles — Faint floating green dots/pixels drifting across the screen, like dust in front of a CRT
- [x] Glitch effect — Random screen glitches (horizontal tears, color shifts, brief static) that fire occasionally for CRT realism
- [x] Custom ASCII art — ASCII art banner or illustrations for section headers or the home screen

## Bigger features

- [ ] Self-hosted audio + waveform visualizer — Replace Mixcloud iframes with self-hosted MP3s to enable Web Audio API AnalyserNode for real audio-reactive waveform visualization on the music page
- [x] Snake game — Implement the snake game (currently stubbed as "Coming soon..." in the command prompt)
- [x] Command input — A fake terminal prompt where visitors can type commands like `help`, `ls`, `cd experience`
- [x] Matrix rain — `matrix` command that fills the screen with falling green characters that spell out resume keywords and wash them away
- [ ] Print/PDF mode — `@media print` CSS that strips terminal effects and renders a clean traditional resume. Add a `[P] PRINT` nav option
- [ ] Theme switcher — Toggle between green (P1), amber (P3), and blue phosphor themes. Just swap the CSS variables
- [x] 3D tic-tac-toe — Play tic-tac-toe against CPU on a rotatable 3D cube with 6 boards
- [x] Boot screen command — Hidden `boot` command in terminal prompt to replay the boot screen with ASCII art
- [ ] Snake high score persistence — Save snake high scores to localStorage so they persist across sessions
- [x] IRL easter egg video — Click ASCII art during boot or type `irl` command to open YouTube video in new tab
- [ ] Hidden chat room — Real-time IRC/BBS-style chat using Firebase Realtime Database. Hidden `chat` command opens a green-text chat overlay. Needs: Firebase project, nicknames, rate limiting, message length limits
- [ ] Multiplayer MUD — Text-based multiplayer dungeon where visitors explore resume as rooms, see each other, and chat. Needs: WebSocket server, room/player state, navigation commands (look, go, say). Rooms map to resume sections with thematic descriptions
