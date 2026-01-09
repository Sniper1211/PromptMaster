# Implement Masonry (Waterfall) Layout

To achieve the requested waterfall layout, I will modify the grid container to use CSS columns and ensure the prompt cards adapt to their content height.

## Technical Implementation

### 1. Update Grid Layout
**File:** [PromptGrid.tsx](file:///Users/lxx/coding/PromptMaster/src/components/home/PromptGrid.tsx)
- Replace CSS Grid (`grid-cols-*`) with CSS Columns (`columns-*`) for the waterfall effect.
- Wrap each card in a container with `break-inside-avoid` to prevent cards from being split across columns.
- Add bottom margin (`mb-6`) to cards to create vertical spacing (replacing grid gap).

### 2. Adjust Card Styling
**File:** [PromptCard.tsx](file:///Users/lxx/coding/PromptMaster/src/components/PromptCard.tsx)
- Remove `h-full` from the main card container to allow the card to shrink/grow based on its content (essential for the waterfall look).
- Update the image style from `h-full` to `h-auto` to respect the natural aspect ratio of the images, further enhancing the waterfall variation.

## Verification
- Confirm that cards stack vertically within columns (top-to-bottom order).
- Verify that cards with different text lengths or image aspect ratios stack cleanly without gaps.
- Check that the hover effects (scale/shadow) still work without causing layout jitter.
