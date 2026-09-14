---
layout: post
title: "Toward General Physical Intelligence"
date: 2026-08-28
tags: [robotics, embodied_ai, robot_learning, manipulation]
---

# Toward general physical intelligence

I see robotics as the work of grounding intelligence in physical experience. Language and vision are powerful representations, but they are not the world itself. An intelligence that can investigate the world must be able to act, encounter consequences, and revise its understanding through interaction.

My long-term interest is in embodied intelligence as a scientific partner: a system that can help expand how humanity explores, understands, and learns from the physical world.

## Progress is a ladder

I do not expect general physical intelligence to arrive through a single method or a single decisive breakthrough. Robotics progresses through interdependent stages: enough generalization and scale at one stage creates the conditions for the next. Simulation, imitation learning, reinforcement learning, and classical control are complementary tools whose roles change as capabilities and data improve.

This means that there may be several feasible routes through each stage. Progress depends on investigating those routes carefully rather than assuming that one paradigm is sufficient for every problem.

## Why manipulation

Robotics includes locomotion, navigation, and manipulation. I am currently most interested in manipulation because it is the contact-rich part of the field: it makes tool use, experimentation, and precise interaction possible.

Learned systems can already perform impressive manipulation behaviors, but the space of useful behaviors is enormous. Whether an action succeeds depends on the object, scene, goal, embodiment, and the details of the interaction. This makes behavior generalization—learning behaviors that remain useful beyond a single demonstration or familiar setting—a central problem for my research.

## A research path

My first exposure to robotics research was BiDex, which showed me both the promise of learned dexterous behavior and the scale of the challenge ahead. It made clear that collecting useful data and training a policy are only the beginning: robust behavior must account for the enormous variety of objects, scenes, and tasks encountered in the world.

With IFG, I explored a simulation-driven route to scalable functional grasp generation. Optimization-based methods can provide physical and geometric validity, while internet-scale vision models can provide functional intent about how an object should be used. Combining these strengths made it possible to generate diverse, functional grasp data at scale in simulation.

My subsequent work has continued to ask how broader manipulation behaviors can be discovered, generalized, and deployed. I am especially interested in the transition from local expert behaviors to context-aware generalist policies, and in using real-world data to refine behavior generalists such as vision-language-action models.

## Learning needs control

Learned policies are only one part of a real robot. The sim-to-real gap makes motion generation and control essential for reliable physical behavior. This has led me to study Riemannian Motion Policies and geometric fabrics, and to reimplement these frameworks in order to understand how structured controllers and learned policies can work together.

The central question I keep returning to is simple: once we have broader behavior generalists, how can we deploy and refine them so that they become genuinely useful in the real world? Answering that question could open the next stage of robotics, where embodied agents can gather experience, improve their behaviors, and explore more autonomously.
