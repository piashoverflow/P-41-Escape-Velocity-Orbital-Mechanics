# P-41: Escape Velocity & Orbital Conics Mechanics Lab

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Author: Shamsuddin Piash](https://img.shields.io/badge/Author-Shamsuddin%20Piash-0ea5e9.svg)](https://piashoverflow.github.io)
[![BUET ME](https://img.shields.io/badge/Institution-BUET%20'25-10b981.svg)](https://buet.ac.bd)

> **Interactive Computational Orbital Dynamics & Astrophysical Simulator**  
> Developed by **Shamsuddin Piash** | Department of Mechanical Engineering, Bangladesh University of Engineering and Technology (BUET).  
> Covers **HSC Physics 1st Paper, Chapter 6 (Gravitation & Gravity / মহাকর্ষ ও অভিকর্ষ)** — Topic Code **P-41**.

---

## 🔬 Core Physics Principles & Formulations

### 1. Escape Velocity Derivation (মুক্তিবেগ)
Minimum initial speed required for a projectile launched from planetary surface to escape gravitational attraction completely:
$$E_{\text{initial}} = \frac{1}{2}m v_e^2 - \frac{GMm}{R} = 0 \implies v_e = \sqrt{\frac{2GM}{R}} = \sqrt{2gR}$$
- For Earth ($g = 9.81\text{ m/s}^2, R = 6,371\text{ km}$):
  $$v_e \approx 11.2 \text{ km/s} \approx 40,320 \text{ km/h}$$
- Relation to circular orbital speed $v_0 = \sqrt{gR} \approx 7.91\text{ km/s}$:
  $$v_e = \sqrt{2} \cdot v_0 \approx 1.414 v_0$$

---

### 2. Newton's Cannonball & Conic Trajectories (কনিক্স কক্ষপথ)
Horizontal projectile launched from mountain peak behaves according to specific energy $E = \frac{v^2}{2} - \frac{\mu}{r}$:
1. **$v < 7.91\text{ km/s}$**: Sub-orbital elliptical ballistic arc (crashes into Earth).
2. **$v = 7.91\text{ km/s}$**: Circular Low-Earth Orbit ($e = 0, E < 0$).
3. **$7.91 < v < 11.2\text{ km/s}$**: Closed Elliptical Orbit ($0 < e < 1, E < 0$).
4. **$v = 11.2\text{ km/s}$**: Parabolic Escape ($e = 1, E = 0$).
5. **$v > 11.2\text{ km/s}$**: Hyperbolic Trajectory with excess asymptotic velocity $v_\infty = \sqrt{v^2 - v_e^2}$ ($e > 1, E > 0$).

---

### 3. Atmospheric Retention & Maxwell-Boltzmann Speed (বায়ুমণ্ডল ধারণ)
The root-mean-square thermal speed of atmospheric gas molecules:
$$v_{\text{rms}} = \sqrt{\frac{3RT}{M}}$$
- **Jeans Escape Condition**: If $v_{\text{rms}} > \frac{1}{6} v_e$, the gas molecules escape into outer space over geological time.
- **Why the Moon Has No Atmosphere**:
  - Moon's escape speed is only $v_e = 2.38\text{ km/s}$.
  - During the lunar daytime ($T \sim 390\text{ K}$), $v_{\text{rms}}$ for gases like $N_2, O_2, H_2O$ exceeded the escape threshold, completely stripping the Moon of an atmosphere.

---

### 4. Mathematical Bridge: Newton's Gravitation ⟷ Kepler's 3rd Law
Equating centripetal force to Newtonian gravitational attraction:
$$\frac{mv^2}{r} = \frac{GMm}{r^2} \implies v = \sqrt{\frac{GM}{r}}$$
Using orbital period $T = \frac{2\pi r}{v}$:
$$T = \frac{2\pi r^{3/2}}{\sqrt{GM}} \implies T^2 = \left(\frac{4\pi^2}{GM}\right) r^3 \implies T^2 \propto r^3$$

---

## 🚀 Getting Started & Local Development

```bash
# Clone repository
git clone https://github.com/piashoverflow/P-41-Escape-Velocity-Orbital-Mechanics.git
cd P-41-Escape-Velocity-Orbital-Mechanics

# Install dependencies
npm install

# Launch Vite development server
npm run dev

# Build for production / Vercel
npm run build
```

---

## 🌐 1-Click Deployment to Vercel
This project is configured for out-of-the-box zero-config deployment on [Vercel](https://vercel.com). Simply import this repository into your Vercel dashboard and click **Deploy**.

---

## 📜 License
MIT License © 2026 **Shamsuddin Piash**. See [LICENSE](LICENSE) for details.
