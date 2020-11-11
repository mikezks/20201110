# Usage of Assets w/i Micro Frontends

Deploying a Micro Frontend including referenced assets to a certain origin is challenging.

As long as the hosting HTML page is located in same path/origin, everything works as expected. This changes if one loads the Micro Frontend script bundle from a different origin.

As the HTML page defines the Base-HREF the Micro Frontend, which is deployed to a different origin, tries to find the assets referenced with a relative path at the host page's origin. This leads to errors loading the assets.


## Possible solutions

There are possible solutions on how to fix this behavior:


### Build-time

- Base-HREF and Deploy-URL
- Using absolute path definitions including origin
- Inline assets by using a Base64 Data-URL


### Post-build

- Replacing path definitions with TypeScript- and CSS-variables


### Deployment-time

- Copy assets from Micro Frontend origin to host page origin


### Runtime

- Loading a CSS-file with relative path definitions directly in the hosting page
- Assign Micro Frontend origin to the TypeScript- and CSS-variables


### Server-side

- Use a proxy configuration to serve the Micro Frontend's assets from the host's origin


## Comparison

| Shell with Micro Frontend | Micro Frontend directly |
|:-------------------------:|:-----------------------:|
| ![Shell: partly loaded](./screenshots/shell-partly-loaded.png) | ![Micro Frontend: everything loaded](./screenshots/micro-app-all-loaded.png) |


## Errors on loading assets

- Relative path in Angular Component's CSS file
- Relative path in Angular's App CSS file, that is bundled to styles.ts
- Relative path in Angular Template
