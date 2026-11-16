# Rules & Loopholes

A one-page reading reflection on Bruce Schneier’s *A Hacker’s Mind*, by Han Wang for Duke AIPI XAI.

## View locally

Open `index.html` directly in a browser, or serve this directory:

```sh
python3 -m http.server 8000
```

Visit http://localhost:8000. The page uses plain HTML, inline CSS and JavaScript, system fonts, and a local book-cover image. No installation, build, accounts, or API keys are required. The experiments run locally without sending visitor data anywhere.

## Publish with GitHub Pages

1. Commit this folder to your GitHub repository and push it to `main`.
2. In the repository’s **Settings → Pages**, select **Deploy from a branch**.
3. Select **main** and **/ (root)**, then save.
4. GitHub will display the published address in Pages settings when deployment completes.

Keep `index.html`, `project.md`, `.nojekyll`, and `assets/a-hackers-mind-cover.jpg` at their current relative paths. The relative links also work on project Pages URLs such as `https://USERNAME.github.io/REPOSITORY/`.

See [GitHub’s publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) for the branch publishing settings.

Repository: https://github.com/duke-aipi-Han/XAI-HackersReflect

## Verify the models

With Node.js 18 or later:

```sh
node --test tests/models.test.mjs
```

The tests exercise the actual model code extracted from the HTML: reward calculations, the fixed vote distribution, both district plans, disconnected and unequal districts, lottery coverage, and prize splitting. The three games appear one after another as you scroll. Browser checks should cover basket buttons, district reassignment, sliders, resets, keyboard access, and narrow screens.

Verified in Chrome on desktop and at a 375px responsive width. Manual checks covered purchases and budget limits, reward-rule changes, resets, the minority-win preset, invalid district populations, lottery draws and prize splitting, local image loading, and opening the HTML directly from disk. Nine model tests pass.

## Sources and scope

- [Original notes](project.md) provide the takeaways and example topics. The page’s first-person prose expands those notes; it is not a quotation from Schneier.
- [Official book page](https://www.schneier.com/books/a-hackers-mind/): reference, referral link, and cover image source. The turquoise, yellow, orange, scanlines, and serif typography take their cue from the cover. The book cover remains credited to the book and publisher.
- [UC Davis’s David Phillips profile](https://www.ucdavis.edu/news/pudding-guy-asks-who-wants-be-mileage-millionaire) and [TIME’s contemporary report](https://time.com/archive/6740722/the-pudding-prince-of-frequent-flyer-miles/): context for pudding rewards.

All three games explicitly use simplified teaching assumptions. The district map and lottery parameters are invented. The lottery is not a model of a currently available lottery or financial advice.
