# 🐾 FitPet — Frontend (React + Vite + Tailwind v3)

**Estado:** Entrega funcional inicial.  
**Objetivo:** UI web para gestionar el bienestar de mascotas (registro/login, base de navegación, componentes reutilizables, theme claro/oscuro).  
**Backend:** Java/Spring Boot (Docker + MySQL). Endpoints de auth operativos. Puedes acceder desde 👉 https://github.com/Marisol-Mancera/fitpet-backend

---

## 🚀 Estado del proyecto (31/10/2025)

- ✅ **Login** operativo con JWT (token guardado en `localStorage`).
- ✅ **Arquitectura** modular por features.
- ✅ **Tests** unitarios: Login, Register, ThemeToggle.
- ✅ **Tailwind v3** (sin CSS variables de temas).
- ⚠️ **Dark Mode**: toggle funcionando, falta aplicar clases `dark:` en todos los componentes.
- ⚙️ **Docker**: backend y MySQL listos vía `docker compose`.

---

## 🧩 Características 

- **Autenticación**
  - Registro: validación granular (email, longitud, número, símbolo, confirmación).
  - Login: guarda **JWT** y redirige.
- **UI/UX**
  - Header, Footer, Home rediseñados (estilo “Margarita”).
  - Componentes reutilizables: `Button`, `Input`, `ThemeToggle`.
  - Responsive (Mobile + Desktop).
- **Arquitectura FE**
  - Rutas con React Router.
  - `PrivateRoute` para proteger páginas.
- **Pruebas**
  - Vitest + React Testing Library.
  - `setupTests.js` con `matchMedia` mock global.

---

## 🧠 Stack

- **React 18 + Vite**
- **TailwindCSS v3** (`darkMode: 'class'`)
- **Vitest** + **React Testing Library**
- **Axios**
- **ESLint / Prettier**
- **Docker / Docker Compose** (stack full: backend + MySQL)

---

## ⚙️ Instalación y ejecución (Frontend)

```bash
git clone https://github.com/Marisol-Mancera/fitpet-frontend
cd fitpet_frontend
npm install
npm run dev
```


```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

> **Endpoints usados en esta versión (Auth):**  
> Registro → `POST /auth/registro`  
> Login → `POST /auth/token`

---

## 🐋 Back + DB con Docker (referencia)

El `docker compose` vive en el backend. Para levantar el stack completo:

```bash
# Desde la carpeta del backend
docker compose up --build
```

**Servicios:**
- **MySQL** → `localhost:3307` (interno `3306`)
- **Backend** → `http://localhost:8080`

**Spring Profile activo:** `mysql`.

---

## 📁 Estructura del proyecto (Frontend)

```
fitpet_frontend/
├── src/
│   ├── app/
│   │   └── routes/
│   │       └── router.jsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   └── __tests__/
│   │   │   │       ├── LoginPage.test.jsx
│   │   │   │       └── RegisterPage.test.jsx
│   │   │   ├── services/
│   │   │   │   └── authService.js
│   │   │   └── utils/
│   │   │       └── validation.js
│   │   ├── admin/
│   │   │   └── pages/AdminPage.jsx
│   │   ├── pet/
│   │   │   └── pages/PetPage.jsx
│   │   └── home/HomePage.jsx
│   ├── shared/
│   │   ├── assets/logo.svg
│   │   ├── components/
│   │   │   ├── auth/PrivateRoute.jsx
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Header.jsx
│   │   │       ├── Footer.jsx
│   │   │       ├── ThemeToggle.jsx
│   │   │       └── __tests__/
│   │   │           ├── ThemeToggle.test.jsx
│   │   │           └── Footer.test.jsx
│   │   └── layout/
│   │       ├── AppLayout.jsx
│   │       └── CredentialsLayout.jsx
│   ├── setupTests.js
│   ├── index.css
│   ├── main.jsx
│   └── tailwind.config.js
├── package.json
└── vite.config.js
```

---

## 🎨 Tailwind (config y paleta)

`tailwind.config.js` (extracto):
```js
export default {
  darkMode: 'class',
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'fp-primary': { 500:'#155B6D', 600:'#0F4C5C', 700:'#0B3944' },
        'fp-mint': { 500:'#7AD9C0', 600:'#3CBFA1' },
        'fp-warm': { 500:'#FFC857' },
        'teal': { 100:'#CEEBD1' }
      }
    }
  },
  plugins: []
}
```

**Paleta base:**

| Nombre | Hex | Uso |
|---|---|---|
| `fp-primary-600` | `#0F4C5C` | Primario |
| `fp-mint-500` | `#7AD9C0` | Acento |
| `fp-warm-500` | `#FFC857` | Avisos / CTA |
| `teal-100` | `#CEEBD1` | Fondos suaves |

---

## 🔐 Autenticación (frontend)

`authService.js` (resumen):
```js
export const login = async (email, password) => { /* POST /auth/token */ }
export const register = async (email, password) => { /* POST /auth/registro */ }
export const saveToken = (t) => localStorage.setItem('token', t)
export const getToken = () => localStorage.getItem('token')
export const removeToken = () => localStorage.removeItem('token')
export const isAuthenticated = () => !!getToken()
```

Rutas protegidas:
```jsx
// router.jsx
{
  path: '/admin',
  element: <PrivateRoute><AdminPage/></PrivateRoute>
}
```

---

## 🧪 Tests

**Stack:** Vitest + React Testing Library

```bash
npm run test
```

- **RegisterPage.test.jsx** → 8/8 tests (validaciones granulares).
- **LoginPage.test.jsx** → flujo básico y almacenamiento de token.
- **ThemeToggle.test.jsx** → toggle con `matchMedia` mock global en `setupTests.js`.
- **Pendientes** → Header, Footer (parcial), HomePage, Router.

`setupTests.js` (extracto):
```js
import { vi } from 'vitest'
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(q => ({
      matches:false, media:q,
      addListener:vi.fn(), removeListener:vi.fn(),
      addEventListener:vi.fn(), removeEventListener:vi.fn(),
      dispatchEvent:vi.fn()
    }))
  })
}
```

---

## 🧭 Roadmap corto (próximas horas)

1) **Arreglar Dark Mode**  
   - Añadir `dark:` en Header, Footer, Inputs, Cards, Home.

2) **Rutas protegidas completas**  
   - Integrar `PrivateRoute` en `/mascotas` y demás.

3) **HU2: CRUD Mascotas (Frontend)**  
   - `PetPage` con listado y formulario (create/update/delete).  
   - Tests de componentes y servicios.

4) **Tests faltantes**  
   - Header, Footer, HomePage, Router.

---

## 🧱 Convenciones del proyecto

- **Código:** `camelCase`  
- **Tests (nombres de métodos):** `snake_case`  
- **Principios:** **DRY**, **KISS**, **SOLID**, **YAGNI**  
- **Commits:** **Conventional Commits** (`feat:`, `fix:`, `test:`, `refactor:`, `chore:`, `docs:`)

---

## 🧷 Notas útiles

- **Backend base URL:** `http://localhost:8080/api/v1`
- **Auth endpoints:**  
  - `POST /auth/registro`  
  - `POST /auth/token`
- **JWT:** guardado en `localStorage` como `token`.

---

## 👩‍💻 Créditos / Disclaimer

Proyecto académico del bootcamp. Uso educativo, sin garantías.  
Frontend: **FitPet (v1 entrega)**.  
Autora: **Marisol Mancera**.

--- 
