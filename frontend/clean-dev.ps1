# Script para limpar cache e reiniciar o servidor de desenvolvimento
Write-Host "Limpando cache do Next.js..." -ForegroundColor Yellow

# Remove diretório .next
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✓ Diretório .next removido" -ForegroundColor Green
}

# Remove cache do node_modules
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "✓ Cache do node_modules removido" -ForegroundColor Green
}

Write-Host "`nCache limpo! Agora execute: npm run dev" -ForegroundColor Green
