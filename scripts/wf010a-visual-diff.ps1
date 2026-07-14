$ErrorActionPreference = 'Stop'

$root = 'C:\Users\Dell-User\OneDrive\DEVELOPMENT\WEBSITES\pcs-core'
$canon = 'C:\Users\Dell-User\OneDrive\DEVELOPMENT\WEBSITES\pro-court-sports'
$out = Join-Path $root 'artifacts\visual-diff'
New-Item -ItemType Directory -Force -Path $out | Out-Null

$canonicalPng = Join-Path $out 'canonical-home.png'
$refactorPng = Join-Path $out 'wf010a-home.png'
$diffPng = Join-Path $out 'diff-home.png'

$env:PORT = '3101'
$p1 = Start-Process node -ArgumentList 'server.js' -WorkingDirectory $canon -PassThru
try {
  for ($i = 0; $i -lt 400; $i++) {
    try {
      Invoke-WebRequest 'http://127.0.0.1:3101/' -UseBasicParsing | Out-Null
      break
    }
    catch {}
  }

  npx playwright screenshot --browser chromium --viewport-size "1440,3600" --full-page --wait-for-timeout 1200 "http://127.0.0.1:3101/" "$canonicalPng"
}
finally {
  Stop-Process -Id $p1.Id -Force -ErrorAction SilentlyContinue
}

$env:PORT = '3102'
$p2 = Start-Process node -ArgumentList 'src/server.js' -WorkingDirectory $root -PassThru
try {
  for ($i = 0; $i -lt 400; $i++) {
    try {
      Invoke-WebRequest 'http://127.0.0.1:3102/' -UseBasicParsing | Out-Null
      break
    }
    catch {}
  }

  npx playwright screenshot --browser chromium --viewport-size "1440,3600" --full-page --wait-for-timeout 1200 "http://127.0.0.1:3102/" "$refactorPng"
}
finally {
  Stop-Process -Id $p2.Id -Force -ErrorAction SilentlyContinue
}

npx -y -p pixelmatch -p pngjs node .\scripts\wf010a-compare-images.js "$canonicalPng" "$refactorPng" "$diffPng"
