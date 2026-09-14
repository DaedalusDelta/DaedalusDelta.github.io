---
layout: page
title: Blog
permalink: /blog/
description: Writing by Ray Muxin Liu on robotics, embodied AI, mathematical thinking, and technical notes from research and systems work.
---

{% assign featured_titles = "From DextrAH-G to DextrAH-RGB|RMP Explained: Motivation, Intuition, and Design" | split: "|" %}
{% assign reading_map_titles = "Welcome to My Blog|A Brief Note on Mathematical Writing" | split: "|" %}

<section class="blog-layout">
  <aside class="blog-sidebar" aria-label="Blog navigation">
    <div class="blog-sidebar-card">
      <p class="blog-kicker">Navigate</p>
      <nav class="blog-sidebar-nav">
        <a href="#featured-writing">Featured Writing</a>
        <a href="#dextrah-post">DextrAH</a>
        <a href="#rmp-post">RMP</a>
        <a href="#reading-map">Reading Map</a>
        <a href="#more-writing">More Writing</a>
      </nav>
    </div>
  </aside>

  <section class="blog-index-shell">
    <section id="featured-writing" class="blog-featured">
      <div class="blog-section-head">
        <p class="blog-kicker">Featured Writing</p>
        <h1>Robotics notes</h1>
        <p>
          Technical explanations of robot learning, motion generation, and the
          ideas that connect learning systems to physical behavior.
        </p>
      </div>

      <div class="blog-grid">
        {% for featured_title in featured_titles %}
          {% for post in site.posts %}
          {% if post.title == featured_title %}
            <article id="{% if post.title == 'From DextrAH-G to DextrAH-RGB' %}dextrah-post{% else %}rmp-post{% endif %}" class="blog-card">
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
                  {% endif %}
                </div>
                <div class="card-content">
                  <h2 class="card-title">{{ post.title }}</h2>
                  <time class="card-date" datetime="{{ post.date | date_to_xmlschema }}">
                    {{ post.date | date: "%b %-d, %Y" }}
                  </time>
                  {% if post.tags %}
                    <p class="card-tags">
                      {% for tag in post.tags limit: 3 %}
                        <span class="tag">#{{ tag }}</span>
                      {% endfor %}
                    </p>
                  {% endif %}
                </div>
              </a>
            </article>
          {% endif %}
          {% endfor %}
        {% endfor %}
      </div>
    </section>

    <section id="reading-map" class="blog-secondary">
      <div class="blog-section-head">
        <p class="blog-kicker">Reading Map</p>
        <h2>About these notes</h2>
        <p>
          Two short entries on the purpose of this blog and the approach behind
          its technical explanations.
        </p>
      </div>

      <div class="featured-list">
        {% for post in site.posts %}
          {% if reading_map_titles contains post.title %}
            <article class="featured-post">
              <a class="featured-post-link" href="{{ post.url | relative_url }}">
                <div class="featured-post-meta">
                  <span>{{ post.date | date: "%b %-d, %Y" }}</span>
                  {% if post.tags and post.tags.size > 0 %}
                    <span>{{ post.tags[0] | replace: "_", " " }}</span>
                  {% endif %}
                </div>
                <h3>{{ post.title }}</h3>
                <p>{{ post.content | markdownify | strip_html | normalize_whitespace | truncate: 220 }}</p>
              </a>
            </article>
          {% endif %}
        {% endfor %}
      </div>
    </section>

    <section id="more-writing" class="blog-secondary">
      <div class="blog-section-head">
        <p class="blog-kicker">More Writing</p>
        <h2>Research perspective</h2>
      </div>

      <div class="featured-list">
        {% for post in site.posts %}
          {% if post.title == "Toward General Physical Intelligence" %}
            <article class="featured-post">
              <a class="featured-post-link" href="{{ post.url | relative_url }}">
                <div class="featured-post-meta">
                  <span>{{ post.date | date: "%b %-d, %Y" }}</span>
                  <span>robotics</span>
                </div>
                <h3>{{ post.title }}</h3>
                <p>{{ post.content | markdownify | strip_html | normalize_whitespace | truncate: 220 }}</p>
              </a>
            </article>
          {% endif %}
        {% endfor %}
      </div>
    </section>
  </section>
</section>
