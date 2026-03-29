# Script para crear usuario administrador en Azure Table Storage
# Ejecutar desde PowerShell en la carpeta del backend

# IMPORTANTE: Cambia estos valores
$username = "admin"
$password = "admin123"  # CAMBIAR EN PRODUCCIÓN
$connectionString = "TU_CONNECTION_STRING_AQUI"

# Calcular hash de la contraseña (SHA256)
$bytes = [System.Text.Encoding]::UTF8.GetBytes($password)
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$hashBytes = $sha256.ComputeHash($bytes)
$passwordHash = [Convert]::ToBase64String($hashBytes)

Write-Host "=== Crear Usuario Administrador ===" -ForegroundColor Green
Write-Host "Username: $username" -ForegroundColor Cyan
Write-Host "Password Hash: $passwordHash" -ForegroundColor Yellow

# Verificar si se tiene Azure.Data.Tables
try {
    Add-Type -Path "$env:HOME\.nuget\packages\azure.data.tables\12.11.0\lib\net6.0\Azure.Data.Tables.dll"
    Write-Host "Azure.Data.Tables cargado" -ForegroundColor Green
} catch {
    Write-Host "Error: No se pudo cargar Azure.Data.Tables" -ForegroundColor Red
    Write-Host "Instala con: dotnet add package Azure.Data.Tables" -ForegroundColor Yellow
    exit
}

Write-Host "`n=== Datos del usuario ===" -ForegroundColor Cyan
Write-Host "PartitionKey: User" -ForegroundColor White
Write-Host "RowKey: $username" -ForegroundColor White
Write-Host "Username: $username" -ForegroundColor White
Write-Host "PasswordHash: $passwordHash" -ForegroundColor White
Write-Host "Role: Admin" -ForegroundColor White
Write-Host "IsActive: true" -ForegroundColor White

Write-Host "`n=== INSTRUCCIONES ===" -ForegroundColor Yellow
Write-Host "1. Abre Azure Portal (https://portal.azure.com)" -ForegroundColor White
Write-Host "2. Ve a tu Storage Account (storagetestarauco)" -ForegroundColor White
Write-Host "3. Ve a Storage Browser > Tables > Users" -ForegroundColor White
Write-Host "4. Click en 'Add Entity' y crea con estos valores:" -ForegroundColor White
Write-Host "   - PartitionKey: User" -ForegroundColor Gray
Write-Host "   - RowKey: $username" -ForegroundColor Gray
Write-Host "   - Username (String): $username" -ForegroundColor Gray
Write-Host "   - PasswordHash (String): $passwordHash" -ForegroundColor Gray
Write-Host "   - Role (String): Admin" -ForegroundColor Gray
Write-Host "   - IsActive (Boolean): true" -ForegroundColor Gray
Write-Host "   - CreatedAt (DateTime): $(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')" -ForegroundColor Gray

Write-Host "`n=== Credenciales de Login ===" -ForegroundColor Green
Write-Host "Username: $username" -ForegroundColor Cyan
Write-Host "Password: $password" -ForegroundColor Cyan
Write-Host "`n⚠️  IMPORTANTE: Cambia la contraseña en producción!" -ForegroundColor Red
