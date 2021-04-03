defmodule RollupTest.AppsMacro do
  require Logger

  defmacro __using__(options) do
    path = Keyword.fetch!(options, :manifest_path)
    manifest = File.read!(Path.join(:code.priv_dir(:rollup_test), path)) |> Jason.decode!()
    manifest_escaped = Macro.escape(manifest)

    quote do
      @manifest unquote(manifest_escaped)
      @before_compile unquote(__MODULE__)
    end
  end

  defmacro __before_compile__(env) do
    manifest = Module.get_attribute(env.module, :manifest)

    Enum.map(manifest, fn {_, app} ->
      Logger.debug("Generating code for app: #{app["name"]}")

      quote do
        def app_style(unquote(app["name"])) do
          unquote(app["stylePath"])
        end

        def app_script(unquote(app["name"])) do
          unquote(app["scriptPath"])
        end
      end
    end)
  end
end
