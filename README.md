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

- **LLM pipelines, retrieval and evals.** [Docket Lens](https://shawnskelly.com/projects/docket-lens/) and [Reddit Research](https://shawnskelly.com/projects/reddit-research/) are multi-step LLM pipelines that ingest raw public data and turn it into cited reports: one classifies every filing in an FCC comment docket, with the bias I brought to it measured and corrected, and the other clusters and deduplicates subreddit discussions before synthesis. [evalharness](https://shawnskelly.com/projects/evalharness/) treats retrieval evaluation like a test framework: deterministic metrics, committed baselines, CI gates, and an LLM that audits results but never scores them. That kind of retrieval is what [SF-Assistant](https://shawnskelly.com/projects/sf-assistant/) and [Salesforce Vector Knowledge](https://shawnskelly.com/projects/salesforce-vector-knowledge/) are built on: a zero-dependency assistant that answers plain-English questions about a Salesforce codebase, and hybrid semantic search over Salesforce Knowledge with cited answers for under a tenth of a cent per search.
- **Code that reads code.** [RepoAudit](https://shawnskelly.com/projects/repoaudit/) audits repositories and [PRISM](https://shawnskelly.com/projects/prism/) watches running software. I'm packaging the workflow I use to run coding agents into a starter kit: task-based orchestration with implementation and review in separate sessions, and Playwright verification that doubles as user documentation. The goal is one loop through the whole development cycle: audit a repo, turn the findings into tasks, let agents work them, keep watching, and report what changed. The [Playwright template](https://github.com/spskelly/playwright-e2e-guides-template) is public; the rest is still being extracted and connected.
- **Land and sky.** [TALON](https://shawnskelly.com/projects/talon/), a lidar, parcel and terrain platform for 14 western North Carolina counties, was the long, hard build. With that data in place, [Blue Ridge Skyline](https://shawnskelly.com/projects/dark-sky/) went from an idea to a tool I use in the field in a fraction of the time, the [satellite dish siting demo](https://shawnskelly.com/evidence/satellite-siting/) came together quickly, and fog detection for my [GOES-19 ground station](https://shawnskelly.com/projects/satellite/) is in progress on the same terrain.

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

- **Writing.** [The model doesn't get to decide](https://shawnskelly.com/blog/model-doesnt-get-to-decide-part-1/), a four-part series on keeping LLMs in the auditor's seat instead of the judge's, and [I asked three rival models to kill my spec](https://shawnskelly.com/blog/spec-assassins/), on adversarial spec review across three vendors before writing any code.
- **More LLM pipelines.** [BookParse](https://shawnskelly.com/projects/bookparse/) turns novels into structured knowledge graphs with a multi-agent pipeline. [Classifieds Briefing](https://shawnskelly.com/projects/classifieds-briefing/) scores daily listings against a buy box, then has Claude audit each one and write the newsletter. [Market Monitor](https://shawnskelly.com/projects/market-monitor/) runs multi-turn investigations of rare earth mineral markets, with paper trading for calibration feedback.
- **Western NC.** [Loops](https://github.com/spskelly/loops) generates walking routes in the browser with elevation processing ([published app](https://spskelly.github.io/loops/)). [WNC Bloom](https://github.com/spskelly/wnc-bloom) is a spring bloom succession planner for the mountains ([published app](https://spskelly.github.io/wnc-bloom/)).
- **Small tools.** [Apex Log Parser](https://github.com/spskelly/apex-log-parser) turns Salesforce debug logs into filterable views, entirely in the browser. [CSV](https://github.com/spskelly/csv-viewer), [JSON](https://github.com/spskelly/json-viewer) and [Markdown](https://github.com/spskelly/markdown-viewer) viewers register as default file handlers. [Diegeist](https://github.com/spskelly/diegeist) is a roguelite dungeon crawler built to a single HTML file ([play it](https://spskelly.github.io/diegeist/)).

Longer project write-ups are on [my portfolio](https://shawnskelly.com/).
