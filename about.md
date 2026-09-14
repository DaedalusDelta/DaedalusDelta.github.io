---
layout: page
title: Ray Muxin Liu
permalink: /
description: Ray Muxin Liu is a fourth-year Carnegie Mellon University School of Computer Science undergraduate in Artificial Intelligence, expected to graduate in December 2026, and focused on robotics, embodied AI, dexterous manipulation, and robot learning.
---

<section class="profile-shell">
  <section class="profile-hero">
    <div class="profile-copy">
      <p class="profile-kicker">Carnegie Mellon University · School of Computer Science</p>
      <h1>Ray Muxin Liu</h1>
      <p class="profile-lead">
        I am an undergraduate at Carnegie Mellon University studying Artificial
        Intelligence in the School of Computer Science. I am a fourth-year
        student expected to graduate in December 2026, and I am interested in research at the
        intersection of robotics, embodied AI, and learning systems.
      </p>
      <p class="profile-lead">
        I am preparing to apply for PhD programs and am especially interested in
        dexterous manipulation, behavior generalization, and post-training
        generalist robot policies with real-world feedback. I want to build
        systems that can refine their behaviors through experience and, over
        time, support increasingly autonomous exploration and self-improvement.
      </p>
      <div class="profile-socials" aria-label="Contact and research profiles">
        <button
          class="social-icon-button copy-email-button"
          type="button"
          data-user="muxinl"
          data-domain="andrew.cmu.edu"
          aria-label="Copy email address"
          title="Copy email address">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5h17v13h-17zM4.5 6.5 12 13l7.5-6.5M4 18l5.4-5M20 18l-5.4-5"/></svg>
        </button>
        <a class="social-icon-button" href="{{ '/assets/files/Ray_Muxin_Liu_Resume.pdf' | relative_url }}" target="_blank" rel="noopener" aria-label="Open résumé PDF" title="Résumé">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2.75h8l4 4v14.5H6zM14 2.75v4h4M8.75 12h6.5M8.75 15h6.5M8.75 18h4.25"/></svg>
        </a>
        {% if site.linkedin_url != "" %}
        <a class="social-icon-button icon-filled" href="{{ site.linkedin_url }}" aria-label="LinkedIn" title="LinkedIn">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.1 3.5a1.85 1.85 0 1 1 0 3.7 1.85 1.85 0 0 1 0-3.7ZM3.5 8.7h3.2v11.8H3.5V8.7Zm5.2 0h3.07v1.61h.04c.43-.81 1.48-1.66 3.05-1.66 3.26 0 3.87 2.15 3.87 4.94v6.91h-3.2v-6.13c0-1.46-.03-3.34-2.04-3.34-2.05 0-2.36 1.59-2.36 3.24v6.23H8.7V8.7Z"/></svg>
        </a>
        {% endif %}
        {% if site.google_scholar_url != "" %}
        <a class="social-icon-button icon-filled" href="{{ site.google_scholar_url }}" aria-label="Google Scholar" title="Google Scholar">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 10 5.5L12 14 2 8.5 12 3Zm-6.25 8.94V16c0 1.78 2.8 3.22 6.25 3.22s6.25-1.44 6.25-3.22v-4.06L12 15.37l-6.25-3.43Zm14.5-2.17v6.48h1.25V9.77h-1.25Z"/></svg>
        </a>
        {% endif %}
      </div>
      <p class="profile-contact-line">
        Email:
        <span class="obfuscated-email">muxinl [at] andrew [dot] cmu [dot] edu</span>
      </p>
    </div>
    <div class="profile-aside">
      <div class="portrait-card">
        <img src="/assets/images/portrait.jpeg" alt="Portrait of Ray Muxin Liu">
      </div>
      <dl class="profile-facts">
        <div>
          <dt>Program</dt>
          <dd>B.S. in Artificial Intelligence</dd>
        </div>
        <div>
          <dt>School</dt>
          <dd>CMU School of Computer Science</dd>
        </div>
        <div>
          <dt>Year</dt>
          <dd>Fourth Year · Expected December 2026</dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd>Robotics, embodied AI, manipulation</dd>
        </div>
      </dl>
    </div>
  </section>

  <section class="profile-grid">
    <article class="info-panel">
      <p class="section-label">Research philosophy</p>
      <h2>Intelligence needs a body</h2>
      <p>
        I see robotics as the work of giving intelligence a body. Learning
        systems can reason over language and vision, but an intelligence that
        genuinely explores the world must also act in it, observe the
        consequences, and revise its understanding through physical experience.
      </p>
      <p>
        I am motivated by the long-term possibility of embodied intelligence
        becoming a scientific partner: a system that helps extend how humanity
        investigates, understands, and learns from the physical world.
      </p>
    </article>

    <article class="info-panel">
      <p class="section-label">A working view</p>
      <h2>Discovery through interaction</h2>
      <p>
        I am interested in the intelligence that emerges when perception,
        reasoning, and action are treated as one connected process. A robot
        should not only describe its surroundings; it should be able to test
        hypotheses, use tools, and learn from the consequences of contact with
        the world. My current interests include post-training generalist
        vision-language-action policies with demonstrations, DAgger, and
        reinforcement learning so that useful behaviors can become more robust
        and eventually support continual self-improvement.
      </p>
      <p>
        I write about the more technical side of this view—behavior
        generalization, simulation, real-world learning, and control—in the
        <a href="/blog/">blog</a>.
      </p>
    </article>
  </section>

  <section class="paper-section">
    <div class="section-heading">
      <p class="section-label">Papers</p>
      <h2>Selected papers</h2>
    </div>

    <article class="paper-card">
      <div class="paper-layout">
        <div class="paper-thumb">
          <img src="/assets/images/papers/cowboy.jpg" alt="COWBOY whole-body mobile manipulation experiments across diverse environments">
        </div>
        <div class="paper-body">
          <div class="paper-meta">
            <span>2026</span>
            <span>Accepted (unreleased)</span>
          </div>
          <h3>COWBOY: A Scalable Sim-to-Real Framework for Learning Contextual Whole-Body Manipulation</h3>
          <p class="paper-authors">Jiahui Yang*, Jason Jingzhou Liu*, <strong class="paper-author-highlight">Ray Muxin Liu*</strong>, Andrew E. Wang, Kenneth Shaw, Deepak Pathak, Ruslan Salakhutdinov</p>
          <p class="paper-venue">Accepted (unreleased)</p>
          <p>
            A scalable sim-to-real framework for contextual whole-body mobile
            manipulation, using local reinforcement-learning experts,
            student-teacher distillation, whole-body control, and simulation
            evaluation.
          </p>
        </div>
      </div>
    </article>

    <article class="paper-card">
      <div class="paper-layout">
        <a class="paper-thumb" href="https://ifgrasping.github.io/" aria-label="IFG project page">
          <img src="/assets/images/papers/teaser.png" alt="Teaser image for IFG">
        </a>
        <div class="paper-body">
          <div class="paper-meta">
            <span>2025</span>
            <span>Workshop</span>
          </div>
          <h3>IFG: Internet-Scale Guidance for Functional Grasping Generation</h3>
          <p class="paper-authors"><strong class="paper-author-highlight">Ray Muxin Liu*</strong>, Mingxuan Li*, Kenneth Shaw, Deepak Pathak</p>
          <p class="paper-venue">ICRA Workshop on Robot Learning Prior Maps · Best Poster Finalist</p>
          <p>
            A grasp generation framework that combines internet-scale semantic cues
            with simulation-driven geometric reasoning for functional dexterous
            grasping.
          </p>
          <div class="paper-links">
            <a href="https://ifgrasping.github.io/">Project</a>
            <a href="https://arxiv.org/abs/2511.09558">arXiv</a>
          </div>
        </div>
      </div>
    </article>

    <article class="paper-card">
      <div class="paper-layout">
        <a class="paper-thumb" href="https://bidex-teleop.github.io/" aria-label="BiDex project page">
          <img src="/assets/images/papers/bidex.png" alt="Teaser image for Bimanual Dexterity for Complex Tasks">
        </a>
        <div class="paper-body">
          <div class="paper-meta">
            <span>2024</span>
            <span>CoRL</span>
          </div>
          <h3>Bimanual Dexterity for Complex Tasks</h3>
          <p class="paper-authors">Kenneth Shaw*, Yulong Li*, Jiahui Yang, Mohan Kumar Srirama, <strong class="paper-author-highlight">Ray Muxin Liu</strong>, Haoyu Xiong, Russell Mendonca, Deepak Pathak</p>
          <p class="paper-venue">Conference on Robot Learning (CoRL) 2024</p>
          <p>
            A low-cost, highly dexterous bimanual teleoperation system for collecting
            data and training policies for complex multi-hand manipulation tasks.
          </p>
          <div class="paper-links">
            <a href="https://bidex-teleop.github.io/">Project</a>
            <a href="https://openreview.net/forum?id=55tYfHvanf">OpenReview</a>
            <a href="https://arxiv.org/abs/2411.13677">arXiv</a>
          </div>
        </div>
      </div>
    </article>
  </section>
</section>
