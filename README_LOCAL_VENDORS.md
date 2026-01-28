
# Local vendor files for MatchDay Navigator (Leaflet + MarkerCluster)

This package sets up your repository to **use local vendor files** first and **fall back to CDNs** only if the local files are missing. It avoids running PowerShell or shell scripts locally by using a small **GitHub Actions workflow** that downloads the official builds directly into your repo.

## What this ZIP contains

```
assets/
  vendor/
    leaflet/                  # leaflet.js and leaflet.css will be downloaded here by the workflow
    leaflet.markercluster/    # leaflet.markercluster.js and MarkerCluster.css will be downloaded here by the workflow
.github/
  workflows/
    fetch-vendors.yml         # GitHub Action to fetch vendor files and commit them
```

## How to use

1. **Unzip** these folders at the **root** of your repo (same level as `worldcup-2026/`).
2. Commit and push (so the workflow file is present in your repo on GitHub).
3. In GitHub → **Actions** tab → select **Fetch local vendor files** → **Run workflow**.
   - The action downloads pinned versions:
     - Leaflet **1.9.4**
     - Leaflet.MarkerCluster **1.5.3**
   - It commits them into `assets/vendor/...` using the repository `GITHUB_TOKEN`.
4. Verify the files now exist in your repo:
   - `assets/vendor/leaflet/leaflet.js`
   - `assets/vendor/leaflet/leaflet.css`
   - `assets/vendor/leaflet.markercluster/leaflet.markercluster.js`
   - `assets/vendor/leaflet.markercluster/MarkerCluster.css`
5. Visit your site. Your page loader already tries local vendors first; if present, **no CDN** is used.

## Notes
- The workflow is **manual** by default (workflow_dispatch). You can re-run anytime to refresh vendor files.
- If you prefer automatic updates, change the workflow `on:` section to a schedule.
- Licenses: Leaflet and Leaflet.MarkerCluster are open-source (BSD-2-Clause/MIT). The workflow downloads unmodified official builds.
