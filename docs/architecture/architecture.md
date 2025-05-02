# Hybrid-QML-IDE — Architecture (v0.1 / Phase 1)

## 1 Top-Level Components
| Component | Responsibility | Location |
|-----------|----------------|----------|
| **Electron Main** | app lifecycle; spawns Python worker | `app/main.js` |
| **Renderer (React/Vite)** | visual canvas & UI logic | `app/frontend` |
| **Preload (IPC Bridge)** | exposes limited APIs to Renderer | `app/preload.js` |
| **Python Worker** | runs FastAPI micro-server & executes hybrid graphs | `app/backend` |
| **Data Layer** | project JSON, datasets, checkpoints | `~/.qml-ide` |

## 2 Chosen Communication Pattern
* **Electron IPC (channel `hybrid-run`)** → Main invokes Python via `child_process.spawn`.
* Stdout/stderr JSON pipes carry progress/events.
* No open TCP port in Phase 1; switchable to FastAPI localhost later.

## 3 Plugin Contract (v0.1 draft)
```python
# app/backend/plugins/base.py
class Component:
    inputs: list[str] = []
    outputs: list[str] = []
    def execute(self, **kwargs): ...
