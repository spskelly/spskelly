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

I'm packaging the workflow I use to run coding agents into a starter kit: task-based agent orchestration where implementation and review happen in separate sessions, Playwright verification that doubles as user documentation, and repository/deployment configuration.

The Playwright template is public. The broader kit is still being extracted and documented.

## Recently active

<!-- recent:start -->
No recent public activity.
<!-- recent:end -->

## Engineering approach

Define acceptance criteria before implementation. Use deterministic fixtures and deterministic scoring where possible, and keep the model out of decisions it cannot justify. Keep failure evidence available for diagnosis, distinguish generated artifacts from source, and make limitations explicit.

My goal is less repeated setup and supervision, without making the resulting software harder to review or maintain.

## More work

[Loops](https://github.com/spskelly/loops) explores browser-based walking-route generation, elevation processing, and local persistence. [WNC Bloom](https://github.com/spskelly/wnc-bloom) is a spring bloom succession planner for the mountains of western North Carolina ([published app](https://spskelly.github.io/wnc-bloom/)). Longer project write-ups are on [my portfolio](https://shawnskelly.com/).
