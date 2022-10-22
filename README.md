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

### Page title - requires our simple package simplificator_3000_phoenix

Page title helper is used in app.html.eex that looks for :page_title key in the connection assigns. Page title can be set from controller or view depending on what you prefer. Sometimes it makes sense to set all data in controller and sometimes you would use view, it makes no difference to the template helper.

```
<title><%= title(@conn, assigns) %></title>
```

## How it all works

From technical point of view not that much has changed. This demo project is still a Phoenix project that you are already familiar with, we just replace Webpack content of `assets` folder with Vite, added some new eex files and few lines of code here and there.

### Whole process overview

- Single command starts vite build for all apps in `apps` folder withou having to register them somewhere
- When Phoenix application is being build it looks in `static/apps` directory (can be configured) and generated functions to get path to script and style for all apps
- In your Phoenix page controller you can then include specific apps for given route, for example with  
  `conn |> Apps.include(["connect", "numbers"])`
- Elixir and Javascript scripts generates proper _script_ and _link_ tags in the final render output
- When the page is loaded _AppManager_ Javascript helper looks for tags with _data-app_ attribute and automatically creates proper App based on its value and with properties in the tag (sets coresponding properties), for example this code will create a like button at _Liked_ state for image id 1

```
<span data-app="like" data-id="1" data-liked="true"/>
```

## How to use this

For easier usage there is a _\_template_ folder that contains all necessary files. _\_template/lib/replace_with_project_name_web_ should be renamed to your web project or the files should be copied out of it to your web project.

1. Create new application, for example with  
   `mix phx.new --no-assets  project_name`

2. Copy files from `_template` folder
3. Add these aliases to `mix.exs`

``` elixir
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
- `css` for global scripts  with global.scss for global css
- `images` for static images copied to `priv/static/images`
- `js` for `main.js` that is the main entry point for all common Javascript code shared among all (or some) apps, like notification manager, event bus, basic rest providers and so on

5. Modify these files

- `lib\example_app\templates\layout\root.html.eex` - Add this code at the end of `<head>` section to allow automatic script registrations

  ```
    <script defer type="text/javascript"  type="module" src={Routes.static_path(@conn, "/js/main.mjs")}></script>
  <%= render "_component_scripts.html", additional_scripts: Map.get(assigns, :additional_scripts, []) %>

  <%= render_existing ProjectNameWeb.LayoutView, "app.styles.html", assigns %>
  <%= render "_component_styles.html", additional_styles: Map.get(assigns, :additional_styles, []) %>
  <%= render_existing view_module(@conn), String.replace_suffix(view_template(@conn), ".html", "") <> ".styles.html", assigns %>

  ```

- and this just above end of body
-

  ```
   <%= render_existing ProjectNameWeb.LayoutView, "app.scripts.html", assigns %>
  <%= render_existing view_module(@conn), String.replace_suffix(view_template(@conn), ".html", "") <> ".scripts.html", assigns %>

  ```

6. Check Plug.Static in checkpoint that you dont have js and apps allowed.

7. Add titles
   1. Add `{:simplificator_3000_phoenix, "~> 0.1.0"}` as dependency
   2. Add `use Simplificator3000Phoenix, :controller` to controller makro definition in `project_name_web.ex`  
   3. Add `use Simplificator3000Phoenix, :view` to view macro definion in `project_name_web.ex`
   4. Add `use Simplificator3000Phoenix, :layout` to your layout view (`layout_view.ex`)
   5. Add `<title><%= title(@conn, assigns) %></title>` to head in your root layout
   7. Now you can just use `set_title("title")` in controllers
   8. Configuration
      `page_title` = default title
      if `title_separator` is set final title is composed of `page_title`+`title_separator`+title you set

   ``` elixir
    config :project_name,
      page_title: "Project name",
      title_separator: "・"
    ```

## Add new app

To add new app just create folder with its name and add `js/main.js`. There you have to create contructor for your app and register it to app manager.

``` js
import App from "./App.svelte";

// instantiate the component
function constructor(element, props) {
  new App({
    // mount it to `document.body`
    target: element,

    // pass some props (optional)
    props: props,
  });
}

window.AppsManager.register("counter", constructor);

```

Now to use it just add it to `Apps.Include(["app-name",...])` in controller you want to use it and add elemenet with `data-app="app-name"` to template and ...

## THAT's it

Your apps (their css and js) are automatically loaded as you need them and created with proper parameters.

Start your Phoenix server with `run.bat` that automatically opens iex console.

You run vite builds by running `npm run dev` for development build without minimalization and with watch and `npm run prod` for production build. If you only want to build some apps put their names after command (`npm run dev app1 app2`)

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).
