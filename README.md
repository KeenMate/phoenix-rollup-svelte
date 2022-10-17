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
- Standardize how are components registered on pages they are used on
  - And feel safe using them
- Add new mix tasks for easier setup and build of assets
- Have a centralized way to setup (dynamic) page title, from both controller and view
- !!! Make your life a hell of a lot easier !!!

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

### Page title - requires our simple package simplificator_3000

Page title helper is used in app.html.eex that looks for :page_title key in the connection assigns. Page title can be set from controller or view depending on what you prefer. Sometimes it makes sense to set all data in controller and sometimes you would use view, it makes no difference to the template helper.

```
<title><%= title(@conn, assigns) %></title>
```

## How it all works

From technical point of view not that much has changed. This demo project is still a Phoenix project that you are already familiar with, we just replace Webpack content of `assets` folder with Vite, added some new eex files and few lines of code here and there.

### Whole process overview

- Single Rollup config is used to build multiple Svelte apps that you can find in `assets/apps` folder
  - These apps are build into `priv/static` folder, each to its speficic folder to be able to use them separately
  - After all apps are build Rollup generates `manifest.json` file that is later used in Elixir macro to generate a map of available apps
- When Phoenix application is being build it looks for the `manifest.json` file and generates a map of available apps
- In your Phoenix page controller you can then include specific apps for given route, for example with  
  `conn |> Apps.include(["connect", "numbers"])`
- Elixir and Javascript scripts generates proper _script_ and _link_ tags in the final render output
- When the page is loaded _AppManager_ Javascript helper looks for tags with _data-app_ attribute and automatically creates proper App based on its value and with properties in the tag, for example this code will create a like button at _Liked_ state for image id 1

```
<span data-app="like" data-id="1" data-liked="true"/>
```

## How to use this

For easier usage there is a _\_template_ folder that contains all necessary files. _\_template/lib/replace_with_project_name_web_ should be renamed to your web project or the files should be copied out of it to your web project.

1. Create new application, for example with  
   `mix phx.new --no-webpack example-app --module ExampleApp --app example_app`

2. Add these aliases to `mix.exs`

```
defp aliases do
    [
      setup: ["assets.setup", "assets.build", "deps.get"],
      "assets.setup": ["cmd --cd assets npm i"],
      "assets.build": ["cmd --cd assets npm run prod"],
      ...
    ]
  end
```

4. After copy of `assets` folder you should have following structure

- `apps` for Svelte applications/components
- `css` for global scripts
- `images` for static images copied to `priv/static/images`
- `js` for `main.js` that is the main entry point for all common Javascript code shared among all (or some) apps, like notification manager, event bus, basic rest providers and so on
- If you have place it into another folder you HAVE to update outdir in `app.vite.js` and `main.vite.js`

5. Modify these files

- `assets\css\global.scss` - Whenever you want some global css import or a css class add it here
- `assets\js\main.js` - Global scss is imported here to be part of global css file - Whenever you add a new common class or piece of code modify add an import here to include it in the main package
- `lib\example_app\templates\layout\app.html.eex` - Add this code at the end of `<head>` section to allow automatic script registrations

  ``` html
  <script defer type="text/javascript" src="<%= Routes.static_path(@conn, "/js/main.js") %>"></script>
  <%= render "_component_scripts.html", additional_scripts: Map.get(assigns, :additional_scripts, []) %>

  <%= render_existing RollupTestWeb.LayoutView, "app.styles.html", assigns %>
  <%= render "_component_styles.html", additional_styles: Map.get(assigns, :additional_styles, []) %>
  <%= render_existing view_module(@conn), String.replace_suffix(view_template(@conn), ".html", "") <> ".styles.html", assigns %>
  ```

6. Check Plug.Static in checkpoint that you dont have js and apps enabled.

## THAT's it

Your apps (their css and js) are automatically loaded as you need them and created with proper parameters.

Start your Phoenix server with `run.bat` that automatically opens iex console.

You run vite builds by running `npm run dev` for development build without minimalization and with watch and `npm run prod` for production build. If you only want to build some apps put their names after command (`npm run dev app1 app2`)

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).
