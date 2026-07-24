# What “complete site” means right now (honest scope)

You asked for the **complete** Hanumat experience with perfect Hindi pronunciation, full cinematics, all paths, songs, scores, etc.

## Shipped in this build

| Area | Status |
|------|--------|
| Multi-page stunning UI | Home, Path library, Path Studio (karaoke), Listen, Japa, Katha, Sankat, Calendar |
| Cinematic images | Hero dawn, diya, temple night, ocean |
| Full Hanuman Chalisa | Text + HI/EN meaning + full TTS + verse cues |
| Aarti, Bajrang Baan (selected), Ashtak (selected), mantra japa | TTS + cues |
| Sundar Kand | Structure + sample section (not full Manas yet) |
| Ambient beds | Synthetic tanpura-like drone |
| Domain readiness | Static export for `hanumat.life` |
| Deploy docs | `docs/deploy/hostinger.md` |

## Cannot honestly claim “perfect” yet

1. **Perfect classical path pronunciation / melodic path singing**  
   Edge neural Hindi (`hi-IN-MadhurNeural`) is clear Indian-accent speech, **not** a trained temple *pāṭhī* or raga-based recitation. True “perfect” path needs a human reciter.

2. **Full Sundar Kand (all chaupais)**  
   Hours of accurate GP-collated text + audio. Sample is live; full kand needs your edition PIN collate (or trusted digital GP text imported section-by-section).

3. **Full Bajrang Baan / complete Ashtak variants**  
   Site has **devotionally usable selections**, not every regional extended form.

4. **Filmi bhajan “songs”**  
   Not generated as music videos/songs — TTS is recitation-style, not Bollywood-style singing.

5. **Scroll cinematic video sequence**  
   Still images + UI motion; full frame-sequence film can be a next polish pass.

## Help / decisions needed from you

1. **Deploy target:** DNS `@` is **2.57.91.91** (shared hosting), VPS is **187.127.156.152**. Which should `hanumat.life` use?  
2. **Permission to update DNS** if VPS.  
3. **Full SK text:** confirm we may import mūla from your GP soft copy (you collate or share PDF pages) for complete SK TTS.  
4. **Pronunciation bar:** accept neural TTS as Wave 0, or budget human reciter later.  
5. **Any must-have stotra missing** for launch (Bahuk, Panchmukhi, Maruti Stotra, 108 names full)?

## Local preview

```bash
cd "C:\Users\Sabyasachi\Desktop\Hanuman Chalisha"
pnpm --filter @hanumat/web exec -- npx serve out
```
