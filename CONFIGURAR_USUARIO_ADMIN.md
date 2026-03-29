# Instrucciones para crear usuario administrador

## Opción 1: Usando Azure Portal (MÁS FÁCIL)

1. Abre [Azure Portal](https://portal.azure.com)
2. Ve a tu Storage Account: **storagetestarauco**
3. En el menú lateral, busca **Storage Browser** o **Explorador de almacenamiento**
4. Navega a **Tables** > **Users**
5. Si la tabla "Users" no existe, créala
6. Click en **Add Entity** (Agregar entidad)
7. Completa los campos:

```
PartitionKey: User
RowKey: admin
Username: admin
PasswordHash: jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=
Role: Admin
IsActive: true
CreatedAt: 2024-03-28T10:00:00Z
```

8. Click en **Add** (Agregar)

## Opción 2: Calcular tu propio hash de contraseña

Si quieres usar una contraseña diferente, calcula el hash SHA256:

### En PowerShell:
```powershell
$password = "TU_CONTRASEÑA_AQUI"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($password)
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$hashBytes = $sha256.ComputeHash($bytes)
$passwordHash = [Convert]::ToBase64String($hashBytes)
Write-Host "Password Hash: $passwordHash"
```

### En C# (puedes ejecutar en el backend):
```csharp
using System.Security.Cryptography;
using System.Text;

var password = "TU_CONTRASEÑA_AQUI";
var bytes = Encoding.UTF8.GetBytes(password);
var hash = SHA256.HashData(bytes);
var passwordHash = Convert.ToBase64String(hash);
Console.WriteLine($"Password Hash: {passwordHash}");
```

## Credenciales por defecto

```
Username: admin
Password: admin123
```

⚠️ **IMPORTANTE**: 
- El hash mostrado arriba corresponde a la contraseña: **admin123**
- Cambia la contraseña en producción
- No compartas las credenciales en repositorios públicos

## Verificar que funciona

1. Levanta el backend en Azure o localmente
2. Ve a la web en http://localhost:3001
3. Serás redirigido a /login
4. Ingresa:
   - Usuario: **admin**
   - Contraseña: **admin123** (o la que hayas configurado)
5. Deberías poder acceder al panel de administración

## Crear usuarios adicionales

Repite el proceso en Azure Portal, pero cambia:
- `RowKey`: El nuevo nombre de usuario
- `Username`: El nuevo nombre de usuario
- `PasswordHash`: El hash de la nueva contraseña
