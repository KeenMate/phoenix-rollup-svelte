# Phoenix + Rollup + Svelte

## Introduction

This repository is a working demo that shows our approach to Javascript components working in server side rendered pages. It completely replaces Webpack and works with lighter Rollup. 

As an Javascript framework we use Svelte that works pretty well with Elixir. It's also very lightweight, syntax is supersimple and it is most useful for small components and forms, altough we are running some SPA administration in Svelte so it can be used for that as well.

As a HTML/CSS framework Tailwind is used but this approach can be used with whatever you have.

## Requirements

- Be able to have custom Javascript rendered for each page at the bottom of the final rendered content
- Be able to have custom CSS rendered for each page at the &lt;head&gt; section of the final rendered content
- Replace Webpack with Rollup
- Be able to use Svelte components in server side rendered pages
- Standardize how are components registred to each page they are used on
  - And feel safe using them
- Add new mix tasks for easier setup and build of assets
- !!! Make your a hell of a lot easier !!!


## Demo apps (Javascript components)

There are four apps as in this demo that represents of what can be done and how.

- Connect button
- Like button
- Numbers
- Subscription form

### Connect button, Numbers

Simple components dummy components that just display some data and simulate a delayed action by waiting for some time.

### Like button

This component shows how to communicate with API controller. This is not a traditional stateless API controller that requires access token but rather its authentication process is based on CSRF token and Session. Controller is behind a specific pipeline that confirms validity of CSRF token. 
  
CSRF token is stored into &lt;head&gt; section where the component looks before it sends any request to server and put it into HTTP headers.

### Subscription form

This component shows how can you create a dynamic form instead of using server side input helpers. Input fields are still rendered inside a server rendered form tag but we render inputs and validate everything on the client in a Svelte component and control when it's submitted from it.

## How it all works

From technical point of view not that much has changed. This demo project is still a Phoenix project that you are already familiar with, we just replace Webpack content of `assets` folder with Rollup, added some new eex files and few lines of code here and there.

### Whole process overview

- Single Rollup config is used to build multiple Svelte apps that you can find in `assets/apps` folder
  - These apps are build into `priv/static` folder, each to its speficic folder to be able to use them separately
  - After all apps are build Rollup generates `manifest.json` file that is later used in Elixir macro to generate a map of available apps
- When Phoenix application is being build it looks for the `manifest.json` file and generates a map of available apps 


## How to use this

1. Create new application with 
```mix phx.new --no-webpack example-app --module ExampleApp --app example_app ```

2. Copy this code watcher configuration to ```config/dev.exs``` file, app endpoint's watcher section
```
node: [
      "node_modules/rollup/dist/bin/rollup",
      "--config",
      "--watch",
      cd: Path.expand("../assets", __DIR__)
    ]
```

3. Add these aliases to ```mix.exs```
```
defp aliases do
    [
      setup: ["assets.setup", "assets.build", "deps.get"],
      "assets.setup": ["cmd --cd assets npm i"],
      "assets.build": ["cmd --cd assets npm run deploy"],
      ...
    ]
  end
```
4. Create ```assets``` folder in your the root directory with following structure
  - apps -> for Svelte applications/components
  - css -> for global scripts
  - images -> for static images copied to ``priv/static/images``
  - js -> for ``main.js`` that is the main entry point for all common Javascript code shared among all (or some) apps, like notification manager, event bus, basic rest providers and so on

5. Copy these files from this repository
  - ```assets\css\global.template.css``` to ```assets\css``` folder as ```global.scss```
  - ```assets\js\AppsManager.js``` to ```assets\js``` folder, serves as an automatic apps loader
  - ```assets\js\main.template.json``` to ```assets\js``` folder as ```main.js```
  - ```assets\package.template.json``` to ```assets``` folder as ```package.json```
  - ```assets\postcss.config.template.js``` to ```assets``` folder as ```postcss.config.js```
  - ```assets\rollup.config.template.js``` to ```assets``` folder as ```rollup.config.js```
  - ```lib\rollup_test_web\templates\layout\_component*``` to ```lib\example_app_web\templates\layout\_component*```
  - ```lib\rollup_test_web\templates\layout\app.scripts/styles.html.eex``` to ```lib\rollup_test_web\templates\layout\app.scripts/styles.html.eex```

6. Modify these files
  - ```assets\rollup.config.js```
    - Whenever you add a new app to your apps folder modify line ```let apps =``` or keep it empty if you have no apps yet
    - Whenever you add a new common class or piece of code modify ```external: ['apps-manager'],```
      - And it's registration below
        ``` // 'OTHER COMMON CLASS NAME': 'OTHER COMMON CLASS FILE NAME INSIDE js FOLDER'
        globals: {
          'apps-manager': 'AppsManager'      
        } 
        ```
  - ```assets\css\global.scss```
    - Whenever you want some global css import or a css class add it here
  - ```assets\js\main.js```
    - Global scss is imported here to be part of global css file
    - Whenever you add a new common class or piece of code modify add an import here to include it in the main package
  - ```lib\example_app\templates\layout\app.html.eex```
    - Add this code to allow automatic script registrations
    ```
    <script defer type="text/javascript" src="<%= Routes.static_path(@conn, "/js/main.js") %>"></script>
    <%= render "_component_scripts.html", additional_scripts: Map.get(assigns, :additional_scripts, []) %>

    <%= render_existing RollupTestWeb.LayoutView, "app.styles.html", assigns %>
    <%= render "_component_styles.html", additional_styles: Map.get(assigns, :additional_styles, []) %>
    <%= render_existing view_module(@conn), String.replace_suffix(view_template(@conn), ".html", "") <> ".styles.html", assigns %>
    ```
  - 



To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix
