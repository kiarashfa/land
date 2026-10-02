# 04 · Game design (proposals to put to Kia)

These are starting points, not decisions. Present them to Kia as mocks and multiple-choice questions.

## The core loop

1. **The lot arrives.** The room hushes, the lot cools in on the turntable, the screen shows the catalogue photograph, and the card gives the name, maker, date and one line of description.
2. **The player judges.** The judgement depends on the mode (below), and is timed by the board's split-flap countdown.
3. **The hammer.** The gavel falls, the hammer price flips onto the board, and the room reacts (a murmur, applause for a record).
4. **The lesson.** The auctioneer explains in two or three sentences what drove the price: provenance, rarity, condition, demand, timing. One key idea is highlighted and collected (see "Value lessons").
5. **Next lot.** A session is a "sale" of 8–12 lots. That's short, like a Perceptense module.

## Game modes

| Mode | How it plays | What it teaches |
| --- | --- | --- |
| **Hammer price** | Slide a paddle along a log scale to guess the price; score by how close (log error). | Orders of magnitude; anchoring. |
| **Higher or lower** | Two lots side by side on twin plinths; pick the one that sold for more. | Comparing value drivers. |
| **The appraiser** | Read the condition report and provenance, then set the estimate range (low and high). | How experts reason. |
| **Bid against the room** | A live auction: the AI bidders raise paddles; you bid or drop out. Win the lot at the best price without overpaying your budget. | Auction dynamics; the winner's curse. |
| **Sort the sale** | Order five lots from least to most valuable. | Relative value. |
| **Daily sale** | The same short sale for everyone each day, shareable result (no accounts needed). | Habit; talking about it. |

## Value lessons (the curriculum)

Each lot illustrates one idea; players collect them like catalogue entries:

- **Provenance:** who owned it changes what it is worth.
- **Rarity and survival:** how many exist today.
- **Condition:** original, restored, damaged.
- **Authorship and attribution:** "by", "workshop of", "after".
- **Material versus artistry.**
- **Demand and taste:** prices follow fashion.
- **Timing:** markets, records, the first and last of something.
- **Story:** history, celebrity, a famous moment.
- **Estimate versus hammer versus premium:** what the numbers mean.
- **Price is not value:** sentimental, cultural, scientific value.

## Content model (per lot)

```json
{
  "id": "lot-0042",
  "title": "…", "maker": "…", "date": "…", "category": "watch | painting | wine | car | design | everyday | …",
  "image": { "src": "…", "credit": "…", "licence": "CC0 / public domain / own" },
  "model": "optional glTF for the plinth",
  "estimate": { "low": 0, "high": 0, "currency": "GBP" },
  "result": { "hammer": 0, "premium": 0, "date": "…", "sale": "…", "source": "URL or citation" },
  "lesson": "provenance | rarity | condition | …",
  "story": "two or three sentences for the auctioneer",
  "difficulty": 1
}
```

## Scoring and feedback

- Score with logarithmic error for prices, so being out by a factor of 2 costs the same at £100 and at £10 million.
- Give immediate, kind feedback: "You were within 20%: an expert's eye." Show the real estimate band against the player's guess.
- Optional streaks and daily results kept in local storage only. No trackers, no accounts unless Kia wants them.

## Presentation notes

- The saleroom is the stage: keep the lot, board, screen, rostrum and card. Add a clear game UI layer (paddle slider, choice buttons) in the same luxurious language: brass, lacquer, serif display type.
- On phones the card becomes a bottom sheet and the camera frames the lot and the board.
- Sound (off by default): gavel, room tone, murmurs and applause, an optional auctioneer voice.
- Accessibility: every value and question also in HTML text; keyboard play; reduced motion respected.
