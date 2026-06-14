# Run once after: npx vercel login
# Sets Google + NextAuth + Neon env vars on Vercel (Production)
param(
  [Parameter(Mandatory = $true)][string]$GoogleClientId,
  [Parameter(Mandatory = $true)][string]$GoogleClientSecret,
  [Parameter(Mandatory = $true)][string]$NextAuthSecret,
  [Parameter(Mandatory = $true)][string]$DatabaseUrl,
  [string]$NextAuthUrl = "https://vocabulary-proj.vercel.app"
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

function Set-VercelEnv($Name, $Value) {
  Write-Host "Setting $Name ..."
  $Value | npx vercel env add $Name production --force 2>&1 | Out-Host
}

Set-VercelEnv "GOOGLE_CLIENT_ID" $GoogleClientId
Set-VercelEnv "GOOGLE_CLIENT_SECRET" $GoogleClientSecret
Set-VercelEnv "NEXTAUTH_SECRET" $NextAuthSecret
Set-VercelEnv "NEXTAUTH_URL" $NextAuthUrl
Set-VercelEnv "DATABASE_URL" $DatabaseUrl

Write-Host ""
Write-Host "Done. Run: npx vercel --prod  OR redeploy from Vercel dashboard."
