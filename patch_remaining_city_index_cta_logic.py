#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
import re
import sys

NEW_SCRIPT = """<script>
const MATCH_API_URL = 'https://mdn-bird-backend.onrender.com/api/matches';

function renderBadge(match) {
  if (!match || !match.status) return 'Plan this match';
  const status = String(match.status).toUpperCase();

  if ((status === 'FT' || status === 'AET' || status === 'PEN') && match.home_score != null && match.away_score != null) {
    return match.badge_text || `${status} ${match.home_score}-${match.away_score}`;
  }
  if (status === 'LIVE' && match.home_score != null && match.away_score != null) {
    return `LIVE ${match.home_score}-${match.away_score}`;
  }
  if (status === 'PLAYED') {
    return 'Played';
  }
  return 'Plan this match';
}

function statusLabel(match) {
  const status = String((match && match.status) || '').toUpperCase();
  if (status === 'UPCOMING') return 'Upcoming';
  if (status === 'LIVE') return 'Live';
  if (status === 'FT') return 'Final';
  if (status === 'AET') return 'Final (AET)';
  if (status === 'PEN') return 'Final (Pens)';
  if (status === 'PLAYED') return 'Played';
  return 'Upcoming';
}

function updateCityCta(matchesById) {
  const cityPlanCta = document.querySelector('[data-city-plan-cta]');
  const cityCtaSubtext = document.querySelector('[data-city-cta-subtext]');
  if (!cityPlanCta) return;

  const cards = Array.from(document.querySelectorAll('[data-match-id]'));
  const hasUpcomingOrLive = cards.some(card => {
    const matchId = card.getAttribute('data-match-id');
    const match = matchesById[matchId];
    const status = String((match && match.status) || '').toUpperCase();
    return status === 'UPCOMING' || status === 'LIVE';
  });

  if (hasUpcomingOrLive) {
    cityPlanCta.textContent = '🔥 Get full matchday plan';
    cityPlanCta.disabled = false;
    cityPlanCta.setAttribute('aria-disabled', 'false');
    cityPlanCta.style.opacity = '1';
    cityPlanCta.style.pointerEvents = 'auto';
    if (cityCtaSubtext) {
      cityCtaSubtext.textContent = 'Use the city gateway for broad planning, then switch to a fixture page if you want match-specific context, timing, and official results where applicable.';
    }
  } else {
    cityPlanCta.textContent = '✅ City schedule completed';
    cityPlanCta.disabled = true;
    cityPlanCta.setAttribute('aria-disabled', 'true');
    cityPlanCta.style.opacity = '0.72';
    cityPlanCta.style.pointerEvents = 'none';
    cityPlanCta.removeAttribute('onclick');
    if (cityCtaSubtext) {
      cityCtaSubtext.textContent = 'All hosted fixtures on this city page are now completed. Match cards remain available as result and venue reference pages.';
    }
  }
}

async function updateScoreBadges() {
  try {
    const response = await fetch(MATCH_API_URL, { method: 'GET' });
    const allMatches = await response.json();

    document.querySelectorAll('[data-match-id]').forEach(card => {
      const matchId = card.getAttribute('data-match-id');
      const badge = card.querySelector('[data-score-badge]');
      const meta = card.querySelector('[data-score-meta]');
      if (!badge || !matchId || !allMatches[matchId]) return;

      const match = allMatches[matchId];
      badge.textContent = renderBadge(match);
      badge.classList.toggle('live', String(match.status).toUpperCase() === 'LIVE');

      if (meta) {
        const parts = meta.textContent.split(' · ');
        if (parts.length >= 3) {
          parts[parts.length - 1] = statusLabel(match);
          meta.textContent = parts.join(' · ');
        }
      }
    });

    updateCityCta(allMatches);
  } catch (error) {
    console.error('Score update failed', error);
  }
}

updateScoreBadges();
</script>"""

SCRIPT_RE = re.compile(r"<script>\s*const MATCH_API_URL\s*=\s*'https://mdn-bird-backend\.onrender\.com/api/matches';.*?updateScoreBadges\(\);\s*</script>", re.S)
CITY_CTA_MARKER = '<button type="button" class="cta-main cta-hard" onclick="startCheckout({product_type:'planning_pass''


def patch_index_html(path: Path) -> bool:
    text = path.read_text(encoding='utf-8')
    original = text
    text = text.replace(CITY_CTA_MARKER, '<button type="button" class="cta-main cta-hard" data-city-plan-cta onclick="startCheckout({product_type:'planning_pass'', 1)
    text = text.replace('<div class="cta-subtext">', '<div class="cta-subtext" data-city-cta-subtext>', 1)
    text, count = SCRIPT_RE.subn(NEW_SCRIPT, text, count=1)
    if count == 0:
        return False
    if text != original:
        path.write_text(text, encoding='utf-8')
        return True
    return False


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
    candidates = sorted(root.rglob('index.html'))
    patched = []
    skipped = []
    for file in candidates:
        try:
            if patch_index_html(file):
                patched.append(str(file))
            else:
                skipped.append(str(file))
        except Exception as exc:
            skipped.append(f'{file} | ERROR: {exc}')

    print('PATCHED:')
    for item in patched:
        print(item)
    print('SKIPPED:')
    for item in skipped:
        print(item)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
