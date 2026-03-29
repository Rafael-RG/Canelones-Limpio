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
PasswordHash: admin123
Role: Admin
IsActive: true
CreatedAt: 2024-03-28T10:00:00Z
```

8. Click en **Add** (Agregar)

## Credenciales por defecto

```
Username: admin
Password: admin123
```

⚠️ **NOTA**: 
- La contraseña se guarda en texto plano en el campo `PasswordHash`
- Aunque el campo se llama "PasswordHash", guardamos la contraseña directamente
- Cambia la contraseña por una segura en producción

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
- `PasswordHash`: La nueva contraseña (sin hash, directamente el texto)
