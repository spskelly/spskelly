# Shawn Skelly

**AI engineer. I build AI systems and the evals that check them.**

I build LLM pipelines, retrieval systems, agent workflows, and applications that run models locally, along with the tests and evals that check their output.

My background is enterprise quality engineering, so I write the tests first and I measure a model's output before I rely on it. I also build geospatial applications on the side.

[Portfolio and case studies](https://shawnskelly.com/) · Based in western North Carolina

## Start here

| Project | What it does | Explore |
| --- | --- | --- |
| **Docket Lens** | An LLM pipeline that processes public comment documents into structured classifications and source-linked reports, with incremental processing and documented limitations. | [Source](https://github.com/spskelly/docket-lens) · [Example reports](https://github.com/spskelly/docket-lens/tree/master/reports) |
| **Fieldstation** | Published observations from a camera-and-microphone bird station that runs detection and classification models locally. This public repository contains generated site output and data, not the private inference pipeline. | [Output and data](https://github.com/spskelly/fieldstation-site) · [Published site](https://spskelly.github.io/fieldstation-site/) |
| **Playwright E2E Guides Template** | Uses the same journeys for regression tests and recorded user guides. Includes a synthetic example app, resumable recording, and publication validation. | [Source and quickstart](https://github.com/spskelly/playwright-e2e-guides-template) |
| **Blue Ridge Skyline** | A stargazing planner combining moon phases, forecasts, mapped observing locations, and terrain-aware sky views. | [Source](https://github.com/spskelly/dark-sky) · [Published app](https://spskelly.github.io/dark-sky/) |

## Current focus

Most of what I build now starts from something I already built, so each new project comes together faster than the last.

- **Land and sky.** [TALON](https://shawnskelly.com/projects/talon/), a lidar, parcel and terrain platform for 14 western North Carolina counties, was the long, hard build. With that data in place, [Blue Ridge Skyline](https://shawnskelly.com/projects/dark-sky/) went from an idea to a tool I use in the field in a fraction of the time, the [satellite dish siting demo](https://shawnskelly.com/evidence/satellite-siting/) came together quickly, and fog detection for my [GOES-19 ground station](https://shawnskelly.com/projects/satellite/) is in progress on the same terrain.
- **Code that reads code.** [RepoAudit](https://shawnskelly.com/projects/repoaudit/) audits repositories and [PRISM](https://shawnskelly.com/projects/prism/) watches running software. I'm packaging the workflow I use to run coding agents into a starter kit: task-based orchestration with implementation and review in separate sessions, and Playwright verification that doubles as user documentation. The goal is one loop through the whole development cycle: audit a repo, turn the findings into tasks, let agents work them, keep watching, and report what changed. The [Playwright template](https://github.com/spskelly/playwright-e2e-guides-template) is public; the rest is still being extracted and connected.

Reusing my own work this fast has a cost: code copied between repos drifts apart quietly. I wrote about [checking how my projects actually depend on each other](https://shawnskelly.com/blog/leaning-on-each-other/), and the rule I follow now.

## Recently active

<!-- recent:start -->
- [TALON](https://shawnskelly.com/projects/talon/), active Sep 2026
- [Blue Ridge Skyline](https://shawnskelly.com/projects/dark-sky/), active Sep 2026
- [evalharness](https://shawnskelly.com/projects/evalharness/), active Sep 2026
- [Diegeist](https://shawnskelly.com/projects/diegeist/), active Sep 2026
- [GOES-19 Ground Station](https://shawnskelly.com/projects/satellite/), active Sep 2026
- [Docket Lens](https://shawnskelly.com/projects/docket-lens/), active Sep 2026
<!-- recent:end -->

## Engineering approach

Define acceptance criteria before implementation. Use deterministic fixtures and deterministic scoring where possible, and keep the model out of decisions it cannot justify. Keep failure evidence available for diagnosis, distinguish generated artifacts from source, and make limitations explicit.

My goal is less repeated setup and supervision, without making the resulting software harder to review or maintain.

## More work

[Loops](https://github.com/spskelly/loops) explores browser-based walking-route generation, elevation processing, and local persistence. [WNC Bloom](https://github.com/spskelly/wnc-bloom) is a spring bloom succession planner for the mountains of western North Carolina ([published app](https://spskelly.github.io/wnc-bloom/)). Longer project write-ups are on [my portfolio](https://shawnskelly.com/).
