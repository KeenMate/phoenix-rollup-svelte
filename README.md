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
