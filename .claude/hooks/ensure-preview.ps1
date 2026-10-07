# Keeps the site preview (Next.js dev server on port 3217) running.
# Run by Claude Code hooks (.claude/settings.local.json) at session start and after every file edit or shell command.
# If nothing is listening on 3217, it starts `npm run dev -- -p 3217` in its own hidden window and returns at once.
$ErrorActionPreference = 'SilentlyContinue'
$root = 'C:\YAM ads'
$port = 3217
if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) { exit 0 }
New-Item -ItemType Directory -Force -Path (Join-Path $root '.work') | Out-Null
$log = Join-Path $root '.work\preview.log'
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', "npm run dev -- -p $port > `"$log`" 2>&1" -WorkingDirectory $root -WindowStyle Hidden
exit 0
