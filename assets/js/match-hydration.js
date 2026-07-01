function hydrateMatchCard(card, match) {
    const teamSpans =
        card.querySelectorAll('.match-teams span');

    if (
        match.home_team &&
        match.away_team &&
        teamSpans.length >= 5
    ) {
        teamSpans[1].textContent =
            match.home_team;

        teamSpans[4].textContent =
            match.away_team;
    }
}