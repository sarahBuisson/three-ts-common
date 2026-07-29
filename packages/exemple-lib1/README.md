# @electron-three-boiler/exemple-lib1

Composant React réutilisable - ExempleComponent1.

## Installation

```bash
npm install github:username/electron-three-boiler#@electron-three-boiler/exemple-lib1@0.1.0
```

Ou dans `package.json` :

```json
{
  "dependencies": {
    "@electron-three-boiler/exemple-lib1": "github:username/electron-three-boiler#semver:^0.1.0"
  }
}
```

## Usage

```tsx
import { ExempleComponent1 } from '@electron-three-boiler/exemple-lib1'

function App() {
  return <ExempleComponent1 />
}
```

## Versions

Les versions sont gérées via des Git tags. Voir les [Releases GitHub](https://github.com/username/electron-three-boiler/releases) pour l'historique.

### Créer une release

```bash
# Depuis la racine du monorepo
npm run version:lib1        # Bumpe la version (patch)
npm run release             # Push + crée le tag Git
```
