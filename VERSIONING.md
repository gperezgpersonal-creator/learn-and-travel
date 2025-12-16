# Estrategia de Versionado (Git Flow)

Para mantener una versión estable pública (V1) y seguir trabajando en mejoras futuras (V2), utilizamos ramas de Git.

## Ramas Principales

### 1. `main` (Producción)
- **Qué es:** Es la "verdad absoluta". Lo que hay aquí es lo que el público ve en `learnandtravel.com`.
- **Regla de oro:** Nunca se sube código roto o incompleto aquí.
- **Estado actual:** Representará la **Versión 1.0.0** (Sitio informativo limpio, sin login, con página Tec protegida).

### 2. `develop` (Desarrollo / V2)
- **Qué es:** Es tu mesa de trabajo. Aquí desarrollamos las nuevas funciones (como el Login, Dashboard, nuevos programas).
- **Regla:** Aquí sí podemos tener cosas "en construcción".
- **Estado futuro:** Aquí reactivaremos el botón de "Login" que ocultamos en `main`.

## Flujo de Trabajo Práctico

### Paso 1: Congelar la V1
Una vez que aprobemos los cambios actuales (Ocultar login/programas + Página Tec), haremos:
```bash
git checkout main
git tag v1.0.0
```
Esto crea una "foto" permanente de esta versión.

### Paso 2: Trabajar en la V2
Para agragar nuevas funciones sin afectar lo publicado, creamos una rama paralela:
```bash
git checkout -b develop
# O para algo específico:
git checkout -b feature/login-v2
```
En esta rama, **descomentamos** el código que ocultamos y seguimos programando.

### Paso 3: Publicar la V2
Cuando la V2 esté perfecta en la rama `develop`, la "mezclamos" (merge) con `main`:
```bash
git checkout main
git merge develop
git tag v2.0.0
```

---

## Cambios Realizados para V1.0.0 (Actual)

### Elementos Ocultos (Feature Flagging)
Se han ocultado los siguientes elementos para simplificar el lanzamiento inicial:
- **Header:** Enlace "Programas" y Botón "Iniciar Sesión".
- **Home:** Sección "Tipos de Programas" y "Programas Destacados".
- **Footer:** Enlace "Programas".
- **About:** Sección "Nuestro Equipo" y Botón "Ver programas".

### Nuevas Características
- **Página Protegida TEC:** Nueva ruta `/tec-de-monterrey` protegida con contraseña simple (`tec2025` o `TEC2025`).
