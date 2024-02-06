---
title: "Compiler-As-a-Service"
date: 2023-10-25
time: 1-2:30 p.m. EDT
location: Online
thumbnail: /assets/images/events/oa-week.jpg
alt: A computer-generated image of people in a library with white shelves, white staircases, and blue sofas
registerurl: https://schedule.yale.edu/calendar/instruction/keynote
categories:
  - Talk
tags:
  - Data Management
teaser: >
  Join us for our Open Access Week keynote presentation, featuring a conversation between Daniel Dollar (Associate University Librarian for Scholarly Resources, Yale University Library) and Peter Suber (Senior Advisor on Open Access, Harvard Library; Director, Harvard Open Access Project).
---

### Project Goals
Incremental compilation aims to support clients that need to keep a single compiler instance active across multiple compile requests. Our work focuses on:

- Enhancement – upstream incremental compilation extensions available in forks;

- Generalization – make building tools using incremental compilation easier;

- Sustainability – move incremental use cases upstream.

Cling currently requires around 100 patches to clang’s incremental compilation facilities. For example, CodeGen was modified to work with multiple llvm::Module instances, and to finalize per each end-of-translation unit (cling has more than one). Tweaks to the FileManager’s caching mechanism, and improvements to the SourceManager virtual and overridden files (code reached mostly from within cling’s setup) were necessary. Our research shows that the clang infrastructure works amazingly well to support something which was not its main use case. The grand total of our diffs against clang-9 is: 62 files changed, 1294 insertions(+), 231 deletions(-). A major weakness of cling’s infrastructure is that it does not work with the clang Action infrastructure due to the lack of an IncrementalAction. An incremental action should enable the incremental compilation mode in clang (eg., in the preprocessor) and does not terminate at end of the main source file.

Our Incremental Action allows constant compilation of partial inputs and ensures that the compiler remains active. It includes an API to access attributes of recently compiled chunks of code that can be post-processed.