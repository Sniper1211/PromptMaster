# Implement Colorful Keyword Cover for Non-Image Prompts

To replace the "Need Image" placeholder with a more visual "Colorful + Keyword" design, I will modify the `PromptCard` component.

## Technical Implementation

### 1. Define Color Palette
**File:** [PromptCard.tsx](file:///Users/lxx/coding/PromptMaster/src/components/PromptCard.tsx)
- Create a palette of vibrant/brutalist background colors (e.g., Red, Yellow, Purple, Orange, Teal, Pink).

### 2. Update Card Rendering Logic
**File:** [PromptCard.tsx](file:///Users/lxx/coding/PromptMaster/src/components/PromptCard.tsx)
- In the `PromptCard` component, locate the `else` block for `!prompt.previewImageUrl`.
- Replace the existing "Need Image" placeholder `div` with a new container.
- **Logic**:
  - Deterministically select a background color from the palette based on `prompt.id` (using character code sum).
  - Apply the selected background color to the container (`aspect-video`).
  - Render the `prompt.tags` inside the container.
  - **Styling**:
    - Use a flex/grid layout to center or artfully arrange the tags.
    - Style tags with high contrast (e.g., Black text on vibrant background, or white "sticker" style tags).
    - Ensure the "Overlay Actions" (Play/Copy buttons) still appear on hover.

## Verification
- Verify that prompts with images still show the image.
- Verify that prompts *without* images now show a colored background.
- Check that the color is consistent for the same prompt (refresh persistence).
- Ensure tags are legible and the layout looks good in the new Masonry grid.
