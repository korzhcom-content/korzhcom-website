# /easyquery hero collage

Source of `source/assets/images/eq-collage.webp`, the hero image on `/easyquery`.
It lives outside `source/`, so Jekyll does not publish it.

`collage.html` lays out three browser-window frames (rounded corners, title bar, shadow)
on a transparent 1600×1120 canvas. Each frame holds one screenshot:

| File | Window | Taken from |
|---|---|---|
| `as.png` | Advanced search | `Razor.AdvancedSearch` in eq-samples-aspnetcore-razor-mvc, 1400×972 window |
| `er.png` | EasyReport Starter Kit | ERSK Pro, "Employee of the year" with a doughnut chart, 1180×915 window, top 560 px |
| `df.png` | Data filtering | `Mvc.DataFiltering` in eq-samples-aspnetcore-razor-mvc, 1400 px window, region x 140–1250, y 60–608 |

## Rebuild

1. Serve this folder: `python -m http.server 4013 --bind 127.0.0.1`.
2. Screenshot the `#c` element with a transparent background, for example with Playwright:
   ```js
   await page.setViewportSize({ width: 1600, height: 1120 });
   await page.goto('http://127.0.0.1:4013/collage.html');
   await page.locator('#c').screenshot({ path: 'collage.png', omitBackground: true });
   ```
3. Convert, keeping the alpha channel:
   `ffmpeg -i collage.png -c:v libwebp -quality 90 -compression_level 6 -pix_fmt yuva420p ../../source/assets/images/eq-collage.webp`

To change the layout, edit the `left`, `top` and `width` of the three `.win` blocks.
If a window moves lower, raise the `#c` height so its shadow is not clipped.
