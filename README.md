# GetWellData

## Development

### Prerequisites

Node.js 18 or higher is required because `pcf-scripts` and `pcf-start` specify
"node": ">=18" in `package-lock.json`. The control has been tested with Node 18
and Node 22, so either version can be used.

1. Install dependencies.

```bash
npm install
```

`pcf-scripts` will regenerate files under `generated/` automatically.
If you edit the manifest and need the types ahead of running the control,
run `npm run refreshTypes`.

2. Start the control.

```bash
npm start
```

The `start` script uses `pcf-scripts` so the dependencies must be installed before running it.
