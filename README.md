# Houston Packet Field v2

**Developed by Thomas Hopkins**

An offline-first Progressive Web App for maintaining a personal packet-radio directory, routes, aliases, connection history, command references, equipment profiles, and field observations.

## V2 highlights

- Field Mode quick actions and retest queue
- Multiple routes per station and connection history
- Offline path finder using confirmed topology records
- Aliases, confidence/source, favorites, watch list, stale-record warnings
- Interactive network graph with station-type shapes
- Software-specific command cards: General, BPQ, KA-Node, FBB, Chat
- Equipment profiles and per-log equipment/power/frequency/location
- Frequency, baud, grid, coordinates, sysop, and service fields
- Optional on-device distance sorting when location permission is requested
- BBS and chat-specific record fields, including last activity/login, message-waiting notes, forwarding partners, and regulars
- Discovery Mode parser for pasted J/NODES/MHEARD-style terminal output
- Optional compressed screenshot/photo attachments in connection logs
- JSON full-fidelity backup/import plus CSV table export/import
- Red-light field display mode
- Offline/update-aware PWA shell
- V1 local-data migration when upgrading on the same browser/origin
- Thomas Hopkins branding in the header, about screen, app metadata, and icon monogram
- Native Share Sheet / clipboard sharing for individual station and route summaries
- Separate last-heard and last-tested timestamps

## Privacy / storage model

There is **no cloud sync and no account**. Data stays in browser local storage. Location is only requested when the user taps **Near me** and is kept in memory for that session. Log screenshots are compressed and stored locally.

Browser local storage is finite; many image attachments can fill it. Use JSON backups periodically, especially before clearing Safari website data or changing hosting URLs.

## Deploy to GitHub Pages

Upload all files in this folder to the repository root. In GitHub:

1. **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**
4. Folder: **/(root)**
5. Save

After GitHub publishes it, open the Pages URL in Safari and choose **Share → Add to Home Screen**.

## Important limitation

The Path Finder is a graph search over routes the user has entered or confirmed. It is not a propagation model and does not guarantee that a radio path is currently usable.
