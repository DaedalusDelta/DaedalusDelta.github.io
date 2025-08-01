---
layout: page
title: Blog
permalink: /blog/
---

<div class="blog-grid">
  {% for post in site.posts %}
    <div class="blog-card">
      <a href="{{ post.url }}">
        <div class="card-media">
          {% if post.video %}
            <video 
              class="card-video"
              src="{{ post.video | relative_url }}"
              muted
              loop
              autoplay
              playsinline
            ></video>
          {% else %}
            <img 
              src="{{ post.image | relative_url }}" 
              alt="Cover image for {{ post.title }}"
            >
          {% endif %}
        </div>
        <h2 class="card-title">{{ post.title }}</h2>
        <time class="card-date" datetime="{{ post.date | date_to_xmlschema }}">
          {{ post.date | date: "%b %-d, %Y" }}
        </time>
      </a>
    </div>
  {% endfor %}
</div>