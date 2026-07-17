# @electron-three-boiler/exemple-lib2

Composant React réutilisable - ExempleComponent2.

## Installation

```bash
npm install github:username/electron-three-boiler#@electron-three-boiler/exemple-lib2@0.1.0
```

Ou dans `package.json` :

```json
{
  "dependencies": {
    "@electron-three-boiler/exemple-lib2": "github:username/electron-three-boiler#semver:^0.1.0"
  }
}
```

## Usage

```tsx
import { ExempleComponent2 } from '@electron-three-boiler/exemple-lib2'

function App() {
  return <ExempleComponent2 />
}
```

## Versions

Les versions sont gérées via des Git tags. Voir les [Releases GitHub](https://github.com/username/electron-three-boiler/releases) pour l'historique.

### Créer une release

```bash
# Depuis la racine du monorepo
npm run version:lib2        # Bumpe la version (patch)
npm run release             # Push + crée le tag Git
```

