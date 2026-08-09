# videos/

## hero-energy-storage.mp4 — shipped

The home page hero clip. 1692 × 1080, 24 fps, 13.25 s, no audio, ~2.6 MB.

It is enabled in `js/config.js` (`video: { enabled: true }`). Set that to `false` and the
hero falls back to the still image, which is frame one of this same clip — so the fallback
is invisible rather than a jump to a different composition.

### How this file was prepared

Starting from a 1280 × 720 source clip:

| Step | What and why |
| --- | --- |
| Trim | The first 80 frames (3.3 s) were letterboxed with black bars and were dropped. |
| Crop | Cropped to **1128 × 720**, removing the right-hand strip. A static watermark sat at x 1138–1183, y 578–625; cropping the right edge removes it while keeping full height, which suits the tall hero panel better than cropping the bottom would. |
| Loop | Forward pass plus a reversed pass, with the shared frame removed at both the turnaround and the wrap. The clip loops seamlessly instead of hard-cutting from a close-up back to a wide shot. |
| Scale | Upscaled 1.5× to 1692 × 1080 with Lanczos plus a light unsharp. This is resampling, not detail recovery — it stops the browser doing a worse job of the same enlargement on larger screens. |
| Encode | H.264 high profile, CRF 28, `-preset veryslow`, `yuv420p`, `+faststart`, audio stripped. |

### Replacing it

Drop in a new `hero-energy-storage.mp4` and regenerate the poster stills so they still match
frame one:

```bash
ffmpeg -i videos/hero-energy-storage.mp4 -frames:v 1 poster.png
# then resize poster.png to 800 / 1280 / 1692 px wide as
# images/hero/bess-yard-drone-{800,1280,1692}.jpg
```

If your replacement is a different aspect ratio, update the `ar=` argument on the hero image
in the page source, and the width list for `images/hero/bess-yard-drone`.

Keep it short, muted and under about 3 MB. The clip is attached after first paint, so it never
blocks the hero from rendering, and it is skipped entirely for visitors who prefer reduced
motion or have Data Saver switched on.

## Optional extra clips

Two further slots are referenced in the design notes if you want to extend the site:

- `renewable-storage.mp4`
- `industrial-storage.mp4`

Neither is wired up yet.
