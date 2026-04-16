---
layout: page
title: Blog
permalink: /blog/
description: Writing by Ray Muxin Liu on robotics, embodied AI, mathematical thinking, and technical notes from research and systems work.
---

{% assign featured_titles = "Welcome to My Blog|A Brief Note on Mathematical Writing" | split: "|" %}

<section class="blog-layout">
  <aside class="blog-sidebar" aria-label="Blog navigation">
    <div class="blog-sidebar-card">
      <p class="blog-kicker">Navigate</p>
      <nav class="blog-sidebar-nav">
        <a href="#start-here">Start Here</a>
        <a href="#intro-post">Welcome to My Blog</a>
        <a href="#math-brief-post">Math Brief</a>
        <a href="#archive-posts">Individual Posts</a>
      </nav>
    </div>
  </aside>

  <section class="blog-index-shell">
    <section id="start-here" class="blog-featured">
      <div class="blog-section-head">
        <p class="blog-kicker">Start Here</p>
        <h1>Reading map</h1>
        <p>
          Two short entries that explain what this blog is trying to do and how to
          read the longer technical pieces.
        </p>
      </div>

      <div class="featured-list">
        {% for post in site.posts %}
          {% if featured_titles contains post.title %}
            <article id="{% if post.title == 'Welcome to My Blog' %}intro-post{% elsif post.title == 'A Brief Note on Mathematical Writing' %}math-brief-post{% endif %}" class="featured-post">
              <a class="featured-post-link" href="{{ post.url | relative_url }}">
                <div class="featured-post-meta">
                  <span>{{ post.date | date: "%b %-d, %Y" }}</span>
                  {% if post.tags and post.tags.size > 0 %}
                    <span>{{ post.tags[0] | replace: "_", " " }}</span>
                  {% endif %}
                </div>
                <h2>{{ post.title }}</h2>
                <p>{{ post.content | markdownify | strip_html | normalize_whitespace | truncate: 220 }}</p>
              </a>
            </article>
          {% endif %}
        {% endfor %}
      </div>
    </section>

    <section id="archive-posts" class="blog-archive">
      <div class="blog-section-head">
        <p class="blog-kicker">Archive</p>
        <h2>Individual posts</h2>
      </div>

      <div class="blog-grid">
        {% for post in site.posts %}
          {% unless featured_titles contains post.title %}
            <div class="blog-card">
              <a href="{{ post.url | relative_url }}">
                <div class="card-media">
                  {% if post.video %}
                    <img
                      class="card-poster"
                      src="{% if post.poster %}{{ post.poster | relative_url }}{% else %}{{ '/assets/images/blog/dextrah_blog_poster.jpg' | relative_url }}{% endif %}"
                      alt="Preview image for {{ post.title }}"
                    >
                    <img
                      class="card-preview"
                      src="{% if post.preview %}{{ post.preview | relative_url }}{% else %}{{ '/assets/images/blog/dextrah_blog_preview.webp' | relative_url }}{% endif %}"
                      alt="Animated preview for {{ post.title }}"
                    >
                  {% else %}
                    <img
                      src="{{ post.image | relative_url }}"
                      alt="Cover image for {{ post.title }}"
                    >
                  {% endif %}
                </div>
                <div class="card-content">
                  <h3 class="card-title">{{ post.title }}</h3>
                  <time class="card-date" datetime="{{ post.date | date_to_xmlschema }}">
                    {{ post.date | date: "%b %-d, %Y" }}
                  </time>
                  {% if post.tags %}
                    <p class="card-tags">
                      {% for tag in post.tags %}
                        <span class="tag">#{{ tag }}</span>
                      {% endfor %}
                    </p>
                  {% endif %}
                </div>
              </a>
            </div>
          {% endunless %}
        {% endfor %}
      </div>
    </section>
  </section>
</section>
