# 01 · Brief

## In Kia's words

On the Round 03 mocks of the landing site (lightly edited for spelling):

> Amazing! The "glass cases with living rooms" is so good that I have decided to use it as another completely different project. I am going to make a website to list my top 20 TV series and top 20 movies of all time. There we can develop this idea more: a 20-storey building, each floor one movie or series, or something like that. The Vitrines and Specimen designs were also cool, so that website may have all three ways to show the list.
>
> Some comments about the boxes and rooms: they were not as real as I wanted, so the level of detail should improve in the future project. Also the boxes were not the same size or height; one (the Swan station from LOST) even had the glass ceiling shorter than the room walls.

## The project

- **What:** a personal website of Kia's 20 favourite TV series and 20 favourite films.
- **The device:** every title is a small, realistic, *living* room under glass. People move, screens flicker, clocks run. Each room recreates the world of one title through its setting, props, colour and light.
- **Three ways to see the list** (all three mocks are in `mocks/pages/`):
  1. **The building:** a 20-storey glass tower where each floor is one title (from `07-glass-house.html`). Two lists could be two towers side by side, one for series and one for films, or one building with a floor per title. Ask Kia.
  2. **The vitrines:** a gallery hall of glass cases you walk along (from `05-vitrines.html`).
  3. **The specimen:** one case at a time in daylight; the rooms rise and sink through the plinth (from `06-specimen.html`).
- **Quality bar:** as real as possible. Kia's reference was a set of glass-box dioramas by Ryan Sael, made with Claude: a data centre, a river lab and an apartment cut-away. They had dense props, soft real light, tilt-shift depth of field, a glass case on a dark base and small labels. The look is "exquisite scale model", never cartoon.
- **Kia's taste in general** (from the landing site): graphically astonishing, luxurious, elegant, very 3D, out of the box. Kia rejected cards in a grid, chaotic motion, toy-like physics and anything childish.

## What Kia said about these mocks

| Point | What it means for the next round |
| --- | --- |
| Not as real as wanted | Raise detail everywhere: real materials, textures, bevels, denser props, believable people. See `03-lessons-and-fixes.md`, section "More real". |
| Boxes not the same size or height | Every case must be identical. Use one fixed model scale and one room footprint for all titles. |
| The Swan's glass was shorter than its walls | A scaling bug, explained and fixed in `03-lessons-and-fixes.md`. Never let a room exceed its case. |
| The rest | Kia liked all three layouts and wants all three on the new site. |

## Open questions for Kia (ask early, multiple choice where possible)

1. The two lists: their titles, in rank order. Is the order fixed (ranked) or just "top 20"?
2. One building or two (series and films)? Is the floor order the rank (1 at the top)?
3. What goes on each floor's label: title, year, a line on why Kia loves it, a link (to what: trailer, IMDb, Letterboxd)?
4. Should we avoid spoilers in the rooms (e.g. choose an early, iconic scene)?
5. People in rooms: suggestive figures (costume, hair, props) rather than actor likenesses? Recommended, for taste and for publicity and likeness rights.
6. Sound: off by default, as on the landing site?
7. Phone experience: the same building scaled down, or a lighter view?
8. Stack and hosting: GitHub Pages like Kia's other projects? Astro + three.js, as planned for the landing site?

## Things to settle in the first round

- The **room module**: one footprint and height for every room (see fix 1 in `03-lessons-and-fixes.md`), so cases match and floors stack.
- A **realism pass** on one room until Kia says yes, before making 40.
- A **budget per room**: lights, shadow casters, triangles and texture memory, so 20 floors can share one page. Only rooms near the camera should run their animations; see `02-how-it-works.md`, section "Performance".
