# Local portfolio server

The macOS LaunchAgent `com.codex.portfolio.localserver` keeps the portfolio
development server available at <http://localhost:3000/>.

The service starts when the user logs in and restarts if the server exits. It
runs with reduced scheduling and I/O priority and listens only on the local
machine.

Useful commands:

```sh
launchctl print gui/502/com.codex.portfolio.localserver
launchctl kickstart -k gui/502/com.codex.portfolio.localserver
launchctl bootout gui/502 "$HOME/Library/LaunchAgents/com.codex.portfolio.localserver.plist"
```

The small installed launcher and its logs live in
`~/Library/Application Support/CodexPortfolio/`. The project itself remains in
this workspace. Logs may be deleted whenever the server is stopped. The source
backup is stored beside the project in `../backups/`.
