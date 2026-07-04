# Frontend Quick Reference

## Important Files
- `globals.css`: Contains all the design tokens. MUST be used for styling.
- `DESIGN.md`: Main design documentation.
- `.agents/HANDOFF_PROTOCOL.md`: Protocol for handing off tasks between agents.
- `.agents/contracts/`: Contains API contracts agreed upon with the backend agent.

## Design Tokens (Tailwind v4)
Always use the variables defined in `globals.css` rather than hardcoded hex values. Example tokens (verify in `globals.css`):
- `bg-canvas`
- `bg-primary`
- `text-ink`
- etc.

## Key Workflows
- **Booking Flow**: Private vs Sharing trip paths.
- **Search Flow**: Interactive filters for finding boats.
- **Captain Dashboard**: Managing trips and completions.
