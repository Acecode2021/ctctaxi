# Hero video

Drop the rendered CTC hero film here as:

- `ctc-hero.webm`  (VP9 — served first)
- `ctc-hero.mp4`   (H.264 fallback — keep for older Android)

The `<video>` in `src/components/Hero.tsx` references both. If these files are
absent the hero falls back to the still poster automatically — nothing breaks.

## Spec
| Property | Value |
|---|---|
| Resolution | 1920 x 1080 (plus a 1080 x 1920 vertical cut) |
| Duration | 10 s, seamless loop |
| Audio | **none** — strip the track entirely |
| Weight | <= 2.0 MB desktop, <= 1.2 MB mobile |
| Encoding | `+faststart` (moov atom at the front) |
| Content | Branded CTC vehicle, legible CTC livery, Black Nigerian passengers, Lagos locations |

```bash
ffmpeg -i master.mov -an -vf "scale=1920:-2" -c:v libx264 -profile:v high \
  -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart -g 48 ctc-hero.mp4

ffmpeg -i master.mov -an -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 34 \
  -b:v 0 -row-mt 1 -deadline good ctc-hero.webm
```
