##Running GUI Locally##

From directory “mse-gui” run:

npm install
npm run serve 

Go to localhost address displayed in console

##Deploying GUI##

To deploy successfully, the publicPath property must be correct configured before building the Vue app.

The publicPath property is found in mse-gui/vue.config.js

If deploying to https//domainname.com/subdir/ then edit publicPath the read:
"publicPath": “/subdir"

If incorrectly configured, will cause a blank screen when hosting
For further information see: https://cli.vuejs.org/guide/deployment.html#github-pages

From directory “mse-gui” run:

npm install
npm run build

Necessary files created in dist/ directory.

The dist/ directory is meant to be served by a HTTP server, so opening dist/index.html directly won’t work.
To preview locally, see “Running GUI Locally”.
